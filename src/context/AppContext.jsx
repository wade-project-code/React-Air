import { createContext, useContext, useReducer, useEffect } from 'react'

// App 狀態的初始值
const initialState = {
  // 使用者偏好
  user: {
    preferences: {
      language: 'zh-TW',
      notifications: true,
      autoRefresh: true,
      refreshInterval: 5 * 60 * 1000, // 5 分鐘
      defaultView: 'dashboard'
    }
  },
  
  // 應用程式設定
  app: {
    title: '台灣環境監測儀表板',
    version: '1.0.0',
    isLoading: false,
    error: null,
    lastUpdated: null
  },
  
  // 資料過濾和排序設定
  filters: {
    county: '',
    dateRange: {
      start: null,
      end: null
    },
    dataTypes: [],
    sortBy: 'updateTime',
    sortOrder: 'desc'
  },
  
  // UI 狀態
  ui: {
    sidebarCollapsed: false,
    activeView: 'dashboard',
    selectedStation: null,
    mapCenter: {
      lat: 23.8,
      lng: 120.9
    },
    mapZoom: 8
  },
  
  // 通知狀態
  notifications: []
}

// Action 類型常數
const ActionTypes = {
  SET_LOADING: 'SET_LOADING',
  SET_ERROR: 'SET_ERROR',
  CLEAR_ERROR: 'CLEAR_ERROR',
  UPDATE_USER_PREFERENCES: 'UPDATE_USER_PREFERENCES',
  SET_FILTERS: 'SET_FILTERS',
  RESET_FILTERS: 'RESET_FILTERS',
  SET_UI_STATE: 'SET_UI_STATE',
  SET_ACTIVE_VIEW: 'SET_ACTIVE_VIEW',
  SET_SELECTED_STATION: 'SET_SELECTED_STATION',
  SET_MAP_STATE: 'SET_MAP_STATE',
  ADD_NOTIFICATION: 'ADD_NOTIFICATION',
  REMOVE_NOTIFICATION: 'REMOVE_NOTIFICATION',
  CLEAR_NOTIFICATIONS: 'CLEAR_NOTIFICATIONS',
  SET_LAST_UPDATED: 'SET_LAST_UPDATED'
}

// Reducer 函數
const appReducer = (state, action) => {
  switch (action.type) {
    case ActionTypes.SET_LOADING:
      return {
        ...state,
        app: {
          ...state.app,
          isLoading: action.payload
        }
      }

    case ActionTypes.SET_ERROR:
      return {
        ...state,
        app: {
          ...state.app,
          error: action.payload,
          isLoading: false
        }
      }

    case ActionTypes.CLEAR_ERROR:
      return {
        ...state,
        app: {
          ...state.app,
          error: null
        }
      }

    case ActionTypes.UPDATE_USER_PREFERENCES:
      return {
        ...state,
        user: {
          ...state.user,
          preferences: {
            ...state.user.preferences,
            ...action.payload
          }
        }
      }

    case ActionTypes.SET_FILTERS:
      return {
        ...state,
        filters: {
          ...state.filters,
          ...action.payload
        }
      }

    case ActionTypes.RESET_FILTERS:
      return {
        ...state,
        filters: {
          ...initialState.filters,
          // 保留某些設定
          sortBy: state.filters.sortBy,
          sortOrder: state.filters.sortOrder
        }
      }

    case ActionTypes.SET_UI_STATE:
      return {
        ...state,
        ui: {
          ...state.ui,
          ...action.payload
        }
      }

    case ActionTypes.SET_ACTIVE_VIEW:
      return {
        ...state,
        ui: {
          ...state.ui,
          activeView: action.payload
        }
      }

    case ActionTypes.SET_SELECTED_STATION:
      return {
        ...state,
        ui: {
          ...state.ui,
          selectedStation: action.payload
        }
      }

    case ActionTypes.SET_MAP_STATE:
      return {
        ...state,
        ui: {
          ...state.ui,
          mapCenter: action.payload.center || state.ui.mapCenter,
          mapZoom: action.payload.zoom || state.ui.mapZoom
        }
      }

    case ActionTypes.ADD_NOTIFICATION:
      return {
        ...state,
        notifications: [
          ...state.notifications,
          {
            id: Date.now(),
            timestamp: new Date(),
            ...action.payload
          }
        ]
      }

    case ActionTypes.REMOVE_NOTIFICATION:
      return {
        ...state,
        notifications: state.notifications.filter(
          notification => notification.id !== action.payload
        )
      }

    case ActionTypes.CLEAR_NOTIFICATIONS:
      return {
        ...state,
        notifications: []
      }

    case ActionTypes.SET_LAST_UPDATED:
      return {
        ...state,
        app: {
          ...state.app,
          lastUpdated: action.payload || new Date()
        }
      }

    default:
      return state
  }
}

// 建立 App Context
const AppContext = createContext()

// App Provider 組件
export const AppProvider = ({ children }) => {
  const [state, dispatch] = useReducer(appReducer, initialState)

  // 從 localStorage 載入使用者偏好
  useEffect(() => {
    const savedPreferences = localStorage.getItem('userPreferences')
    if (savedPreferences) {
      try {
        const preferences = JSON.parse(savedPreferences)
        dispatch({
          type: ActionTypes.UPDATE_USER_PREFERENCES,
          payload: preferences
        })
      } catch (error) {
        console.error('Failed to load user preferences:', error)
      }
    }
  }, [])

  // 儲存使用者偏好到 localStorage
  useEffect(() => {
    localStorage.setItem(
      'userPreferences', 
      JSON.stringify(state.user.preferences)
    )
  }, [state.user.preferences])

  // Action creators
  const actions = {
    setLoading: (isLoading) => {
      dispatch({
        type: ActionTypes.SET_LOADING,
        payload: isLoading
      })
    },

    setError: (error) => {
      dispatch({
        type: ActionTypes.SET_ERROR,
        payload: error
      })
    },

    clearError: () => {
      dispatch({
        type: ActionTypes.CLEAR_ERROR
      })
    },

    updateUserPreferences: (preferences) => {
      dispatch({
        type: ActionTypes.UPDATE_USER_PREFERENCES,
        payload: preferences
      })
    },

    setFilters: (filters) => {
      dispatch({
        type: ActionTypes.SET_FILTERS,
        payload: filters
      })
    },

    resetFilters: () => {
      dispatch({
        type: ActionTypes.RESET_FILTERS
      })
    },

    setUIState: (uiState) => {
      dispatch({
        type: ActionTypes.SET_UI_STATE,
        payload: uiState
      })
    },

    setActiveView: (view) => {
      dispatch({
        type: ActionTypes.SET_ACTIVE_VIEW,
        payload: view
      })
    },

    setSelectedStation: (station) => {
      dispatch({
        type: ActionTypes.SET_SELECTED_STATION,
        payload: station
      })
    },

    setMapState: (mapState) => {
      dispatch({
        type: ActionTypes.SET_MAP_STATE,
        payload: mapState
      })
    },

    addNotification: (notification) => {
      dispatch({
        type: ActionTypes.ADD_NOTIFICATION,
        payload: notification
      })
    },

    removeNotification: (id) => {
      dispatch({
        type: ActionTypes.REMOVE_NOTIFICATION,
        payload: id
      })
    },

    clearNotifications: () => {
      dispatch({
        type: ActionTypes.CLEAR_NOTIFICATIONS
      })
    },

    setLastUpdated: (timestamp) => {
      dispatch({
        type: ActionTypes.SET_LAST_UPDATED,
        payload: timestamp
      })
    }
  }

  const value = {
    state,
    actions
  }

  return (
    <AppContext.Provider value={value}>
      {children}
    </AppContext.Provider>
  )
}

// 自定義 hook 來使用 App Context
export const useApp = () => {
  const context = useContext(AppContext)
  
  if (context === undefined) {
    throw new Error('useApp must be used within an AppProvider')
  }
  
  return context
}

// 輔助 hooks
export const useAppState = () => {
  const { state } = useApp()
  return state
}

export const useAppActions = () => {
  const { actions } = useApp()
  return actions
}

export const useUserPreferences = () => {
  const { state, actions } = useApp()
  return {
    preferences: state.user.preferences,
    updatePreferences: actions.updateUserPreferences
  }
}

export const useFilters = () => {
  const { state, actions } = useApp()
  return {
    filters: state.filters,
    setFilters: actions.setFilters,
    resetFilters: actions.resetFilters
  }
}

export const useNotifications = () => {
  const { state, actions } = useApp()
  return {
    notifications: state.notifications,
    addNotification: actions.addNotification,
    removeNotification: actions.removeNotification,
    clearNotifications: actions.clearNotifications
  }
}

export default AppContext
import { useState, useCallback } from 'react'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'

// 自定義 API Hook
export const useApi = () => {
  const queryClient = useQueryClient()

  // 重新獲取查詢
  const refetchQuery = useCallback((queryKey) => {
    return queryClient.refetchQueries({ queryKey })
  }, [queryClient])

  // 無效化查詢
  const invalidateQuery = useCallback((queryKey) => {
    return queryClient.invalidateQueries({ queryKey })
  }, [queryClient])

  // 設定查詢資料
  const setQueryData = useCallback((queryKey, data) => {
    return queryClient.setQueryData(queryKey, data)
  }, [queryClient])

  // 獲取查詢資料
  const getQueryData = useCallback((queryKey) => {
    return queryClient.getQueryData(queryKey)
  }, [queryClient])

  return {
    refetchQuery,
    invalidateQuery,
    setQueryData,
    getQueryData
  }
}

// 資料獲取 Hook
export const useApiQuery = (queryKey, queryFn, options = {}) => {
  const defaultOptions = {
    staleTime: 2 * 60 * 1000, // 2 分鐘
    cacheTime: 5 * 60 * 1000, // 5 分鐘
    retry: 2,
    refetchOnWindowFocus: false,
    ...options
  }

  return useQuery({
    queryKey,
    queryFn,
    ...defaultOptions
  })
}

// 資料變更 Hook
export const useApiMutation = (mutationFn, options = {}) => {
  const queryClient = useQueryClient()

  const defaultOptions = {
    onSuccess: () => {
      // 預設成功後的處理
    },
    onError: (error) => {
      console.error('Mutation error:', error)
    },
    ...options
  }

  return useMutation({
    mutationFn,
    ...defaultOptions
  })
}

// 分頁資料 Hook
export const usePaginatedApi = (queryFn, initialParams = {}) => {
  const [params, setParams] = useState({
    page: 1,
    pageSize: 20,
    ...initialParams
  })

  const queryKey = ['paginated', params]

  const { data, isLoading, error, refetch } = useApiQuery(
    queryKey,
    () => queryFn(params),
    {
      keepPreviousData: true
    }
  )

  // 設定分頁
  const setPagination = useCallback((page, pageSize) => {
    setParams(prev => ({
      ...prev,
      page,
      pageSize
    }))
  }, [])

  // 設定篩選器
  const setFilters = useCallback((filters) => {
    setParams(prev => ({
      ...prev,
      ...filters,
      page: 1 // 重設到第一頁
    }))
  }, [])

  // 重置參數
  const resetParams = useCallback(() => {
    setParams({
      page: 1,
      pageSize: 20,
      ...initialParams
    })
  }, [initialParams])

  return {
    data,
    isLoading,
    error,
    params,
    setPagination,
    setFilters,
    resetParams,
    refetch
  }
}

// 即時資料 Hook
export const useRealTimeApi = (queryKey, queryFn, interval = 30000, options = {}) => {
  const [isRealTime, setIsRealTime] = useState(false)

  const query = useApiQuery(
    queryKey,
    queryFn,
    {
      refetchInterval: isRealTime ? interval : false,
      refetchIntervalInBackground: false,
      ...options
    }
  )

  const startRealTime = useCallback(() => {
    setIsRealTime(true)
  }, [])

  const stopRealTime = useCallback(() => {
    setIsRealTime(false)
  }, [])

  const toggleRealTime = useCallback(() => {
    setIsRealTime(prev => !prev)
  }, [])

  return {
    ...query,
    isRealTime,
    startRealTime,
    stopRealTime,
    toggleRealTime
  }
}

// 錯誤處理 Hook
export const useApiError = () => {
  const [error, setError] = useState(null)

  const handleError = useCallback((error) => {
    const processedError = {
      message: error?.userMessage || error?.message || '發生未知錯誤',
      status: error?.status,
      code: error?.code,
      details: error
    }
    
    setError(processedError)
    
    // 根據錯誤類型進行不同處理
    if (error?.status === 401) {
      // 處理認證錯誤
      console.warn('Authentication error:', error)
    } else if (error?.status >= 500) {
      // 處理伺服器錯誤
      console.error('Server error:', error)
    }

    return processedError
  }, [])

  const clearError = useCallback(() => {
    setError(null)
  }, [])

  return {
    error,
    handleError,
    clearError
  }
}

// 載入狀態 Hook
export const useApiLoading = () => {
  const [loadingStates, setLoadingStates] = useState({})

  const setLoading = useCallback((key, isLoading) => {
    setLoadingStates(prev => ({
      ...prev,
      [key]: isLoading
    }))
  }, [])

  const isLoading = useCallback((key) => {
    return !!loadingStates[key]
  }, [loadingStates])

  const isAnyLoading = useCallback(() => {
    return Object.values(loadingStates).some(Boolean)
  }, [loadingStates])

  return {
    setLoading,
    isLoading,
    isAnyLoading,
    loadingStates
  }
}

// 資料快取 Hook
export const useApiCache = () => {
  const queryClient = useQueryClient()

  const cacheData = useCallback((key, data, options = {}) => {
    const defaultOptions = {
      staleTime: 5 * 60 * 1000, // 5 分鐘
      cacheTime: 10 * 60 * 1000, // 10 分鐘
      ...options
    }

    queryClient.setQueryData(key, data)
    
    // 設定查詢選項
    queryClient.setQueryDefaults(key, defaultOptions)
  }, [queryClient])

  const getCachedData = useCallback((key) => {
    return queryClient.getQueryData(key)
  }, [queryClient])

  const removeCachedData = useCallback((key) => {
    queryClient.removeQueries({ queryKey: key })
  }, [queryClient])

  const clearCache = useCallback(() => {
    queryClient.clear()
  }, [queryClient])

  return {
    cacheData,
    getCachedData,
    removeCachedData,
    clearCache
  }
}

export default useApi
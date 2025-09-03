module.exports = {
  env: {
    browser: true,
    es2021: true,
    node: true
  },
  extends: [
    'eslint:recommended',
    'plugin:react/recommended',
    'plugin:react-hooks/recommended',
    'plugin:react/jsx-runtime'
  ],
  parserOptions: {
    ecmaFeatures: {
      jsx: true
    },
    ecmaVersion: 12,
    sourceType: 'module'
  },
  plugins: [
    'react',
    'react-hooks',
    'react-refresh'
  ],
  rules: {
    // React 相關規則
    'react/react-in-jsx-scope': 'off',
    'react/prop-types': 'warn',
    'react/jsx-uses-react': 'off',
    'react/jsx-uses-vars': 'error',
    
    // React Hooks 規則
    'react-hooks/rules-of-hooks': 'error',
    'react-hooks/exhaustive-deps': 'warn',
    
    // 一般規則
    'no-unused-vars': ['warn', { 
      argsIgnorePattern: '^_',
      varsIgnorePattern: '^_' 
    }],
    'no-console': 'warn',
    'no-debugger': 'error',
    'no-undef': 'error',
    
    // 程式碼品質
    'prefer-const': 'error',
    'no-var': 'error',
    'object-shorthand': 'warn',
    'prefer-template': 'warn',
    
    // 格式化
    'indent': ['warn', 2],
    'quotes': ['warn', 'single'],
    'semi': ['warn', 'never'],
    'comma-dangle': ['warn', 'never'],
    'jsx-quotes': ['warn', 'prefer-double']
  },
  settings: {
    react: {
      version: 'detect'
    }
  },
  ignorePatterns: [
    'dist',
    'node_modules',
    '*.config.js'
  ]
}
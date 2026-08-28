import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { Provider } from 'react-redux'
import 'bootstrap/dist/css/bootstrap.min.css'
import { ThemeProvider } from '@mui/material/styles'
import './index.css'
import App from './App.jsx'
import { autovistaTheme } from './theme/theme.js'
import { store } from './app/store.js'

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <Provider store={store}><ThemeProvider theme={autovistaTheme}><App /></ThemeProvider></Provider>
  </StrictMode>,
)

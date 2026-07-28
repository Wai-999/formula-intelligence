import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'
import { useThemeStore, applyTheme } from './store/useThemeStore.js'

// Set the attribute before the first render: doing it in an effect would
// paint the dark palette first and then swap, which reads as a flash.
applyTheme(useThemeStore.getState().theme)

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <App />
  </StrictMode>,
)

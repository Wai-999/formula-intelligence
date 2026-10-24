import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'
import { useThemeStore, applyTheme, applyMotion } from './store/useThemeStore.js'
import { applyInitialLocation } from './lib/hashRoute.js'

// Set the attribute before the first render: doing it in an effect would
// paint the dark palette first and then swap, which reads as a flash.
applyTheme(useThemeStore.getState().theme)
applyMotion(useThemeStore.getState().motion)
applyInitialLocation()

// Offline support: production builds only (the dev server's modules are not
// precacheable), and never blocking the first render.
if (import.meta.env.PROD && 'serviceWorker' in navigator) {
  window.addEventListener('load', () => {
    navigator.serviceWorker.register(`${import.meta.env.BASE_URL}sw.js`).catch(() => {})
  })
}

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <App />
  </StrictMode>,
)

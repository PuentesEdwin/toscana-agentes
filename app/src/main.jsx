import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.jsx'
import { applyBrand } from './config.js'
import './styles.css'

applyBrand()

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
)

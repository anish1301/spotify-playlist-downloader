import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.jsx'
import './styles/App.css'
import './styles/AuthCard.css'
import './styles/PlaylistCard.css' // Fixed filename
import './styles/TrackItem.css'
import './styles/Footer.css'
import './styles/InputCard.css' // Add missing import

ReactDOM.createRoot(document.getElementById('root')).render(
    <React.StrictMode>
        <App/>
    </React.StrictMode>
)
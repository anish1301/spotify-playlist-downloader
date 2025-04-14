import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.jsx'
import './index.css'
import './styles/App.css'
import './styles/AuthCard.css'
import './styles/Playlist.css'
import './styles/TrackItem.css'
import './styles/Footer.css'
import AuthCard from './components/AuthCard.jsx'
import InputCard from './components/InputCard.jsx'
import PlaylistCard from './components/PlaylistCard.jsx'
import TrackItem from './components/TrackItem.jsx'

ReactDOM.createRoot(document.getElementById('root')).render(
    <React.StrictMode>
        <App/>
    </React.StrictMode>
)
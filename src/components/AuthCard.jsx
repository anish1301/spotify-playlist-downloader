// src/components/AuthCard.jsx
import { getAuthUrl } from '../services/spotifyService';
import '../styles/AuthCard.css';

function AuthCard() {
  const handleLogin = () => {
    window.location.href = getAuthUrl();
  };

  return (
    <div className="auth-card">
      <div className="auth-content">
        <h2>Connect with Spotify</h2>
        <p>To download your playlists, we need access to your Spotify account.</p>
        <button 
          className="spotify-login-button"
          onClick={handleLogin}
        >
          Login with Spotify
        </button>
        <div className="auth-info">
          <p className="disclaimer">
            We only request read access to your playlists.
            We don't store your login information.
          </p>
        </div>
      </div>
    </div>
  );
}

export default AuthCard;
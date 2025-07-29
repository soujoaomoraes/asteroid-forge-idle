import React, { useState } from 'react';
import { useAudio } from '../hooks/useAudio';
import './AudioControls.css';

export const AudioControls: React.FC = () => {
  const {
    config,
    isLoaded,
    isAudioSupported,
    setVolume,
    setMusicVolume,
    setSFXVolume,
    toggleMute,
    playMusic,
    stopMusic
  } = useAudio();

  const [isExpanded, setIsExpanded] = useState(false);

  if (!isAudioSupported) {
    return (
      <div className="audio-controls">
        <div className="audio-warning">
          ⚠️ Audio não suportado neste navegador
        </div>
      </div>
    );
  }

  return (
    <div className="audio-controls">
      <div className="audio-header">
        <button
          className="audio-toggle"
          onClick={() => setIsExpanded(!isExpanded)}
          title="Controles de Áudio"
        >
          🎵
        </button>
        
        <button
          className={`mute-button ${config.muted ? 'muted' : ''}`}
          onClick={toggleMute}
          title={config.muted ? 'Desmutar' : 'Mutar'}
        >
          {config.muted ? '🔇' : '🔊'}
        </button>
      </div>

      {isExpanded && (
        <div className="audio-panel">
          <div className="audio-section">
            <h4>🎵 Música</h4>
            <div className="volume-control">
              <input
                type="range"
                min="0"
                max="1"
                step="0.1"
                value={config.musicVolume}
                onChange={(e) => setMusicVolume(parseFloat(e.target.value))}
                disabled={config.muted}
              />
              <span>{Math.round(config.musicVolume * 100)}%</span>
            </div>
            <div className="music-controls">
              <button onClick={playMusic} disabled={config.muted}>
                ▶️
              </button>
              <button onClick={stopMusic} disabled={config.muted}>
                ⏹️
              </button>
            </div>
          </div>

          <div className="audio-section">
            <h4>🔊 Efeitos Sonoros</h4>
            <div className="volume-control">
              <input
                type="range"
                min="0"
                max="1"
                step="0.1"
                value={config.sfxVolume}
                onChange={(e) => setSFXVolume(parseFloat(e.target.value))}
                disabled={config.muted}
              />
              <span>{Math.round(config.sfxVolume * 100)}%</span>
            </div>
          </div>

          <div className="audio-section">
            <h4>🎚️ Volume Geral</h4>
            <div className="volume-control">
              <input
                type="range"
                min="0"
                max="1"
                step="0.1"
                value={config.volume}
                onChange={(e) => setVolume(parseFloat(e.target.value))}
                disabled={config.muted}
              />
              <span>{Math.round(config.volume * 100)}%</span>
            </div>
          </div>

          <div className="audio-status">
            <div className={`status-indicator ${isLoaded ? 'loaded' : 'loading'}`}>
              {isLoaded ? '✅ Carregado' : '⏳ Carregando...'}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}; 
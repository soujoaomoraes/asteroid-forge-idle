import React, { useState, useEffect } from 'react';
import { useWebSocketService } from '../hooks/useWebSocketService';

interface Resources {
  crystals: number;
  energy: number;
  research: number;
  reputation: number;
}

interface Production {
  crystals: number;
  energy: number;
  research: number;
  reputation: number;
}

interface GameStats {
  currentResources: Resources;
  production: Production;
  ships: number;
  upgrades: number;
}

const ResourcePanelOptimized: React.FC = () => {
  const [gameStats, setGameStats] = useState<GameStats | null>(null);
  const [lastUpdate, setLastUpdate] = useState<Date>(new Date());

  // WebSocket connection usando hook personalizado
  const { connected: wsConnected, lastMessage } = useWebSocketService('ws://localhost:3000');

  // Processar mensagens do WebSocket
  useEffect(() => {
    if (lastMessage && lastMessage.type === 'RESOURCES_UPDATED') {
      setGameStats(prev => prev ? {
        ...prev,
        currentResources: lastMessage.data.resources
      } : null);
      setLastUpdate(new Date());
    }
  }, [lastMessage]);

  // Fetch initial game stats apenas uma vez
  useEffect(() => {
    const fetchGameStats = async () => {
      try {
        const response = await fetch('http://localhost:3000/api/game-stats');
        const data = await response.json();
        
        if (data.success) {
          setGameStats(data.data);
        }
      } catch (error) {
        console.error('Error fetching game stats:', error);
      }
    };

    fetchGameStats();
  }, []);

  if (!gameStats) {
    return (
      <div className="resource-panel loading">
        <div className="loading-spinner">⏳</div>
        <p>Carregando recursos...</p>
      </div>
    );
  }

  const formatNumber = (num: number) => {
    if (num >= 1000000) return `${(num / 1000000).toFixed(1)}M`;
    if (num >= 1000) return `${(num / 1000).toFixed(1)}K`;
    return num.toFixed(1);
  };

  const formatProduction = (rate: number) => {
    const sign = rate >= 0 ? '+' : '';
    return `${sign}${rate.toFixed(1)}/s`;
  };

  return (
    <div className="resource-panel">
      <div className="panel-header">
        <h3>🚀 Recursos</h3>
        <div className="connection-status">
          <span className={`status-dot ${wsConnected ? 'connected' : 'disconnected'}`}></span>
          {wsConnected ? 'Tempo Real' : 'Offline'}
        </div>
      </div>

      <div className="resources-grid">
        <div className="resource-item crystals">
          <div className="resource-icon">💎</div>
          <div className="resource-info">
            <div className="resource-name">Crystals</div>
            <div className="resource-value">{formatNumber(gameStats.currentResources.crystals)}</div>
            <div className="resource-rate">{formatProduction(gameStats.production.crystals)}</div>
          </div>
        </div>

        <div className="resource-item energy">
          <div className="resource-icon">⚡</div>
          <div className="resource-info">
            <div className="resource-name">Energy</div>
            <div className="resource-value">{formatNumber(gameStats.currentResources.energy)}</div>
            <div className="resource-rate">{formatProduction(gameStats.production.energy)}</div>
          </div>
        </div>

        <div className="resource-item research">
          <div className="resource-icon">🔬</div>
          <div className="resource-info">
            <div className="resource-name">Research</div>
            <div className="resource-value">{formatNumber(gameStats.currentResources.research)}</div>
            <div className="resource-rate">{formatProduction(gameStats.production.research)}</div>
          </div>
        </div>

        <div className="resource-item reputation">
          <div className="resource-icon">⭐</div>
          <div className="resource-info">
            <div className="resource-name">Reputation</div>
            <div className="resource-value">{formatNumber(gameStats.currentResources.reputation)}</div>
            <div className="resource-rate">{formatProduction(gameStats.production.reputation)}</div>
          </div>
        </div>
      </div>

      <div className="stats-summary">
        <div className="stat-item">
          <span className="stat-label">Naves:</span>
          <span className="stat-value">{gameStats.ships}</span>
        </div>
        <div className="stat-item">
          <span className="stat-label">⚡ Upgrades:</span>
          <span className="stat-value">{gameStats.upgrades}</span>
        </div>
      </div>

      <div className="last-update">
        Última atualização: {lastUpdate.toLocaleTimeString()}
      </div>
    </div>
  );
};

export default ResourcePanelOptimized; 
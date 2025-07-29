import React, { useState, useEffect } from 'react';
import { useWebSocketService } from '../hooks/useWebSocketService';

interface Upgrade {
  id: string;
  name: string;
  description: string;
  type: string;
  cost: {
    crystals: number;
    energy: number;
    research: number;
    reputation: number;
  };
  effect: any;
  purchased: boolean;
}

interface Resources {
  crystals: number;
  energy: number;
  research: number;
  reputation: number;
}

const UpgradePanelOptimized: React.FC = () => {
  const [upgrades, setUpgrades] = useState<Upgrade[]>([]);
  const [resources, setResources] = useState<Resources | null>(null);
  const [isOpen, setIsOpen] = useState(false);

  // WebSocket connection
  const { connected: wsConnected, lastMessage } = useWebSocketService('ws://localhost:3000');

  // Processar mensagens do WebSocket
  useEffect(() => {
    if (lastMessage && lastMessage.type === 'RESOURCES_UPDATED') {
      setResources(lastMessage.data.resources);
    }
  }, [lastMessage]);

  // Fetch upgrades e resources apenas uma vez
  useEffect(() => {
    const fetchData = async () => {
      try {
        // Fetch upgrades
        const upgradesResponse = await fetch('http://localhost:3000/api/upgrades');
        const upgradesData = await upgradesResponse.json();
        
        if (upgradesData.success) {
          setUpgrades(upgradesData.data);
        }

        // Fetch current resources
        const resourcesResponse = await fetch('http://localhost:3000/api/resources');
        const resourcesData = await resourcesResponse.json();
        
        if (resourcesData.success) {
          setResources(resourcesData.data);
        }
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    };

    fetchData();
  }, []);

  const handlePurchaseUpgrade = async (upgradeId: string) => {
    try {
      const response = await fetch(`http://localhost:3000/api/upgrades/${upgradeId}/purchase`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      const data = await response.json();
      
      if (data.success) {
        // Atualizar apenas o upgrade comprado
        setUpgrades(prev => prev.map(upgrade => 
          upgrade.id === upgradeId 
            ? { ...upgrade, purchased: true }
            : upgrade
        ));
      } else {
        alert('Erro ao comprar upgrade: ' + data.error);
      }
    } catch (error) {
      console.error('Error purchasing upgrade:', error);
      alert('Erro ao comprar upgrade');
    }
  };

  const canAfford = (cost: any) => {
    if (!resources) return false;
    
    return resources.crystals >= cost.crystals &&
           resources.energy >= cost.energy &&
           resources.research >= cost.research &&
           resources.reputation >= cost.reputation;
  };

  const formatNumber = (num: number) => {
    if (num >= 1000000) return `${(num / 1000000).toFixed(1)}M`;
    if (num >= 1000) return `${(num / 1000).toFixed(1)}K`;
    return num.toFixed(1);
  };

  const getUpgradeIcon = (type: string) => {
    const icons: { [key: string]: string } = {
      'mining': '⛏️',
      'energy': '⚡',
      'research': '🔬',
      'reputation': '⭐',
      'ship': '🚀',
      'asteroid': '🪨'
    };
    return icons[type] || '⚙️';
  };

  const getUpgradeColor = (type: string) => {
    const colors: { [key: string]: string } = {
      'mining': '#FF9800',
      'energy': '#4CAF50',
      'research': '#2196F3',
      'reputation': '#FFD700',
      'ship': '#9C27B0',
      'asteroid': '#795548'
    };
    return colors[type] || '#666';
  };

  return (
    <div className="upgrade-panel">
      <div className="panel-header">
        <h3>⚡ Upgrades</h3>
        <button 
          className="toggle-button"
          onClick={() => setIsOpen(!isOpen)}
        >
          {isOpen ? '▼' : '▶'}
        </button>
      </div>

      {isOpen && (
        <div className="upgrades-container">
          {upgrades.length === 0 ? (
            <div className="no-upgrades">
              <p>Nenhum upgrade disponível</p>
              <p>Continue jogando para desbloquear upgrades!</p>
            </div>
          ) : (
            <div className="upgrades-grid">
              {upgrades.map((upgrade) => (
                <div 
                  key={upgrade.id} 
                  className={`upgrade-item ${upgrade.purchased ? 'purchased' : ''}`}
                  style={{ borderColor: getUpgradeColor(upgrade.type) }}
                >
                  <div className="upgrade-header">
                    <span className="upgrade-icon">{getUpgradeIcon(upgrade.type)}</span>
                    <h4 className="upgrade-name">{upgrade.name}</h4>
                  </div>
                  
                  <p className="upgrade-description">{upgrade.description}</p>
                  
                  <div className="upgrade-cost">
                    <span className="cost-label">Custo:</span>
                    <div className="cost-items">
                      {upgrade.cost.crystals > 0 && (
                        <span className="cost-item">💎 {formatNumber(upgrade.cost.crystals)}</span>
                      )}
                      {upgrade.cost.energy > 0 && (
                        <span className="cost-item">⚡ {formatNumber(upgrade.cost.energy)}</span>
                      )}
                      {upgrade.cost.research > 0 && (
                        <span className="cost-item">🔬 {formatNumber(upgrade.cost.research)}</span>
                      )}
                      {upgrade.cost.reputation > 0 && (
                        <span className="cost-item">⭐ {formatNumber(upgrade.cost.reputation)}</span>
                      )}
                    </div>
                  </div>

                  {upgrade.purchased ? (
                    <div className="upgrade-status purchased">
                      ✅ Comprado
                    </div>
                  ) : (
                    <button
                      className={`purchase-button ${canAfford(upgrade.cost) ? 'affordable' : 'unaffordable'}`}
                      onClick={() => handlePurchaseUpgrade(upgrade.id)}
                      disabled={!canAfford(upgrade.cost)}
                    >
                      {canAfford(upgrade.cost) ? 'Comprar' : 'Recursos Insuficientes'}
                    </button>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default UpgradePanelOptimized; 
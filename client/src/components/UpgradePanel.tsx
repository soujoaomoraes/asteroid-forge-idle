import React, { useState, useEffect } from 'react';

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

const UpgradePanel: React.FC = () => {
  const [upgrades, setUpgrades] = useState<Upgrade[]>([]);
  const [resources, setResources] = useState<Resources | null>(null);
  const [isOpen, setIsOpen] = useState(false);

  // Fetch upgrades and resources
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
    const interval = setInterval(fetchData, 5000); // Refresh every 5 seconds
    
    return () => clearInterval(interval);
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
        // Refresh data
        const upgradesResponse = await fetch('http://localhost:3000/api/upgrades');
        const upgradesData = await upgradesResponse.json();
        if (upgradesData.success) {
          setUpgrades(upgradesData.data);
        }

        const resourcesResponse = await fetch('http://localhost:3000/api/resources');
        const resourcesData = await resourcesResponse.json();
        if (resourcesData.success) {
          setResources(resourcesData.data);
        }
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
    return num.toFixed(0);
  };

  const getUpgradeIcon = (type: string) => {
    switch (type) {
      case 'MINING_EFFICIENCY': return '⛏️';
      case 'ENERGY_GENERATION': return '⚡';
      case 'RESEARCH_BOOST': return '🔬';
      default: return '⚡';
    }
  };

  const getUpgradeColor = (type: string) => {
    switch (type) {
      case 'MINING_EFFICIENCY': return '#ffd700';
      case 'ENERGY_GENERATION': return '#00ffff';
      case 'RESEARCH_BOOST': return '#ff69b4';
      default: return '#ffffff';
    }
  };

  return (
    <>
      {/* Toggle Button */}
      <button 
        className="upgrade-toggle"
        onClick={() => setIsOpen(!isOpen)}
      >
        {isOpen ? '✕' : '⚡'} Upgrades
      </button>

      {/* Upgrade Panel */}
      {isOpen && (
        <div className="upgrade-panel">
          <div className="upgrade-header">
            <h3>⚡ Upgrades</h3>
            <button 
              className="close-btn"
              onClick={() => setIsOpen(false)}
            >
              ✕
            </button>
          </div>

          <div className="upgrades-list">
            {upgrades.length === 0 ? (
              <div className="no-upgrades">
                <p>Nenhum upgrade disponível ainda...</p>
                <p>Continue jogando para desbloquear upgrades!</p>
              </div>
            ) : (
              upgrades.map((upgrade) => (
                <div 
                  key={upgrade.id} 
                  className={`upgrade-item ${upgrade.purchased ? 'purchased' : ''}`}
                >
                  <div className="upgrade-icon" style={{ color: getUpgradeColor(upgrade.type) }}>
                    {getUpgradeIcon(upgrade.type)}
                  </div>
                  
                  <div className="upgrade-info">
                    <div className="upgrade-name">{upgrade.name}</div>
                    <div className="upgrade-description">{upgrade.description}</div>
                    
                    <div className="upgrade-cost">
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

                  <div className="upgrade-action">
                    {upgrade.purchased ? (
                      <span className="purchased-badge">✓ Comprado</span>
                    ) : (
                      <button
                        className={`purchase-btn ${canAfford(upgrade.cost) ? 'affordable' : 'expensive'}`}
                        onClick={() => handlePurchaseUpgrade(upgrade.id)}
                        disabled={!canAfford(upgrade.cost)}
                      >
                        {canAfford(upgrade.cost) ? 'Comprar' : 'Caro'}
                      </button>
                    )}
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      )}
    </>
  );
};

export default UpgradePanel; 
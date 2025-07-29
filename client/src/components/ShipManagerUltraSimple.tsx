import React, { useState, useEffect } from 'react';
import { ShipType } from '../types/ship';

interface Ship {
  id: string;
  type: ShipType;
  name: string;
  level: number;
  isActive: boolean;
  position?: { x: number; y: number };
}

interface ShipStats {
  speed: number;
  mining: number;
  capacity: number;
  health: number;
}

interface ShipManagerUltraSimpleProps {
  onDeployShip?: (type: ShipType) => void;
  ships?: Ship[];
  shipStats?: ShipStats;
}

const ShipManagerUltraSimple: React.FC<ShipManagerUltraSimpleProps> = ({ 
  onDeployShip, 
  ships = [], 
  shipStats = { speed: 2, mining: 0.5, capacity: 10, health: 50 }
}) => {
  const [isOpen, setIsOpen] = useState(false);

  const shipTypes = [
    { type: ShipType.SCOUT, name: 'Scout', icon: '🔍', description: 'Explora asteroides rapidamente' },
    { type: ShipType.MINER, name: 'Miner', icon: '⛏️', description: 'Mineração básica eficiente' },
    { type: ShipType.HAULER, name: 'Hauler', icon: '📦', description: 'Alta capacidade de transporte' },
    { type: ShipType.DESTROYER, name: 'Destroyer', icon: '💥', description: 'Remove obstáculos e protege' }
  ];

  const handleDeployShip = (shipType: ShipType) => {
    onDeployShip?.(shipType);
  };

  const getShipIcon = (type: ShipType) => {
    const shipType = shipTypes.find(s => s.type === type);
    return shipType?.icon || '🚀';
  };

  const getShipName = (type: ShipType) => {
    const shipType = shipTypes.find(s => s.type === type);
    return shipType?.name || 'Unknown';
  };

  const getShipDescription = (type: ShipType) => {
    const shipType = shipTypes.find(s => s.type === type);
    return shipType?.description || '';
  };

  return (
    <div className="ship-manager">
      <div className="panel-header">
        <h3>🚀 Naves</h3>
        <button 
          className="toggle-button"
          onClick={() => setIsOpen(!isOpen)}
        >
          {isOpen ? '▼' : '▶'}
        </button>
      </div>

      {isOpen && (
        <div className="ships-container">
          {ships.length === 0 ? (
            <div className="no-ships">
              <p>Nenhuma nave ativa</p>
              <p>Deploy uma nave para começar a minerar!</p>
            </div>
          ) : (
            <div className="ships-list">
              {ships.map((ship) => (
                <div key={ship.id} className={`ship-item ${ship.isActive ? 'active' : 'inactive'}`}>
                  <div className="ship-icon">{getShipIcon(ship.type)}</div>
                  <div className="ship-info">
                    <div className="ship-name">{ship.name}</div>
                    <div className="ship-type">{getShipName(ship.type)}</div>
                    <div className="ship-level">Nível {ship.level}</div>
                  </div>
                  <div className="ship-status">
                    {ship.isActive ? '🟢 Ativa' : '🔴 Inativa'}
                  </div>
                </div>
              ))}
            </div>
          )}

          <div className="deploy-section">
            <h4>Deploy de Naves</h4>
            <div className="deploy-grid">
              {shipTypes.map((shipType) => (
                <button
                  key={shipType.type}
                  className="deploy-button"
                  onClick={() => handleDeployShip(shipType.type)}
                >
                  <div className="deploy-icon">{shipType.icon}</div>
                  <div className="deploy-name">{shipType.name}</div>
                  <div className="deploy-description">{shipType.description}</div>
                </button>
              ))}
            </div>
          </div>

          <div className="ship-stats">
            <h4>Informações da Nave</h4>
            <div className="stats-grid">
              <div className="stat-item">
                <span className="stat-label">Velocidade:</span>
                <span className="stat-value">{shipStats.speed}</span>
              </div>
              <div className="stat-item">
                <span className="stat-label">Mineração:</span>
                <span className="stat-value">{shipStats.mining}/s</span>
              </div>
              <div className="stat-item">
                <span className="stat-label">Capacidade:</span>
                <span className="stat-value">{shipStats.capacity}</span>
              </div>
              <div className="stat-item">
                <span className="stat-label">Vida:</span>
                <span className="stat-value">{shipStats.health}</span>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ShipManagerUltraSimple; 
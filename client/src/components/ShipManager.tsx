import React, { useState, useEffect } from 'react';
import { ShipType, ShipStatus, SHIP_CONFIGS } from '../types/ship';
import './ShipManager.css';

interface ShipManagerProps {
  onDeployShip: (type: ShipType) => void;
  ships: any[];
  shipStats: {
    total: number;
    idle: number;
    mining: number;
    returning: number;
    deploying: number;
    totalCargo: number;
  };
}

const ShipManager: React.FC<ShipManagerProps> = ({ onDeployShip, ships, shipStats }) => {
  const [selectedShipType, setSelectedShipType] = useState<ShipType>(ShipType.SCOUT);

  const getStatusColor = (status: ShipStatus): string => {
    switch (status) {
      case ShipStatus.IDLE: return '#4CAF50';
      case ShipStatus.MINING: return '#FF9800';
      case ShipStatus.RETURNING: return '#2196F3';
      case ShipStatus.DEPLOYING: return '#9C27B0';
      default: return '#757575';
    }
  };

  const getStatusText = (status: ShipStatus): string => {
    switch (status) {
      case ShipStatus.IDLE: return 'Ociosa';
      case ShipStatus.MINING: return 'Minerando';
      case ShipStatus.RETURNING: return 'Retornando';
      case ShipStatus.DEPLOYING: return 'Deployando';
      default: return 'Desconhecido';
    }
  };

  const formatNumber = (num: number): string => {
    if (num >= 1000000) return `${(num / 1000000).toFixed(1)}M`;
    if (num >= 1000) return `${(num / 1000).toFixed(1)}K`;
    return num.toString();
  };

  return (
    <div className="ship-manager">
      <div className="ship-manager-header">
        <h3>🚀 Gerenciador de Naves</h3>
        <div className="ship-stats">
          <div className="stat">
            <span className="stat-label">Total:</span>
            <span className="stat-value">{shipStats.total}</span>
          </div>
          <div className="stat">
            <span className="stat-label">Minerando:</span>
            <span className="stat-value">{shipStats.mining}</span>
          </div>
          <div className="stat">
            <span className="stat-label">Carga:</span>
            <span className="stat-value">{formatNumber(shipStats.totalCargo)}</span>
          </div>
        </div>
      </div>

      <div className="ship-deploy-section">
        <h4>Deploy Nova Nave</h4>
        <div className="ship-type-selector">
          {Object.values(ShipType).map((type) => {
            const config = SHIP_CONFIGS[type];
            return (
              <div
                key={type}
                className={`ship-type-option ${selectedShipType === type ? 'selected' : ''}`}
                onClick={() => setSelectedShipType(type)}
              >
                <div className="ship-type-icon">
                  {type === ShipType.SCOUT && '🔍'}
                  {type === ShipType.MINER && '⛏️'}
                  {type === ShipType.HAULER && '📦'}
                  {type === ShipType.DESTROYER && '⚔️'}
                </div>
                <div className="ship-type-info">
                  <div className="ship-type-name">{config.name}</div>
                  <div className="ship-type-cost">
                    💎 {formatNumber(config.cost.crystals)} 
                    ⚡ {formatNumber(config.cost.energy)}
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        <button
          className="deploy-button"
          onClick={() => onDeployShip(selectedShipType)}
        >
          Deploy {SHIP_CONFIGS[selectedShipType].name}
        </button>
      </div>

      <div className="ship-list-section">
        <h4>Naves Ativas ({ships.length})</h4>
        <div className="ship-list">
          {ships.length === 0 ? (
            <div className="no-ships">
              <p>Nenhuma nave ativa</p>
              <p>Deploy uma nave para começar a minerar!</p>
            </div>
          ) : (
            ships.map((ship) => (
              <div key={ship.id} className="ship-item">
                <div className="ship-icon">
                  {ship.type === ShipType.SCOUT && '🔍'}
                  {ship.type === ShipType.MINER && '⛏️'}
                  {ship.type === ShipType.HAULER && '📦'}
                  {ship.type === ShipType.DESTROYER && '⚔️'}
                </div>
                <div className="ship-info">
                  <div className="ship-name">
                    {SHIP_CONFIGS[ship.type as ShipType].name} #{ship.id.slice(-4)}
                  </div>
                  <div className="ship-status">
                    <span 
                      className="status-indicator"
                      style={{ backgroundColor: getStatusColor(ship.status) }}
                    ></span>
                    {getStatusText(ship.status)}
                  </div>
                  <div className="ship-cargo">
                    Carga: {ship.currentCargo}/{ship.capacity}
                  </div>
                </div>
                <div className="ship-position">
                  <div>X: {Math.round(ship.position.x)}</div>
                  <div>Y: {Math.round(ship.position.y)}</div>
                </div>
              </div>
            ))
          )}
        </div>
      </div>

      <div className="ship-info-panel">
        <h4>Informações da Nave</h4>
        <div className="ship-details">
          <div className="detail-row">
            <span className="detail-label">Velocidade:</span>
            <span className="detail-value">{SHIP_CONFIGS[selectedShipType].stats.speed}</span>
          </div>
          <div className="detail-row">
            <span className="detail-label">Mineração:</span>
            <span className="detail-value">{SHIP_CONFIGS[selectedShipType].stats.miningSpeed}/s</span>
          </div>
          <div className="detail-row">
            <span className="detail-label">Capacidade:</span>
            <span className="detail-value">{SHIP_CONFIGS[selectedShipType].stats.capacity}</span>
          </div>
          <div className="detail-row">
            <span className="detail-label">Vida:</span>
            <span className="detail-value">{SHIP_CONFIGS[selectedShipType].stats.health}</span>
          </div>
          <div className="detail-description">
            {SHIP_CONFIGS[selectedShipType].description}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ShipManager; 
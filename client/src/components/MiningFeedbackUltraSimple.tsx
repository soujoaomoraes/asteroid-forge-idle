import React from 'react';

interface MiningData {
  resources: {
    crystals?: number;
    energy?: number;
    research?: number;
    reputation?: number;
  };
  timestamp: number;
}

interface MiningFeedbackUltraSimpleProps {
  lastMinedResources: MiningData | null;
}

const MiningFeedbackUltraSimple: React.FC<MiningFeedbackUltraSimpleProps> = ({ lastMinedResources }) => {
  if (!lastMinedResources) {
    return null;
  }

  const formatNumber = (num: number) => {
    if (num >= 1000000) return `${(num / 1000000).toFixed(1)}M`;
    if (num >= 1000) return `${(num / 1000).toFixed(1)}K`;
    return num.toFixed(1);
  };

  const getResourceIcon = (resourceType: string) => {
    const icons: { [key: string]: string } = {
      crystals: '💎',
      energy: '⚡',
      research: '🔬',
      reputation: '⭐'
    };
    return icons[resourceType] || '📦';
  };

  const getResourceColor = (resourceType: string) => {
    const colors: { [key: string]: string } = {
      crystals: '#FFD700',
      energy: '#4CAF50',
      research: '#2196F3',
      reputation: '#FFD700'
    };
    return colors[resourceType] || '#ffffff';
  };

  const resources = lastMinedResources.resources;
  const timestamp = new Date(lastMinedResources.timestamp);

  return (
    <div className="mining-feedback">
      <div className="feedback-header">
        <h3>⛏️ Mineração</h3>
        <span className="feedback-time">{timestamp.toLocaleTimeString()}</span>
      </div>

      <div className="resources-mined">
        {Object.entries(resources).map(([resourceType, amount]) => {
          if (!amount || amount <= 0) return null;
          
          return (
            <div 
              key={resourceType} 
              className="mined-resource"
              style={{ color: getResourceColor(resourceType) }}
            >
              <span className="resource-icon">{getResourceIcon(resourceType)}</span>
              <span className="resource-name">{resourceType.charAt(0).toUpperCase() + resourceType.slice(1)}</span>
              <span className="resource-amount">+{formatNumber(amount)}</span>
            </div>
          );
        })}
      </div>

      <div className="mining-stats">
        <div className="stat-item">
          <span className="stat-label">Total Mined:</span>
          <span className="stat-value">
            {Object.values(resources).reduce((sum, amount) => sum + (amount || 0), 0)}
          </span>
        </div>
        <div className="stat-item">
          <span className="stat-label">Resources:</span>
          <span className="stat-value">
            {Object.keys(resources).filter(key => (resources[key as keyof typeof resources] || 0) > 0).length}
          </span>
        </div>
      </div>
    </div>
  );
};

export default MiningFeedbackUltraSimple; 
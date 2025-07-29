import React, { useEffect, useState } from 'react';
import { AsteroidResources } from '../types/asteroid';

interface MiningFeedbackProps {
  lastMinedResources: {
    resources: AsteroidResources;
    timestamp: number;
  } | null;
}

const MiningFeedback: React.FC<MiningFeedbackProps> = ({ lastMinedResources }) => {
  const [isVisible, setIsVisible] = useState(false);
  const [fadeOut, setFadeOut] = useState(false);

  useEffect(() => {
    if (lastMinedResources) {
      setIsVisible(true);
      setFadeOut(false);

      // Fade out após 3 segundos
      const timer = setTimeout(() => {
        setFadeOut(true);
        setTimeout(() => setIsVisible(false), 500);
      }, 3000);

      return () => clearTimeout(timer);
    }
  }, [lastMinedResources]);

  if (!isVisible || !lastMinedResources) {
    return null;
  }

  const formatResources = (resources: AsteroidResources): string => {
    const parts = [];
    if (resources.crystals > 0) parts.push(`💎 ${resources.crystals}`);
    if (resources.metals > 0) parts.push(`🔧 ${resources.metals}`);
    if (resources.gems > 0) parts.push(`💎 ${resources.gems}`);
    if (resources.energy > 0) parts.push(`⚡ ${resources.energy}`);
    
    return parts.join(', ');
  };

  return (
    <div className={`mining-feedback ${fadeOut ? 'fade-out' : ''}`}>
      <div className="mining-icon">⛏️</div>
      <div className="mining-text">
        <div className="mining-title">Recursos Minerados!</div>
        <div className="mining-resources">
          {formatResources(lastMinedResources.resources)}
        </div>
      </div>
    </div>
  );
};

export default MiningFeedback; 
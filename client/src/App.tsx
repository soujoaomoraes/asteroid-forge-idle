import React, { useState } from 'react';
import { SpaceCanvasSimple } from './components/SpaceCanvasSimple';
import { SpaceCanvasPhysics } from './components/SpaceCanvasPhysics';
import ResourcePanelUltraSimple from './components/ResourcePanelUltraSimple';
import UpgradePanelUltraSimple from './components/UpgradePanelUltraSimple';
import MiningFeedbackUltraSimple from './components/MiningFeedbackUltraSimple';
import ShipManagerUltraSimple from './components/ShipManagerUltraSimple';
import { ShipType } from './types/ship';
import './components/ResourcePanel.css';
import './components/UpgradePanel.css';
import './components/MiningFeedback.css';
import './components/ShipManager.css';
import './components/UI.css';

function App() {
  const [lastMinedResources, setLastMinedResources] = useState(null);
  const [ships, setShips] = useState([]);
  const [shipStats, setShipStats] = useState({
    speed: 2,
    mining: 0.5,
    capacity: 10,
    health: 50
  });

  const handleDeployShip = (type: ShipType) => {
    console.log(`🚀 Deploying ship type: ${type}`);
    // Aqui você pode adicionar lógica para verificar recursos
    // e integrar com o sistema de recursos
  };

  return (
    <div className="App">
      <SpaceCanvasSimple 
        onMiningFeedback={setLastMinedResources}
        onDeployShip={handleDeployShip}
      />
      {/* TESTE 5: Canvas com Física Realista */}
      <SpaceCanvasPhysics 
        onMiningFeedback={setLastMinedResources}
        onDeployShip={handleDeployShip}
      />
      <div className="ui-panels">
        <ResourcePanelUltraSimple />
        <UpgradePanelUltraSimple />
        <ShipManagerUltraSimple 
          onDeployShip={handleDeployShip}
          ships={ships}
          shipStats={shipStats}
        />
        <MiningFeedbackUltraSimple lastMinedResources={lastMinedResources} />
      </div>
    </div>
  );
}

export default App; 
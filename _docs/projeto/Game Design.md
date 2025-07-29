🚀 Space Miner Idle - Game Design
Document
📋 VISÃO GERAL DO JOGO
Conceito Principal
Space Miner Idle é um jogo idle/incremental ambientado no espaço onde o jogador gerencia
uma frota de naves mineradoras autônomas. O objetivo é expandir operações de mineração,
descobrir novos recursos e desbloquear tecnologias avançadas.
Pillares de Design
1. Progressão Satisfatória: Cada upgrade deve ter impacto visível
2. Física Envolvente: Matter.js para movimento realista
3. Automação Inteligente: Decisões estratégicas > micro-management
4. Feedback Visual: Toda ação tem resposta visual imediata
🎮 MECÂNICAS PRINCIPAIS
Sistema de Recursos
interface Resources {
crystals: number; // Recurso primário para upgrades
energy: number; // Combustível para naves
research: number; // Desbloqueia tecnologias
reputation: number; // Acesso a novos setores
}
Tipos de Naves
● Scout: Rápida, baixa capacidade, explora asteroides
● Miner: Mineração básica, equilibrada
● Hauler: Alta capacidade, lenta, transporte eficiente
● Destroyer: Remove obstáculos, protege frota
Progressão de Upgrades
1. Nível 1-10: Upgrades básicos de velocidade/capacidade
2. Nível 11-25: Especializações de naves
3. Nível 26-50: Tecnologias avançadas
4. Nível 51+: Prestige e modificadores permanentes
🌌 MUNDO DO JOGO
Setores Espaciais
● Setor Alpha: Tutorial, asteroides básicos
● Setor Beta: Asteroides densos, maior recompensa
● Setor Gamma: Campos de energia, novos recursos
● Setor Delta: Zona perigosa, recompensas premium
Física Espacial
● Gravidade: Baixa, permitindo movimento fluido
● Momentum: Naves mantêm velocidade, requer planejamento
● Colisões: Damage system baseado em massa/velocidade
● Órbitas: Asteroides em movimento previsível
🔧 IMPLEMENTAÇÃO TÉCNICA
Arquitetura do Sistema Idle
class IdleCalculator {
calculateOfflineProgress(lastSave: Date, currentTime: Date) {
const timeOffline = currentTime.getTime() - lastSave.getTime();
const hoursOffline = timeOffline / (1000 * 60 * 60);
return {
crystalsEarned: this.calculateCrystalRate() * hoursOffline,
energyConsumed: this.calculateEnergyRate() * hoursOffline,
researchGained: this.calculateResearchRate() * hoursOffline
};
}
}
Integração Matter.js
// Configuração do mundo físico
const engine = Matter.Engine.create();
engine.world.gravity.y = 0.1; // Gravidade espacial baixa
// Naves com propriedades físicas
const ship = Matter.Bodies.rectangle(x, y, 20, 40, {
density: 0.001,
frictionAir: 0.01,
render: { fillStyle: '#00ff00' }
});
WebSocket Events
● game-state-update: Sincronização de estado
● resource-earned: Feedback de mineração
● upgrade-purchased: Confirmação de compra
● ship-collision: Eventos de física
🎯 BALANCEAMENTO
Curva de Progressão
● Early Game (0-30min): Descoberta e aprendizado
● Mid Game (30min-2h): Otimização e estratégia
● Late Game (2h+): Prestige e metas de longo prazo
Fórmulas de Scaling
// Custo de upgrades (escala exponencial)
const upgradeCost = baseCost * Math.pow(1.15, currentLevel);
// Taxa de mineração (melhoria logarítmica)
const miningRate = baseRate * Math.log(shipCount + 1) * shipEfficiency;
// Recursos offline (limitado para evitar inflação)
const offlineMultiplier = Math.min(hoursOffline, 24) / 24;
🎨 DIREÇÃO VISUAL
Paleta de Cores
● Primária: Azuis e cianos (#00B4D8, #0077B6)
● Secundária: Verdes energéticos (#06D6A0, #118AB2)
● Acentos: Dourados para upgrades (#FFD60A)
● Fundo: Preto espacial com estrelas (#000814)
Efeitos Visuais
● Partículas de Mineração: Pequenos cristais voando
● Rastros de Naves: Trails luminosos
● Explosões: Feedback de colisões
● Pulsação: UI elements para ações importantes
UI/UX Guidelines
● Minimal Clean: Informação clara sem sobrecarga
● Feedback Imediato: Toda ação tem resposta visual
● Mobile First: Design responsivo desde o início
● Accessibility: Cores contrastantes, fontes legíveis
📊 MÉTRICAS E ANALYTICS
KPIs Principais
● Session Length: Tempo médio de jogo
● Retention: D1, D7, D30
● Upgrade Frequency: Quantos upgrades por sessão
● Offline Return Rate: % que volta após tempo offline
Telemetria Events
interface TelemetryEvent {
eventType: 'upgrade_purchased' | 'ship_deployed' | 'resource_milestone';
timestamp: Date;
playerLevel: number;
sessionDuration: number;
metadata: Record<string, any>;
}
🚀 ROADMAP PÓS-MVP
Features Futuras
1. Multiplayer Guild System: Cooperação entre jogadores
2. PvP Space Combat: Batalhas táticas
3. Planetary Colonies: Expansão para planetas
4. Real Economy: Trading entre jogadores
5. Seasonal Events: Conteúdo limitado
Melhorias Técnicas
● Performance Optimization: Spatial partitioning
● Advanced Physics: Realistic orbital mechanics
● AI Ships: Comportamentos emergentes
● Procedural Generation: Infinitos setores
🎯 OBJETIVOS DE RETENÇÃO
Short-term (Primeira Sessão)
● [ ] Completar tutorial em < 2 minutos
● [ ] Primeiro upgrade em < 5 minutos
● [ ] Ver primeira nave minerando automaticamente
● [ ] Descobrir 3 tipos diferentes de asteroides
Medium-term (Primeira Semana)
● [ ] Desbloquear segundo tipo de nave
● [ ] Atingir primeiro milestone de 1000 crystals
● [ ] Explorar segundo setor espacial
● [ ] Fazer primeiro prestige
Long-term (Primeiro Mês)
● [ ] Construir frota de 10+ naves
● [ ] Completar árvore de tecnologia
● [ ] Dominar todos os setores
● [ ] Participar de eventos sazonais
🔧 ESPECIFICAÇÕES TÉCNICAS
Performance Targets
● 60 FPS consistentes no gameplay
● < 100ms de latência no WebSocket
● < 3 segundos para load inicial
● < 50MB de memória RAM utilizada
Compatibilidade
● Desktop: Chrome 90+, Firefox 88+, Safari 14+
● Mobile: iOS 14+, Android 10+
● Resolution: 320px até 4K suportado
Arquitetura Escalável
// Separação clara de responsabilidades
interface GameArchitecture {
presentation: React.Component[];
business: GameLogic[];
data: DatabaseLayer[];
physics: Matter.Engine;
network: WebSocketManager;
}
Este documento serve como guia completo para desenvolvimento e deve ser atualizado
conforme o projeto evolui.
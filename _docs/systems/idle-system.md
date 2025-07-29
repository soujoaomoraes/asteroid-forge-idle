# Sistema de Recursos Idle

## 📋 Visão Geral

O **Sistema de Recursos Idle** é o coração do jogo, responsável por todas as mecânicas de produção automática de recursos, upgrades e progressão do jogador.

## 🏗️ Arquitetura

### Componentes Principais

#### 1. **GameLoopService** (`server/src/services/gameLoop.ts`)
- **Função**: Loop principal do jogo que executa a cada 1 segundo
- **Responsabilidades**:
  - Calcular produção de recursos
  - Aplicar multiplicadores de upgrades
  - Atualizar banco de dados
  - Broadcast via WebSocket

#### 2. **WebSocket Integration**
- **Função**: Comunicação em tempo real
- **Eventos**:
  - `RESOURCES_UPDATED`: Recursos atualizados
  - `SHIPS_UPDATED`: Naves atualizadas
  - `UPGRADE_PURCHASED`: Upgrade comprado

#### 3. **API Endpoints**
- `GET /api/game-stats`: Estatísticas e taxas de produção
- `GET /api/resources`: Recursos atuais
- `POST /api/upgrades`: Comprar upgrades

## ⚙️ Mecânicas de Recursos

### Produção Base

| Recurso | Taxa Base | Condição |
|---------|-----------|----------|
| **Crystals** | 1.0/segundo | Sempre ativo |
| **Energy** | -0.5/segundo | Consumo constante |
| **Research** | 0.1/segundo | Se crystals ≥ 10 |
| **Reputation** | 0.2/segundo | Se research ≥ 5 |

### Fórmulas de Produção

```typescript
// Produção de Crystals
crystalsPerSecond = 1.0 * crystalMultiplier

// Consumo de Energy  
energyPerSecond = -0.5 * energyMultiplier

// Produção de Research
researchPerSecond = (crystals >= 10) ? 0.1 * researchMultiplier : 0

// Produção de Reputation
reputationPerSecond = (research >= 5) ? 0.2 : 0
```

## 🔧 Sistema de Upgrades

### Tipos de Upgrades

| Tipo | Efeito | Multiplicador |
|------|--------|---------------|
| `MINING_EFFICIENCY` | Aumenta produção de crystals | `efficiencyMultiplier` |
| `ENERGY_GENERATION` | Reduz consumo de energy | `energyMultiplier` |
| `RESEARCH_BOOST` | Aumenta produção de research | `researchMultiplier` |

### Estrutura de Upgrade

```typescript
interface Upgrade {
  id: string;
  name: string;
  description: string;
  type: UpgradeType;
  cost: {
    crystals: number;
    energy: number;
    research: number;
    reputation: number;
  };
  effect: {
    efficiencyMultiplier?: number;
    energyMultiplier?: number;
    researchMultiplier?: number;
  };
  purchased: boolean;
  createdAt: Date;
}
```

## 🎮 Game Loop

### Ciclo de Atualização (1 segundo)

1. **Calcular Delta Time**
   ```typescript
   const deltaTime = (now - lastUpdate) / 1000;
   ```

2. **Buscar Estado Atual**
   ```typescript
   const gameState = await prisma.gameState.findFirst({
     include: { resources, ships, upgrades }
   });
   ```

3. **Calcular Produção**
   ```typescript
   const production = calculateResourceProduction(gameState, deltaTime);
   ```

4. **Aplicar Multiplicadores**
   ```typescript
   production.crystals *= crystalMultiplier;
   production.energy *= energyMultiplier;
   production.research *= researchMultiplier;
   ```

5. **Atualizar Banco**
   ```typescript
   await prisma.resources.update({
     data: {
       crystals: current + production.crystals,
       energy: Math.max(0, current + production.energy),
       // ...
     }
   });
   ```

6. **Broadcast WebSocket**
   ```typescript
   await wsService.broadcastResources();
   ```

## 📊 API de Estatísticas

### Endpoint: `GET /api/game-stats`

**Response:**
```json
{
  "success": true,
  "data": {
    "currentResources": {
      "crystals": 150.5,
      "energy": 25.0,
      "research": 12.3,
      "reputation": 8.7
    },
    "production": {
      "crystals": 2.0,
      "energy": -0.25,
      "research": 0.2,
      "reputation": 0.4
    },
    "ships": 3,
    "upgrades": 5,
    "statistics": {
      "totalCrystalsMined": 1500,
      "totalEnergyConsumed": 500,
      "totalResearchGenerated": 200
    }
  }
}
```

## 🔄 Cálculos Offline

### Implementação Futura

O sistema está preparado para implementar **cálculos offline**:

```typescript
// Calcular produção durante período offline
const offlineTime = (now - lastSave) / 1000;
const offlineProduction = calculateResourceProduction(gameState, offlineTime);

// Aplicar produção acumulada
await updateResources(offlineProduction);
```

## 🚀 Próximos Passos

### 1. **Frontend Integration**
- [ ] Componente de recursos em tempo real
- [ ] Interface de upgrades
- [ ] Gráficos de produção

### 2. **Sistema de Asteroids**
- [ ] Geração procedural de asteroides
- [ ] Mecânicas de mineração
- [ ] Diferentes tipos de recursos

### 3. **Sistema de Naves**
- [ ] Deploy de naves para mineração
- [ ] Diferentes tipos de naves
- [ ] Sistema de upgrades de naves

### 4. **Física com Matter.js**
- [ ] Colisões realistas
- [ ] Gravidade e movimento
- [ ] Efeitos visuais

## 🐛 Troubleshooting

### Problemas Comuns

1. **Game Loop não inicia**
   - Verificar se `GameLoopService` está sendo instanciado
   - Verificar logs do servidor

2. **Recursos não atualizam**
   - Verificar conexão com banco de dados
   - Verificar se `gameState` existe

3. **WebSocket não funciona**
   - Verificar se porta 3000 está livre
   - Verificar logs de conexão

### Logs Importantes

```bash
# Game Loop iniciado
🎮 Starting game loop...
✅ Game loop started

# Recursos atualizados (a cada 10s)
📊 Resources updated: { crystals: 150.5, energy: 25.0, ... }

# WebSocket conectado
🔌 WebSocket client connected
```

## 📈 Performance

### Otimizações Implementadas

1. **Update Rate**: 1 segundo (balanceado entre responsividade e performance)
2. **Batch Updates**: Atualizações em lote no banco
3. **Selective Broadcasting**: Só broadcast quando necessário
4. **Error Handling**: Try-catch em todas as operações críticas

### Métricas de Monitoramento

- **Uptime**: Tempo de execução do game loop
- **Update Frequency**: Taxa de atualizações por segundo
- **Database Queries**: Número de queries por ciclo
- **WebSocket Connections**: Número de clientes conectados

---

**Última Atualização**: Janeiro 2025  
**Versão**: 1.0.0  
**Status**: ✅ Implementado e Funcionando 
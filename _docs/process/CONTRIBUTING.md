# 🛠️ Práticas de Desenvolvimento

## 📋 Convenções Gerais

### Estrutura de Commits
```
feat: adicionar sistema de naves autônomas
fix: resolver problema de WebSocket
docs: atualizar documentação de API
refactor: otimizar performance do canvas
test: adicionar testes para mineração
```

### Nomenclatura
- **Arquivos**: kebab-case (`game-canvas.tsx`)
- **Componentes**: PascalCase (`GameCanvas`)
- **Funções**: camelCase (`calculateMiningRate`)
- **Constantes**: UPPER_SNAKE_CASE (`MAX_ASTEROIDS`)

## 🏗️ Arquitetura

### Frontend (React)
```typescript
// Componentes organizados por responsabilidade
src/
├── components/
│   ├── ui/          // Componentes base (Button, Input)
│   ├── game/        // Componentes do jogo (Canvas, Ships)
│   └── layout/      // Layout e estrutura
├── hooks/           // Custom hooks
├── services/        // API, WebSocket
└── types/           // TypeScript definitions
```

### Backend (Node.js)
```typescript
// Separação clara de responsabilidades
src/
├── routes/          // API endpoints
├── services/        // Lógica de negócio
├── types/           // TypeScript definitions
└── utils/           // Funções utilitárias
```

## 🧪 Testing

### Estratégia de Testes
1. **Unit Tests**: Componentes e funções isoladas
2. **Integration Tests**: API endpoints
3. **E2E Tests**: Fluxos completos do jogo
4. **Performance Tests**: FPS, memória, latência

### Exemplo de Teste
```typescript
describe('MiningService', () => {
  it('should calculate mining rate correctly', () => {
    const service = new MiningService();
    const rate = service.calculateRate(5, 1.5);
    expect(rate).toBe(7.5);
  });
});
```

## 📊 Performance

### Métricas Obrigatórias
- **FPS**: 60 FPS consistentes
- **Memória**: < 50MB RAM
- **Load Time**: < 3 segundos
- **WebSocket Latency**: < 100ms

### Otimizações
- Object pooling para partículas
- Spatial partitioning para colisões
- Lazy loading de componentes
- WebSocket batching

## 🔧 Debugging

### WebSocket Issues
```typescript
// Logs detalhados para debug
ws.on('connection', (socket) => {
  console.log('🔌 Client connected:', socket.id);
  
  socket.on('disconnect', (reason) => {
    console.log('❌ Client disconnected:', socket.id, 'Reason:', reason);
  });
});
```

### Performance Monitoring
```typescript
// Monitor de FPS
let frameCount = 0;
let lastTime = performance.now();

function updateFPS() {
  frameCount++;
  const currentTime = performance.now();
  
  if (currentTime - lastTime >= 1000) {
    const fps = Math.round((frameCount * 1000) / (currentTime - lastTime));
    console.log('🎮 FPS:', fps);
    frameCount = 0;
    lastTime = currentTime;
  }
}
```

## 📝 Documentação

### Padrões de Documentação
- **README.md**: Visão geral do projeto
- **current-state.md**: Estado atual implementado
- **todo.md**: Próximas tarefas
- **changelog.md**: Histórico de mudanças
- **ER.mermaid**: Diagrama de entidade-relacionamento

### Comentários de Código
```typescript
/**
 * Calcula a taxa de mineração baseada no número de naves
 * @param shipCount - Número de naves mineradoras
 * @param efficiency - Multiplicador de eficiência
 * @returns Taxa de mineração em cristais/segundo
 */
function calculateMiningRate(shipCount: number, efficiency: number): number {
  return shipCount * BASE_RATE * efficiency;
}
```

## 🚀 Deployment

### Docker
```dockerfile
# Multi-stage build para otimização
FROM node:18-alpine AS builder
WORKDIR /app
COPY package*.json ./
RUN npm ci --only=production
COPY . .
RUN npm run build

FROM node:18-alpine
WORKDIR /app
COPY --from=builder /app/dist ./dist
EXPOSE 3000
CMD ["npm", "start"]
```

### Environment Variables
```env
DATABASE_URL=file:./game.db
WS_PORT=8080
HTTP_PORT=3000
NODE_ENV=production
GAME_TICK_RATE=60
```

## 🔄 Workflow

### Desenvolvimento
1. **Leia documentação** antes de começar
2. **Crie branch** para nova feature
3. **Desenvolva** seguindo convenções
4. **Teste** localmente
5. **Commit** com mensagem descritiva
6. **Push** e crie PR

### Code Review
- [ ] Código segue convenções
- [ ] Testes passam
- [ ] Performance não degradou
- [ ] Documentação atualizada
- [ ] Changelog atualizado

---

**Última atualização**: Janeiro 2025  
**Próxima revisão**: Após correção do WebSocket 
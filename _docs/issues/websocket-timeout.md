# 🔌 Problema do WebSocket - Documentação

## 📋 Resumo do Problema

**Status**: 🔴 **CRÍTICO** - WebSocket desconecta após ~30 segundos  
**Data**: 28/07/2025  
**Versão**: v0.4.0  

## 🐛 Sintomas

### Comportamento Atual:
1. **Conexão inicial**: ✅ WebSocket conecta normalmente
2. **Primeiros 30s**: ✅ Funciona perfeitamente, recebe mensagens
3. **Após 30s**: ❌ Desconecta automaticamente
4. **Reconexão**: ✅ Reconecta após 3s, mas desconecta novamente

### Logs do Servidor:
```
🔌 WebSocket client connected
🏓 Pong received from client
📊 Resources updated: { crystals: 2699, energy: 0, research: 0, reputation: 0 }
🔌 WebSocket client disconnected
🔌 WebSocket client connected
🏓 Pong received from client
```

## 🔍 Análise Técnica

### Implementações Testadas:

#### 1. **Hook Personalizado** (`useWebSocket.ts`)
- ❌ **Problema**: Múltiplas instâncias de WebSocket
- ❌ **Causa**: React StrictMode causando re-renderizações

#### 2. **Serviço Singleton** (`websocketService.ts`)
- ❌ **Problema**: Ainda desconecta após 30s
- ✅ **Melhoria**: Uma única conexão WebSocket

#### 3. **Remoção do StrictMode**
- ❌ **Problema**: Não resolveu o problema
- ✅ **Melhoria**: Reduziu reconexões desnecessárias

### Configurações Atuais:

#### Servidor (porta 3000):
```typescript
// server/src/services/websocket.ts
- Heartbeat: 15 segundos
- Broadcast: 5 segundos
- Reconexão: 3 segundos
```

#### Cliente:
```typescript
// client/src/services/websocketService.ts
- Reconexão automática: 3 segundos
- Singleton pattern
- Handlers para mensagens e conexão
```

## 🎯 Possíveis Causas

### 1. **Timeout do Servidor**
- ❓ **Hipótese**: Servidor pode ter timeout de 30s
- 🔍 **Verificar**: Configurações do Express/Node.js

### 2. **Proxy/Reverse Proxy**
- ❓ **Hipótese**: WSL2 pode ter timeout de proxy
- 🔍 **Verificar**: Configurações de rede

### 3. **Firewall/Antivírus**
- ❓ **Hipótese**: Software de segurança bloqueando
- 🔍 **Verificar**: Logs do sistema

### 4. **Memory Leak**
- ❓ **Hipótese**: Vazamento de memória causando crash
- 🔍 **Verificar**: Uso de memória do processo

## 🛠️ Próximos Passos para Debug

### 1. **Adicionar Logs Detalhados**
```typescript
// Adicionar no servidor
ws.on('close', (event) => {
  console.log('🔌 WebSocket disconnected:', {
    code: event.code,
    reason: event.reason,
    wasClean: event.wasClean,
    timestamp: new Date().toISOString()
  });
});
```

### 2. **Verificar Timeouts do Sistema**
```bash
# Verificar configurações de rede
sysctl net.ipv4.tcp_keepalive_time
sysctl net.ipv4.tcp_keepalive_intvl
sysctl net.ipv4.tcp_keepalive_probes
```

### 3. **Monitorar Processo**
```bash
# Monitorar uso de memória e CPU
top -p $(pgrep -f "ts-node src/index.ts")
```

### 4. **Teste com WebSocket Simples**
```javascript
// Criar teste isolado sem React
const ws = new WebSocket('ws://localhost:3000');
ws.onclose = (e) => console.log('Disconnected:', e.code, e.reason);
```

## 📁 Arquivos Modificados

### Servidor:
- `server/src/services/websocket.ts` - Heartbeat reduzido para 15s
- `server/src/services/gameLoop.ts` - Broadcast reduzido para 5s

### Cliente:
- `client/src/services/websocketService.ts` - **NOVO** - Serviço singleton
- `client/src/hooks/useWebSocketService.ts` - **NOVO** - Hook que usa singleton
- `client/src/components/ResourcePanel.tsx` - Atualizado para usar novo hook
- `client/src/main.tsx` - StrictMode removido temporariamente

## 🎮 Estado Atual do Jogo

### ✅ Funcionalidades Funcionando:
- **Backend**: Node.js + Express + Prisma + SQLite
- **Game Loop**: Atualização de recursos a cada 1s
- **API REST**: Todas as rotas funcionando
- **Sistema de Naves Autônomas**: Implementado
- **Interface**: ResourcePanel, UpgradePanel, ShipManager

### ❌ Problemas:
- **WebSocket**: Desconecta após ~30s
- **Tempo Real**: Funciona apenas por 30s, depois volta para polling

## 🚀 Próximos Passos

### Prioridade 1: Resolver WebSocket
1. **Debug detalhado** com logs adicionais
2. **Teste isolado** sem React
3. **Verificar timeouts** do sistema
4. **Monitorar recursos** do processo

### Prioridade 2: Continuar Desenvolvimento
1. **Expansão de Upgrades** - Mais tipos e árvore de progressão
2. **Polish e Otimizações** - Efeitos visuais e performance
3. **Integração Matter.js** - Física realista

## 📝 Comandos Úteis

```bash
# Reiniciar servidor
npm run dev

# Testar WebSocket
node test-websocket.js

# Verificar portas
ss -tlnp | grep -E "(3000|8080)"

# Monitorar logs em tempo real
tail -f /var/log/syslog | grep -i websocket
```

## 🔗 URLs Importantes

- **Frontend**: http://localhost:8080
- **Backend API**: http://localhost:3000/api
- **Health Check**: http://localhost:3000/health
- **WebSocket**: ws://localhost:3000

---

**Próxima sessão**: Focar em resolver o problema do WebSocket antes de continuar com novas funcionalidades. 
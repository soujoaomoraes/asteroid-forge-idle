# 🚀 Space Miner Idle

Um jogo idle/incremental espacial com física realista, desenvolvido com React 18 + TypeScript + Node.js.

## 📁 Estrutura do Projeto

```
space-miner-idle/
├── client/                 # Frontend React + Vite
│   ├── src/               # Código fonte do frontend
│   ├── package.json       # Dependências do frontend
│   └── vite.config.ts     # Configuração Vite
├── server/                # Backend Node.js + Express
│   ├── src/               # Código fonte do backend
│   ├── package.json       # Dependências do backend
│   └── tsconfig.json      # Configuração TypeScript
├── _docs/                 # Documentação do projeto
│   └── dev/              # Documentação de desenvolvimento
└── package.json          # Configuração do monorepo
```

## 🚀 Como Executar

### Desenvolvimento (Frontend + Backend)
```bash
# Instalar todas as dependências
npm run install:all

# Executar frontend e backend simultaneamente
npm run dev
```

### Apenas Frontend
```bash
npm run dev:client
```

### Apenas Backend
```bash
npm run dev:server
```

### Produção
```bash
# Build de ambos
npm run build

# Executar servidor de produção
npm start
```

## 🌐 URLs

- **Frontend**: http://localhost:8080
- **Backend**: http://localhost:3000
- **Health Check**: http://localhost:3000/health
- **API**: http://localhost:3000/api

## 📊 Estado Atual

### ✅ Implementado
- Canvas de jogo com fundo espacial
- Nave controlável (WASD/Arrow Keys)
- Sistema de estrelas (200 estrelas com parallax)
- Física básica (movimento, rotação)
- Limites de mundo com borda visual completa
- Backend Express com APIs básicas
- Estrutura monorepo organizada
- **Sistema de Recursos Idle** (Game Loop)
  - Produção automática de crystals, energy, research, reputation
  - Sistema de upgrades com multiplicadores
  - Broadcast em tempo real via WebSocket
- **Sistema de Asteroides** (Geração Procedural)
  - 5 tipos: Small, Medium, Large, Rare, Epic
  - Geração automática ao redor da nave
  - Rotação animada e cores por tipo
- **Sistema de Mineração** (Integração Completa)
  - Mineração automática com SPACE
  - API integrada com feedback visual
  - Recursos minerados vão para o sistema idle
- **Interface de Recursos** (Tempo Real)
  - ResourcePanel com WebSocket
  - UpgradePanel com interface de compras
  - Design responsivo e tema espacial
- **Sistema de Naves Autônomas** (AI Básica)
  - 4 tipos: Scout, Miner, Hauler, Destroyer
  - AI para movimento e mineração automática
  - Deploy com teclas 1-4, interface ShipManager
  - Renderização visual das naves no canvas

### 🔄 Em Desenvolvimento
- Interface frontend para recursos
- Asteroides e sistema de mineração
- Naves autônomas e AI
- Integração Matter.js para física realista

## 🛠️ Stack Tecnológico

### Frontend
- **React 18** + TypeScript
- **Vite** (bundler)
- **Canvas 2D** (renderização)
- **CSS** (estilização)

### Backend
- **Node.js** + Express
- **TypeScript**
- **REST API** + WebSocket
- **SQLite** + Prisma
- **Game Loop Service** (Sistema Idle)

## 📚 Documentação

Consulte a pasta `_docs/` para documentação completa:

### 📋 Projeto
- **[PRD.md](_docs/projeto/PRD.md)** - Product Requirements Document
- **[Game Design.md](_docs/projeto/Game%20Design.md)** - Design do jogo e mecânicas

### 🛠️ Desenvolvimento
- **[Status](_docs/dev/STATUS.md)** - Status atual do projeto
- **[TODO](_docs/dev/todo.md)** - Próximas tarefas e roadmap
- **[Changelog](_docs/dev/changelog.md)** - Histórico de mudanças

### 🔄 Processos
- **[Contribuindo](_docs/process/CONTRIBUTING.md)** - Boas práticas e convenções

### 🗄️ Técnico
- **[ER.mermaid](_docs/dev/ER.mermaid)** - Diagrama de entidade-relacionamento

### 📋 Problemas
- **[Problemas Conhecidos](_docs/issues/known-bugs.md)** - Lista consolidada de issues
- **[WebSocket Timeout](_docs/issues/websocket-timeout.md)** - Problema crítico de conexão

### ⚙️ Sistemas
- **[Idle System](_docs/systems/idle-system.md)** - Sistema de recursos idle

## 🎯 Próximos Passos

1. **Interface Frontend** - Mostrar recursos em tempo real
2. **Sistema de Asteroides** - Geração procedural e mineração
3. **Naves Autônomas** - AI básica para mineração
4. **Matter.js** - Física realista
5. **Polish & Deploy** - UI/UX e produção

## 🤝 Contribuição

1. Leia a documentação em `_docs/dev/`
2. Siga as convenções estabelecidas
3. Mantenha o `changelog.md` atualizado
4. Teste suas mudanças

---

**Versão**: v0.4.0  
**Status**: Sistema de naves autônomas implementado  
**Última atualização**: Janeiro 2025 
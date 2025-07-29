# 🚀 Space Miner Idle - Product Requirements Document

## 📋 Executive Summary

**Product:** Space Miner Idle - MVP em 4 horas  
**Objective:** Criar um jogo idle/incremental funcional com física realista usando coding agents  
**Target:** Demonstrar viabilidade de desenvolvimento acelerado com IA  
**Timeline:** 4 horas (MVP) + roadmap de expansão  

### Success Metrics
- ✅ **Functional MVP**: Jogo idle completo e jogável
- ⚡ **Performance**: 60 FPS consistentes
- 🐳 **Deployment**: Container Docker funcional
- 📱 **Responsiveness**: Funcional desktop + mobile
- 🔄 **Retention**: Mecânicas viciantes implementadas

---

## 🎯 Product Vision

### Problem Statement
Jogos idle tradicionalmente são simples visualmente mas complexos em balanceamento. O desafio é criar uma experiência envolvente que combine:
- Física realista (Matter.js)
- Mecânicas idle satisfatórias
- Feedback visual imediato
- Progressão equilibrada

### Solution Overview
Uma plataforma de mineração espacial onde naves autônomas coletam recursos, permitindo progressão contínua mesmo offline, com física espacial realista e upgrades estratégicos.

---

## 🏗️ Technical Architecture

### Stack Definition
```typescript
interface TechStack {
  frontend: {
    framework: "React 18 + TypeScript";
    styling: "Tailwind CSS";
    physics: "Matter.js";
    rendering: "HTML5 Canvas";
  };
  backend: {
    runtime: "Node.js + Express";
    language: "TypeScript";
    database: "SQLite + Prisma ORM";
    realtime: "WebSocket";
  };
  infrastructure: {
    containerization: "Docker";
    deployment: "docker-compose";
    development: "Coding Agents (Claude/Windsurf/Cursor)";
  };
}
```

### System Components
1. **Game Engine**: Matter.js physics simulation
2. **State Management**: React Context + local persistence
3. **Real-time Sync**: WebSocket bidirectional communication
4. **Persistence Layer**: SQLite with Prisma migrations
5. **Rendering Pipeline**: Canvas-based with particle effects

---

## 🎮 Feature Specifications

### Core Features (Must-Have - Hour 1-3)

#### 1. Physics Engine Integration
**Requirements:**
- Matter.js world with low gravity (0.1)
- Ship objects with realistic physics properties
- Asteroid collision detection
- Particle system for visual feedback

**Acceptance Criteria:**
- [ ] Ships move with momentum and friction
- [ ] Collisions generate resources
- [ ] 60+ FPS performance with 20+ objects
- [ ] Visual particles on mining events

#### 2. Idle Mechanics System
**Requirements:**
```typescript
interface IdleSystem {
  automaticMining: boolean;
  offlineCalculation: (lastSave: Date) => Resources;
  resourceGeneration: number; // per second
  upgradeMultipliers: Record<string, number>;
}
```

**Acceptance Criteria:**
- [ ] Resources accumulate when tab is closed
- [ ] Mining continues without player input
- [ ] Offline calculation caps at 24 hours
- [ ] Visual feedback for resource generation

#### 3. Ship Management System
**Requirements:**
- 4 ship types: Scout, Miner, Hauler, Destroyer
- Each with unique stats and physics properties
- Upgradeable attributes (speed, capacity, efficiency)
- Visual differentiation in canvas

**Acceptance Criteria:**
- [ ] Ships can be deployed and recalled
- [ ] Each type has distinct behavior
- [ ] Upgrade system affects performance
- [ ] Ship count affects overall mining rate

#### 4. Resource Economy
**Requirements:**
```typescript
interface Resources {
  crystals: number;    // Primary currency
  energy: number;      // Ship fuel
  research: number;    // Tech unlocks
  reputation: number;  // Sector access
}
```

**Acceptance Criteria:**
- [ ] Resources display in real-time
- [ ] Upgrade costs scale exponentially
- [ ] Energy consumption balanced with generation
- [ ] Research unlocks new technologies

### Enhanced Features (Nice-to-Have - Hour 4)

#### 5. Multiple Sectors
**Requirements:**
- Alpha (tutorial), Beta (dense), Gamma (energy), Delta (premium)
- Unlock progression based on reputation
- Different asteroid densities and resources

#### 6. Prestige System
**Requirements:**
- Reset progress for permanent bonuses
- Prestige points calculation
- Meta-progression unlocks

#### 7. Visual Polish
**Requirements:**
- Smooth animations and transitions
- Particle effects for all actions
- Responsive UI with mobile support
- Dark space theme with vibrant accents

---

## 🔧 Implementation Roadmap

### Hour 1: Foundation (Setup & Documentation)
**Deliverables:**
- [ ] Project structure with monorepo
- [ ] Matter.js basic world setup
- [ ] WebSocket connection established
- [ ] Prisma schema defined
- [ ] Basic canvas rendering working

**Technical Tasks:**
```bash
# Project setup
npx create-react-app client --template typescript
mkdir server && cd server && npm init -y
npm install express prisma sqlite3 ws matter-js
```

### Hour 2: Frontend Core + Physics
**Deliverables:**
- [ ] Game canvas with Matter.js integration
- [ ] Ship objects with physics properties
- [ ] Basic UI layout (header, canvas, sidebar)
- [ ] Particle system implementation

**Key Components:**
- `GameCanvas.tsx` - Main game rendering
- `PhysicsEngine.tsx` - Matter.js wrapper
- `ShipManager.tsx` - Ship creation/management
- `ParticleSystem.tsx` - Visual effects

### Hour 3: Backend + Game Logic
**Deliverables:**
- [ ] REST API endpoints for game state
- [ ] WebSocket real-time updates
- [ ] Idle calculation system
- [ ] Save/load functionality

**API Specification:**
```typescript
// REST Endpoints
GET    /api/game-state     // Current game state
POST   /api/save-game      // Save progress
PUT    /api/upgrade        // Purchase upgrade
POST   /api/deploy-ship    // Deploy new ship

// WebSocket Events
'game-state-update'        // Real-time sync
'resource-earned'          // Mining feedback
'ship-collision'           // Physics events
```

### Hour 4: Integration + Docker
**Deliverables:**
- [ ] Frontend-backend integration complete
- [ ] Docker containerization
- [ ] Game balancing and polish
- [ ] Final testing and documentation

---

## 🎨 UI/UX Specifications

### Layout Structure
```
┌─────────────────────────────────────────┐
│ Header: Resources + Stats + Menu        │
├─────────────────┬───────────────────────┤
│                 │                       │
│   Game Canvas   │    Control Panel      │
│   (Matter.js)   │  • Ship Management    │
│                 │  • Upgrades           │
│                 │  • Statistics         │
│                 │  • Settings           │
├─────────────────┴───────────────────────┤
│ Footer: Quick Actions + Status          │
└─────────────────────────────────────────┘
```

### Design System
**Colors:**
- Primary: `#00B4D8` (Cyan)
- Secondary: `#06D6A0` (Green)
- Accent: `#FFD60A` (Gold)
- Background: `#000814` (Space Black)

**Typography:**
- Headers: `font-bold text-xl`
- Body: `font-medium text-sm`
- Numbers: `font-mono` (for resources)

### Responsive Breakpoints
- Mobile: `< 768px` - Single column, canvas on top
- Tablet: `768px - 1024px` - Condensed sidebar
- Desktop: `> 1024px` - Full layout

---

## 📊 Performance Requirements

### Target Metrics
- **Frame Rate**: 60 FPS consistent
- **Memory Usage**: < 50MB RAM
- **Load Time**: < 3 seconds initial
- **WebSocket Latency**: < 100ms
- **Bundle Size**: < 2MB total

### Optimization Strategies
1. **Object Pooling**: Reuse physics bodies
2. **Spatial Partitioning**: Optimize collision detection
3. **Frame Rate Throttling**: Canvas updates at 60 FPS
4. **Lazy Loading**: Components load on demand
5. **WebSocket Batching**: Group updates to reduce traffic

---

## 🧪 Testing Strategy

### Automated Testing
```typescript
describe('Idle System', () => {
  it('should calculate offline resources correctly', () => {
    const calculator = new IdleCalculator();
    const result = calculator.calculateOfflineProgress(
      new Date('2024-01-01T00:00:00Z'),
      new Date('2024-01-01T01:00:00Z')
    );
    expect(result.crystalsEarned).toBeGreaterThan(0);
  });
});
```

### Manual Testing Checklist
- [ ] All ship types deploy and mine correctly
- [ ] Offline calculation works when returning to game
- [ ] Upgrades affect ship performance visibly
- [ ] Physics feels realistic and responsive
- [ ] UI responsive on mobile devices
- [ ] WebSocket reconnects after network issues

---

## 🚀 Deployment Specification

### Docker Configuration
```dockerfile
# Multi-stage build for optimization
FROM node:18-alpine AS builder
WORKDIR /app
COPY package*.json ./
RUN npm ci --only=production
COPY . .
RUN npm run build

FROM node:18-alpine
WORKDIR /app
COPY --from=builder /app/dist ./dist
COPY --from=builder /app/node_modules ./node_modules
EXPOSE 3000 8080
CMD ["npm", "start"]
```

### Environment Variables
```env
DATABASE_URL=file:./game.db
WS_PORT=8080
HTTP_PORT=3000
NODE_ENV=production
GAME_TICK_RATE=60
MAX_OFFLINE_HOURS=24
```

---

## 📈 Success Metrics & Analytics

### Key Performance Indicators
1. **Technical KPIs:**
   - Frame rate consistency (target: 95% at 60+ FPS)
   - Memory usage stability (target: < 50MB)
   - Zero-downtime deployment success

2. **Gameplay KPIs:**
   - Tutorial completion rate (target: > 80%)
   - Average session duration (target: > 10 minutes)
   - Upgrade frequency (target: 1 upgrade per 3 minutes)

### Telemetry Events
```typescript
interface GameEvent {
  type: 'upgrade_purchased' | 'ship_deployed' | 'sector_unlocked' | 'offline_return';
  timestamp: Date;
  playerLevel: number;
  sessionDuration: number;
  metadata: Record<string, any>;
}
```

---

## 🔄 Post-MVP Roadmap

### Phase 2: Enhanced Features (Week 2)
- Advanced ship behaviors and AI
- Procedural asteroid generation
- Achievement system
- Sound effects and music

### Phase 3: Multiplayer (Month 2)
- Guild system for cooperation
- Leaderboards and competitions
- Trading marketplace
- PvP combat mechanics

### Phase 4: Platform Expansion (Month 3)
- Mobile app deployment
- Steam integration
- Monetization strategy
- Advanced analytics

---

## ⚠️ Risk Assessment

### Technical Risks
1. **Matter.js Performance**: Mitigation via object pooling and spatial optimization
2. **WebSocket Scalability**: Plan for horizontal scaling with Redis
3. **SQLite Limitations**: Migration path to PostgreSQL defined
4. **Mobile Compatibility**: Progressive Web App as fallback

### Business Risks
1. **Development Speed**: Coding agents may need human intervention
2. **Balancing Complexity**: Automated testing for economy balance
3. **User Retention**: A/B testing for core game loops

---

## 🎯 Definition of Done

### MVP Completion Criteria
- [ ] All core features implemented and tested
- [ ] Docker container builds and runs successfully
- [ ] Performance targets met (60 FPS, < 50MB RAM)
- [ ] Mobile responsive design working
- [ ] Save/load system functional
- [ ] Offline calculation accurate
- [ ] WebSocket real-time updates working
- [ ] Documentation complete (README + architecture)

### Quality Gates
- [ ] Code review by senior developer
- [ ] Performance profiling completed
- [ ] Security scan passed
- [ ] Cross-browser testing completed
- [ ] Mobile device testing on 3+ devices

---

**Document Version**: 1.0  
**Last Updated**: July 27, 2025  
**Next Review**: Post-MVP completion  

**Approval Required From:**
- Technical Lead: ✅ Architecture approved
- Product Manager: ✅ Requirements validated  
- Development Team: ✅ Timeline feasible
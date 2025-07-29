# 📋 Problemas Conhecidos - Space Miner Idle

## 🎯 Visão Geral
Este documento lista todos os problemas conhecidos do projeto, organizados por prioridade e status.

## 🔴 Problemas Críticos

### 1. WebSocket Timeout
- **Status**: 🔴 CRÍTICO - Bloqueando desenvolvimento
- **Descrição**: WebSocket desconecta após ~30 segundos
- **Impacto**: Perda de sincronização em tempo real
- **Documentação**: [websocket-timeout.md](websocket-timeout.md)
- **Prioridade**: Máxima - Resolver antes de continuar desenvolvimento

## 🟡 Problemas Médios

### 2. Performance - setInterval Drift
- **Status**: 🟡 MÉDIO - Afeta performance
- **Descrição**: setInterval pode causar drift de timing
- **Impacto**: FPS inconsistente em longas sessões
- **Solução**: Migrar para requestAnimationFrame
- **Prioridade**: Média - Resolver na próxima iteração

### 3. Mobile Responsiveness
- **Status**: 🟡 MÉDIO - Funcionalidade limitada
- **Descrição**: Interface não totalmente responsiva
- **Impacto**: Experiência ruim em dispositivos móveis
- **Solução**: Implementar design mobile-first
- **Prioridade**: Média - Resolver antes do deploy

## 🟢 Problemas Menores

### 4. Física Não Realista
- **Status**: 🟢 BAIXO - Funcionalidade básica
- **Descrição**: Movimento sem inércia realista
- **Impacto**: Experiência de jogo limitada
- **Solução**: Integrar Matter.js
- **Prioridade**: Baixa - Resolver na fase de polish

### 5. State Management
- **Status**: 🟢 BAIXO - Escalabilidade
- **Descrição**: useState pode não escalar
- **Impacto**: Performance com muitos componentes
- **Solução**: Migrar para Context API ou Redux
- **Prioridade**: Baixa - Resolver quando necessário

## ✅ Problemas Resolvidos

### 6. Múltiplas Instâncias WebSocket
- **Status**: ✅ RESOLVIDO
- **Descrição**: React StrictMode causando múltiplas conexões
- **Solução**: Implementado Singleton pattern
- **Data**: Janeiro 2025

### 7. Reconexões Desnecessárias
- **Status**: ✅ RESOLVIDO
- **Descrição**: Reconexões frequentes do WebSocket
- **Solução**: Removido React StrictMode
- **Data**: Janeiro 2025

## 📊 Métricas de Problemas

### Por Status
- 🔴 **Críticos**: 1 problema
- 🟡 **Médios**: 2 problemas
- 🟢 **Menores**: 2 problemas
- ✅ **Resolvidos**: 2 problemas

### Por Categoria
- **Performance**: 2 problemas
- **Funcionalidade**: 2 problemas
- **UX/UI**: 1 problema
- **Infraestrutura**: 1 problema

## 🚀 Roadmap de Resolução

### Semana 1: Problemas Críticos
- [ ] Resolver WebSocket timeout
- [ ] Debug e logs detalhados
- [ ] Teste isolado sem React

### Semana 2: Problemas Médios
- [ ] Migrar para requestAnimationFrame
- [ ] Implementar design mobile-first
- [ ] Otimizações de performance

### Semana 3: Problemas Menores
- [ ] Integrar Matter.js
- [ ] Migrar para Context API
- [ ] Polish e otimizações

---

**Última atualização**: Janeiro 2025  
**Próxima revisão**: Após resolução do WebSocket timeout 
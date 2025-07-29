# 🔄 Workflow de Desenvolvimento padrão

## 🎯 Visão Geral
Este documento define **COMO EU (Avalon) executo desenvolvimento** - o workflow e rotinas que sigo para garantir desenvolvimento eficiente e de qualidade.

### 📚 Documentos Relacionados
- **`_persona.md`**: Quem EU sou e minha filosofia (DOCUMENTO PRINCIPAL)
- **`documentation-pattern.md`**: Como EU organizo documentação
- **`workflow-pattern.md`**: Como EU executo desenvolvimento (este documento)
- **`tdd-pattern.md`**: Como EU faço desenvolvimento orientado a testes

## 📋 1. Como EU Faço Análise Inicial

### Leitura da Documentação
- **Sempre inicie** lendo a documentação completa do projeto e o código completo, nunca pule essa etapa se você ainda não fez.
- **Localização**: Pasta `_docs/` ou pasta informada pelo usuário
- **Cobertura**: Documentação + código existente
- **Objetivo**: Entender completamente o projeto antes de qualquer desenvolvimento

### Checklist de Entendimento
- [ ] Estrutura do projeto (frontend/backend)
- [ ] Stack tecnológico atual
- [ ] Funcionalidades implementadas
- [ ] Problemas conhecidos
- [ ] Roadmap e próximas etapas
- [ ] Padrões de código estabelecidos

## 🏗️ 2. Como EU Estruturo o Trabalho

### Planejamento por Módulos
- **Separe** o desenvolvimento em etapas claras e módulos independentes
- **Crie/atualize** o arquivo `todo.md` com etapas planejadas
- **Mantenha** documentação sempre atualizada
- **Foque** em entregas incrementais

### Documentação Obrigatória
Antes de iniciar desenvolvimento, confirme se existem:
- [ ] Estrutura de documentação seguindo `documentation-pattern.md`
- [ ] `todo.md` - Lista de tarefas e planejamento
- [ ] `status.md` - Status atual do projeto
- [ ] `changelog.md` - Histórico de mudanças
- [ ] Documentação técnica específica do projeto

## 🧪 3. Como EU Faço Desenvolvimento Orientado a Testes

### Abordagem TDD
- **Sempre sigo** o padrão TDD definido em `tdd-pattern.md`
- **Ciclo Red-Green-Refactor**: Escrevo teste, implemento, refatoro
- **Teste Primeiro**: Nunca escrevo código sem teste
- **Cobertura Adequada**: 90%+ para unit tests, 80%+ para integration

### Tipos de Testes que EU Uso
- **Unit Tests**: Componentes e funções isoladas
- **Integration Tests**: API endpoints e serviços
- **E2E Tests**: Fluxos completos do jogo
- **Performance Tests**: FPS, memória, latência

## 📝 4. Como EU Faço Documentação Contínua

### Atualizações Obrigatórias
Ao finalizar cada etapa:
- [ ] **changelog.md** - Registre progresso e mudanças
- [ ] **status.md** - Atualize status atual
- [ ] **todo.md** - Marque tarefas concluídas
- [ ] **Documentação técnica** - Crie/atualize conforme necessário

### Padrões de Documentação
- **Seguir**: Estrutura definida em `documentation-pattern.md`
- **Evitar**: Duplicações entre documentos
- **Manter**: Responsabilidades específicas de cada arquivo
- **Atualizar**: Sempre que houver mudanças significativas

## 🔄 5. Como EU Faço Controle de Versão

### Commits e Push
Sempre que concluir uma etapa:
- [ ] **Commits descritivos** - Mensagens claras e específicas
- [ ] **Push para GitHub** - Mantenha repositório atualizado
- [ ] **Histórico organizado** - Commits frequentes e bem estruturados

### Padrão de Commits
```
feat: add user authentication system
fix: resolve WebSocket connection timeout
docs: update API documentation
refactor: optimize database queries
test: add unit tests for user service
perf: improve application startup time
chore: update dependencies
style: format code according to guidelines
ci: add automated testing pipeline
build: configure production build
```

## 🚀 6. Como EU Faço Checklist de Finalização

### Antes de Considerar Tarefa Concluída
- [ ] **Código funcionando** - Testado localmente
- [ ] **Testes passando** - Cobertura adequada
- [ ] **Documentação atualizada** - Todos os arquivos relevantes
- [ ] **Commits realizados** - Histórico organizado
- [ ] **Push para GitHub** - Repositório atualizado
- [ ] **Próximos passos definidos** - Roadmap atualizado

### Validação de Qualidade
- [ ] **Performance** - Métricas dentro do esperado
- [ ] **Código limpo** - Seguindo padrões estabelecidos
- [ ] **Escalabilidade** - Arquitetura sustentável
- [ ] **Manutenibilidade** - Fácil de manter e evoluir

---

**Última atualização**: Janeiro 2025  
**Versão**: v1.0 
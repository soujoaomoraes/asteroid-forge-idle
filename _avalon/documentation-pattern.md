# 📚 Padrão de Documentação

## 🎯 Visão Geral
Este documento define **COMO EU (Avalon) organizo documentação** em TODOS os projetos. Como Full Stack Senior Developer, sigo estes padrões para garantir consistência e organização em qualquer projeto.

### 📚 Documentos Relacionados
- **`_persona.md`**: Quem EU sou e minha filosofia (DOCUMENTO PRINCIPAL)
- **`documentation-pattern.md`**: Como EU organizo documentação (este documento)
- **`workflow-pattern.md`**: Como EU executo desenvolvimento
- **`tdd-pattern.md`**: Como EU faço desenvolvimento orientado a testes

## 📁 Estrutura Obrigatória

### Pasta Principal: `_docs/`
Toda documentação deve ser centralizada na pasta `_docs/` na raiz do projeto, seguindo esta estrutura:

```
_docs/
├── projeto/                     # 📋 Documentação de alto nível
│   ├── PRD.md                  # Product Requirements Document
│   ├── Game Design.md          # Design do jogo (se aplicável)
│   ├── user-stories.md         # Histórias de usuário
│   └── [outros-docs].md        # Outros documentos de projeto
├── dev/                        #️ Documentação para desenvolvedores
│   ├── status.md               # Status atual do projeto
│   ├── todo.md                 # Próximas tarefas e roadmap
│   ├── changelog.md            # Histórico de mudanças
│   ├── ER.mermaid             # Diagrama de entidade-relacionamento
│   ├── API.md                  # Documentação da API
│   └── setup.md                # Guia de configuração
├── systems/                    # ⚙️ Documentação de sistemas específicos
│   ├── [sistema].md            # Documentação de cada sistema
│   └── [outro-sistema].md      # Outros sistemas
├── process/                    # 🔄 Documentação de processos
│   ├── CONTRIBUTING.md         # Boas práticas e convenções
│   ├── DEPLOYMENT.md           # Processo de deploy
│   ├── TESTING.md              # Estratégia de testes
│   └── [outro-processo].md     # Outros processos
├── issues/                     # 📋 Documentação de problemas
│   ├── known-bugs.md           # Lista consolidada de issues
│   └── [problema].md           # Problemas específicos
└── assets/                     # 🎨 Recursos e diagramas
    ├── diagrams/               # Diagramas técnicos
    ├── screenshots/            # Screenshots da aplicação
    └── mockups/                # Mockups e wireframes
```

## 📋 Como EU Organizo Documentação - RESPONSABILIDADES CLARAS

### 1. `projeto/` - Documentação de Alto Nível
**Propósito**: Documentação estratégica e de requisitos

#### Arquivos Obrigatórios:
- **PRD.md** - Product Requirements Document
  - **RESPONSABILIDADE**: Requisitos do produto, visão, objetivos, métricas de sucesso
  - **NÃO CONTÉM**: Status técnico, próximas tarefas, histórico de mudanças
- **FRD.md** - Functional Requirements Document  
  - **RESPONSABILIDADE**: Requisitos funcionais detalhados, casos de uso, regras de negócio
  - **NÃO CONTÉM**: Status de implementação, roadmap técnico
- **user-stories.md** - Histórias de usuário
  - **RESPONSABILIDADE**: Histórias de usuário, personas, jornadas do usuário
  - **NÃO CONTÉM**: Status técnico, implementação

#### Arquivos Opcionais:

### 2. `dev/` - Documentação para Desenvolvedores
**Propósito**: Documentação técnica e de desenvolvimento

#### Arquivos Obrigatórios:
- **status.md** - Status atual do projeto
  - **RESPONSABILIDADE**: Estado atual do projeto, funcionalidades implementadas, problemas resolvidos, servidor rodando
  - **NÃO CONTÉM**: Próximas tarefas detalhadas, roadmap futuro, histórico completo
  - **CONTÉM**: Status do servidor, recursos em tempo real, tecnologias utilizadas

- **todo.md** - Próximas tarefas e roadmap
  - **RESPONSABILIDADE**: Lista de tarefas pendentes, roadmap de versões, próximos passos detalhados
  - **NÃO CONTÉM**: Status atual, histórico de mudanças, problemas resolvidos
  - **CONTÉM**: Tarefas organizadas por versão, prioridades, estimativas

- **changelog.md** - Histórico de mudanças
  - **RESPONSABILIDADE**: Histórico completo de todas as mudanças, versões, releases
  - **NÃO CONTÉM**: Status atual, próximas tarefas, roadmap
  - **CONTÉM**: Mudanças por versão, data, autor, detalhes técnicos

- **ER.mermaid** - Diagrama de entidade-relacionamento
  - **RESPONSABILIDADE**: Diagrama de entidades e relacionamentos do banco de dados
  - **NÃO CONTÉM**: Status de implementação, próximas entidades

- **API.md** - Documentação da API
  - **RESPONSABILIDADE**: Endpoints, parâmetros, respostas, exemplos de uso
  - **NÃO CONTÉM**: Status de implementação, roadmap da API

- **setup.md** - Guia de configuração
  - **RESPONSABILIDADE**: Como configurar o ambiente, instalar dependências, executar o projeto
  - **NÃO CONTÉM**: Status do servidor, problemas de configuração

#### Arquivos Opcionais:
- **performance.md** - Métricas de performance
- **deployment.md** - Processo de deploy
- **testing.md** - Estratégia de testes
- **database.md** - Documentação do banco de dados

### 3. `systems/` - Documentação de Sistemas
**Propósito**: Documentação técnica de sistemas específicos

#### Padrão de Nomenclatura:
- `[nome-sistema].md` - Ex: `auth-system.md`, `payment-system.md`
- `[funcionalidade].md` - Ex: `user-management.md`, `notification.md`

#### Exemplos Comuns:
- `auth-system.md` - Sistema de autenticação
- `payment-system.md` - Sistema de pagamentos
- `notification-system.md` - Sistema de notificações
- `cache-system.md` - Sistema de cache

### 4. `process/` - Documentação de Processos
**Propósito**: Processos, convenções e boas práticas

#### Arquivos Obrigatórios:
- **CONTRIBUTING.md** - Como contribuir para o projeto
- **DEPLOYMENT.md** - Processo de deploy
- **TESTING.md** - Estratégia de testes

#### Arquivos Opcionais:
- `CODE_REVIEW.md` - Processo de code review
- `RELEASE.md` - Processo de release
- `SECURITY.md` - Políticas de segurança
- `MONITORING.md` - Estratégia de monitoramento

### 5. `issues/` - Documentação de Problemas
**Propósito**: Problemas conhecidos e bugs

#### Arquivos Obrigatórios:
- **known-bugs.md** - Lista consolidada de problemas

#### Padrão para Problemas Específicos:
- `[problema].md` - Ex: `websocket-timeout.md`, `memory-leak.md`
- `[categoria]-[problema].md` - Ex: `performance-issue.md`

### 6. `assets/` - Recursos e Diagramas
**Propósito**: Recursos visuais, diagramas e mockups

#### Estrutura:
- **diagrams/** - Diagramas técnicos (arquitetura, fluxos, etc.)
- **screenshots/** - Screenshots da aplicação
- **mockups/** - Mockups e wireframes

#### Padrão de Nomenclatura:
- **Diagramas**: `[tipo]-[nome].png/svg` - Ex: `architecture-overview.png`
- **Screenshots**: `[tela]-[versao].png` - Ex: `dashboard-v1.2.png`
- **Mockups**: `[tela]-mockup.png` - Ex: `login-mockup.png`

## 📝 Padrões de Nomenclatura

### Arquivos
- **Formato**: kebab-case (`auth-system.md`)
- **Descritivo**: Nomes que explicam o conteúdo
- **Consistente**: Mesmo padrão em todo o projeto

### Pastas
- **Formato**: camelCase ou kebab-case
- **Claras**: Nomes que indicam o propósito
- **Organizadas**: Estrutura lógica e intuitiva

### Documentos
- **Títulos**: Descritivos e claros
- **Versões**: Sempre incluir data e versão
- **Status**: Indicar se está atualizado

## 🔄 Processo de Criação

### 1. Análise do Projeto
- **Identificar** tipo de projeto (web, mobile, game, etc.)
- **Definir** documentação obrigatória baseada no tipo
- **Criar** estrutura de pastas seguindo o padrão

### 2. Criação da Estrutura
```bash
# Criar estrutura básica
mkdir -p _docs/{projeto,dev,systems,process,issues,assets/{diagrams,screenshots,mockups}}

# Criar arquivos obrigatórios
touch _docs/projeto/{PRD,user-stories}.md
touch _docs/dev/{STATUS,todo,changelog,API,setup}.md
touch _docs/dev/ER.mermaid
touch _docs/process/{CONTRIBUTING,DEPLOYMENT,TESTING}.md
touch _docs/issues/known-bugs.md
```

### 3. Preenchimento Inicial
- **README.md** (raiz) - Visão geral + como executar
- **PRD.md** - Requisitos do produto
- **STATUS.md** - Status atual
- **todo.md** - Próximas tarefas
- **CONTRIBUTING.md** - Como contribuir

## 📊 Checklist de Validação

### Estrutura
- [ ] Pasta `_docs/` existe na raiz
- [ ] Todas as subpastas obrigatórias criadas
- [ ] Arquivos obrigatórios existem
- [ ] Nomenclatura segue padrões

### Conteúdo
- [ ] README.md tem visão geral clara
- [ ] PRD.md tem requisitos bem definidos
- [ ] user-stories.md tem histórias de usuário
- [ ] STATUS.md tem status atual
- [ ] todo.md tem próximas tarefas
- [ ] changelog.md tem histórico
- [ ] API.md tem documentação da API
- [ ] setup.md tem guia de configuração
- [ ] CONTRIBUTING.md tem boas práticas
- [ ] DEPLOYMENT.md tem processo de deploy
- [ ] TESTING.md tem estratégia de testes

### Qualidade
- [ ] Documentação está atualizada
- [ ] Informações são claras e objetivas
- [ ] Links funcionam corretamente
- [ ] Estrutura é intuitiva

## 🚀 Aplicação em Diferentes Tipos de Projeto

### Web Application
```
_docs/
├── projeto/
│   ├── PRD.md
│   └── user-stories.md
├── dev/
│   ├── STATUS.md
│   ├── todo.md
│   ├── changelog.md
│   ├── API.md
│   └── setup.md
├── systems/
│   ├── auth-system.md
│   ├── payment-system.md
│   └── notification-system.md
├── process/
│   ├── CONTRIBUTING.md
│   ├── DEPLOYMENT.md
│   └── TESTING.md
├── issues/
│   └── known-bugs.md
└── assets/
    ├── diagrams/
    ├── screenshots/
    └── mockups/
```

### Game Project
```
_docs/
├── projeto/
│   ├── PRD.md
│   ├── Game Design.md
│   └── user-stories.md
├── dev/
│   ├── STATUS.md
│   ├── todo.md
│   ├── changelog.md
│   ├── API.md
│   └── setup.md
├── systems/
│   ├── physics-system.md
│   ├── ai-system.md
│   └── save-system.md
├── process/
│   ├── CONTRIBUTING.md
│   ├── DEPLOYMENT.md
│   └── TESTING.md
├── issues/
│   └── known-bugs.md
└── assets/
    ├── diagrams/
    ├── screenshots/
    └── mockups/
```

### Mobile App
```
_docs/
├── projeto/
│   ├── PRD.md
│   └── user-stories.md
├── dev/
│   ├── STATUS.md
│   ├── todo.md
│   ├── changelog.md
│   ├── API.md
│   └── setup.md
├── systems/
│   ├── auth-system.md
│   ├── push-notification.md
│   └── offline-sync.md
├── process/
│   ├── CONTRIBUTING.md
│   ├── DEPLOYMENT.md
│   └── TESTING.md
├── issues/
│   └── known-bugs.md
└── assets/
    ├── diagrams/
    ├── screenshots/
    └── mockups/
```

## ⚠️ Regras Importantes

### Obrigatório
- **SEMPRE** usar a pasta `_docs/` na raiz
- **SEMPRE** seguir a estrutura de pastas definida
- **SEMPRE** criar arquivos obrigatórios
- **SEMPRE** usar nomenclatura padronizada
- **SEMPRE** respeitar as responsabilidades de cada documento

### Proibido
- **NUNCA** criar documentação fora de `_docs/`
- **NUNCA** usar nomes inconsistentes
- **NUNCA** deixar documentação desatualizada
- **NUNCA** ignorar arquivos obrigatórios
- **NUNCA** duplicar informações entre documentos
- **NUNCA** colocar status atual em todo.md
- **NUNCA** colocar próximas tarefas em status.md
- **NUNCA** colocar histórico em status.md

### Flexível
- **PODE** adicionar pastas específicas se necessário
- **PODE** adaptar para necessidades específicas do projeto
- **PODE** incluir documentação adicional conforme necessário

## 🔄 Regras de Não-Duplicação

### ❌ PROIBIDO - Informações que NUNCA devem ser duplicadas:

1. **Próximas Tarefas**
   - ✅ **ONDE**: Apenas em `todo.md`
   - ❌ **NÃO**: Em `status.md`, `changelog.md`, ou outros documentos

2. **Status Atual**
   - ✅ **ONDE**: Apenas em `status.md`
   - ❌ **NÃO**: Em `todo.md`, `changelog.md`, ou outros documentos

3. **Histórico de Mudanças**
   - ✅ **ONDE**: Apenas em `changelog.md`
   - ❌ **NUNCA**: Em `status.md`, `todo.md`, ou outros documentos

4. **Roadmap de Versões**
   - ✅ **ONDE**: Apenas em `todo.md`
   - ❌ **NÃO**: Em `status.md` ou outros documentos

### ✅ PERMITIDO - Referências cruzadas:

1. **Links entre documentos**
   - ✅ `status.md` pode linkar para `todo.md` para próximas tarefas
   - ✅ `todo.md` pode linkar para `status.md` para status atual
   - ✅ `changelog.md` pode linkar para ambos

2. **Resumos breves**
   - ✅ `status.md` pode ter um resumo de "Próximo: Sistema de Sons"
   - ✅ `todo.md` pode ter um resumo de "Status: v0.5.1 estável"

### 🎯 Exemplo de Separação Correta:

**status.md:**
```markdown
## 📊 Status Geral
- **Versão**: v0.5.1
- **Status**: ✅ ESTÁVEL
- **Próximo**: Sistema de Sons (ver todo.md)
```

**todo.md:**
```markdown
## 🚀 Próximos Passos
- **Status Atual**: v0.5.1 estável (ver status.md)
- **Próximo**: Sistema de Sons (v0.6.0)
```

**changelog.md:**
```markdown
## [v0.5.1] - 2025-01-29
- Limpeza de componentes não utilizados
- Status atualizado (ver status.md)
- Próximas tarefas organizadas (ver todo.md)
```

## 🔄 Manutenção Contínua

### Atualizações Obrigatórias
- **status.md** - Sempre que houver mudanças significativas
- **changelog.md** - A cada nova versão/feature
- **todo.md** - Sempre que tarefas forem concluídas
- **known-bugs.md** - Quando novos problemas forem descobertos

### Revisões Periódicas
- **Mensal**: Revisar estrutura e organização
- **Trimestral**: Validar se padrões ainda são adequados
- **Anual**: Avaliar necessidade de novos padrões

## 🤖 Verificação de Duplicações - OBRIGATÓRIO PARA IA

### ✅ Checklist Antes de Atualizar Qualquer Documento:

1. **Verificar Responsabilidade**
   - [ ] Esta informação pertence ao documento correto?
   - [ ] Não está duplicada em outro documento?
   - [ ] Respeita as responsabilidades definidas?

2. **Verificar Conteúdo**
   - [ ] `status.md` contém apenas status atual?
   - [ ] `todo.md` contém apenas próximas tarefas?
   - [ ] `changelog.md` contém apenas histórico?

3. **Verificar Referências**
   - [ ] Links entre documentos estão corretos?
   - [ ] Resumos breves não duplicam informações?
   - [ ] Referências cruzadas são apropriadas?

### 🚨 Ações Obrigatórias ao Encontrar Duplicações:

1. **Identificar a Fonte Principal**
   - Determinar qual documento deve conter a informação
   - Remover de todos os outros documentos

2. **Criar Referências Cruzadas**
   - Adicionar links entre documentos
   - Usar resumos breves quando necessário

3. **Documentar a Correção**
   - Atualizar `changelog.md` com a correção
   - Explicar por que a duplicação foi removida

### 📋 Exemplo de Correção de Duplicação:

**ANTES (INCORRETO):**
```markdown
# status.md
- Próximas tarefas: Sistema de Sons, Otimizações, Mobile

# todo.md  
- Status atual: v0.5.1 estável
- Próximas tarefas: Sistema de Sons, Otimizações, Mobile
```

**DEPOIS (CORRETO):**
```markdown
# status.md
- Status: v0.5.1 estável
- Próximo: Sistema de Sons (ver todo.md)

# todo.md
- Status atual: v0.5.1 estável (ver status.md)
- Próximas tarefas: Sistema de Sons, Otimizações, Mobile
```

---

**Última atualização**: Janeiro 2025  
**Versão**: v1.0  
**Aplicabilidade**: TODOS os projetos 
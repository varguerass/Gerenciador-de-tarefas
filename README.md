# Gerenciador de Tarefas

Projeto de lista de tarefas para portfólio, com funcionalidades básicas e avançadas (filtros, prioridades, prazos, persistência no localStorage, edição e modo noturno).

## O que o projeto faz

- Adiciona tarefas com prioridade e prazo
- Lista tarefas em tempo real
- Marca tarefas como concluídas
- Remove tarefas individualmente ou em lote
- Filtra por todas, pendentes ou concluídas
- Salva as tarefas no localStorage
- Permite editar tarefas já criadas
- Destaca tarefas atrasadas e coloca no topo da lista
- Alterna entre modo claro e modo noturno

## Estrutura dos arquivos

- `index.html`: estrutura da página, inputs, botões, filtros e lista de tarefas.
- `styles.css`: estilos visuais (paleta de cores, layout, responsividade, animações e modo noturno).
- `Main.js`: regras de negócio (estado das tarefas, eventos e atualização da interface).

## Explicação detalhada do código

### HTML (`index.html`)

- `header.hero`: área de título do projeto com botão de tema e efeitos de hover.
- `section.composer`: formulário para criar nova tarefa (texto, prioridade e prazo).
- `section.toolbar`: filtros de visualização e remoção em lote.
- `ul#task-list`: lista dinâmica onde as tarefas são renderizadas pelo JavaScript.
- `section.summary`: resumo com total, pendentes e concluídas.

### CSS (`styles.css`)

- `:root`: define a paleta de cores e variáveis globais do tema claro.
- `[data-theme="dark"]`: sobrescreve variáveis do tema claro para o modo noturno.
- `.hero`: container do título com movimentação sutil ao passar o mouse (parallax simples).
- `.composer`, `.toolbar`, `.task`: layout responsivo e organização dos blocos.
- `.task.overdue`: cores para tarefas atrasadas.
- `.task.completed`: estilo de tarefa concluída (risco no texto).
- `.tag.*`: etiquetas de prioridade e atraso.

### JavaScript (`Main.js`)

- **Estado principal**
  - `tasks`: array com todas as tarefas.
  - `activeFilter`: filtro atual (all, pending, completed).
  - `editingId`: guarda o id da tarefa em edição.

- **Persistência**
  - `storageKey`: chave do localStorage para tarefas.
  - `themeKey`: chave do localStorage para o tema.
  - `loadTasks()` / `saveTasks()`: carregam e salvam tarefas.
  - `loadTheme()` / `applyTheme()` / `toggleTheme()`: carregam, aplicam e alternam o tema.

- **Datas e atraso**
  - `formatDate()`: formata a data no padrão pt-BR.
  - `getTodayStart()`: gera a data de hoje sem horário.
  - `isOverdue()`: identifica se a tarefa está atrasada.

- **Renderização**
  - `createTaskElement()`: monta o HTML de cada tarefa.
    - adiciona a classe `overdue` se estiver atrasada.
    - exibe o selo “Atrasada”.
    - controla a exibição do modo edição.
  - `renderTasks()`: filtra, ordena e desenha a lista na tela.
  - `updateSummary()`: atualiza o resumo.

- **Ações do usuário**
  - `addTask()`: cria nova tarefa.
  - `toggleTask()`: marca/desmarca como concluída.
  - `removeTask()`: remove uma tarefa.
  - `clearCompleted()`: remove todas concluídas.
  - `startEditing()` / `saveEdit()` / `cancelEdit()`: fluxo de edição.
  - `setFilter()`: muda o filtro.

## Tecnologias usadas

- HTML5
- CSS3
- JavaScript (DOM + localStorage)

## Aprendizados

- Manipulação do DOM com eventos
- Estruturação de estados simples no JavaScript
- Persistência de dados com localStorage
- Construção de layouts responsivos
- Implementação de temas (modo claro e noturno)

## Como executar

Abra o arquivo `index.html` no navegador.



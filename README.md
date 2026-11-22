# NEXO — MVP estático


Uma homepage editorial + gerador de desafios de aprendizagem e conversa. Sem backend ou build: HTML, CSS, JavaScript e JSON.


## Publicar no GitHub Pages
1. Crie um repositório e envie todos os arquivos desta pasta para a raiz (ou para a pasta configurada para Pages).
2. No GitHub, abra **Settings → Pages**.
3. Escolha **Deploy from a branch**, selecione sua branch (geralmente `main`) e `/ (root)`.
4. Salve e aguarde a publicação.


## Adicionar desafios
Edite `topics.json` e acrescente itens dentro do array `topics`. Campos necessários:
- `id`: identificador único (slug)
- `category`: `filosofia`, `sociologia`, `fisica`, `psicologia`, `historia` ou `tecnologia`
- `type`: tipo editorial, como Figura, Conceito, Teoria, Questão, Fenômeno
- `title`: título curto
- `description`: contexto e provocação
- `mission`: tarefa de pesquisa e apresentação

Exemplo:
```json
{
  "id": "socio-fato-social",
  "category": "sociologia",
  "type": "Conceito",
  "title": "O fato social",
  "description": "Como a sociedade influencia comportamentos individuais?",
  "mission": "Pesquise o conceito, encontre exemplos e explique o que descobriu aos participantes."
}
```


## Funcionalidades do MVP
- Homepage editorial Explore
- Navegação para Desafie-se
- Sorteio aleatório de desafio ou por área
- Modos/participantes (casal, amigos, grupo, solo — informativo por enquanto)
- Tempos configuráveis de pesquisa e apresentação, com presets e personalizado
- Cronômetro com iniciar/pausar, reiniciar etapa e pular etapa
- Fases: pesquisa → apresentação → discussão livre
- Dados separados em `topics.json`


## Limitações / próximas melhorias
- Os modos de participantes ainda não mudam as regras nem atribuem papéis automaticamente.
- A discussão é livre e não tem cronômetro.
- Sem persistência de sessão, login, favoritos ou histórico.
- Fontes web usadas para tipografia Google Fonts; se quiser offline, remova o `@import` e use fontes de sistema.
- Se o JSON for servido com falha de fetch por abrir `index.html` diretamente (`file://`), use um servidor local ou publique no GitHub Pages. `fetch()` não lê JSON local via file URL em browsers comuns.

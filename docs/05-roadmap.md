# Brezel — Roadmap

Items identificados ao longo do processo de design e desenvolvimento.

---

## Funcionalidades

### Exportação e Compartilhamento
- **Exportação de dados em PDF formatado** — com capa, nome do usuário, data, tipografia cuidada. Um *Wörterbuch* pessoal imprimível.
- **Compartilhamento de entrada individual** — página única bem diagramada com termo, definições, exemplos e notas. Mesmo engine do livro completo, parametrizado.
- **Momento de exportação personalizado** — antes de exportar, perguntar ao usuário sua frase favorita em alemão e "Para quem é este livro?" para gerar uma dedicatória na página 1.

### Medidor de Progresso e Desbloqueios
- **Medidor de progresso no hub** — anel circular discreto mostrando progresso em direção à meta de entradas.
- **Meta de 50 entradas para desbloquear o livro** — entradas incompletas não contam.
- **10 entradas para desbloquear as saudações** — o usuário constrói o próprio vocabulário primeiro, depois recebe conteúdo curado.
- **Animação do medidor completando** — anel completa, animação sutil, botão de exportar aparece.

### Conteúdo Curado (Saudações Brezel)
- **Frases de saudação rotativas no hub** — "Na, was gibt's Neues?", etc. Desbloqueadas após 10 entradas.
- **Botão "Adicionar como entrada"** nas saudações — o usuário pode incorporar ao próprio vocabulário.
- **Endpoint `POST /api/entries/from-library`** — cria entrada com definição e exemplo em uma transação só, para uso tanto nas saudações quanto na biblioteca.

### Biblioteca — Palavras Clicáveis
- **Palavras das frases de exemplo na biblioteca são clicáveis** — usuário autenticado pode adicionar ao vocabulário direto da página de conteúdo estático.
- **Cada frase de exemplo já tem contexto** — a frase vira o exemplo da entrada automaticamente.

### Ferramentas de Memorização
- **Flashcards** — com palavras do vocabulário do próprio usuário ou por categorias específicas.
- **Der/Die/Das trainer** — ferramenta para praticar artigos com as palavras do usuário.

### Aprendizado Visual
- **Suporte a sketches e fotos** — diferentes formas de o usuário comunicar ideias e definir palavras.
- **Photo capture com OCR** — acionar quick capture pela câmera com reconhecimento de texto.

### Funcionalidades Sociais e Institucionais
- **Grupos e relação professor/aluno** — para escolas e instituições.
- **Fluxo de validação de entrada pelo professor**.
- **Conteúdo estático personalizado por grupo**.

### Animações
- **Animação da lupa no 404** — lupa percorre a tela revelando o pretzel pontilhado se tornando sólido onde passa. CSS clip-path + keyframes.
- **Animação do onboarding** — elementos SVG isolados entrando com delay escalonado, palavras aparecendo com fade ao redor dos objetos.

---

## UX / Design

- **Ícones de xilogravura para a biblioteca** — cada tópico com seu próprio ícone no estilo cordel. Diagrama de Venn para Wechselpräpositionen, Brezel e caixa para preposições de posição, tabelinha para declinações.
- **Tema claro e escuro** — toggle no menu do usuário, preferência salva no banco.
- **i18n PT-BR e EN** — strings centralizadas, locale salvo no banco, default inteligente via OAuth + idioma do sistema como fallback.

---

## Dados e Backend

- **Lixeira com restauração** — entradas soft deleted acessíveis via menu do usuário.
- **Exportar dados** — disponível no menu e também oferecido antes de excluir a conta.

---

## Produto

- **"Conheça o Brezel"** em páginas da biblioteca para visitantes não autenticados — converte no momento de maior interesse.
- **Página de onboarding** — 4 telas com ilustrações xilogravura explicando o conceito do app antes do login.
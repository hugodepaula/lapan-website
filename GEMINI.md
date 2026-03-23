# GEMINI.md - LAPAN Website

Este arquivo fornece contexto e diretrizes para o desenvolvimento do site institucional do LAPAN.

## 🚀 Visão Geral do Projeto

O site do LAPAN é construído com **Astro 6**, **Tailwind CSS 4** e **Decap CMS**. Ele utiliza uma arquitetura baseada em conteúdo para gerenciar membros da equipe, projetos, eventos e publicações.

- **Tecnologias Principais:** Astro (v6+), TypeScript, Tailwind CSS (v4+), Vite, Citeproc (para referências ABNT).
- **Gerenciamento de Conteúdo:** Astro Content Collections (Astro 5+ API) e Decap CMS (configurado em `public/lapan-gestao`).
- **Publicações:** Integradas via Zotero, processadas por um script de normalização que gera referências em formato ABNT.

## 🛠️ Comandos Principais

### Desenvolvimento
```bash
npm install        # Instala dependências
npm run dev        # Inicia servidor de desenvolvimento (http://localhost:4321)
```

### Build e Produção
```bash
npm run build      # Gera o build estático em dist/
npm run preview    # Visualiza o build localmente
```

### Utilitários
```bash
npm run zotero:normalizar  # Normaliza dados do Zotero em content/zotero.json
```

## 📁 Estrutura de Conteúdo (Content Collections)

As coleções de conteúdo estão definidas em `src/content.config.ts`:

- **Equipe (`src/content/team`)**: Membros do laboratório. Inclui cargo, bio, foto e links (Lattes, etc).
- **Eventos (`src/content/events`)**: Histórico e futuros eventos (CBNV, DARV, etc).
- **Projetos (`src/content/projects`)**: Projetos de pesquisa com resumo, metodologia, impacto e equipe vinculada.

## 🎨 Convenções de Desenvolvimento

- **Estilização:** Utiliza Tailwind CSS 4 via plugin do Vite. Prefira classes utilitárias e mantenha o design consistente com a identidade visual do LAPAN.
- **Idiomas:** Toda a documentação técnica (incluindo este arquivo), comentários de código e conteúdo do site devem ser em **Português (Brasil)**.
- **CMS:** O painel administrativo está em `/admin` (mapeado fisicamente para `public/lapan-gestao/index.html`). A configuração reside em `public/lapan-gestao/config.yml`.
- **Imagens:**
    - Fotos da equipe: `public/images/team/`
    - Uploads do CMS: `public/images/uploads/`
    - Assets gerais: `public/images/`
- **Publicações:** O arquivo fonte é `content/zotero.json`. Use o script de normalização após atualizar este arquivo para garantir que a interface reflita as mudanças.

## ⚠️ Observações de Migração

O arquivo `INCONSISTENCIAS_MIGRACAO.md` contém registros de problemas identificados durante a migração do sistema legado (Jekyll/WordPress). Sempre consulte este arquivo ao editar eventos ou projetos históricos.

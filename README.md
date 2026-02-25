# LAPAN Website

Site institucional do LAPAN, construído com Astro + Tailwind CSS + Decap CMS.

## Guia rápido

1. Instale dependências:
```bash
npm install
```
2. Rode localmente:
```bash
npm run dev
```
3. Gere build de produção:
```bash
npm run build
```

O site final é gerado em `dist/`.

## CMS (edição de conteúdo)

- Painel: `/admin` (ex.: `http://localhost:4321/admin`)
- Collections editáveis nesta etapa:
  - `Equipe`
  - `Eventos`
  - `Projetos`
- Publicações continuam fora do CMS (fonte atual: `content/zotero.json`).

## Deploy sem conhecimento técnico

Use o guia completo em [INSTALL.md](/home/hugo/Documents/LAPAN/dev/lapan-website/INSTALL.md).

Ele inclui:
- pré-requisitos
- configuração de formulário de contato
- validação antes de publicar
- deploy em Netlify, Vercel, Cloudflare Pages, GitHub Pages e servidor próprio
- checklist de pós-deploy

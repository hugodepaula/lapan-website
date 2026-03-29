# LAPAN Website

@author Prof. Hugo de Paula

Site institucional do LAPAN, construído com Astro + Tailwind CSS + Decap CMS.

Requisitos de runtime:
- Node.js 22.12.0 ou superior
- npm 10 ou superior

## Estado atual do conteúdo

- Equipe: conteúdos em `src/content/team`, com imagens normalizadas em `public/images/team`.
- Eventos: histórico migrado de `/_migration/jekyll/_drafts` para `src/content/events`.
- Projetos: conteúdos em `src/content/projects`.
- Inconsistências da migração para revisão manual: `INCONSISTENCIAS_MIGRACAO.md`.

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
4. Rode as validações de conteúdo e GEO:
```bash
npm run check
```

O site final é gerado em `dist/`.

## GEO / SEG

- Fundamentos e implementação: [docs/geo-foundations.md](/home/hugo/Documents/LAPAN/dev/lapan-website/docs/geo-foundations.md)
- Arquivo `llms.txt` gerado em build para descoberta por ferramentas e modelos
- Validações automatizadas:
  - `npm run validate:content`
  - `npm run validate:geo`
  - `npm run check`

## CMS (edição de conteúdo)

- Painel: `/admin` (ex.: `http://localhost:4321/admin`)
- Collections editáveis nesta etapa:
  - `Equipe`
  - `Eventos`
  - `Projetos`
- Publicações continuam fora do CMS.

## Deploy sem conhecimento técnico

Use o guia completo em [INSTALL.md](/home/hugo/Documents/LAPAN/dev/lapan-website/INSTALL.md).

Ele inclui:
- pré-requisitos
- configuração de formulário de contato
- validação antes de publicar
- deploy em Netlify, Vercel, Cloudflare Pages, GitHub Pages e servidor próprio
- checklist de pós-deploy

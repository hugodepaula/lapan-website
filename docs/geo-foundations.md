# Fundamentos SEG / GEO no projeto LAPAN

## Objetivo

Este projeto trata SEO clássico e GEO como camadas complementares.

- SEO continua importante para descoberta, canonicalização, sitemap e rastreabilidade.
- GEO prioriza legibilidade semântica, estrutura de entidades, citações, atribuição e extração por modelos generativos.
- O objetivo do site não é inflar palavras-chave, e sim publicar páginas canônicas que possam ser citadas com confiança por humanos, buscadores e sistemas de IA.

## Princípios adotados

1. Markdown é a fonte de verdade.
2. Frontmatter carrega fatos estruturados e curtos, não listas vazias de keywords.
3. O corpo do conteúdo continua legível e editorial.
4. Estrutura semântica e JSON-LD são gerados a partir do conteúdo canônico.
5. Validação automatizada protege o contrato GEO ao longo do tempo.

## Arquitetura implementada

### Fonte de conteúdo

- Equipe: [src/content/team](/home/hugo/Documents/LAPAN/dev/lapan-website/src/content/team)
- Eventos: [src/content/events](/home/hugo/Documents/LAPAN/dev/lapan-website/src/content/events)
- Projetos: [src/content/projects](/home/hugo/Documents/LAPAN/dev/lapan-website/src/content/projects)
- Schema tipado: [src/content.config.ts](/home/hugo/Documents/LAPAN/dev/lapan-website/src/content.config.ts)
- CMS: [public/lapan-gestao/config.yml](/home/hugo/Documents/LAPAN/dev/lapan-website/public/lapan-gestao/config.yml)

### Camada GEO compartilhada

- Config de site e sitemap: [astro.config.mjs](/home/hugo/Documents/LAPAN/dev/lapan-website/astro.config.mjs)
- Identidade institucional: [src/lib/site.ts](/home/hugo/Documents/LAPAN/dev/lapan-website/src/lib/site.ts)
- Canonical, breadcrumbs e JSON-LD: [src/lib/geo.ts](/home/hugo/Documents/LAPAN/dev/lapan-website/src/lib/geo.ts)
- Normalização de entidades: [src/lib/entities.ts](/home/hugo/Documents/LAPAN/dev/lapan-website/src/lib/entities.ts)
- Resumos e utilidades de conteúdo: [src/lib/content-helpers.ts](/home/hugo/Documents/LAPAN/dev/lapan-website/src/lib/content-helpers.ts)
- Injeção em todas as páginas: [src/layouts/BaseLayout.astro](/home/hugo/Documents/LAPAN/dev/lapan-website/src/layouts/BaseLayout.astro)

### Páginas canônicas por entidade

- Pessoa: [src/pages/equipe/[slug].astro](/home/hugo/Documents/LAPAN/dev/lapan-website/src/pages/equipe/[slug].astro)
- Evento: [src/pages/eventos/[slug].astro](/home/hugo/Documents/LAPAN/dev/lapan-website/src/pages/eventos/[slug].astro)
- Projeto: [src/pages/projetos/[slug].astro](/home/hugo/Documents/LAPAN/dev/lapan-website/src/pages/projetos/[slug].astro)

### Ativos para crawlers e modelos

- `robots.txt`: [src/pages/robots.txt.ts](/home/hugo/Documents/LAPAN/dev/lapan-website/src/pages/robots.txt.ts)
- `llms.txt`: [src/pages/llms.txt.ts](/home/hugo/Documents/LAPAN/dev/lapan-website/src/pages/llms.txt.ts)
- Sitemap XML: gerado por `@astrojs/sitemap`

## O que mudou no conteúdo

### Equipe

Campos novos no frontmatter:

- `resumoCurto`
- `afiliacao`
- `credenciais`
- `areasAtuacao`
- `destaques`
- `email`
- `orcid`
- `ultimaRevisao`

Exemplo:

```yaml
nome: "Prof. Dr. Ricardo Queiroz Guimarães"
cargo: "Diretor e Fundador do LAPAN"
resumoCurto: "Médico oftalmologista e fundador do LAPAN..."
afiliacao: "Hospital de Olhos Dr. Ricardo Guimarães (HOlhos)"
credenciais:
  - "Médico oftalmologista"
areasAtuacao:
  - "Neurociências da visão"
ultimaRevisao: "2026-03-29"
```

### Eventos

Campos novos:

- `fim`
- `resumoCurto`
- `tipo`
- `organizadores`
- `instituicoes`
- `temas`
- `publico`
- `modo`
- `ultimaRevisao`

### Projetos

Campos novos:

- `resumoCurto`
- `perguntaCentral`
- `metodos`
- `achadosPrincipais`
- `instituicoes`
- `financiamento`
- `populacao`
- `citationSummary`
- `areasTematicas`
- `ultimaRevisao`

Esses campos existem para melhorar extração, sumarização e atribuição. Eles não substituem o texto principal e não devem ser preenchidos com termos genéricos ou keywords vazias.

## Metadados e tags gerados

O layout base injeta em todas as páginas:

```html
<link rel="canonical" href="...">
<meta name="description" content="...">
<meta name="robots" content="index,follow,max-snippet:-1,max-image-preview:large,max-video-preview:-1">
<meta property="og:title" content="...">
<meta property="og:description" content="...">
<meta property="og:url" content="...">
<meta property="og:image" content="...">
<meta name="twitter:card" content="summary_large_image">
```

Também são gerados JSON-LD para:

- `WebSite`
- `ResearchOrganization`
- `BreadcrumbList`
- `ProfilePage`
- `Event`
- `ResearchProject`
- `ContactPage`

## Schemas implementados

### Organization

Fonte: [src/lib/geo.ts](/home/hugo/Documents/LAPAN/dev/lapan-website/src/lib/geo.ts)

Estrutura resumida:

```json
{
  "@context": "https://schema.org",
  "@type": "ResearchOrganization",
  "name": "Laboratório de Pesquisa Aplicação à Neurociências da Visão (LAPAN)",
  "foundingDate": "2009",
  "email": "contato@...",
  "telephone": "+55 31 ...",
  "sameAs": ["LinkedIn"],
  "address": {
    "@type": "PostalAddress"
  }
}
```

### ProfilePage + Person

Fonte: [src/pages/equipe/[slug].astro](/home/hugo/Documents/LAPAN/dev/lapan-website/src/pages/equipe/[slug].astro)

```json
{
  "@type": "ProfilePage",
  "mainEntity": {
    "@type": "Person",
    "name": "...",
    "jobTitle": "...",
    "sameAs": ["Lattes", "ORCID", "LinkedIn"]
  }
}
```

### Event

Fonte: [src/pages/eventos/[slug].astro](/home/hugo/Documents/LAPAN/dev/lapan-website/src/pages/eventos/[slug].astro)

```json
{
  "@type": "Event",
  "name": "...",
  "startDate": "...",
  "endDate": "...",
  "eventAttendanceMode": "https://schema.org/OfflineEventAttendanceMode",
  "eventStatus": "https://schema.org/EventScheduled",
  "location": {
    "@type": "Place"
  }
}
```

### ResearchProject

Fonte: [src/pages/projetos/[slug].astro](/home/hugo/Documents/LAPAN/dev/lapan-website/src/pages/projetos/[slug].astro)

```json
{
  "@type": "ResearchProject",
  "name": "...",
  "description": "...",
  "keywords": ["..."],
  "member": [{ "@type": "Person" }],
  "funder": [{ "@type": "Organization" }],
  "sponsor": [{ "@type": "Organization" }]
}
```

## llms.txt

O arquivo [src/pages/llms.txt.ts](/home/hugo/Documents/LAPAN/dev/lapan-website/src/pages/llms.txt.ts) gera um índice curado para uso por ferramentas e modelos.

Ele contém:

- resumo do site
- páginas principais
- políticas e transparência
- lista canônica de projetos
- lista canônica de eventos
- seção `Optional` com perfis de equipe

Importante:

- `llms.txt` é tratado como camada experimental de GEO
- ele complementa, não substitui, sitemap, canonicals e JSON-LD

## Rotas canônicas

O projeto mantém apenas o namespace institucional canônico em `/sobre-o-laboratorio/`.

Rotas institucionais ativas:

- `/sobre-o-laboratorio/`
- `/sobre-o-laboratorio/missao-e-valores/`
- `/sobre-o-laboratorio/historia-e-fundadores/`
- `/sobre-o-laboratorio/infraestrutura-e-equipamentos/`
- `/sobre-o-laboratorio/metodologia-e-evidencias/`

## Comandos

Desenvolvimento:

```bash
npm run dev
```

Build:

```bash
npm run build
```

Validação de conteúdo:

```bash
npm run validate:content
```

Validação GEO pós-build:

```bash
npm run validate:geo
```

Fluxo completo:

```bash
npm run check
```

## Validadores implementados

### Conteúdo

Arquivo: [scripts/validate-content.mjs](/home/hugo/Documents/LAPAN/dev/lapan-website/scripts/validate-content.mjs)

Verifica:

- datas absurdas em equipe
- ano inconsistente entre título e data de eventos
- projetos sem `citationSummary`
- projetos sem fontes estruturadas
- bios excessivamente curtas

### GEO

Arquivo: [scripts/validate-geo.mjs](/home/hugo/Documents/LAPAN/dev/lapan-website/scripts/validate-geo.mjs)

Verifica:

- presença de arquivos em `dist/`
- canonical
- Open Graph
- Twitter card
- JSON-LD
- `robots.txt`
- `llms.txt`
- `sitemap-index.xml`

## Observações operacionais

- Configure `PUBLIC_SITE_URL` no ambiente de build para garantir canonicals corretos.
- Configure `PUBLIC_CONTACT_EMAIL` se o contato institucional mudar.
- Configure `PUBLIC_INSTAGRAM_URL` apenas se houver perfil canônico real.
- Mantenha Search Console e Bing Webmaster alinhados com o sitemap atual.
- Se desejar compatibilidade com URLs antigas no futuro, prefira tratar isso no nível do CDN ou servidor, sem reintroduzir namespaces descontinuados no código principal.

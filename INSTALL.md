# INSTALL / DEPLOY - LAPAN Website

Este guia permite instalar, configurar e publicar o site sem precisar conhecer a estrutura interna do projeto.

## 1) Pré-requisitos

- Node.js 20 ou superior
- npm 10 ou superior
- Git (opcional, mas recomendado)

Verificação:
```bash
node -v
npm -v
```

## 2) Baixar o projeto

Se já recebeu a pasta, pule esta etapa.

Com Git:
```bash
git clone <URL_DO_REPOSITORIO>
cd lapan-website
```

## 3) Instalar dependências

```bash
npm install
```

## 4) Configurar formulário de contato (opcional, mas recomendado)

A página `/contato` já possui formulário com os campos:
- Nome
- E-mail
- Assunto
- Mensagem

Para envio real, configure um endpoint HTTP que receba `POST` em formato `application/x-www-form-urlencoded`.

Crie um arquivo `.env` na raiz do projeto:
```bash
PUBLIC_CONTACT_FORM_ENDPOINT=https://SEU-ENDPOINT-DE-ENVIO
```

Observação:
- Sem essa variável, o formulário continua visível e validando campos, mas não envia online.
- Nesse caso, a interface orienta o usuário a usar o e-mail institucional.

## 5) Rodar localmente para revisão

```bash
npm run dev
```

Abra no navegador:
- `http://localhost:4321`

## 5.1) Usar o Decap CMS

O painel administrativo está em:
- `http://localhost:4321/admin`

Arquivos de configuração:
- `public/admin/index.html`
- `public/admin/config.yml`

Collections disponíveis no CMS:
- Equipe (`src/content/team`)
- Eventos (`src/content/events`)
- Projetos (`src/content/projects`)

Uploads de mídia:
- pasta física: `public/images/uploads`
- URL pública: `/images/uploads/...`

Observações para o GitHub backend:
- Repositório configurado: `hugodepaula/lapan-website`
- Branch: `main`
- Workflow editorial habilitado (`publish_mode: editorial_workflow`)
- Para login/edição em produção, é necessário configurar autenticação GitHub OAuth do Decap/Netlify Identity conforme o ambiente de hospedagem.

## 6) Validar build de produção

```bash
npm run build
```

Saída esperada:
- build concluído sem erros
- pasta `dist/` criada/atualizada

## 7) Publicar (deploy)

O site é estático. Qualquer hospedagem de arquivos estáticos funciona.

### Opção A: Netlify (simples)

Configuração:
- Build command: `npm run build`
- Publish directory: `dist`
- Environment variable: `PUBLIC_CONTACT_FORM_ENDPOINT` (se usar formulário com envio)

### Opção B: Vercel

Configuração:
- Framework preset: Astro
- Build command: `npm run build`
- Output directory: `dist`
- Environment variable: `PUBLIC_CONTACT_FORM_ENDPOINT` (se usar formulário com envio)

### Opção C: Cloudflare Pages

Configuração:
- Build command: `npm run build`
- Build output directory: `dist`
- Environment variable: `PUBLIC_CONTACT_FORM_ENDPOINT` (se usar formulário com envio)

### Opção D: GitHub Pages (build local)

1. Gerar build:
```bash
npm run build
```
2. Publicar conteúdo de `dist/` no branch/pasta configurada para Pages.

### Opção E: Servidor próprio (Nginx/Apache)

1. Gerar build:
```bash
npm run build
```
2. Copiar conteúdo de `dist/` para a pasta pública do servidor.

Exemplo com `rsync`:
```bash
rsync -avz dist/ usuario@servidor:/var/www/lapan/
```

## 8) Checklist pós-deploy

- Página inicial abre corretamente
- Menu navega para:
  - Quem Somos
  - Projetos
  - Publicações
  - Eventos
  - Equipe
  - Parceiros
  - Contato
- Páginas migradas carregam sem erro:
  - `/equipe`
  - `/eventos`
  - `/projetos`
  - `/quem-somos`
  - `/quem-somos/fundadores`
  - `/quem-somos/infraestrutura`
  - `/quem-somos/objetivo`
  - `/parceiros`
  - `/contato`
- Imagens aparecem corretamente
- Formulário de contato:
  - com endpoint: envia com sucesso
  - sem endpoint: mostra orientação de contato por e-mail
- Responsividade em mobile e desktop

## 9) Comandos úteis

```bash
npm run dev      # desenvolvimento
npm run build    # build de produção
npm run preview  # pré-visualizar build localmente
```

## 10) Solução de problemas

### Erro em `npm install`
- Atualize Node.js para versão 20+
- Remova `node_modules` e `package-lock.json`, depois rode `npm install` novamente

### Build falha
- Rode:
```bash
npm run build
```
- Corrija o erro apontado no terminal e repita o build

### Formulário não envia
- Verifique se `PUBLIC_CONTACT_FORM_ENDPOINT` está definido
- Confirme se o endpoint aceita `POST` com `application/x-www-form-urlencoded`
- Verifique CORS no endpoint

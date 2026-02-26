# Inconsistências Para Verificação Manual

Data de geração: 2026-02-26

## Escopo

Este log registra inconsistências identificadas durante a migração de conteúdos legados para o site Astro, com foco na página de eventos.

## Eventos (/_migration/jekyll/_drafts)

1. Título x data no conteúdo:
- **11º Congresso Brasileiro de Neurovisão – CBNV 2022**
- Arquivo legado: `_migration/jekyll/_drafts/11o-congresso-brasileiro-de-neurovisao-cbnv-2022654-autosave-v1-11o-Congresso-Brasileiro-de-Neurovisao-8211-CBNV-2022.md`
- No corpo do texto, o evento menciona realização em **7 e 8 de novembro de 2024**.
- A entrada migrada foi criada com data `2024-11-07`, mantendo o título legado para rastreabilidade.

2. Metadados de data potencialmente não confiáveis:
- Diversos rascunhos possuem `date` de publicação/edição (ex.: 2025) que não representa a data real do evento.
- Exemplo: eventos CBNV 7, 9, 11 e 12.
- Na migração, a data priorizada foi inferida pelo título/descrição quando possível.

3. Duplicidade de versões do mesmo evento:
- Existem arquivos `autosave` e `revision` para os mesmos conteúdos.
- Exemplo: `XXVII Curso DARV` aparece em duas versões:
  - `xxvii-curso-darv363-revision-v1-XXVII-Curso-DARV.md`
  - `xxvii-curso-darv367-autosave-v1-XXVII-Curso-DARV.md`
- Foi mantida a versão com conteúdo mais limpo/coerente.

4. Nomenclatura divergente de um mesmo evento:
- `6º Congresso Brasileiro de Neurovisão` e `6º Congresso Brasileiro de Neurociências da Visão` aparecem em rascunhos distintos.
- A migração usou a versão “Neurociências da Visão”, por estar mais completa no conteúdo importado.

5. Conteúdo incompleto em rascunhos recentes:
- **12º Congresso Brasileiro de Neurovisão – CBNV 2025** contém pouco texto (quase apenas imagem).
- Entrada mantida no histórico, mas requer conferência manual de descrição final.

6. Campos legados com codificação HTML:
- Títulos com entidades como `&#8211;` foram convertidos, mas recomenda-se revisão visual final.

## Caminhos para conferência rápida

- Eventos migrados: `src/content/events/`
- Página de listagem: `src/pages/eventos.astro`
- Imagens de eventos importadas: `public/images/migration/eventos/`
- Fontes legadas: `_migration/jekyll/_drafts/`


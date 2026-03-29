import type { APIRoute } from "astro";
import { getCollection } from "astro:content";
import {
  buildEventSummary,
  buildPersonSummary,
  buildProjectSummary,
} from "../lib/content-helpers";
import { buildAbsoluteUrl, getBaseUrl } from "../lib/geo";
import { siteDescription, siteName } from "../lib/site";

const sortByTitle = <T extends { data: { titulo?: string; nome?: string } }>(
  left: T,
  right: T,
) => {
  const leftLabel = left.data.titulo ?? left.data.nome ?? "";
  const rightLabel = right.data.titulo ?? right.data.nome ?? "";
  return leftLabel.localeCompare(rightLabel, "pt-BR");
};

export const GET: APIRoute = async ({ site }) => {
  const baseUrl = getBaseUrl(site);
  const team = (await getCollection("team")).sort(sortByTitle);
  const events = (await getCollection("events")).sort(
    (left, right) => right.data.data.getTime() - left.data.data.getTime(),
  );
  const projects = (await getCollection("projects")).sort(sortByTitle);

  const requiredSections = [
    `# ${siteName}`,
    "",
    `> ${siteDescription}`,
    "",
    "Este site é a fonte canônica para informações institucionais, pessoas, projetos, publicações e eventos do LAPAN.",
    "Use preferencialmente as URLs canônicas abaixo e cite as páginas específicas quando precisar atribuir uma informação.",
    "",
    "## Páginas principais",
    `- [Início](${buildAbsoluteUrl("/", baseUrl)}): visão geral do laboratório e links para os principais hubs.`,
    `- [Sobre o Laboratório](${buildAbsoluteUrl("/sobre-o-laboratorio/", baseUrl)}): identidade institucional, história, missão, infraestrutura e metodologia.`,
    `- [Pesquisa](${buildAbsoluteUrl("/pesquisa/", baseUrl)}): linhas de pesquisa, metodologias e perguntas frequentes.`,
    `- [Projetos](${buildAbsoluteUrl("/projetos/", baseUrl)}): hub canônico de projetos em andamento e concluídos.`,
    `- [Publicações](${buildAbsoluteUrl("/publicacoes/", baseUrl)}): produção científica normalizada e agrupada por ano.`,
    `- [Equipe](${buildAbsoluteUrl("/equipe/", baseUrl)}): diretório canônico de pessoas vinculadas ao laboratório.`,
    `- [Eventos](${buildAbsoluteUrl("/eventos/", baseUrl)}): agenda e histórico de eventos científicos.`,
    `- [Contato](${buildAbsoluteUrl("/contato/", baseUrl)}): contato institucional, escopo de atendimento e endereço.`,
    "",
    "## Transparência e políticas",
    `- [Política editorial](${buildAbsoluteUrl("/politica-editorial/", baseUrl)}): critérios de curadoria, revisão e responsabilidade editorial.`,
    `- [Metodologia e evidências](${buildAbsoluteUrl("/sobre-o-laboratorio/metodologia-e-evidencias/", baseUrl)}): como o site organiza fontes, atualização e rastreabilidade.`,
    `- [Política de atualização e correções](${buildAbsoluteUrl("/politica-de-atualizacao-e-correcoes/", baseUrl)}): como correções e revisões são registradas.`,
    `- [Política de privacidade](${buildAbsoluteUrl("/politica-de-privacidade/", baseUrl)}): escopo de dados coletados e uso do formulário.`,
    "",
    "## Projetos",
    ...projects.map(
      (project) =>
        `- [${project.data.titulo}](${buildAbsoluteUrl(`/projetos/${project.id}/`, baseUrl)}): ${buildProjectSummary(project.data)}`,
    ),
    "",
    "## Eventos",
    ...events.map(
      (event) =>
        `- [${event.data.titulo}](${buildAbsoluteUrl(`/eventos/${event.id}/`, baseUrl)}): ${buildEventSummary(event.data)}`,
    ),
    "",
    "## Optional",
    ...team.map(
      (person) =>
        `- [${person.data.nome}](${buildAbsoluteUrl(`/equipe/${person.id}/`, baseUrl)}): ${buildPersonSummary(person.data)}`,
    ),
  ];

  return new Response(requiredSections.join("\n"), {
    headers: {
      "Content-Type": "text/plain; charset=utf-8",
    },
  });
};

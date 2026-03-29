import { defineCollection } from "astro:content";
import { glob } from "astro/loaders";
import { z } from "astro/zod";

const safeHttpUrlSchema = z
  .string()
  .min(1)
  .refine((valor) => {
    try {
      const url = new URL(valor);
      return url.protocol === "http:" || url.protocol === "https:";
    } catch {
      return false;
    }
  }, "Use uma URL HTTP ou HTTPS válida");

const safeResourceUrlSchema = z
  .string()
  .min(1)
  .refine((valor) => valor.startsWith("/") || safeHttpUrlSchema.safeParse(valor).success, "Use um caminho interno iniciado por / ou uma URL HTTP/HTTPS válida");

const linkSchema = z.object({
  rotulo: z.string().min(1),
  url: z.url(),
});

const resourceLinkSchema = z.object({
  rotulo: z.string().min(1),
  url: safeResourceUrlSchema,
});

const stringListSchema = z.array(z.string().min(1)).default([]);

const anoOuDataSchema = z
  .string()
  .regex(/^\d{4}(-\d{2}-\d{2})?$/, "Use o formato AAAA ou AAAA-MM-DD");

const team = defineCollection({
  loader: glob({ pattern: "**/[^_]*.md", base: "./src/content/team" }),
  schema: z.object({
    nome: z.string().min(1),
    cargo: z.string().min(1),
    bio: z.string().min(1),
    resumoCurto: z.string().min(1).optional(),
    foto: z.string().optional(),
    tipo: z.enum([
      "Doutorado em andamento",
      "Doutorado concluído",
      "Mestrado em andamento",
      "Mestrado concluído",
      "Iniciação Científica em andamento",
      "Iniciação Científica concluída",
      "Pesquisador",
      "Colaborador",
    ]),
    dataInicio: anoOuDataSchema.optional(),
    dataTermino: anoOuDataSchema.optional(),
    afiliacao: z.string().optional(),
    credenciais: stringListSchema,
    areasAtuacao: stringListSchema,
    destaques: stringListSchema,
    email: z.string().email().optional(),
    orcid: safeHttpUrlSchema.optional(),
    ultimaRevisao: anoOuDataSchema.optional(),
    links: z.array(linkSchema).default([]),
  }),
});

const events = defineCollection({
  loader: glob({ pattern: "**/[^_]*.md", base: "./src/content/events" }),
  schema: z.object({
    titulo: z.string().min(1),
    data: z.coerce.date(),
    fim: z.coerce.date().optional(),
    local: z.string().min(1),
    descricao: z.string().min(1),
    resumoCurto: z.string().min(1).optional(),
    tipo: z.string().optional(),
    organizadores: stringListSchema,
    instituicoes: stringListSchema,
    temas: stringListSchema,
    publico: z.string().optional(),
    modo: z.enum(["Presencial", "Online", "Híbrido"]).default("Presencial"),
    ultimaRevisao: anoOuDataSchema.optional(),
    link: z.url().optional(),
    imagem: z.string().optional(),
  }),
});

const projects = defineCollection({
  loader: glob({ pattern: "**/[^_]*.md", base: "./src/content/projects" }),
  schema: z.object({
    titulo: z.string().min(1),
    resumo: z.string().min(1),
    resumoCurto: z.string().min(1).optional(),
    descricao: z.string().min(1),
    impacto: z.string().min(1),
    metodologia: z.string().min(1),
    perguntaCentral: z.string().optional(),
    metodos: stringListSchema,
    achadosPrincipais: stringListSchema,
    instituicoes: stringListSchema,
    financiamento: stringListSchema,
    populacao: z.string().optional(),
    citationSummary: z.string().optional(),
    areasTematicas: stringListSchema,
    inicio: z.string().optional(),
    area: z.string().optional(),
    ultimaRevisao: anoOuDataSchema.optional(),
    status: z.enum(["Em andamento", "Concluído", "Planejado"]).default("Em andamento"),
    imagem: z.string().optional(),
    link: z.url().optional(),
    equipe: z.array(z.string().min(1)).default([]),
    publicationKeywords: z.array(z.string().min(1)).default([]),
    fontes: z.array(resourceLinkSchema).default([]),
  }),
});

export const collections = {
  team,
  events,
  projects,
};

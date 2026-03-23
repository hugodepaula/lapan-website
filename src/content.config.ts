import { defineCollection } from "astro:content";
import { glob } from "astro/loaders";
import { z } from "astro/zod";

const linkSchema = z.object({
  rotulo: z.string().min(1),
  url: z.url(),
});

const resourceLinkSchema = z.object({
  rotulo: z.string().min(1),
  url: z.string().min(1),
});

const anoOuDataSchema = z
  .string()
  .regex(/^\d{4}(-\d{2}-\d{2})?$/, "Use o formato AAAA ou AAAA-MM-DD");

const team = defineCollection({
  loader: glob({ pattern: "**/[^_]*.md", base: "./src/content/team" }),
  schema: z.object({
    nome: z.string().min(1),
    cargo: z.string().min(1),
    bio: z.string().min(1),
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
    links: z.array(linkSchema).default([]),
  }),
});

const events = defineCollection({
  loader: glob({ pattern: "**/[^_]*.md", base: "./src/content/events" }),
  schema: z.object({
    titulo: z.string().min(1),
    data: z.coerce.date(),
    local: z.string().min(1),
    descricao: z.string().min(1),
    link: z.url().optional(),
    imagem: z.string().optional(),
  }),
});

const projects = defineCollection({
  loader: glob({ pattern: "**/[^_]*.md", base: "./src/content/projects" }),
  schema: z.object({
    titulo: z.string().min(1),
    resumo: z.string().min(1),
    descricao: z.string().min(1),
    impacto: z.string().min(1),
    metodologia: z.string().min(1),
    inicio: z.string().optional(),
    area: z.string().optional(),
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

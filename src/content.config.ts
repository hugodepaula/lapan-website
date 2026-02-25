import { defineCollection, z } from "astro:content";

const linkSchema = z.object({
  rotulo: z.string().min(1),
  url: z.string().url(),
});

const team = defineCollection({
  schema: z.object({
    nome: z.string().min(1),
    cargo: z.string().min(1),
    bio: z.string().min(1),
    foto: z.string().optional(),
    tipo: z.enum(["Mestrado", "Doutorado", "Iniciação Científica", "Pesquisador", "Colaborador"]),
    links: z.array(linkSchema).default([]),
  }),
});

const events = defineCollection({
  schema: z.object({
    titulo: z.string().min(1),
    data: z.coerce.date(),
    local: z.string().min(1),
    descricao: z.string().min(1),
    link: z.string().url().optional(),
    imagem: z.string().optional(),
  }),
});

const projects = defineCollection({
  schema: z.object({
    titulo: z.string().min(1),
    resumo: z.string().min(1),
    area: z.string().optional(),
    status: z.enum(["Em andamento", "Concluído", "Planejado"]).default("Em andamento"),
    imagem: z.string().optional(),
    link: z.string().url().optional(),
  }),
});

export const collections = {
  team,
  events,
  projects,
};

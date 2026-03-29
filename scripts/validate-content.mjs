import { promises as fs } from "node:fs";
import path from "node:path";

const cwd = process.cwd();
const currentYear = new Date().getFullYear();

const readText = async (filePath) =>
  fs.readFile(path.join(cwd, filePath), "utf8");

const listMarkdownFiles = async (dirPath) => {
  const absolutePath = path.join(cwd, dirPath);
  const entries = await fs.readdir(absolutePath, { withFileTypes: true });

  return entries
    .filter((entry) => entry.isFile() && entry.name.endsWith(".md"))
    .map((entry) => path.join(dirPath, entry.name));
};

const extractValue = (source, key) => {
  const match = source.match(new RegExp(`^${key}:\\s*(.+)$`, "m"));
  return match?.[1]?.trim() ?? "";
};

const unquote = (value) => value.replace(/^['"]|['"]$/g, "");

const errors = [];
const warnings = [];
const shortBios = [];
const projectsWithoutSources = [];
const projectsWithoutCitationSummary = [];

const teamFiles = await listMarkdownFiles("src/content/team");
for (const filePath of teamFiles) {
  const source = await readText(filePath);
  const bio = unquote(extractValue(source, "bio"));
  const start = unquote(extractValue(source, "dataInicio"));
  const end = unquote(extractValue(source, "dataTermino"));

  if (bio.length < 40) {
    shortBios.push(filePath);
  }

  for (const [label, value] of [
    ["dataInicio", start],
    ["dataTermino", end],
  ]) {
    if (!value) continue;
    const year = Number.parseInt(value.slice(0, 4), 10);
    if (Number.isNaN(year) || year < 1900 || year > currentYear + 2) {
      errors.push(`${filePath}: ${label} inválido (${value}).`);
    }
  }
}

const eventFiles = await listMarkdownFiles("src/content/events");
for (const filePath of eventFiles) {
  const source = await readText(filePath);
  const title = unquote(extractValue(source, "titulo"));
  const date = unquote(extractValue(source, "data"));
  const titleYear = title.match(/20\d{2}/)?.[0];

  if (titleYear && date && titleYear !== date.slice(0, 4)) {
    errors.push(
      `${filePath}: o ano no título (${titleYear}) não corresponde à data (${date.slice(0, 4)}).`,
    );
  }
}

const projectFiles = await listMarkdownFiles("src/content/projects");
for (const filePath of projectFiles) {
  const source = await readText(filePath);

  if (/^fontes:\s*\[\s*\]\s*$/m.test(source)) {
    projectsWithoutSources.push(filePath);
  }

  if (!/^citationSummary:/m.test(source)) {
    projectsWithoutCitationSummary.push(filePath);
  }
}

if (shortBios.length > 0) {
  warnings.push(
    `${shortBios.length} perfil(is) com biografia curta. Exemplo: ${shortBios.slice(0, 3).join(", ")}`,
  );
}

if (projectsWithoutSources.length > 0) {
  warnings.push(
    `${projectsWithoutSources.length} projeto(s) sem fontes estruturadas. Exemplo: ${projectsWithoutSources.slice(0, 3).join(", ")}`,
  );
}

if (projectsWithoutCitationSummary.length > 0) {
  warnings.push(
    `${projectsWithoutCitationSummary.length} projeto(s) sem citationSummary. Exemplo: ${projectsWithoutCitationSummary.slice(0, 3).join(", ")}`,
  );
}

if (errors.length > 0) {
  console.error("Erros de conteúdo:");
  errors.forEach((error) => console.error(`- ${error}`));
}

if (warnings.length > 0) {
  console.warn("Avisos de conteúdo:");
  warnings.forEach((warning) => console.warn(`- ${warning}`));
}

if (errors.length > 0) {
  process.exit(1);
}

console.log(
  `Validação de conteúdo concluída com ${warnings.length} aviso(s) e nenhum erro bloqueante.`,
);

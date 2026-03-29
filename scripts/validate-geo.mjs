import { promises as fs } from "node:fs";
import path from "node:path";

const cwd = process.cwd();
const distDir = path.join(cwd, "dist");

const requiredFiles = [
  "index.html",
  "contato/index.html",
  "sobre-o-laboratorio/index.html",
  "sobre-o-laboratorio/metodologia-e-evidencias/index.html",
  "equipe/ricardo-queiroz-guimaraes/index.html",
  "eventos/2024-11-07-xi-congresso-brasileiro-neurovisao/index.html",
  "projetos/bom-comeco/index.html",
  "robots.txt",
  "llms.txt",
  "sitemap-index.xml",
];

const errors = [];

for (const file of requiredFiles) {
  try {
    await fs.access(path.join(distDir, file));
  } catch {
    errors.push(`Arquivo obrigatório ausente em dist/: ${file}`);
  }
}

const htmlFiles = requiredFiles.filter((file) => file.endsWith(".html"));

for (const file of htmlFiles) {
  const absolutePath = path.join(distDir, file);
  const source = await fs.readFile(absolutePath, "utf8");

  const checks = [
    ["canonical", /<link rel="canonical" href="[^"]+"/],
    ["Open Graph title", /<meta property="og:title" content="[^"]+"/],
    ["Twitter card", /<meta name="twitter:card" content="summary_large_image"/],
    ["JSON-LD", /<script type="application\/ld\+json">/],
  ];

  for (const [label, pattern] of checks) {
    if (!pattern.test(source)) {
      errors.push(`${file}: ausência de ${label}.`);
    }
  }
}

const llmsText = await fs.readFile(path.join(distDir, "llms.txt"), "utf8");
if (!llmsText.includes("## Páginas principais")) {
  errors.push("llms.txt não contém a seção canônica de páginas principais.");
}

const robotsText = await fs.readFile(path.join(distDir, "robots.txt"), "utf8");
if (!robotsText.includes("Sitemap:")) {
  errors.push("robots.txt não referencia sitemap.");
}

if (errors.length > 0) {
  console.error("Falhas de validação GEO:");
  errors.forEach((error) => console.error(`- ${error}`));
  process.exit(1);
}

console.log("Validação GEO concluída com sucesso.");

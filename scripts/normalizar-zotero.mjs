import fs from "node:fs/promises";

const entrada = process.argv[2] ?? "content/zotero.json";
const saida = process.argv[3] ?? "content/zotero.json";

const extrairTexto = (valor) => {
  if (typeof valor !== "string") return undefined;
  const limpo = valor.trim();
  return limpo.length > 0 ? limpo : undefined;
};

const extrairAno = (valor) => {
  const texto = extrairTexto(valor);
  if (!texto) return undefined;
  const match = texto.match(/\b(19|20)\d{2}\b/);
  return match ? Number(match[0]) : undefined;
};

const normalizarDoi = (doi, url) => {
  const bruto = extrairTexto(doi) ?? extrairTexto(url);
  if (!bruto) return undefined;
  const semPrefixo = bruto.replace(/^https?:\/\/(dx\.)?doi\.org\//i, "").replace(/^doi:\s*/i, "").trim();
  return semPrefixo.includes("/") ? semPrefixo : undefined;
};

const normalizarUrl = (valor) => {
  const texto = extrairTexto(valor);
  if (!texto) return undefined;
  try {
    return new URL(texto).toString();
  } catch {
    return undefined;
  }
};

const main = async () => {
  const bruto = await fs.readFile(entrada, "utf8");
  const itens = JSON.parse(bruto);

  if (!Array.isArray(itens)) {
    throw new Error("Formato inválido: esperado um array JSON.");
  }

  const problemas = [];
  const normalizados = itens
    .map((item, indice) => {
      const titulo = extrairTexto(item?.title);
      const ano = extrairAno(item?.date);

      if (!titulo || !ano) {
        problemas.push({ indice, key: item?.key, motivo: !titulo ? "Título ausente" : "Ano inválido/ausente" });
        return null;
      }

      const doi = normalizarDoi(item?.DOI, item?.url);
      const url = normalizarUrl(item?.url);

      return {
        itemType: extrairTexto(item?.itemType) ?? "journalArticle",
        title: titulo,
        creators: Array.isArray(item?.creators) ? item.creators : [],
        date: String(ano),
        publicationTitle: extrairTexto(item?.publicationTitle) ?? "Publicações",
        ...(doi ? { DOI: doi } : {}),
        ...(url ? { url } : {}),
        key: extrairTexto(item?.key) ?? `pub-${ano}-${indice + 1}`,
      };
    })
    .filter(Boolean)
    .sort((a, b) => Number(b.date) - Number(a.date) || a.title.localeCompare(b.title, "pt-BR"));

  await fs.writeFile(saida, `${JSON.stringify(normalizados, null, 2)}\n`, "utf8");

  console.log(`Arquivo normalizado salvo em: ${saida}`);
  console.log(`Registros válidos: ${normalizados.length}`);
  console.log(`Registros ignorados: ${problemas.length}`);
};

main().catch((erro) => {
  console.error(erro.message);
  process.exit(1);
});

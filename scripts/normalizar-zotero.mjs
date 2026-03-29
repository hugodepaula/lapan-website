import fs from "node:fs/promises";

const entrada = process.argv[2] ?? "content/zotero.json";
const saida = process.argv[3] ?? "content/zotero.json";

const extrairTexto = (valor) => {
  if (typeof valor !== "string") return undefined;
  const limpo = valor.trim();
  return limpo.length > 0 ? limpo : undefined;
};

const extrairAno = (issued) => {
  const bruto = issued?.["date-parts"]?.[0]?.[0];
  const ano = typeof bruto === "string" ? parseInt(bruto, 10) : bruto;
  if (typeof ano === "number" && !isNaN(ano) && ano >= 1900 && ano <= 2100) return ano;
  return undefined;
};

const normalizarDoi = (doi) => {
  const bruto = extrairTexto(doi);
  if (!bruto) return undefined;
  const semPrefixo = bruto
    .replace(/^https?:\/\/(dx\.)?doi\.org\//i, "")
    .replace(/^doi:\s*/i, "")
    .trim();
  return semPrefixo.includes("/") ? semPrefixo : undefined;
};

const normalizarUrl = (valor) => {
  const texto = extrairTexto(valor);
  if (!texto) return undefined;
  if (texto.startsWith("/")) return texto;
  try {
    return new URL(texto).toString();
  } catch {
    return undefined;
  }
};

const normalizarAutores = (autores) => {
  if (!Array.isArray(autores)) return [];
  return autores
    .map((a) => {
      const family = extrairTexto(a?.family);
      const given = extrairTexto(a?.given);
      const literal = extrairTexto(a?.literal);
      if (literal && !family && !given) return { literal };
      if (!family && !given) return null;
      return { ...(family ? { family } : {}), ...(given ? { given } : {}) };
    })
    .filter(Boolean);
};

const normalizarIssued = (issued) => {
  if (!Array.isArray(issued?.["date-parts"])) return undefined;
  const parts = issued["date-parts"].map((part) =>
    part.map((val) => {
      const num = typeof val === "string" ? parseInt(val, 10) : val;
      return typeof num === "number" && !isNaN(num) ? num : val;
    })
  );
  return { "date-parts": parts };
};

const main = async () => {
  const bruto = await fs.readFile(entrada, "utf8");
  const itens = JSON.parse(bruto);

  if (!Array.isArray(itens)) {
    throw new Error("Formato inválido: esperado um array JSON no formato CSL.");
  }

  const problemas = [];
  const normalizados = itens
    .map((item, indice) => {
      const titulo = extrairTexto(item?.title);
      const ano = extrairAno(item?.issued);

      if (!titulo || !ano) {
        problemas.push({ indice, id: item?.id, motivo: !titulo ? "Título ausente" : "Ano inválido/ausente" });
        return null;
      }

      const doi = normalizarDoi(item?.DOI);
      const url = normalizarUrl(item?.URL);
      const autores = normalizarAutores(item?.author);
      const editores = normalizarAutores(item?.editor);
      const issued = normalizarIssued(item.issued);

      return {
        id: extrairTexto(item?.id) ?? `pub-${ano}-${indice + 1}`,
        type: extrairTexto(item?.type) ?? "article-journal",
        title: titulo,
        ...(autores.length > 0 ? { author: autores } : {}),
        ...(editores.length > 0 ? { editor: editores } : {}),
        issued: issued,
        ...(extrairTexto(item?.["container-title"]) ? { "container-title": extrairTexto(item["container-title"]) } : {}),
        ...(extrairTexto(item?.publisher) ? { publisher: extrairTexto(item.publisher) } : {}),
        ...(extrairTexto(item?.["publisher-place"]) ? { "publisher-place": extrairTexto(item["publisher-place"]) } : {}),
        ...(extrairTexto(item?.volume) ? { volume: extrairTexto(item.volume) } : {}),
        ...(extrairTexto(item?.issue) ? { issue: extrairTexto(item.issue) } : {}),
        ...(extrairTexto(item?.page) ? { page: extrairTexto(item.page) } : {}),
        ...(doi ? { DOI: doi } : {}),
        ...(url ? { URL: url } : {}),
      };
    })
    .filter(Boolean)
    .sort((a, b) => {
      const anoA = a.issued?.["date-parts"]?.[0]?.[0] ?? 0;
      const anoB = b.issued?.["date-parts"]?.[0]?.[0] ?? 0;
      return anoB - anoA || a.title.localeCompare(b.title, "pt-BR");
    });

  await fs.writeFile(saida, `${JSON.stringify(normalizados, null, 2)}\n`, "utf8");

  console.log(`Arquivo normalizado salvo em: ${saida}`);
  console.log(`Registros válidos: ${normalizados.length}`);
  console.log(`Registros ignorados: ${problemas.length}`);
};

main().catch((erro) => {
  console.error(erro.message);
  process.exit(1);
});

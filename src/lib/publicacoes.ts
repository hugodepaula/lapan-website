import CSL from "citeproc";
import abntStyle from "./csl/abnt.csl?raw";
import localePtBR from "./csl/locales-pt-BR.xml?raw";

interface CslAutor {
  family?: string;
  given?: string;
  literal?: string;
}

interface CslIssued {
  "date-parts"?: (number | string)[][];
}

interface CslItem {
  id?: string;
  type?: string;
  title?: string;
  author?: CslAutor[];
  editor?: CslAutor[];
  issued?: CslIssued;
  "container-title"?: string;
  publisher?: string;
  "publisher-place"?: string;
  volume?: string;
  issue?: string;
  page?: string;
  DOI?: string;
  URL?: string;
}

export interface PublicacaoNormalizada {
  id: string;
  titulo: string;
  autores: string[];
  ano: number;
  referenciaAbnt: string;
  doi?: string;
  doiUrl?: string;
  urlExterna?: string;
}

export interface ProblemaValidacao {
  indice: number;
  chave?: string;
  motivo: string;
}

const extrairTexto = (valor: unknown): string | undefined => {
  if (typeof valor !== "string") return undefined;
  const limpo = valor.trim();
  return limpo.length > 0 ? limpo : undefined;
};

const possuiEsquemaSeguro = (valor: string): boolean => {
  try {
    const url = new URL(valor);
    return url.protocol === "http:" || url.protocol === "https:";
  } catch {
    return false;
  }
};

const extrairAno = (issued: CslIssued | undefined): number | undefined => {
  const bruto = issued?.["date-parts"]?.[0]?.[0];
  const ano = typeof bruto === "string" ? parseInt(bruto, 10) : bruto;
  if (typeof ano === "number" && !isNaN(ano) && ano >= 1900 && ano <= 2100) return ano;
  return undefined;
};

const normalizarUrl = (valor: unknown): string | undefined => {
  const texto = extrairTexto(valor);
  if (!texto) return undefined;
  if (texto.startsWith("/")) {
    return texto;
  }
  return possuiEsquemaSeguro(texto) ? new URL(texto).toString() : undefined;
};

const normalizarIssued = (issued: CslIssued | undefined): CslIssued | undefined => {
  if (!Array.isArray(issued?.["date-parts"])) return undefined;
  const parts = issued["date-parts"].map((part) =>
    part.map((val) => {
      const num = typeof val === "string" ? parseInt(val, 10) : val;
      return typeof num === "number" && !isNaN(num) ? num : val;
    })
  );
  return { "date-parts": parts as number[][] };
};

const normalizarCriadores = (autores: CslAutor[] | undefined): string[] => {
  if (!Array.isArray(autores)) return [];
  return autores
    .map((a) => {
      const literal = extrairTexto(a?.literal);
      if (literal) return literal;
      const partes = [extrairTexto(a?.given), extrairTexto(a?.family)].filter(Boolean);
      return partes.length > 0 ? partes.join(" ") : undefined;
    })
    .filter((nome): nome is string => Boolean(nome));
};

const formatarReferenciaAbnt = (item: CslItem): string => {
  const id = extrairTexto(item.id) ?? extrairTexto(item.title) ?? "item-sem-id";
  const cslItem = { ...item, id, issued: normalizarIssued(item.issued) };

  const sys = {
    retrieveLocale: () => localePtBR,
    retrieveItem: (requestedId: string) =>
      requestedId === id ? cslItem : undefined,
  };

  try {
    const engine = new CSL.Engine(sys, abntStyle, "pt-BR");
    engine.setOutputFormat("text");
    engine.updateItems([id]);
    const bibliography = engine.makeBibliography();
    return bibliography[1][0];
  } catch {
    const titulo = extrairTexto(item.title) ?? "Referência sem título";
    const ano = extrairAno(item.issued);
    return `${titulo}${ano ? `. ${ano}.` : "."}`;
  }
};

export const normalizarPublicacoes = (
  dados: unknown
): { publicacoes: PublicacaoNormalizada[]; problemas: ProblemaValidacao[] } => {
  if (!Array.isArray(dados)) {
    return {
      publicacoes: [],
      problemas: [{ indice: -1, motivo: "Formato inválido: esperado array de publicações." }],
    };
  }

  const problemas: ProblemaValidacao[] = [];
  const chaves = new Set<string>();

  const publicacoes = dados
    .map((item, indice) => {
      const atual = (item ?? {}) as CslItem;
      const titulo = extrairTexto(atual.title);
      const ano = extrairAno(atual.issued);

      if (!titulo) {
        problemas.push({ indice, chave: atual.id, motivo: "Título ausente." });
        return null;
      }

      if (!ano) {
        problemas.push({ indice, chave: atual.id, motivo: "Ano inválido ou ausente." });
        return null;
      }

      const doi = extrairTexto(atual.DOI);
      const doiUrl = doi ? `https://doi.org/${encodeURIComponent(doi)}` : undefined;
      const urlOriginal = normalizarUrl(atual.URL);
      const urlExterna = urlOriginal && urlOriginal !== doiUrl ? urlOriginal : undefined;
      const baseId = extrairTexto(atual.id) ?? `${ano}-${titulo.toLowerCase().slice(0, 60)}`;
      const id = chaves.has(baseId) ? `${baseId}-${indice}` : baseId;
      chaves.add(id);

      return {
        id,
        titulo,
        autores: normalizarCriadores(atual.author),
        ano,
        referenciaAbnt: formatarReferenciaAbnt(atual),
        doi,
        doiUrl,
        urlExterna,
      } as PublicacaoNormalizada;
    })
    .filter((item): item is PublicacaoNormalizada => Boolean(item))
    .sort((a, b) => {
      if (a.ano !== b.ano) return b.ano - a.ano;
      return a.titulo.localeCompare(b.titulo, "pt-BR");
    });

  return { publicacoes, problemas };
};

export const agruparPublicacoesPorAno = (publicacoes: PublicacaoNormalizada[]) => {
  const grupos = new Map<number, PublicacaoNormalizada[]>();

  for (const publicacao of publicacoes) {
    const atual = grupos.get(publicacao.ano) ?? [];
    atual.push(publicacao);
    grupos.set(publicacao.ano, atual);
  }

  return [...grupos.entries()].sort((a, b) => b[0] - a[0]);
};

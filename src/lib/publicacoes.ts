import CSL from "citeproc";
import abntStyle from "./csl/abnt.csl?raw";
import localePtBR from "./csl/locales-pt-BR.xml?raw";

interface PublicacaoBruta {
  key?: string;
  title?: string;
  date?: string;
  DOI?: string;
  url?: string;
  itemType?: string;
  creators?: unknown;
  publicationTitle?: string;
  publisher?: string;
  place?: string;
  volume?: string;
  issue?: string;
  pages?: string;
}

interface CriadorBruto {
  firstName?: unknown;
  lastName?: unknown;
  name?: unknown;
  creatorType?: unknown;
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

const extrairAno = (valor: unknown): number | undefined => {
  const texto = extrairTexto(valor);
  if (!texto) return undefined;
  const match = texto.match(/\b(19|20)\d{2}\b/);
  return match ? Number(match[0]) : undefined;
};

const normalizarDoi = (doi: unknown, url: unknown): string | undefined => {
  const bruto = extrairTexto(doi) ?? extrairTexto(url);
  if (!bruto) return undefined;

  const semPrefixo = bruto
    .replace(/^https?:\/\/(dx\.)?doi\.org\//i, "")
    .replace(/^doi:\s*/i, "")
    .trim();

  if (!semPrefixo.includes("/")) return undefined;
  return semPrefixo;
};

const normalizarUrl = (valor: unknown): string | undefined => {
  const texto = extrairTexto(valor);
  if (!texto) return undefined;
  if (texto.startsWith("/")) {
    return texto;
  }
  try {
    return new URL(texto).toString();
  } catch {
    return undefined;
  }
};

const normalizarCriadores = (valor: unknown): string[] => {
  if (!Array.isArray(valor)) return [];

  return valor
    .map((item) => {
      const atual = (item ?? {}) as CriadorBruto;
      const nomeCompleto =
        extrairTexto(atual.name) ??
        [extrairTexto(atual.firstName), extrairTexto(atual.lastName)]
          .filter(Boolean)
          .join(" ");

      const creatorType = extrairTexto(atual.creatorType);
      if (creatorType && creatorType !== "author") return undefined;
      if (!nomeCompleto || nomeCompleto === "Autor não identificado") return undefined;

      return nomeCompleto;
    })
    .filter((autor): autor is string => Boolean(autor));
};

const mapearTipoCsl = (itemType: string | undefined) => {
  const mapa: Record<string, string> = {
    journalArticle: "article-journal",
    bookSection: "chapter",
    thesis: "thesis",
    book: "book",
  };

  return mapa[itemType ?? ""] ?? "article";
};

const extrairDataCsl = (valor: unknown) => {
  const texto = extrairTexto(valor);
  if (!texto) return undefined;

  const match = texto.match(/^(\d{4})(?:-(\d{2}))?(?:-(\d{2}))?/);
  if (!match) return undefined;

  const partes = [
    Number(match[1]),
    match[2] ? Number(match[2]) : undefined,
    match[3] ? Number(match[3]) : undefined,
  ].filter((parte): parte is number => typeof parte === "number");

  return { "date-parts": [partes] };
};

const mapearCriadoresCsl = (valor: unknown, tipo: string) => {
  if (!Array.isArray(valor)) return [];

  return valor
    .filter((item) => {
      const atual = (item ?? {}) as CriadorBruto;
      return extrairTexto(atual.creatorType) === tipo;
    })
    .map((item) => {
      const atual = (item ?? {}) as CriadorBruto;
      const family = extrairTexto(atual.lastName);
      const given = extrairTexto(atual.firstName);
      const literal = extrairTexto(atual.name);

      if (literal && !family && !given) {
        return { literal };
      }

      if (!family && !given) return null;
      if (family === "Autor não identificado") return null;

      return {
        family,
        given,
      };
    })
    .filter(Boolean);
};

const formatarReferenciaAbnt = (item: PublicacaoBruta): string => {
  const id = extrairTexto(item.key) ?? extrairTexto(item.title) ?? "item-sem-id";
  const cslItem = {
    id,
    type: mapearTipoCsl(item.itemType),
    title: extrairTexto(item.title),
    author: mapearCriadoresCsl(item.creators, "author"),
    editor: mapearCriadoresCsl(item.creators, "editor"),
    issued: extrairDataCsl(item.date),
    "container-title": extrairTexto(item.publicationTitle),
    publisher: extrairTexto(item.publisher),
    "publisher-place": extrairTexto(item.place),
    volume: extrairTexto(item.volume),
    issue: extrairTexto(item.issue),
    page: extrairTexto(item.pages),
    DOI: extrairTexto(item.DOI),
    URL: normalizarUrl(item.url),
  };

  const sys = {
    retrieveLocale: () => localePtBR,
    retrieveItem: (requestedId: string) =>
      requestedId === id ? cslItem : undefined,
  };

  try {
    const engine = new CSL.Engine(sys, abntStyle, "pt-BR");
    engine.setOutputFormat("html");
    engine.updateItems([id]);
    const bibliography = engine.makeBibliography();
    return bibliography[1][0];
  } catch {
    const titulo = extrairTexto(item.title) ?? "Referência sem título";
    const ano = extrairAno(item.date);
    return `<div class="csl-entry">${titulo}${ano ? `. ${ano}.` : "."}</div>`;
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
      const atual = (item ?? {}) as PublicacaoBruta;
      const titulo = extrairTexto(atual.title);
      const ano = extrairAno(atual.date);

      if (!titulo) {
        problemas.push({ indice, chave: atual.key, motivo: "Título ausente." });
        return null;
      }

      if (!ano) {
        problemas.push({ indice, chave: atual.key, motivo: "Ano inválido ou ausente." });
        return null;
      }

      const doi = normalizarDoi(atual.DOI, atual.url);
      const doiUrl = doi ? `https://doi.org/${doi}` : undefined;
      const urlOriginal = normalizarUrl(atual.url);
      const urlExterna = urlOriginal && urlOriginal !== doiUrl ? urlOriginal : undefined;
      const baseId = extrairTexto(atual.key) ?? `${ano}-${titulo.toLowerCase().slice(0, 60)}`;
      const id = chaves.has(baseId) ? `${baseId}-${indice}` : baseId;
      chaves.add(id);

      return {
        id,
        titulo,
        autores: normalizarCriadores(atual.creators),
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

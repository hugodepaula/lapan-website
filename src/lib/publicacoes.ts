interface PublicacaoBruta {
  key?: string;
  title?: string;
  date?: string;
  DOI?: string;
  url?: string;
  itemType?: string;
}

export interface PublicacaoNormalizada {
  id: string;
  titulo: string;
  ano: number;
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
  try {
    return new URL(texto).toString();
  } catch {
    return undefined;
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
        ano,
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

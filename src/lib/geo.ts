import {
  address,
  contactEmail,
  contactPhone,
  defaultSocialImage,
  fallbackSiteUrl,
  foundingOrganizations,
  organizationKeywords,
  organizationLogo,
  siteDescription,
  siteName,
  siteShortName,
  socialProfiles,
} from "./site";

export interface BreadcrumbItem {
  name: string;
  item?: string;
}

export type StructuredData = Record<string, unknown>;

const breadcrumbLabels: Record<string, string> = {
  contato: "Contato",
  equipe: "Equipe",
  eventos: "Eventos",
  parceiros: "Parceiros",
  pesquisa: "Pesquisa",
  "linhas-de-pesquisa": "Linhas de pesquisa",
  metodologias: "Metodologias",
  "perguntas-frequentes": "Perguntas frequentes",
  projetos: "Projetos",
  concluidos: "Concluídos",
  "em-andamento": "Em andamento",
  publicacoes: "Publicações",
  "sobre-o-laboratorio": "Sobre o Laboratório",
  "historia-e-fundadores": "História e fundadores",
  "infraestrutura-e-equipamentos": "Infraestrutura e equipamentos",
  "missao-e-valores": "Missão e valores",
  "metodologia-e-evidencias": "Metodologia e evidências",
  "politica-editorial": "Política editorial",
  "politica-de-privacidade": "Política de privacidade",
  "politica-de-atualizacao-e-correcoes": "Política de atualização e correções",
};

export const removeHtml = (value: string) =>
  value.replace(/<[^>]+>/g, " ").replace(/\s+/g, " ").trim();

export const summarizeText = (value: string, maxLength = 180) => {
  const clean = removeHtml(value);
  if (clean.length <= maxLength) return clean;

  const sliced = clean.slice(0, maxLength);
  const lastSpace = sliced.lastIndexOf(" ");
  return `${sliced.slice(0, lastSpace > 0 ? lastSpace : maxLength).trim()}...`;
};

export const stripTrailingSlash = (value: string) => {
  if (value === "/") return value;
  return value.replace(/\/+$/, "");
};

export const ensureCanonicalPath = (pathname: string) => {
  if (!pathname || pathname === "/") return "/";
  if (pathname.endsWith("/")) return pathname;
  return `${pathname}/`;
};

export const getBaseUrl = (site?: URL | string | undefined) =>
  new URL(site?.toString() ?? fallbackSiteUrl);

export const buildAbsoluteUrl = (pathname: string, site?: URL | string) =>
  new URL(ensureCanonicalPath(pathname), getBaseUrl(site)).toString();

export const buildAssetUrl = (pathname: string, site?: URL | string) =>
  new URL(pathname, getBaseUrl(site)).toString();

export const normalizeStructuredData = (
  value?: StructuredData | StructuredData[],
) => {
  if (!value) return [];
  return Array.isArray(value) ? value : [value];
};

export const buildDefaultBreadcrumbs = (pathname: string): BreadcrumbItem[] => {
  const normalizedPath = stripTrailingSlash(pathname);
  if (normalizedPath === "/" || normalizedPath.length === 0) {
    return [{ name: "Início", item: "/" }];
  }

  const segments = normalizedPath.split("/").filter(Boolean);
  const breadcrumbs: BreadcrumbItem[] = [{ name: "Início", item: "/" }];

  segments.forEach((segment, index) => {
    const currentPath = `/${segments.slice(0, index + 1).join("/")}/`;
    breadcrumbs.push({
      name: breadcrumbLabels[segment] ?? segment.replace(/-/g, " "),
      item: currentPath,
    });
  });

  return breadcrumbs;
};

export const buildWebSiteSchema = (site?: URL | string): StructuredData => ({
  "@context": "https://schema.org",
  "@type": "WebSite",
  "@id": `${getBaseUrl(site).toString()}#website`,
  url: getBaseUrl(site).toString(),
  name: siteName,
  alternateName: siteShortName,
  description: siteDescription,
  inLanguage: "pt-BR",
  keywords: organizationKeywords,
  publisher: {
    "@id": `${getBaseUrl(site).toString()}#organization`,
  },
});

export const buildOrganizationSchema = (
  site?: URL | string,
): StructuredData => ({
  "@context": "https://schema.org",
  "@type": "ResearchOrganization",
  "@id": `${getBaseUrl(site).toString()}#organization`,
  name: siteName,
  alternateName: siteShortName,
  url: getBaseUrl(site).toString(),
  description: siteDescription,
  foundingDate: "2009",
  email: contactEmail,
  telephone: contactPhone,
  logo: {
    "@type": "ImageObject",
    url: buildAssetUrl(organizationLogo, site),
  },
  image: buildAssetUrl(defaultSocialImage, site),
  address: {
    "@type": "PostalAddress",
    ...address,
  },
  sameAs: Object.values(socialProfiles).filter(Boolean),
  keywords: organizationKeywords,
  parentOrganization: foundingOrganizations.map((organization) => ({
    "@type": "Organization",
    name: organization.name,
    url: organization.url,
  })),
  contactPoint: [
    {
      "@type": "ContactPoint",
      contactType: "Contato institucional",
      email: contactEmail,
      telephone: contactPhone,
      availableLanguage: ["pt-BR"],
      areaServed: "BR",
    },
  ],
});

export const buildBreadcrumbSchema = (
  breadcrumbs: BreadcrumbItem[],
  site?: URL | string,
): StructuredData | null => {
  if (breadcrumbs.length === 0) return null;

  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: breadcrumbs.map((breadcrumb, index) => ({
      "@type": "ListItem",
      position: index + 1,
      name: breadcrumb.name,
      item: breadcrumb.item
        ? buildAbsoluteUrl(breadcrumb.item, site)
        : undefined,
    })),
  };
};

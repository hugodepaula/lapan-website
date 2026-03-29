export const fallbackSiteUrl = "https://lapan.com.br";

export const siteName =
  "Laboratório de Pesquisa Aplicação à Neurociências da Visão (LAPAN)";
export const siteShortName = "LAPAN";
export const siteDescription =
  "Laboratório acadêmico dedicado à pesquisa aplicada em neurociências da visão, com foco em leitura, aprendizagem, avaliação funcional e inovação em saúde.";

export const contactEmail =
  import.meta.env.PUBLIC_CONTACT_EMAIL ?? "lapan.hugodepaula@gmail.com";
export const contactPhone = "+55 31 3289-2035";
export const socialProfiles = {
  linkedin:
    "https://www.linkedin.com/company/lapan-neurociencias-da-visao/",
  instagram: import.meta.env.PUBLIC_INSTAGRAM_URL ?? "",
};

export const address = {
  streetAddress: "Rua da Paisagem, 220 - Vila da Serra",
  addressLocality: "Belo Horizonte",
  addressRegion: "MG",
  postalCode: "30720-600",
  addressCountry: "BR",
};

export const organizationKeywords = [
  "neurociências da visão",
  "neurovisão",
  "leitura e aprendizagem",
  "triagem visual",
  "pesquisa aplicada",
  "saúde visual",
];

export const foundingOrganizations = [
  {
    name: "Universidade Federal de Minas Gerais (UFMG)",
    url: "https://ufmg.br/",
  },
  {
    name: "Hospital de Olhos Dr. Ricardo Guimarães (HOlhos)",
    url: "https://holhos.com.br/",
  },
  {
    name: "Labbio - Escola de Engenharia da UFMG",
    url: "https://www.ufmg.br/",
  },
];

export const defaultSocialImage = "/images/logo_rect.png";
export const organizationLogo = "/images/logo_rect.png";

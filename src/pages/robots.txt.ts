import type { APIRoute } from "astro";
import { getBaseUrl } from "../lib/geo";
import { fallbackSiteUrl } from "../lib/site";

export const GET: APIRoute = ({ site }) => {
  const baseUrl = getBaseUrl(site ?? fallbackSiteUrl);
  const content = [
    "User-agent: *",
    "Allow: /",
    "",
    `Sitemap: ${new URL("/sitemap-index.xml", baseUrl).toString()}`,
    `# LLM context: ${new URL("/llms.txt", baseUrl).toString()}`,
  ].join("\n");

  return new Response(content, {
    headers: {
      "Content-Type": "text/plain; charset=utf-8",
    },
  });
};

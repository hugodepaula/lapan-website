import fs from "node:fs/promises";
import path from "node:path";

const PDFS_ORIGEM = "_migration/zotero";
const PDFS_DESTINO = "public/docs/publicacoes";
const ZOTERO_JSON = "content/zotero.json";

// Função para normalizar strings para comparação
const normalizar = (str) => 
  str.toLowerCase()
     .normalize("NFD")
     .replace(/[\u0300-\u036f]/g, "")
     .replace(/[^a-z0-9]/g, "");

async function main() {
  const itens = JSON.parse(await fs.readFile(ZOTERO_JSON, "utf8"));
  const arquivos = await fs.readdir(PDFS_ORIGEM);
  const pdfs = arquivos.filter(f => f.toLowerCase().endsWith(".pdf"));

  console.log(`Encontrados ${pdfs.length} PDFs e ${itens.length} publicações.`);

  let vinculados = 0;

  for (const pdf of pdfs) {
    // Tenta encontrar a publicação correspondente
    // O nome do PDF é geralmente "Autor - Ano - Título.pdf" ou "Autor - Título.pdf"
    const nomeSemExt = pdf.replace(/\.pdf$/i, "");
    const partes = nomeSemExt.split(" - ");
    
    // Pega a última parte (título) para comparação mais forte
    const tituloPdf = partes[partes.length - 1];
    const tituloPdfNorm = normalizar(tituloPdf);

    const itemCorrespondente = itens.find(item => {
      const tituloItemNorm = normalizar(item.title || "");
      // Verifica se o título do PDF está contido no título do item ou vice-versa
      return tituloItemNorm.includes(tituloPdfNorm) || tituloPdfNorm.includes(tituloItemNorm);
    });

    if (itemCorrespondente) {
      const novoNome = `${itemCorrespondente.id}.pdf`;
      const origem = path.join(PDFS_ORIGEM, pdf);
      const destino = path.join(PDFS_DESTINO, novoNome);

      await fs.copyFile(origem, destino);
      
      // Atualiza o item no JSON para incluir o link do PDF
      // Se já tiver uma URL que não é PDF, podemos manter o PDF como prioridade ou adicionar um campo novo
      // A interface atual usa publicacao.urlExterna que vem de item.URL
      // Vou atualizar o item.URL se ele não existir ou se for apenas uma URL externa
      itemCorrespondente.URL = `/docs/publicacoes/${novoNome}`;
      
      vinculados++;
      console.log(`[VINCULADO] ${pdf} -> ${novoNome}`);
    } else {
      console.log(`[AVISO] Não foi possível vincular: ${pdf}`);
    }
  }

  await fs.writeFile(ZOTERO_JSON, JSON.stringify(itens, null, 2) + "\n");
  console.log(`\nProcesso concluído: ${vinculados} PDFs vinculados.`);
}

main().catch(console.error);

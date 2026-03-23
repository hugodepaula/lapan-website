#!/bin/bash
# lapan-deploy.sh - Script para deploy com zero-downtime de site estático
# Configure para executar no contab: */5 * * * * /caminho/para/lapan-deploy.sh >> /var/log/lapan-deploy.log 2>&1

set -e # Aborta a execução em caso de erros

# --- Configurações da Hospedagem ---
BASE_DIR="/var/www/lapan-website"
REPO_DIR="${BASE_DIR}/repo"
RELEASES_DIR="${BASE_DIR}/releases"
CURRENT_LINK="${BASE_DIR}/current"
BRANCH="main"
RETAINTED_RELEASES=5 # Quantos backups de código manter em disco

# 1. Configurar diretórios se não existirem
mkdir -p "$RELEASES_DIR"
if [ ! -d "$REPO_DIR" ]; then
  # Se o repo local ainda não existe no servidor alvo, oriente o administrador.
  echo "ERRO: Diretório $REPO_DIR não existe. Faça um git clone no servidor antes usando a conta adequada."
  exit 1
fi

cd "$REPO_DIR"

# 2. Verificar se há atualizações no remoto (sem sobrescrever a árvore)
git fetch origin
LOCAL=$(git rev-parse HEAD)
REMOTE=$(git rev-parse origin/${BRANCH})

if [ "$LOCAL" == "$REMOTE" ]; then
  # Nenhuma novidade no servidor, finaliza silenciosamente (poupa recursos do Cron).
  exit 0
fi

echo "[$(date)] Atualização nova detectada! Procedendo com deploy de $LOCAL para $REMOTE."

# 3. Baixar alteracoes hard pro rep local do servidor (Aconselhamos deploy via branch de main protegida).
git reset --hard origin/${BRANCH}

# 4. Compilar estático (Build do Astro/NPM)
echo "Instalando módulos dependentes..."
# Se os paths do NVM estiverem difíceis via cron, voce pode dar source bash_profile aqui
npm install

echo "Compilando framework para JS/HTML estático puro..."
npm run build

# 5. Organizar e Persistir o pacote de produção
RELEASE_FOLDER_NAME="$(date +%Y%m%d_%H%M%S)_${REMOTE:0:7}"
NEW_RELEASE_PATH="${RELEASES_DIR}/${RELEASE_FOLDER_NAME}"

# Deslocar os assets gerados na pasta padrão Astro ('dist') direto para a arca se segurança 
cp -R dist/ "$NEW_RELEASE_PATH"

# 6. Troca em tempo real da visualização pública
ln -sfn "$NEW_RELEASE_PATH" "$CURRENT_LINK"
echo "Deploy atômico para versão de destino $RELEASE_FOLDER_NAME finalizado com glória."

# 7. Coleta de lixo automático
echo "Iniciando rotação de arquivamentos mantendo histórico para N=${RETAINTED_RELEASES}..."
cd "$RELEASES_DIR"
ls -1tr | head -n -${RETAINTED_RELEASES} | xargs -d '\n' rm -rf -- || true

echo "Sucesso!"

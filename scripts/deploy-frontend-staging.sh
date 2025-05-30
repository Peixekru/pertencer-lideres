#!/bin/bash
set -e

VPS_IP="159.203.185.226"
REMOTE_DIR="/root/staging/frontend/dist"
LOCAL_DIR="./frontend"

echo "🛠️ Iniciando build do frontend..."

cd $LOCAL_DIR
npm run build

echo "📦 Preparando envio do frontend (dist) para VPS..."

# Pergunta ao usuário se deseja fazer uma simulação (dry-run)
read -p "Deseja executar um dry-run (simular envio)? [Y/N]: " CONFIRM

# Define a flag --dry-run se o usuário quiser simular
DRY_RUN=""
if [[ "$CONFIRM" == "y" || "$CONFIRM" == "Y" ]]; then
  DRY_RUN="--dry-run"
  echo "Executando em modo simulação (dry-run)..."
fi

# Executa o rsync com ou sem dry-run
rsync -avz $DRY_RUN \
  --delete \
  dist/ root@$VPS_IP:$REMOTE_DIR/

# Só notifica se não for dry-run
if [[ -z "$DRY_RUN" ]]; then
  echo "🚀 Frontend atualizado em $REMOTE_DIR"
else
  echo "Simulação concluída. Nenhum arquivo foi enviado."
fi

# Permissão -> chmod +x deploy-frontend-staging.sh
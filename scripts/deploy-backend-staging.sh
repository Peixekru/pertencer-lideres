#!/bin/bash
set -e

VPS_IP="159.203.185.226"
REMOTE_DIR="/root/staging/backend"

echo "📦 Preparando envio do backend para VPS..."

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
  --exclude 'node_modules' \
  --exclude 'uploads' \
  --exclude 'tools' \
  --exclude '_' \
  --exclude '.env.*' \
  --exclude '.git' \
  --exclude '.gitignore' \
  --exclude 'requests.rest' \
  --exclude '.DS_Store' \
  ./backend/ root@$VPS_IP:$REMOTE_DIR/

# Só reinicia se não for dry-run
if [[ -z "$DRY_RUN" ]]; then
  echo "🚀 Reiniciando processo no PM2..."
  ssh root@$VPS_IP "cd $REMOTE_DIR && pm2 restart pertencer-api-staging"
  echo "Backend atualizado com sucesso!"
else
  echo "Simulação concluída. Nenhum arquivo foi enviado nem processo reiniciado."
fi

# Permissão -> chmod +x deploy-backend-staging.sh

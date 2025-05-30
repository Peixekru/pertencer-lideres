# PM2 – Gerenciamento dos Ambientes Node.js (Dev, Staging, Prod)

## 🎯 Navegar para os diretórios

```bash
cd ~/staging/backend
cd ~/staging/database
cd ~/staging/frontend
```

---

## 🚀 Iniciar servidores

### Ambiente de Desenvolvimento

```bash
pm2 start server.js --name "pertencer-api-development"
```

### Ambiente de Staging

```bash
pm2 start server.js --name "pertencer-api-staging"
```

### Ambiente de Produção

```bash
pm2 start server.js --name "pertencer-api-production"
```

---

## 🔁 Reiniciar servidores após atualizações

```bash
pm2 restart pertencer-api-development
pm2 restart pertencer-api-staging
pm2 restart pertencer-api-production
```

### Garantir que o `.env` seja recarregado:

```bash
pm2 restart pertencer-api-staging --update-env
```

---

## 📜 Visualizar logs

```bash
pm2 logs pertencer-api-development
pm2 logs pertencer-api-staging
pm2 logs pertencer-api-production
```

---

## 🛑 Parar ou remover servidores

```bash
pm2 stop pertencer-api-development
pm2 delete pertencer-api-development

pm2 stop pertencer-api-staging
pm2 delete pertencer-api-staging

pm2 stop pertencer-api-production
pm2 delete pertencer-api-production
```

---

## 💾 Persistir e restaurar processos (opcional)

### Salvar o estado atual dos processos:

```bash
pm2 save
```

### Configurar para iniciar com o sistema:

```bash
pm2 startup
```

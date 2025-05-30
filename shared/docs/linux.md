# 🐧 Linux – Comandos Essenciais para Desenvolvedores

## 📁 Navegação de Diretórios

```bash
pwd              # Mostra o caminho atual
ls               # Lista arquivos no diretório
ls -la           # Lista tudo com detalhes, incluindo ocultos
cd pasta/        # Entra na pasta
cd ..            # Sobe um nível
cd -             # Volta pro último diretório
```

---

## 🗃️ Gerenciamento de Arquivos

```bash
touch arquivo.txt        # Cria arquivo
mkdir nova-pasta         # Cria pasta
mv arq.txt pasta/        # Move/renomeia
cp arq.txt copia.txt     # Copia arquivo
rm arq.txt               # Remove arquivo
rm -rf pasta/            # Remove pasta recursivamente (⚠️ cuidado!)
```

---

## 🔍 Busca e Filtragem

```bash
grep "termo" arquivo.txt         # Busca palavra em arquivo
grep -rn "palavra" ./src         # Busca recursivamente com número de linha
find . -name "*.js"              # Busca arquivos por nome/padrão
```

---

## ⚙️ Processos e Portas

```bash
ps aux | grep node              # Verifica processos Node
lsof -i :3000                   # Verifica quem usa a porta 3000
kill -9 <PID>                   # Mata processo com ID
```

---

## 📦 Pacotes e Sistema

```bash
sudo apt update                 # Atualiza lista de pacotes (Ubuntu/Debian)
sudo apt install nome-do-pacote # Instala pacote
df -h                           # Verifica espaço em disco
top                             # Mostra uso de CPU/memória em tempo real
```

---

## 📄 Visualização e Edição de Arquivos

```bash
cat arquivo.txt                 # Exibe conteúdo
less arquivo.txt                # Exibe paginado
nano arquivo.txt                # Editor simples
vim arquivo.txt                 # Editor avançado
```

---

## 🔐 Permissões

```bash
chmod +x script.sh              # Dá permissão de execução
chown user:grupo arquivo        # Muda dono/grupo
```

---

## ⛓️ Comandos Combinados

```bash
cat app.js | grep "export" | less
```

# Logger Customizado

Este logger customizado foi criado para facilitar o registro de logs no console com suporte a diferentes formatos, como logs puros, stringificados e tabelados. Ele também oferece a flexibilidade de adicionar ícones e labels personalizados, além de uma forma de encadear chamadas.

## Instalação

1. Clone ou copie o código para o seu projeto.
2. Importe o logger onde você precisar usá-lo:

```javascript
import logger from "./path/to/logger.js";
```

## Tipos de Logs

O logger possui diferentes métodos de log para atender a vários cenários:

### Logs Padrão (Sem formatação especial)

- **info**: Para logs informativos.
- **warn**: Para avisos.
- **error**: Para erros.
- **debug**: Para logs de depuração.
- **log**: Para logs gerais.

### Logs Stringificados

Esses logs vão exibir os argumentos em formato string, usando a função `JSON.stringify()`:

- **stInfo**: Para logs informativos stringificados.
- **stWarn**: Para avisos stringificados.
- **stError**: Para erros stringificados.
- **stDebug**: Para logs de depuração stringificados.
- **stLog**: Para logs gerais stringificados.

### Logs em Tabela

Exibe os argumentos em formato de tabela no console:

- **tbInfo**: Para logs informativos em formato tabela.
- **tbWarn**: Para avisos em formato tabela.
- **tbError**: Para erros em formato tabela.
- **tbDebug**: Para logs de depuração em formato tabela.
- **tbLog**: Para logs gerais em formato tabela.

## Exemplos de Uso

### Logs Simples

```javascript
logger.inf("Este é um log informativo");
logger.war("Este é um aviso");
logger.err("Este é um erro");
logger.deb("Este é um log de depuração");
```

### Logs Stringificados

```javascript
logger.stInf({ user: "Tiago", action: "login" });
logger.stErr(new Error("Ocorreu um erro inesperado"));
```

### Logs em Tabela

```javascript
const userTable = [
  { id: 1, name: "Tiago", role: "Developer" },
  { id: 2, name: "Ana", role: "Designer" },
];

logger.tbInf(userTable);
```

## Personalização de Ícones e Labels

Você pode personalizar o ícone e o label dos logs usando os métodos `icon()` e `label()`.

### Exemplo de personalização de ícones e labels:

```javascript
logger.icon("⚡").label("ALERTA").war("Algo deu errado!");
```

Isso exibirá o log com o ícone personalizado e o label "ALERTA".

### Resetando Ícones e Labels

Após um log, os ícones e labels são resetados automaticamente, mas você pode resetá-los manualmente com os métodos `resetIcon()` e `resetLabel()`.

```javascript
logger.resetIcon().resetLabel().inf("Log com ícone e label resetados");
```

## Encadeamento de Métodos

O logger suporta encadeamento de métodos para uma utilização mais fluida:

```javascript
logger.st.icon("🔥").label("ERRO").err("Algo realmente errado aconteceu");
logger.tb.icon("📊").label("Tabela").tbInf(userTable);
```

## Função `withReset`

Para garantir que ícones e labels sejam resetados após cada log, utilizamos a função `withReset`. Isso é aplicado automaticamente em todos os logs, mas você também pode usá-la manualmente:

```javascript
logger.inf("Log com ícone e label resetados automaticamente");
```

## Conclusão

Este logger proporciona uma maneira robusta e customizável de registrar logs no console com suporte a formatação, encadeamento de métodos e personalização de ícones e labels. Ele pode ser facilmente integrado ao seu fluxo de desenvolvimento para melhorar a leitura e organização dos logs.

export default function stringifyArgs(...args) {
  // Verifica se args é um array de fato
  if (!Array.isArray(args)) {
    args = [args]; // Se não for, transforma em um array
  }

  // Processa os argumentos, tratando objetos e tipos primitivos
  const processed = args.map(arg =>
    typeof arg === 'object' && arg !== null
      ? JSON.stringify(arg, null, 2) // Formatação bonita para objetos
      : String(arg) // Transforma qualquer outro tipo para string
  );

  // Retorna os argumentos com quebras de linha no início e no fim
  return ['\n', ...processed.map(str => `\n${str}\n`), '\n'];
}

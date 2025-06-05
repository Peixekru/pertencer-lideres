// Perguntas simuladas
export const questions = [
  {
    type: 'multiple',
    text: '1. Qual é o maior desafio que você acredita enfrentar ao assumir uma posição de liderança pela primeira vez?',
    options: [
      'A) Delegar tarefas de forma eficaz.',
      'B) Gerenciar conflitos dentro da equipe.',
      'C) Comunicar-se de maneira clara com todos os níveis da organização.',
      'D) Motivar e engajar sua equipe.',
    ],
  },
  {
    type: 'text',
    text: '2. Como você enxerga o papel de um líder em termos de motivar e engajar uma equipe? Quais estratégias você acredita serem mais eficazes para isso?',
  },
  {
    type: 'multiple',
    text: '3. Qual é o maior desafio que você acredita enfrentar ao assumir uma posição de liderança pela primeira vez?',
    options: [
      'A) Delegar tarefas de forma eficaz.',
      'B) Gerenciar conflitos dentro da equipe.',
      'C) Comunicar-se de maneira clara com todos os níveis da organização.',
      'D) Motivar e engajar sua equipe.',
    ],
  },
  {
    type: 'text',
    text: '4. Como você enxerga o papel de um líder em termos de motivar e engajar uma equipe? Quais estratégias você acredita serem mais eficazes para isso?',
  },
]

// Simulação de respostas do usuário
export const sampleAnswers = [
  'B) Gerenciar conflitos dentro da equipe.',
  'Acredito que ouvir a equipe e dar feedbacks frequentes são as melhores estratégias.',
  'D) Motivar e engajar sua equipe.',
  'Um líder inspira pelo exemplo. Mostrar empatia e reconhecer os esforços da equipe são fundamentais.',
]

// Função que simula retorno da IA com base nas respostas
export function getSuggestionsMock(answers) {
  console.log('IA simulada recebeu as respostas:', answers)

  return [
    {
      title: 'Unidade 01: Gestão de Conflitos',
      items: [
        { label: 'Identificar causas de conflitos recorrentes', highlight: true },
        { label: 'Estabelecer acordos em equipe' },
        { label: 'Mediação assertiva de impasses' },
      ],
    },
    {
      title: 'Unidade 02: Motivação e Engajamento',
      items: [
        { label: 'Reconhecer esforços e conquistas individuais', highlight: true },
        { label: 'Inspirar com propósito' },
        { label: 'Alinhar expectativas da equipe' },
      ],
    },
  ]
}

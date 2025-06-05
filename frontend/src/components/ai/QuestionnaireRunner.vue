<template>
  <div class="text-right">
    <IntroHeader :text="introText" />

    <div v-if="currentStep < questions.length">
      <component
        :is="currentComponent"
        :question="questions[currentStep]"
        :answer="answers[currentStep]"
        @update="handleAnswer"
      />
    </div>

    <div v-else>
      <AiSuggestions
        :suggestions="mockSuggestions"
        @close="handleFinish"
      />
    </div>
    <!-- Botão de questões -->
    <v-container class="py-0 px-6">
      <v-row
        justify="center"
        justify-sm="end"
      >
        <v-col cols="auto">
          <v-btn
            rounded
            size="small"
            class="mt-4 px-8"
            color="primary"
            @click="currentStep === questions.length ? handleFinish() : nextStep()"
            :disabled="currentStep < questions.length && !answers[currentStep]"
          >
            {{ currentStep === questions.length ? 'Finalizar' : 'Prosseguir' }}
          </v-btn>
        </v-col>
      </v-row>
    </v-container>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'
import IntroHeader from './shared/IntroHeader.vue'
import { useModalStore } from '@/store/modal'

// Componentes de pergunta
import MultipleChoice from './questions/MultipleChoice.vue'
import TextAnswer from './questions/TextAnswer.vue'

// Tela final com sugestões da IA
import AiSuggestions from './AiSuggestions.vue'

// Inicializa o modal
const modal = useModalStore()

// Estado do questionário
const currentStep = ref(0)

// Respostas do usuário
const savedAnswers = localStorage.getItem('ai_answers')
const answers = ref(savedAnswers ? JSON.parse(savedAnswers) : [])

// Define o componente baseado no tipo da pergunta
const currentComponent = computed(() => {
  const type = questions[currentStep.value]?.type
  return type === 'multiple' ? MultipleChoice : TextAnswer
})

// Função para lidar com a resposta do usuário
const handleAnswer = (value) => {
  answers.value[currentStep.value] = value
  localStorage.setItem('ai_answers', JSON.stringify(answers.value))
}

// Função para avançar para a próxima pergunta
const nextStep = () => {
  currentStep.value++
}

// Função para finalizar o questionário
const handleFinish = () => {
  localStorage.setItem('ai_questionnaire_completed', 'true')
  modal.closeModal()
}

// Textos do header
const introText = computed(() =>
  currentStep.value < questions.length
    ? 'Antes de iniciarmos sua jornada de aprendizado em sua nova carreira de liderança, preciso conhecer mais sobre você, para poder te passar algumas dicas valiosas. Vou te fazer algumas perguntas, ok?'
    : 'Após analisar suas respostas, sinalizei os temas em que você deve ter mais atenção ao longo da sua jornada. São temas em que percebi alguma oportunidade de melhoria, ou que você mesmo sinalizou como um possível gap de conhecimento. Você pode consultar esses itens no seu dashboard a qualquer momento.'
)
// Mock de perguntas
const questions = [
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
// Mock de sugestões da IA
const mockSuggestions = [
  {
    title: '01 Lorem ipsum dolor sit amet',
    items: [
      { label: 'Lorem ipsum dolor sit amet', highlight: true },
      { label: 'Lorem ipsum dolor sit amet dor sir' },
      { label: 'Lorem ipsum dolor sit amet magnum ant' },
    ],
  },
  {
    title: '02 Lorem ipsum dolor sit amet',
    items: [
      { label: 'Lorem ipsum dolor sit amet', highlight: true },
      { label: 'Lorem ipsum dolor sit amet dor sir' },
      { label: 'Lorem ipsum dolor sit amet magnum ant' },
    ],
  },
  {
    title: '03 Lorem ipsum dolor sit amet',
    items: [
      { label: 'Lorem ipsum dolor sit amet', highlight: true },
      { label: 'Lorem ipsum dolor sit amet dor sir' },
      { label: 'Lorem ipsum dolor sit amet magnum ant' },
    ],
  },
  {
    title: '04 Lorem ipsum dolor sit amet',
    items: [
      { label: 'Lorem ipsum dolor sit amet', highlight: true },
      { label: 'Lorem ipsum dolor sit amet dor sir' },
      { label: 'Lorem ipsum dolor sit amet magnum ant' },
    ],
  },
]
</script>

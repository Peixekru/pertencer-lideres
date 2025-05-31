module.exports = {
  env: {
    browser: true,
    es2021: true,
  },
  extends: ['plugin:vue/vue3-recommended', 'eslint:recommended'],
  rules: {
    'no-undef': 'off', // Para variáveis SCSS não definidas
    'vue/no-parsing-error': 'off', // Para erros de SCSS no Vue
    'vue/multi-word-component-names': 'off', // Para nomes de componentes de uma só palavra
  },
}

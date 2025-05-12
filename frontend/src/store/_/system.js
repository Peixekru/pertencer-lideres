import { defineStore } from 'pinia'


export const useSystemStore = defineStore('system', {
  state: () => ({
    //Status
    isLoged: false,

    //Theme
    isDarkMode: false,

    //Messiges
    msgVisibilty: false,
    msgText: '',
    msgColor: '',
  }),

  actions: {
    //Messiges
    globalMsg(msg, color) {
      this.msgVisibilty = true
      this.msgColor = color
      this.msgText = msg
    },
  }

})

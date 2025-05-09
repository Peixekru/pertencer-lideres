import btnSound from '@/assets/sounds/beep-01.mp3'
const btnbeep = new Audio(btnSound);

export function useBeepSound() {

  let buttons = document.querySelectorAll('button');

  buttons.forEach(button => {
    button.addEventListener('click', () => {
      btnbeep.play();
    });
  });

}
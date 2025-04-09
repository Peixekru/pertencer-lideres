import { defineStore } from 'pinia';
import { useAppStore } from './app';

import CryptoJS from 'crypto-js';

import axios from 'axios';

export const useAuthStore = defineStore('userAuth', {
    state: () => ({
        //fakeServer: import.meta.env.VITE_FAKESERVER,
        //serverUrl: 'http://www.einsteinpertencer.com.br:3000/login'
        //serverUrl: 'https://www.fideliadmin.com/pertencer'
        serverUrl: 'https://www.einsteinpertencer.com.br/pertencer'
    }),

    getters: {
        //
    },

    actions: {


        encrypt(data) {
            const encrypt = CryptoJS.AES.encrypt(data, '19041981').toString()
            return encrypt;
        },

        decrypt(data){
            const decrypt = CryptoJS.AES.decrypt(data, '19041981').toString(CryptoJS.enc.Utf8)
            return decrypt;
        },



        async useLogin(path, data) {

            const appStore = useAppStore()

            if (data.username){
                console.log('cpf criptografado', this.encrypt(data.username))
                localStorage.setItem('userName', JSON.stringify(this.encrypt(data.username))); // Persistente userName do usuário no localSorage
            }

            if (data.password){
                console.log('psw criptografado', this.encrypt(data.password))
                localStorage.setItem('psw', JSON.stringify(this.encrypt(data.password))); // Persistente psw do usuário no localSorage
            }
            

            //Nova instância para utilizar "this" no escopo do axios
            let self = this;

            //console.log(`-> Rota procuradar: ${path}`, `-> Dados enviados:`, data)

            axios.post(this.serverUrl + path, data).then(function (response) {

                console.log(' -> Resposta do servidor: ', response)

                //Login
                if (path == '/login') {

                    //console.log(response.data)
                    //console.log(response.data.id)
                    //console.log(response.data.info)
                    //console.log(response.data.email)
                    //console.log(response.data.autocomplete)


                    const data = JSON.parse(response.data.info) // Converte para objeto
                    appStore.appData = data; // Salva dados no pinia
                    localStorage.setItem('localAppData', JSON.stringify(data)); // Persistente dados no localSorage
                    localStorage.setItem('userId', JSON.stringify(response.data.id)); // Persistente id do usuário no localSorage
                    sessionStorage.setItem('loginState', true); // Persiste o estado de login no SessionStorage

                    console.log(' -> Objeto recebido do servidor no Login: ', data)

                    //Encaminha para home ou primeiro acesso     
                    if (data.firstAccess < 5 || data.firstAccess != 'finished') { self.$router.push('/welcome') }
                    else { self.$router.push('home') }

                }
                //Mudar senha
                else if (path == '/chgpsw') {
                    //console.log(response.data.result)
                    if (response.data.result == 'OK') {
                        
                        console.log(' -> Status da alteração de senha: ', response.data.result)

                        appStore.isChangedPassword = true;
                        //User Feedback
                        appStore.globalMsg('Sua senha foi alterada com sucesso! ', 'success')
                    }
                }

                //Esqueceu a senha
                else if (path == '/resetpassword') {
                    console.log(' -> Status da recuperaçãi da senha: ', response.data.result)
                    appStore.globalMsg('Se você tem um usuário no EisnteinPertencer, receberá um email com o link para Resetar sua Senha.', 'success')
                }

            }).catch(function (error) {
                //erro no envio
                console.error(error);
                appStore.globalMsg('Oops! Um erro inesperado aconteceu.', 'error')
            });


            if (path != '/chgpsw'){

                //Cápsula do tempo
                axios.post(this.serverUrl + '/loadcapsule', { "username" : data.username} ).then(async function (response) {
                    console.log('-> Cápsula info: ', response.data.info)
    
                    appStore.capsulaInfo = JSON.parse(response.data.info);
    
                    console.log('-> Cápsula info: ', appStore.capsulaInfo)
    
                    sessionStorage.setItem('userMail', response.data.email); // Persiste o e-mail no SessionStorage
                    localStorage.setItem('capsulaInfo', response.data.info); // Persiste infos da cápsula do tempo localStorage
    
                }).catch(function (error) {
                    //erro no envio
                    console.error(error);
                    appStore.globalMsg('Oops! As informações sa cápsula do tempo não foram carregadas.', 'error')
                });

            }



        }

    }

})


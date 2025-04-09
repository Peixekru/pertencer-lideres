// Utilities
import { defineStore } from 'pinia'


export const useAppStore = defineStore('app', {
    state: () => ({


        //Rotas
        currentRoute: '/',
        nexRoute: [],
        navigationStart: false,

        //Primeiro acesso
        isChangedPassword: false,
        isReadyToGo: false,
        welcomeStepCounter: 0,

        //Unidades
        currentUnidadeNumber: 0,
        currentUnidadeTitle: '',
        nextUnidadeTitle: '',
        totalItems: [],
        isUnidadeFinished: false,

        //Slider
        currentSliderNumber: 0,

        //Objetos
        currentContent: {},
        currentContentNumber: 0,
        currentObjectIndex: [],
        currentContentTitle: "",
        currentSelectedObject: 0,

        moveContent: 0,

        isLastObject: false,
        objectRating: 0,
        objectContent: '',
        isFinished: false,

        //Próximo objeto (FooterBar)
        nextContent: {},
        nextContenNumber: 0,
        nextUnidadeNumber: 0,
        nextUnidadeTitle: '',
        allFinished: false,

        //Modais
        blockScreenModal: false,
        ///
        videoModal: false,
        ///
        accessModal: false,
        ///
        capsulaModal: false,
        ///
        startModal: false,
        ///
        workplaceModal: false,
        ///
        galleryModal: false,
        ///
        isZoomImg: false,
        ///
        isImageGalleryConfirm: false,
        ///
        selectedGallery: null,
        selectedImg: null,
        imgObject: {},

        ///
        debugModal: false,
        ///


        selectedItem: 0,


        //////////////////
        //ACESSIBILIDADE//
        //////////////////

        //Ferramentas
        isDarkMode: false,

        //PERFIS//

        switchBtn0: false,
        switchBtn1: false,
        switchBtn2: false,
        switchBtn3: false,
        switchBtn4: false,
        switchBtn5: false,


        //AJUSTES//

        //Contraste
        themeName: 'light',
        contrastNumber: "0",

        //Cores
        useColorSelectNumber: "0",
        //Cursor
        cursorSelect: "0",
        //Tamanho da fonte
        fontSize: 1,
        //Espaçamento de linha
        lineSize: 1,
        //Zoom
        zoomSize: 1,

        //AJUSTES//
        leitorTexto: false,
        navTeclado: false,
        linkMarker: false,
        blockAnimation: false,
        contentFocus: false,
        contentGuid: false,


        tdah: false,




        //Tamanhos e posições da tela e do app
        isMobile: false,
        isTablet: false,
        screenHeight: 0,
        screenWidth: 0,
        appHeight: 0,
        appWidth: 0,
        appScroll: 0,

        //Capsula do tempo
        sendDate: '',
        countdown: '',
        progress: 0,
        msg: '',
        capsulaCardKey: 0,
        capsulaModalKey: 0,

        //
        capsulaInfo: {},
        //

        //Galeria de fotos
        totalUsers: 0,
        totalGlobalImgs: 0,
        galleryCardKey: 0,
        gallerySendImageKey: 0,
        galleryUserImgKey: 0,
        changeImage: false,


        //SpecialHomeComponents
        startCardKey: 0,
        workPlaceCardKey: 0,


        //Systema
        globalOverlay: false,
        logoutModal: false,
        isFloatLogoutBtn: false,

        //Global Msgs
        msgVisibilty: false,
        msgText: '',
        msgColor: '',

        isFinished: false,

        isStoryLineLoading: true
    }),

    actions: {
        //Global Msgs
        globalMsg(msg, color) {
            this.msgVisibilty = true
            this.msgColor = color
            this.msgText = msg
        },

        finishedContent(param) {
            this.isFinished = param
        },
    }

})

courses.in_app_totorial = {
  step: 0,
  content_url:
    "https://player.vimeo.com/video/885694978?h=5edeeed7c0&amp;badge=0&amp;autopause=0&amp;quality_selector=1&amp;player_id=0&amp;app_id=58479&autoplay=1",
  content_type: "vimeo",
  background_url: "uploads/app/course/1/bg.mp4",
  background_type: "video",
  avatar_lg_img_url: "uploads/app/course/1/avatar_lg.png",
  avatar_sm_img_url: "uploads/app/course/1/avatar_sm.png",
};

space_settings.settings = {
  favicon_url: "uploads/app/space/1/favicon.svg",
  login_logo_url: "uploads/app/space/1/login_logo.svg",
  login_icon_url: "uploads/app/space/1/login_icon.svg",
  login_background_color_1: "#E4E4E4",
  login_background_color_2: "#E4E4E4",
  login_background_image_url: "uploads/app/space/1/login_background_image.png",
  footer_logo_url: "uploads/app/space/1/footer_logo.svg",
};

user_course_settings.config = {
  colorThemes: {
    dark: {
      dark: true,
      colors: {
        info: "#62C9CE",
        accent: "#2B7080",
        primary: "#5BC6E8",
        surface: "#1b1b1e",
        secondary: "#004F81",
      },
    },
    light: {
      dark: false,
      colors: {
        info: "#62C9CE",
        accent: "#2B7080",
        primary: "#1B1F45",
        surface: "#F4F4F4",
        secondary: "#5BC6E8",
      },
    },
    dark_mono: {
      dark: true,
      colors: {
        info: "#616161",
        error: "#333333",
        accent: "#3c3c3c",
        primary: "#d1d1d1",
        success: "#2f2f2f",
        surface: "#212121",
        warning: "#666666",
        secondary: "#434343",
        background: "#000000",
      },
    },
    light_mono: {
      dark: false,
      colors: {
        info: "#9a9a9a",
        error: "#333333",
        accent: "#575757",
        primary: "#2f2f2f",
        success: "#2f2f2f",
        surface: "#F4F4F4",
        warning: "#666666",
        secondary: "#a3a3a3",
        background: "#bdbdbd",
      },
    },
  },
  header_icons: {
    exit_icon_url: "uploads/app/space/1/exit_icon.svg",
    info_icon_url: "uploads/app/space/1/info_icon.svg",
    access_icon_url: "uploads/app/space/1/access_icon.svg",
  },
  header_logo_url: "uploads/app/space/1/header_logo.svg",
  header_image_url: "uploads/app/space/1/header_image.png",
};

user_coures_accessibility.config = {
  lowVision: 0,
  motorImpairments: 0,
  colorBlindness: 0,
  epilepsy: 0,
  adhd: 0,
  dyslexia: 0,
  fontSize: 1,
  lineHeight: 1,
  zoomLevel: 0,
  contrast: 0,
  colorTheme: 0,
  cursorEnhancement: 0,
  textToSpeech: 0,
  keyboardNavigation: 0,
  linkHighlight: 0,
  animationBlock: 0,
  readingFocus: 0,
  readingGuide: 0,
};

(user_course_badges.config = {
  badge_1: {
    badge_icon_1_url: "uploads/app/course/1/badges/badge_icon_1.svg",
    is_done: 0,
  },
  badge_2: {
    badge_icon_2_url: "uploads/app/course/1/badges/badge_icon_2.svg",
    is_done: 0,
  },
  badge_3: {
    badge_icon_3_url: "uploads/app/course/1/badges/badge_icon_3.svg",
    is_done: 0,
  },
  badge_4: {
    badge_icon_4_url: "uploads/app/course/1/badges/badge_icon_4.svg",
    is_done: 0,
  },
}),
  (user_course_widgets.config = {
    widget_1: {
      title: "Dashboard",
      widget_icon_1_url: "uploads/app/course/1/widget/widget_icon_1.svg",
      is_enabled: 0,
    },
    widget_2: {
      title: "Tira-dúvidas",
      widget_icon_2_url: "uploads/app/course/1/widget/widget_icon_2.svg",
      is_enabled: 0,
    },
    widget_3: {
      title: "Compartilhe sua conquista!",
      widget_icon_3_url: "uploads/app/course/1/widget/widget_icon_3.svg",
      is_enabled: 0,
    },
  });

lessons.ai_review = {
  ai_interact: {
    chat_text:
      "Analisando suas respostas, percebi que você ainda pode ter alguma oportunidade de melhoria em alguns temas.",
    review_list: [
      {
        title: "01 Lesson ipsum dolor sit amet",
        url: "/user-courses/:userCourseId/courses/:courseId/lessons/:lessonId",
      },
      {
        title: "03 Lesson ipsum dolor sit amet",
        url: "/user-courses/:userCourseId/courses/:courseId/lessons/:lessonId",
      },
      {
        title: "04 Lesson ipsum dolor sit amet",
        url: "/user-courses/:userCourseId/courses/:courseId/lessons/:lessonId",
      },
      {
        title: "05 Lesson ipsum dolor sit amet",
        url: "/user-courses/:userCourseId/courses/:courseId/lessons/:lessonId",
      },
    ],
  },
};

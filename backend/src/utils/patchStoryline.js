export function patchStoryline(html) {
  const scormScript = `
<!-- MONKEY PATCHING SCORM -->
<script>
  (function () {
    const scormData = {};
    const API = {
      LMSInitialize: () => {
        console.log('[SCORM] LMSInitialize');
        return 'true';
      },
      LMSFinish: () => {
        console.log('[SCORM] LMSFinish');
        return 'true';
      },
      LMSSetValue: (key, value) => {
        console.log(\`[SCORM] LMSSetValue: \${key} = \${value}\`);
        scormData[key] = value;
        return 'true';
      },
      LMSGetValue: (key) => {
        console.log(\`[SCORM] LMSGetValue: \${key}\`);
        return scormData[key] || '';
      },
      LMSCommit: () => {
        console.log('[SCORM] LMSCommit');
        console.log('[SCORM] Dados atuais:', scormData);
        //Dispara evento para o parent (Vue app)
        window.parent.postMessage({
          type: 'SCORM_PROGRESS',
          payload: { ...scormData }
        }, '*');
        return 'true';
      },
      LMSGetLastError: () => '0',
      LMSGetErrorString: () => 'No error',
      LMSGetDiagnostic: () => 'No diagnostic',
      LMSGetError: () => '0',
    };
    window.API = API;

    window.addEventListener('message', (event) => {
      if (event.data?.type === 'SET_LESSON_ID') {
        window.currentLessonId = event.data.lessonId;
        console.log('[SCORM] lessonId recebido:', window.currentLessonId);
      }
    });
  })();
</script>
<!-- END PATCHING SCORM -->
`;
  return html.replace(
    /<meta charset="utf-8">/,
    `<meta charset="utf-8">\n${scormScript}`
  );
}

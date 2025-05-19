/**
 * Aplica dois patches no HTML do Rise:
 * 1. Substitui o bloco original do LMSProxyFuncs
 * 2. Injeta script para monitorar progresso do curso
 * 3. Adiciona timestamp para controle futuro
 */

export function patchRise(html) {
  // Substitui o LMSProxyFuncs se encontrado
  html = html.replace(
    /var LMSProxyFuncs\s*=\s*pick\([\s\S]*?Function\.prototype\s*\);?/,
    `// MONKEY PATCHING LMSPROXY
    window.LMSProxyFuncs = window.LMSProxyFuncs || {};
    var LMSProxyFuncs = {};
    LMSProxySelections.forEach(function (name) {
      LMSProxyFuncs[name] = function () {
        return null;
      };
    });
    // END PATCH`
  );

  // Patch de progresso após __loadEntry();
  const progressPatch = `
<!-- MONKEY PATCHING PROGRESS -->
<script>
  // Interceptar setCourseProgress para monitorar progresso
  const originalSetCourseProgress = window.Runtime.setCourseProgress;
  window.Runtime.setCourseProgress = function (courseProgress) {
    const progressData = window.Runtime.getProgress();
    const message = {
      type: "update",
      payload: {
        totalProgress: courseProgress,
        lessons: progressData.lessons,
      },
    };
    window.top.postMessage(message, "*");
    return originalSetCourseProgress.apply(this, arguments);
  };
</script>
<!-- END PATCHING -->`;

  // Regex mais flexível para pegar __loadEntry();

  if (html.includes("MONKEY PATCHING PROGRESS")) return html;

  html = html.replace(
    /<script>\s*__loadEntry\(\);?\s*<\/script>/i,
    `<script>__loadEntry();</script>\n\n${progressPatch}`
  );

  return html;
}

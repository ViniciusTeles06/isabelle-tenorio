
document.addEventListener("DOMContentLoaded", () => {

  const STORAGE_KEY = "isabelle_privacy_notice_v1";

  // ANO DA PÁGINA LEGAL
  document.querySelectorAll(".legal-year")
    .forEach((element) => {
      element.textContent = new Date().getFullYear();
    });

  // CONSTRUIR AVISO DE PRIVACIDADE
  const notice = document.createElement("aside");

  notice.className = "cookie-notice";
  notice.setAttribute(
    "aria-label",
    "Informações de privacidade"
  );

  notice.hidden = true;

  notice.innerHTML = `
    <div class="cookie-text">
      <strong>
        PRIVACIDADE EM CADA DETALHE
      </strong>

      <p>
        Utilizamos armazenamento local para
        registrar a visualização deste aviso.
        Nosso código não instala cookies
        de publicidade ou rastreamento.

        Consulte a
        <a href="legal.html#cookies">
          Política de Cookies
        </a>
        e a
        <a href="legal.html#privacidade">
          Política de Privacidade
        </a>.
      </p>
    </div>

    <button
      class="cookie-dismiss"
      type="button"
    >
      ENTENDI
    </button>
  `;

  document.body.appendChild(notice);

  // VERIFICAR SE O AVISO JÁ FOI LIDO
  function getNoticeStatus() {
    try {
      return localStorage.getItem(STORAGE_KEY) === "seen";
    } catch (error) {
      return false;
    }
  }

  // REGISTRAR QUE FOI VISUALIZADO
  function saveNoticeStatus() {
    try {
      localStorage.setItem(STORAGE_KEY, "seen");
    } catch (error) {
      // O navegador pode bloquear armazenamento local.
    }
  }

  // ABRIR AVISO
  function openNotice() {
    notice.hidden = false;
  }

  // FECHAR AVISO
  function closeNotice() {
    saveNoticeStatus();
    notice.hidden = true;
  }

  // PRIMEIRA VISITA
  if (!getNoticeStatus()) {
    openNotice();
  }

  // BOTÃO ENTENDI
  const dismissButton = notice.querySelector(
    ".cookie-dismiss"
  );

  if (dismissButton) {
    dismissButton.addEventListener(
      "click",
      closeNotice
    );
  }

  // BOTÃO DO RODAPÉ
  const privacySettings = document.getElementById(
    "privacy-settings"
  );

  if (privacySettings) {
    privacySettings.addEventListener(
      "click",
      openNotice
    );
  }

  // BOTÃO DA POLÍTICA DE COOKIES
  const cookieInfoButton = document.getElementById(
    "open-cookie-info"
  );

  if (cookieInfoButton) {
    cookieInfoButton.addEventListener(
      "click",
      openNotice
    );
  }

});


document.addEventListener("DOMContentLoaded", () => {
  "use strict";

  const WHATSAPP_NUMBER = "5582987505467";

  const header = document.getElementById("site-header");
  const nav = document.getElementById("main-nav");
  const toggle = document.getElementById("menu-toggle");
  const year = document.getElementById("current-year");

  const motionPreference = window.matchMedia(
    "(prefers-reduced-motion: reduce)"
  );

  const prefersReducedMotion = () => motionPreference.matches;

  // ANO DO RODAPÉ
  if (year) {
    year.textContent = new Date().getFullYear();
  }

  // CABEÇALHO FIXO
  function updateHeader() {
    if (!header) return;

    header.classList.toggle(
      "is-scrolled",
      window.scrollY > 18
    );
  }

  window.addEventListener("scroll", updateHeader, {
    passive: true
  });

  updateHeader();

  // MENU MOBILE
  function closeMenu(restoreFocus = false) {
    if (!nav || !toggle) return;

    const wasOpen = nav.classList.contains("is-open");

    nav.classList.remove("is-open");
    toggle.setAttribute("aria-expanded", "false");
    toggle.setAttribute("aria-label", "Abrir menu");
    document.body.classList.remove("menu-open");

    if (restoreFocus && wasOpen) {
      toggle.focus();
    }
  }

  if (nav && toggle) {
    toggle.addEventListener("click", () => {
      const isOpen = nav.classList.toggle("is-open");

      toggle.setAttribute(
        "aria-expanded",
        String(isOpen)
      );

      toggle.setAttribute(
        "aria-label",
        isOpen ? "Fechar menu" : "Abrir menu"
      );

      document.body.classList.toggle("menu-open", isOpen);

      if (isOpen) {
        nav.querySelector("a")?.focus();
      }
    });

    document.addEventListener("keydown", (event) => {
      if (event.key === "Escape") {
        closeMenu(true);
      }

      if (
        event.key === "Tab" &&
        nav.classList.contains("is-open") &&
        window.innerWidth <= 700
      ) {
        const links = Array.from(
          nav.querySelectorAll("a")
        );

        const first = links[0];
        const last = links[links.length - 1];

        if (event.shiftKey && document.activeElement === first) {
          event.preventDefault();
          toggle.focus();
        } else if (
          !event.shiftKey &&
          document.activeElement === last
        ) {
          event.preventDefault();
          toggle.focus();
        }
      }
    });

    document.addEventListener("pointerdown", (event) => {
      const outside =
        !nav.contains(event.target) &&
        !toggle.contains(event.target);

      if (outside) {
        closeMenu();
      }
    });

    window.addEventListener("resize", () => {
      if (window.innerWidth > 700) {
        closeMenu();
      }
    });
  }

  // NAVEGAÇÃO SUAVE SEM FRAGMENTO NA URL
  function getSamePageTarget(href) {
    try {
      const destination = new URL(href, location.href);

      const samePage =
        destination.origin === location.origin &&
        destination.pathname.replace(/\/$/, "") ===
          location.pathname.replace(/\/$/, "");

      if (!samePage || !destination.hash) {
        return null;
      }

      const id = decodeURIComponent(
        destination.hash.slice(1)
      );

      return document.getElementById(id);
    } catch {
      return null;
    }
  }

  function cleanFragment() {
    if (!location.hash) return;

    history.replaceState(
      history.state,
      "",
      location.pathname + location.search
    );
  }

  function scrollToSection(element) {
    element.scrollIntoView({
      behavior: prefersReducedMotion() ? "auto" : "smooth",
      block: "start"
    });
  }

  document.querySelectorAll('a[href*="#"]').forEach((link) => {
    link.addEventListener("click", (event) => {
      const target = getSamePageTarget(link.href);

      if (!target) {
        closeMenu();
        return;
      }

      event.preventDefault();
      closeMenu();
      scrollToSection(target);
      cleanFragment();
    });
  });

  // ROLAGEM DE QUEM VEM DA PÁGINA NOSSA HISTÓRIA
  function handleInitialFragment() {
    if (!location.hash) return;

    let target = null;

    try {
      target = document.getElementById(
        decodeURIComponent(location.hash.slice(1))
      );
    } catch {
      return;
    }

    if (!target) return;

    requestAnimationFrame(() => {
      target.scrollIntoView({
        behavior: "auto",
        block: "start"
      });

      cleanFragment();
    });
  }

  window.addEventListener("load", handleInitialFragment, {
    once: true
  });

  window.addEventListener("hashchange", () => {
    if (!location.hash) return;

    let target = null;

    try {
      target = document.getElementById(
        decodeURIComponent(location.hash.slice(1))
      );
    } catch {
      return;
    }

    if (target) {
      scrollToSection(target);
      cleanFragment();
    }
  });

  // ANIMAÇÕES DE ROLAGEM
  const revealItems = Array.from(
    document.querySelectorAll(".reveal")
  );

  if (
    !prefersReducedMotion() &&
    "IntersectionObserver" in window
  ) {
    const observer = new IntersectionObserver(
      (entries, currentObserver) => {
        entries.forEach((entry) => {
          if (!entry.isIntersecting) return;

          entry.target.classList.add("is-visible");
          currentObserver.unobserve(entry.target);
        });
      },
      {
        threshold: 0.08,
        rootMargin: "0px 0px 30px 0px"
      }
    );

    revealItems.forEach((element) => {
      const bounds = element.getBoundingClientRect();

      if (
        bounds.top > window.innerHeight * 0.95 &&
        bounds.bottom > 0
      ) {
        element.classList.add("will-reveal");
        observer.observe(element);
      }
    });
  }

  // PERGUNTAS FREQUENTES: MANTER APENAS UMA ABERTA
  const faqItems = Array.from(
    document.querySelectorAll(".faq-item")
  );

  faqItems.forEach((item) => {
    item.addEventListener("toggle", () => {
      if (!item.open) return;

      faqItems.forEach((other) => {
        if (other !== item) {
          other.open = false;
        }
      });
    });
  });

  // FORMULÁRIO
  const form = document.getElementById("custom-form");

  if (!form) return;

  const steps = Array.from(
    form.querySelectorAll(".form-step")
  );

  const nextButton = document.getElementById("form-next");
  const backButton = document.getElementById("form-back");
  const submitButton = document.getElementById("form-submit");

  const stepTitle = document.getElementById("step-title");
  const stepCounter = document.getElementById("step-counter");
  const progressFill = document.getElementById("progress-fill");

  const formStatus = document.getElementById("form-status");
  const description = document.getElementById("description");
  const charCount = document.getElementById("char-count");

  const otherField = document.getElementById(
    "other-piece-field"
  );

  const otherInput = document.getElementById("other-piece");

  const summary = document.getElementById("order-summary");

  const STEP_NAMES = [
    "01 / SUA PEÇA",
    "02 / OS DETALHES",
    "03 / FINALIZAR"
  ];

  let currentStep = 1;

  function setStatus(message) {
    if (formStatus) {
      formStatus.textContent = message;
    }
  }

  // CAMPO OUTRA PEÇA
  function updateOtherPiece() {
    if (!otherField || !otherInput) return;

    const selected = form.querySelector(
      'input[name="pieceType"]:checked'
    );

    const isOther = selected?.value === "Outra peça";

    otherField.hidden = !isOther;
    otherInput.required = isOther;

    if (!isOther) {
      otherInput.value = "";
    }
  }

  form.querySelectorAll(
    'input[name="pieceType"]'
  ).forEach((input) => {
    input.addEventListener("change", updateOtherPiece);
  });

  updateOtherPiece();

  // CONTADOR DE CARACTERES
  if (description && charCount) {
    const updateCount = () => {
      charCount.textContent = String(
        description.value.length
      );
    };

    description.addEventListener("input", updateCount);
    updateCount();
  }

  // LEITURA DOS DADOS
  function getData() {
    return new FormData(form);
  }

  function getValue(data, key) {
    return String(data.get(key) || "").trim();
  }

  function getPiece(data) {
    const selected = getValue(data, "pieceType");

    if (selected === "Outra peça") {
      return getValue(data, "otherPiece");
    }

    return selected;
  }

  // RESUMO SEM INJETAR HTML DA CLIENTE
  function addSummaryLine(label, value) {
    if (!summary) return;

    const line = document.createElement("div");
    const dt = document.createElement("dt");
    const dd = document.createElement("dd");

    dt.textContent = label;
    dd.textContent = value || "A definir";

    line.append(dt, dd);
    summary.append(line);
  }

  function updateSummary() {
    if (!summary) return;

    const data = getData();
    const details = data.getAll("details");

    summary.replaceChildren();

    addSummaryLine("Peça", getPiece(data));
    addSummaryLine("Confecção", getValue(data, "category"));
    addSummaryLine("Tamanho", getValue(data, "size"));

    if (getValue(data, "measurements")) {
      addSummaryLine(
        "Medidas",
        getValue(data, "measurements")
      );
    }

    if (details.length) {
      addSummaryLine(
        "Detalhes",
        details.join(", ")
      );
    }

    addSummaryLine("Sua ideia", getValue(data, "description"));
  }

  // CAMPOS VALIDADOS POR ETAPA
  function fieldsForStep(stepNumber) {
    const container = steps.find(
      (item) => Number(item.dataset.step) === stepNumber
    );

    if (!container) return [];

    return Array.from(
      container.querySelectorAll("input, textarea, select")
    ).filter((field) => {
      return !field.disabled && !field.closest("[hidden]");
    });
  }

  function validateStep(stepNumber) {
    const fields = fieldsForStep(stepNumber);

    for (const field of fields) {
      if (!field.checkValidity()) {
        field.reportValidity();
        field.focus();
        return false;
      }
    }

    return true;
  }

  // ETAPAS VISÍVEIS
  function showStep(number, shouldScroll = false) {
    currentStep = Math.max(1, Math.min(3, number));

    steps.forEach((step) => {
      const isActive =
        Number(step.dataset.step) === currentStep;

      step.hidden = !isActive;
      step.classList.toggle("is-active", isActive);
    });

    if (stepTitle) {
      stepTitle.textContent = STEP_NAMES[currentStep - 1];
    }

    if (stepCounter) {
      stepCounter.textContent =
        `ETAPA ${currentStep} DE 3`;
    }

    if (progressFill) {
      progressFill.style.width =
        `${(currentStep / 3) * 100}%`;
    }

    if (backButton) {
      backButton.hidden = currentStep === 1;
    }

    if (nextButton) {
      nextButton.hidden = currentStep === 3;
    }

    if (submitButton) {
      submitButton.hidden = currentStep !== 3;
    }

    if (currentStep === 3) {
      updateSummary();
    }

    setStatus("");

    if (shouldScroll) {
      const formHeading = form.querySelector(
        ".form-heading"
      );

      if (formHeading) {
        const top =
          formHeading.getBoundingClientRect().top +
          window.scrollY -
          (header?.offsetHeight || 0) -
          24;

        window.scrollTo({
          top: Math.max(0, top),
          behavior: prefersReducedMotion() ? "auto" : "smooth"
        });
      }
    }
  }

  nextButton?.addEventListener("click", () => {
    if (!validateStep(currentStep)) {
      setStatus("Confira os campos obrigatórios para continuar.");
      return;
    }

    showStep(currentStep + 1, true);
  });

  backButton?.addEventListener("click", () => {
    showStep(currentStep - 1, true);
  });

  // ESCOLHA DIRETA PELOS CARDS
  document.querySelectorAll(
    ".choose-category"
  ).forEach((button) => {
    button.addEventListener("click", () => {
      const category = button.dataset.category;

      const radio = Array.from(
        form.querySelectorAll('input[name="category"]')
      ).find((item) => item.value === category);

      if (radio) {
        radio.checked = true;
        radio.dispatchEvent(
          new Event("change", { bubbles: true })
        );
      }

      showStep(1);
      const target = document.getElementById("personalizar");

      if (target) {
        scrollToSection(target);
      }
    });
  });

  // ETAPA FINAL E WHATSAPP
  form.addEventListener("submit", (event) => {
    event.preventDefault();

    for (let step = 1; step <= 3; step++) {
      if (!validateStep(step)) {
        showStep(step, true);
        setStatus(
          "Confira os campos obrigatórios antes de continuar."
        );
        return;
      }
    }

    const privacyAcknowledged = Boolean(
      document.getElementById("privacy-ack")?.checked
    );

    if (!privacyAcknowledged) {
      showStep(3);
      document.getElementById("privacy-ack")?.focus();

      setStatus(
        "Leia as informações de privacidade para continuar."
      );
      return;
    }

    const data = getData();
    const details = data.getAll("details");

    const lines = [
      "Olá, Isabelle! Gostaria de solicitar um orçamento.",
      "",
      "*Solicitação de encomenda*",
      "",
      `Nome: ${getValue(data, "clientName")}`,
      `Peça: ${getPiece(data)}`,
      `Confecção: ${getValue(data, "category")}`,
      `Tamanho: ${getValue(data, "size")}`
    ];

    const measurements = getValue(
      data,
      "measurements"
    );

    if (measurements) {
      lines.push(`Medidas: ${measurements}`);
    }

    if (details.length) {
      lines.push(`Acabamentos: ${details.join(", ")}`);
    }

    lines.push(
      "",
      "*Minha ideia:*",
      getValue(data, "description")
    );

    const hasReference = Boolean(
      document.getElementById("has-reference")?.checked
    );

    if (hasReference) {
      lines.push(
        "",
        "Tenho fotos de referência para compartilhar."
      );
    }

    lines.push(
      "",
      "Gostaria de saber a disponibilidade, o valor e o prazo de confecção."
    );

    const message = lines.join("\n");

    const whatsappUrl =
      `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(message)}`;

    setStatus(
      "Abrindo o WhatsApp para você revisar sua solicitação."
    );

    window.location.assign(whatsappUrl);
  });

  // INICIAR A PRIMEIRA ETAPA
  showStep(1);
});

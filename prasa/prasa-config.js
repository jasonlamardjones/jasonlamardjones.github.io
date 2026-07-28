/*
 * Phase 1 configuration — SINGLE SOURCE for every brand string and every
 * user-facing string used by the pages in this folder.
 *
 * RENAME DAY RULE (relaxed in Phase 4 / Patch 1, approved): this file remains
 * the runtime source of truth — JavaScript still overrides all [data-t] text
 * from here. However, default English text (including the working brand name)
 * is now ALSO baked into the four HTML pages so they stay readable without
 * JavaScript (progressive enhancement). Renaming the project is therefore a
 * five-file edit: this file plus index.html, start.html, board.html, and
 * about.html (titles, brand link, baked strings, and About noscript blocks).
 *
 * TRANSLATION STATUS: every user-facing string carries { en, pt } fields.
 * ALL "pt" STRINGS ARE PROVISIONAL MACHINE-DRAFTED PLACEHOLDERS. They have
 * NOT been reviewed by a native speaker and must not be published as final.
 * Phase 1 renders English only; no language toggle is wired.
 */

window.PRASA_CONFIG = {

  BRAND_NAME: { en: "A Prasa", pt: "A Prasa" }, /* working placeholder, NOT final */

  TAGLINE: {
    en: "You are here. Find your next step.",
    pt: "Está aqui. Encontre o seu próximo passo."
  },

  DESCRIPTOR: {
    en: "A modern resource square for opportunity.",
    pt: "Uma praça moderna de recursos para oportunidades."
  },

  FINDER_NAME: { en: "Start Here", pt: "Comece Aqui" }, /* working label */

  STATION_LABELS: {
    guide:    { en: "Prasa Guide",    pt: "Prasa Guide" },
    works:    { en: "Prasa Works",    pt: "Prasa Works" },
    learn:    { en: "Prasa Learn",    pt: "Prasa Learn" },
    board:    { en: "Prasa Board",    pt: "Prasa Board" },
    business: { en: "Prasa Business", pt: "Prasa Business" },
    start:    { en: "Start Here",     pt: "Comece Aqui" }
  },

  /* Phase 1 station stubs: ONE plain-language promise line each, maximum. */
  STATION_PROMISES: {
    guide: {
      en: "Plain-language orientation to help you choose a realistic path.",
      pt: "Orientação em linguagem simples para escolher um caminho realista."
    },
    works: {
      en: "Practical help preparing for work: CV, skills, and next steps.",
      pt: "Ajuda prática para o trabalho: CV, competências e próximos passos."
    },
    learn: {
      en: "Starting points for courses and learning, from beginner upward.",
      pt: "Pontos de partida para cursos e aprendizagem, desde iniciante."
    },
    board: {
      en: "Current opportunities with dates and official links.",
      pt: "Oportunidades atuais com datas e ligações oficiais."
    },
    business: {
      en: "First steps for starting or improving a small business.",
      pt: "Primeiros passos para criar ou melhorar um pequeno negócio."
    },
    start: {
      en: "Tap a few options and get a suggested first step.",
      pt: "Toque em algumas opções e receba uma sugestão de primeiro passo."
    }
  },

  /* Phase 1 status per station — rendered as a small tag on stub cards. */
  STATION_STATUS: {
    coming_soon: { en: "Coming soon", pt: "Em breve" },
    open:        { en: "Open now",    pt: "Aberto agora" }
  },

  PAGE_TITLES: {
    home:  { en: "Home",               pt: "Início" },
    board: { en: "Board",              pt: "Quadro" },
    about: { en: "About & boundaries", pt: "Sobre e limites" },
    start: { en: "Finder",             pt: "Localizador" }
  },

  NAV: {
    home:  { en: "Home",               pt: "Início" },
    about: { en: "About & boundaries", pt: "Sobre e limites" },
    menu_label: { en: "Main navigation", pt: "Navegação principal" }
  },

  HOME: {
    cta: { en: "Start here", pt: "Comece aqui" },
    orientation: {
      en: "This is one square with clear paths: learn something, find work help, grow a business, or see what is open right now. Tap the option closest to your goal and take one small step.",
      pt: "Esta é uma praça com caminhos claros: aprender algo, encontrar ajuda para o trabalho, desenvolver um negócio ou ver o que está aberto agora. Toque na opção mais próxima do seu objetivo e dê um pequeno passo."
    },
    stations_title: { en: "Stations", pt: "Estações" },
    board_preview_title: { en: "On the board right now", pt: "No quadro agora" },
    board_full_link: { en: "See the full board", pt: "Ver o quadro completo" }
  },

  BOARD: {
    list_title: { en: "Posted opportunities", pt: "Oportunidades publicadas" },
    intro: {
      en: "Current opportunities, each with a date, who it is for, and an official link. Always confirm details on the provider's own page.",
      pt: "Oportunidades atuais, cada uma com data, público-alvo e uma ligação oficial. Confirme sempre os detalhes na página do próprio fornecedor."
    },
    empty_state: {
      en: "Nothing posted right now — check back soon.",
      pt: "Nada publicado neste momento — volte em breve."
    },
    load_error: {
      en: "The board could not be loaded. Please refresh the page to try again.",
      pt: "Não foi possível carregar o quadro. Atualize a página para tentar novamente."
    },
    labels: {
      deadline: { en: "Deadline / date", pt: "Prazo / data" },
      who:      { en: "Who it's for",    pt: "Para quem é" },
      posted:   { en: "Posted",          pt: "Publicado" },
      status:   { en: "Status",          pt: "Estado" },
      link:     { en: "Official link",   pt: "Ligação oficial" }
    },
    link_note: {
      en: "Opens the provider's official page in a new tab.",
      pt: "Abre a página oficial do fornecedor num novo separador."
    }
  },

  ABOUT: {
    what_is_title: { en: "What this is", pt: "O que isto é" },
    what_is_items: [
      { en: "An independent, curated square of starting points for learning, work, and business.",
        pt: "Uma praça independente e curada de pontos de partida para aprendizagem, trabalho e negócios." },
      { en: "A noticeboard of current opportunities, each linking to its official source.",
        pt: "Um quadro de oportunidades atuais, cada uma com ligação à sua fonte oficial." },
      { en: "A simple tap-only finder that suggests a realistic first step.",
        pt: "Um localizador simples, apenas por toques, que sugere um primeiro passo realista." }
    ],
    what_not_title: { en: "What this is not", pt: "O que isto não é" },
    what_not_items: [
      { en: "Not an official page of any embassy, university, government office, or listed provider.",
        pt: "Não é uma página oficial de nenhuma embaixada, universidade, serviço público ou fornecedor listado." },
      { en: "Not an application portal — applying always happens on the official provider's page.",
        pt: "Não é um portal de candidaturas — a candidatura acontece sempre na página oficial do fornecedor." },
      { en: "Not a promise of a place, a job, a certificate, a scholarship, or a visa.",
        pt: "Não é uma promessa de vaga, emprego, certificado, bolsa ou visto." }
    ],
    maintainer_title: { en: "Who maintains it", pt: "Quem mantém" },
    maintainer_body: {
      en: "[BRAND_NAME] is built and maintained by Jason L. Jones as an independent project.",
      pt: "[BRAND_NAME] é construído e mantido por Jason L. Jones como um projeto independente."
    },
    checks_title: { en: "How resources are checked", pt: "Como os recursos são verificados" },
    checks_body: {
      en: "Every posted item links to an official source page. Items are reviewed before posting and updated or removed when details change. Dates, costs, and requirements can still change at any time — always confirm final details on the official page.",
      pt: "Cada item publicado tem ligação a uma página de fonte oficial. Os itens são revistos antes da publicação e atualizados ou removidos quando os detalhes mudam. Datas, custos e requisitos podem mudar a qualquer momento — confirme sempre os detalhes finais na página oficial."
    },
    no_logos_note: {
      en: "No institutional logos are used here, and no affiliation is implied.",
      pt: "Não são usados logótipos institucionais e não é sugerida qualquer afiliação."
    }
  },

  FINDER: {
    intro: {
      en: "Answer with taps only — no typing, no account, nothing saved. You will get one suggested station and one realistic first step.",
      pt: "Responda apenas com toques — sem escrever, sem conta, nada é guardado. Receberá uma estação sugerida e um primeiro passo realista."
    },
    result_station_label: { en: "Suggested station", pt: "Estação sugerida" },
    first_step_label: { en: "Your first step", pt: "O seu primeiro passo" },
    coming_soon_tag: { en: "Coming soon", pt: "Em breve" },
    back: { en: "Back", pt: "Voltar" },
    restart: { en: "Start over", pt: "Recomeçar" },
    open_board_cta: { en: "Open the board", pt: "Abrir o quadro" },
    load_error: {
      en: "The finder could not be loaded. Please refresh the page to try again.",
      pt: "Não foi possível carregar o localizador. Atualize a página para tentar novamente."
    }
  },

  FOOTER: {
    start_cta: { en: "Start here", pt: "Comece aqui" }
  },

  /* Footer boundary note — required on every page (short form). */
  BOUNDARY_SHORT: {
    en: "[BRAND_NAME] is an independent project. It is not an official page of the U.S. Embassy, American Spaces, UniCV, or any government or listed provider. We link to official sources — always check details on the provider's own page.",
    pt: "[BRAND_NAME] é um projeto independente. Não é uma página oficial da Embaixada dos EUA, dos American Spaces, da UniCV, nem de qualquer governo ou fornecedor listado. Ligamos a fontes oficiais — confirme sempre os detalhes na página do próprio fornecedor."
  },

  /* Full boundary statement — exact required text, rendered on the About page. */
  BOUNDARY_FULL: [
    {
      heading: { en: "Who runs this?", pt: "Quem gere isto?" },
      body: {
        en: "[BRAND_NAME] is independently built and maintained by Jason L. Jones. It is not an official platform of the U.S. Embassy, American Spaces, UniCV, the Government of Cabo Verde, or any organization listed here.",
        pt: "[BRAND_NAME] é construído e mantido de forma independente por Jason L. Jones. Não é uma plataforma oficial da Embaixada dos EUA, dos American Spaces, da UniCV, do Governo de Cabo Verde, nem de qualquer organização aqui listada."
      }
    },
    {
      heading: { en: "What about the resources?", pt: "E os recursos?" },
      body: {
        en: "We curate links to real programs and providers. Being listed here does not mean a provider endorses this site — and it does not mean we can promise you a place, a job, a certificate, a scholarship, or a visa. Always confirm dates, costs, and requirements on the official page.",
        pt: "Curamos ligações para programas e fornecedores reais. Estar listado aqui não significa que um fornecedor apoie este site — e não significa que possamos prometer uma vaga, um emprego, um certificado, uma bolsa ou um visto. Confirme sempre datas, custos e requisitos na página oficial."
      }
    },
    {
      heading: { en: "Volunteer work is separate.", pt: "O trabalho voluntário é separado." },
      body: {
        en: "Jason sometimes supports approved community programming as a volunteer. That work is separate from this platform and is only presented as official when it actually is — clearly labeled, case by case.",
        pt: "O Jason por vezes apoia programação comunitária aprovada como voluntário. Esse trabalho é separado desta plataforma e só é apresentado como oficial quando realmente o é — claramente identificado, caso a caso."
      }
    },
    {
      heading: { en: "The square is an idea, for now.", pt: "A praça é uma ideia, por agora." },
      body: {
        en: "[BRAND_NAME] is inspired by the public-square idea. Any future physical presence — a table, a kiosk, an event in a real square — would only happen with the proper permissions, and we would say so clearly.",
        pt: "[BRAND_NAME] inspira-se na ideia da praça pública. Qualquer presença física futura — uma mesa, um quiosque, um evento numa praça real — só aconteceria com as devidas autorizações, e diríamos isso claramente."
      }
    }
  ]
};

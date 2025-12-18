const header = document.querySelector("header");
const sectionTop = document.querySelector(".section-top");

window.addEventListener("load", () => {
  function setupMenu({
    triggerSelector,
    menuSelector,
    closeSelector,
    activeClass = "active",
    openClass = "open",
  }) {
    const trigger = document.querySelector(triggerSelector);
    const menu = document.querySelector(menuSelector);

    if (!trigger || !menu) return;

    const closeBtn = closeSelector ? menu.querySelector(closeSelector) : null;

    const openMenu = () => {
      trigger.classList.add(activeClass);
      menu.classList.add(openClass);
    };

    const closeMenu = () => {
      trigger.classList.remove(activeClass);
      menu.classList.remove(openClass);
    };

    const toggleMenu = (e) => {
      e.stopPropagation();
      if (menu.classList.contains(openClass)) {
        closeMenu();
      } else {
        openMenu();
      }
    };

    trigger.addEventListener("click", toggleMenu, false);

    if (closeBtn) {
      closeBtn.addEventListener("click", (e) => {
        e.stopPropagation();
        closeMenu();
      });
    }

    window.addEventListener("scroll", closeMenu);

    document.addEventListener("click", (e) => {
      const target = e.target;
      const insideMenu = target.closest(menuSelector);
      const insideTrigger = target.closest(triggerSelector);

      if (!insideMenu && !insideTrigger) {
        closeMenu();
      }
    });
  }

  setupMenu({
    triggerSelector: ".header__burger",
    menuSelector: ".nav-main",
    closeSelector: ".nav-main__close",
  });

  setupMenu({
    triggerSelector: ".header__catalog",
    menuSelector: ".nav-catalog",
    closeSelector: ".nav-catalog__close",
  });

  function addPadTop(headerEl, section) {
    if (!headerEl || !section) return;
    const headerHeight = headerEl.offsetHeight;
    section.style.marginTop = `${headerHeight}px`;
  }

  if (sectionTop && header) {
    addPadTop(header, sectionTop);
  }

  function handleScroll() {
    let scroll = window.scrollY;
    if (scroll > 50) {
      header.classList.add("scroll");
    } else {
      header.classList.remove("scroll");
    }
  }

  handleScroll();

  // ====== Lenis ======

  const lenis = new Lenis({
    autoRaf: true,
  });

  window.lenis = lenis;

  // ====== Size / Multiplier ======

  function getWidthMultiplier() {
    const w = window.innerWidth;

    if (w <= 767) {
      return Math.min(window.innerWidth, window.innerHeight) / 375;
    }

    if (w <= 1024) {
      return Math.min(window.innerWidth, window.innerHeight) / 768;
    }

    return window.innerWidth / 1920;
  }

  let _multiplier = getWidthMultiplier();

  function s(value) {
    return value * _multiplier;
  }

  // ====== Swiper ======

  var categorySwiper = new Swiper(".categorySwiper", {
    slidesPerView: 1.05,
    spaceBetween: s(16),
    // autoplay: {
    //   delay: 2500,
    //   disableOnInteraction: false,
    // },
    pagination: {
      el: ".category-pagination",
      type: "progressbar",
    },
    navigation: {
      nextEl: ".category-next",
      prevEl: ".category-prev",
    },
    breakpoints: {
      768: {
        slidesPerView: 3.05,
        spaceBetween: s(16),
      },
      1025: {
        slidesPerView: 4,
        spaceBetween: s(20),
      },
    },
  });

  var aboutSwiper = new Swiper(".aboutSwiper", {
    direction: "vertical",
    slidesPerView: 2.5,
    spaceBetween: s(20),
    loop: true,
    // autoplay: {
    //   delay: 2500,
    //   disableOnInteraction: false,
    // },
    breakpoints: {
      1025: {
        spaceBetween: s(40),
      },
    },
  });

  var aboutSwiper2 = new Swiper(".aboutSwiper2", {
    spaceBetween: s(20),
    // autoplay: {
    //   delay: 2500,
    //   disableOnInteraction: false,
    // },
    navigation: {
      nextEl: ".about-next",
      prevEl: ".about-prev",
    },
    pagination: {
      el: ".about-pagination",
    },
  });

  // var projectsSwiper = new Swiper(".projectsSwiper", {
  //   navigation: {
  //     nextEl: ".projects-next",
  //     prevEl: ".projects-prev",
  //   },
  // });

  // var projectsSwiper2 = new Swiper(".projectsSwiper2", {
  //   spaceBetween: s(20),
  //   pagination: {
  //     el: ".projects-pagination",
  //     type: "progressbar",
  //   },
  //   navigation: {
  //     nextEl: ".projects-next-2",
  //     prevEl: ".projects-prev-2",
  //   },
  // });

  function initProjectsSliders(root = document) {
    root.querySelectorAll(".projectsSwiper").forEach((outerEl) => {
      if (outerEl.swiper) return;

      const panel = outerEl.closest('[id^="projects-"]') || outerEl.parentElement;
      const prev = outerEl.querySelector(".projects-prev");
      const next = outerEl.querySelector(".projects-next");

      new Swiper(outerEl, {
        navigation: { prevEl: prev, nextEl: next },
        observer: true,
        observeParents: true,
        watchSlidesProgress: true,

        on: {
          init() {
            initInnerSwipers(outerEl);
          },
          slideChangeTransitionEnd() {
            initInnerSwipers(outerEl);
          },
        },
      });
    });
  }

  function initInnerSwipers(outerEl) {
    outerEl.querySelectorAll(".projectsSwiper2").forEach((innerEl) => {
      if (innerEl.swiper) return;

      const pagination = outerEl.querySelector(".projects-pagination");
      const prev2 = outerEl.querySelector(".projects-prev-2");
      const next2 = outerEl.querySelector(".projects-next-2");

      new Swiper(innerEl, {
        spaceBetween: s(20),
        nested: true,
        watchSlidesProgress: true, 
        observer: true,
        observeParents: true,

        pagination: {
          el: pagination,
          type: "progressbar",
        },
        navigation: {
          prevEl: prev2,
          nextEl: next2,
        },
      });
    });
  }

  initProjectsSliders();

  document.querySelectorAll(".projectsSwiper, .projectsSwiper2").forEach(el => el.swiper?.update());


  // ====== Modals ======

  const modalWrapper = document.querySelector('.modals');
  if (modalWrapper) {
    const modals = Array.from(modalWrapper.querySelectorAll('.modal'));
    const body = document.body;

    const getModalByType = (type) =>
      modalWrapper.querySelector(`.modal[data-type="${type}"]`);

    const showWrapper = () => {
      modalWrapper.style.opacity = 1;
      modalWrapper.style.pointerEvents = 'all';

      if (window.lenis) {
        window.lenis.stop();
      }
    };

    const hideWrapper = () => {
      modalWrapper.style.opacity = 0;
      modalWrapper.style.pointerEvents = 'none';

      if (window.lenis) {
        window.lenis.start();
      }
    };

    const openModal = (type) => {
      modals.forEach((m) => {
        m.style.display = 'none';
        m.style.removeProperty('transform');
      });

      const modal = getModalByType(type);
      if (!modal) return;

      modal.style.display = 'block';
      showWrapper();

      if (window.gsap) {
        gsap.fromTo(
          modal,
          { y: '-100%' },
          { y: '0%', duration: 0.5, ease: 'power3.out' }
        );
      }
    };

    const closeCurrentModal = () => {
      const current = modals.find((m) => m.style.display !== 'none');

      const finishClose = () => {
        if (current) current.style.display = 'none';
        hideWrapper();
      };

      if (current && window.gsap) {
        gsap.to(current, {
          y: '-100%',
          duration: 0.4,
          ease: 'power3.in',
          onComplete: () => {
            current.style.removeProperty('transform');
            finishClose();
          },
        });
      } else {
        finishClose();
      }
    };

    document.querySelectorAll('.modal-btn').forEach((btn) => {
      btn.addEventListener('click', (e) => {
        e.preventDefault();
        const type = btn.dataset.type;
        if (type) openModal(type);
      });
    });

    modalWrapper.addEventListener('click', (e) => {
      if (e.target === modalWrapper || e.target.closest('.modal__close')) {
        closeCurrentModal();
      }
    });

    window.addEventListener('keydown', (e) => {
      if (e.key === 'Escape' && modalWrapper.style.pointerEvents === 'all') {
        closeCurrentModal();
      }
    });
  }

  // ====== Mask for phone ======

  [].forEach.call(
    document.querySelectorAll('input[type="tel"]'),
    function (input) {
      let keyCode;

      function mask(event) {
        if (event.keyCode) keyCode = event.keyCode;
        let pos = this.selectionStart;
        if (pos < 3) event.preventDefault();

        const matrix = "+7 (___) ___ ____";
        let i = 0;
        const def = matrix.replace(/\D/g, "");
        const val = this.value.replace(/\D/g, "");
        let new_value = matrix.replace(/[_\d]/g, function (a) {
          return i < val.length ? val.charAt(i++) || def.charAt(i) : a;
        });

        i = new_value.indexOf("_");
        if (i !== -1) {
          if (i < 5) i = 3;
          new_value = new_value.slice(0, i);
        }

        const reg = new RegExp(
          "^" +
            matrix
              .substring(0, this.value.length)
              .replace(/_+/g, function (a) {
                return "\\d{1," + a.length + "}";
              })
              .replace(/[+()]/g, "\\$&") +
            "$"
        );

        if (
          !reg.test(this.value) ||
          this.value.length < 5 ||
          (keyCode > 47 && keyCode < 58)
        ) {
          this.value = new_value;
        }

        if (event.type === "blur" && this.value.length < 5) {
          this.value = "";
        }
      }

      input.addEventListener("input", mask, false);
      input.addEventListener("focus", mask, false);
      input.addEventListener("blur", mask, false);
      input.addEventListener("keydown", mask, false);
    }
  );

  // ====== Resize ======

  window.addEventListener("resize", () => {
    if (sectionTop && header) {
      addPadTop(header, sectionTop);
    }
  });

  // ====== Scroll ======

  window.addEventListener('scroll', function() {
    handleScroll();
  });


  // ====== Tabby ======

  var tabs = new Tabby('[data-tabs]');
});
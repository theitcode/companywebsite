document.addEventListener('DOMContentLoaded', () => {
    const header = document.getElementById('mainHeader');
    const sections = document.querySelectorAll('section');
    const navLinks = document.querySelectorAll('.nav-link');

    const hamburger = document.getElementById('hamburger');
    const mobileSidebar = document.getElementById('mobileSidebar');
    const mobileOverlay = document.getElementById('mobileOverlay');
    const mobileClose = document.getElementById('mobileClose');
    const mobileLinks = document.querySelectorAll('.mobile-link');

    const modal = document.getElementById('confirmationModal');
    const contactForms = document.querySelectorAll('.contactForm');


    /* =====================================================
       HEADER SCROLL + ACTIVE NAVIGATION
    ===================================================== */

    function updateHeader() {
        if (header) {
            if (window.scrollY > 40) {
                header.classList.add('scrolled');
            } else {
                header.classList.remove('scrolled');
            }
        }

        let current = '';

        sections.forEach(section => {
            const sectionTop = section.offsetTop - 120;

            if (window.scrollY >= sectionTop) {
                current = section.getAttribute('id');
            }
        });

        navLinks.forEach(link => {
            link.classList.toggle(
                'active',
                link.getAttribute('href') === `#${current}`
            );
        });
    }

    window.addEventListener('scroll', updateHeader, {
        passive: true
    });

    updateHeader();


    /* =====================================================
       MOBILE FULLSCREEN NAVIGATION
    ===================================================== */

    function setSidebar(open) {

        if (!hamburger || !mobileSidebar) {
            return;
        }

        hamburger.classList.toggle('open', open);

        mobileSidebar.classList.toggle(
            'active',
            open
        );

        if (mobileOverlay) {
            mobileOverlay.classList.toggle(
                'active',
                open
            );
        }

        document.body.style.overflow =
            open ? 'hidden' : '';

        hamburger.setAttribute(
            'aria-expanded',
            String(open)
        );
    }


    /* Hamburger button */

    if (hamburger) {

        hamburger.setAttribute(
            'role',
            'button'
        );

        hamburger.setAttribute(
            'tabindex',
            '0'
        );

        hamburger.setAttribute(
            'aria-label',
            'Open navigation'
        );

        hamburger.setAttribute(
            'aria-expanded',
            'false'
        );


        hamburger.addEventListener(
            'click',
            (event) => {

                event.preventDefault();
                event.stopPropagation();

                const isOpen =
                    mobileSidebar &&
                    mobileSidebar.classList.contains(
                        'active'
                    );

                setSidebar(!isOpen);
            }
        );


        /* Keyboard accessibility */

        hamburger.addEventListener(
            'keydown',
            (event) => {

                if (
                    event.key === 'Enter' ||
                    event.key === ' '
                ) {

                    event.preventDefault();

                    const isOpen =
                        mobileSidebar &&
                        mobileSidebar.classList.contains(
                            'active'
                        );

                    setSidebar(!isOpen);
                }
            }
        );
    }


    /* X close button */

    if (mobileClose) {

        mobileClose.addEventListener(
            'click',
            () => {
                setSidebar(false);
            }
        );
    }


    /* Overlay */

    if (mobileOverlay) {

        mobileOverlay.addEventListener(
            'click',
            () => {
                setSidebar(false);
            }
        );
    }


    /* Close menu when navigation item is clicked */

    mobileLinks.forEach(link => {

        link.addEventListener(
            'click',
            () => {
                setSidebar(false);
            }
        );

    });


    /* =====================================================
       FULLSCREEN POPUP / FORM SYSTEM
    ===================================================== */

    window.openPopup = function (popupId) {

        const popup =
            document.getElementById(popupId);

        if (!popup) {
            return;
        }


        /* Close mobile menu first */

        setSidebar(false);


        /* Close other open popups */

        document
            .querySelectorAll('.popup-panel.active')
            .forEach(panel => {

                if (panel !== popup) {
                    panel.classList.remove(
                        'active'
                    );
                }

            });


        /* Open requested popup */

        popup.classList.add('active');

        document.body.style.overflow =
            'hidden';


        /*
         * Automatically focus first
         * form field after animation begins.
         */

        setTimeout(() => {

            const firstField =
                popup.querySelector(
                    'input, select, textarea'
                );

            if (firstField) {
                firstField.focus();
            }

        }, 350);
    };


    /* =====================================================
       CLOSE POPUP
    ===================================================== */

    window.closePopup = function (popupId) {

        const popup =
            document.getElementById(popupId);

        if (!popup) {
            return;
        }


        popup.classList.remove(
            'active'
        );


        /*
         * Only restore scrolling if
         * another popup isn't open.
         */

        const anotherPopupOpen =
            document.querySelector(
                '.popup-panel.active'
            );

        document.body.style.overflow =
            anotherPopupOpen
                ? 'hidden'
                : '';
    };


    /* =====================================================
       ESCAPE KEY
    ===================================================== */

    document.addEventListener(
        'keydown',
        (event) => {

            if (event.key !== 'Escape') {
                return;
            }


            /* Close popup first */

            const openPopup =
                document.querySelector(
                    '.popup-panel.active'
                );

            if (openPopup) {

                openPopup.classList.remove(
                    'active'
                );

                document.body.style.overflow =
                    '';

                return;
            }


            /* Otherwise close mobile menu */

            if (
                mobileSidebar &&
                mobileSidebar.classList.contains(
                    'active'
                )
            ) {

                setSidebar(false);
            }

        }
    );


    /* =====================================================
       FORM SUBMISSION
       Formspree / AJAX
    ===================================================== */

    contactForms.forEach(form => {

        form.addEventListener(
            'submit',
            async function (event) {

                event.preventDefault();


                const submitButton =
                    form.querySelector(
                        'button[type="submit"]'
                    );


                const originalText =
                    submitButton
                        ? submitButton.innerHTML
                        : '';


                /*
                 * Prevent multiple submissions
                 */

                if (submitButton) {

                    submitButton.disabled =
                        true;

                    submitButton.innerHTML =
                        `
                        Sending...
                        <i class="fa-solid fa-spinner fa-spin"></i>
                        `;
                }


                try {

                    const response =
                        await fetch(
                            form.action,
                            {
                                method:
                                    form.method || 'POST',

                                body:
                                    new FormData(form),

                                headers: {
                                    'Accept':
                                        'application/json'
                                }
                            }
                        );


                    if (!response.ok) {
                        throw new Error(
                            'Submission failed'
                        );
                    }


                    /*
                     * Close active popup
                     */

                    const activePopup =
                        form.closest(
                            '.popup-panel'
                        );


                    if (activePopup) {

                        closePopup(
                            activePopup.id
                        );
                    }


                    /*
                     * Reset form
                     */

                    form.reset();


                    /*
                     * Show confirmation modal
                     */

                    if (modal) {

                        modal.classList.add(
                            'active'
                        );
                    }


                } catch (error) {

                    alert(
                        'There was a problem submitting your form. Please try again.'
                    );

                } finally {

                    /*
                     * Restore button
                     */

                    if (submitButton) {

                        submitButton.disabled =
                            false;

                        submitButton.innerHTML =
                            originalText;
                    }

                }

            }
        );

    });


    /* =====================================================
       CONFIRMATION MODAL
    ===================================================== */

    window.closeConfirmationModal =
        function () {

            if (modal) {

                modal.classList.remove(
                    'active'
                );
            }
        };


    /* =====================================================
       CLOSE CONFIRMATION WITH ESCAPE
    ===================================================== */

    document.addEventListener(
        'keydown',
        (event) => {

            if (
                event.key === 'Escape' &&
                modal &&
                modal.classList.contains(
                    'active'
                )
            ) {

                modal.classList.remove(
                    'active'
                );
            }

        }
    );


    /* =====================================================
       PREVENT BACKGROUND CLICK THROUGH POPUPS
    ===================================================== */

    document
        .querySelectorAll('.popup-panel')
        .forEach(popup => {

            popup.addEventListener(
                'click',
                (event) => {

                    /*
                     * If the user clicks directly
                     * on the popup background,
                     * don't accidentally trigger
                     * anything behind it.
                     */

                    if (
                        event.target === popup
                    ) {
                        event.stopPropagation();
                    }

                }
            );

        });


    /* =====================================================
       SMOOTH INTERNAL NAVIGATION
    ===================================================== */

    document
        .querySelectorAll('a[href^="#"]')
        .forEach(link => {

            link.addEventListener(
                'click',
                function (event) {

                    const targetId =
                        this.getAttribute(
                            'href'
                        );

                    if (
                        !targetId ||
                        targetId === '#'
                    ) {
                        return;
                    }


                    const target =
                        document.querySelector(
                            targetId
                        );

                    if (!target) {
                        return;
                    }


                    event.preventDefault();


                    const headerHeight =
                        header
                            ? header.offsetHeight
                            : 0;


                    const targetPosition =
                        target.getBoundingClientRect()
                            .top +
                        window.scrollY -
                        headerHeight;


                    window.scrollTo({
                        top:
                            targetPosition,
                        behavior:
                            'smooth'
                    });


                    /*
                     * Close mobile menu
                     * after navigation.
                     */

                    setSidebar(false);
                }
            );

        });

});
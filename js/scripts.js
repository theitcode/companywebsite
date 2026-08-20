document.addEventListener('DOMContentLoaded', () => {

    /* =========================================================
       ELEMENTS
       ========================================================= */

    const header =
        document.getElementById('mainHeader');

    const sections =
        document.querySelectorAll('section');

    const navLinks =
        document.querySelectorAll('.nav-link');

    const mobileLinks =
        document.querySelectorAll('.mobile-link');

    const hamburger =
        document.getElementById('hamburger');

    const mobileSidebar =
        document.getElementById('mobileSidebar');

    const mobileOverlay =
        document.getElementById('mobileOverlay');

    const modal =
        document.getElementById('confirmationModal');

    const contactForms =
        document.querySelectorAll('.contactForm');



    /* =========================================================
       BODY SCROLL LOCK
       ========================================================= */

    function lockBody() {

        document.body.classList.add('menu-open');

        document.body.style.overflow = 'hidden';

    }


    function unlockBody() {

        const menuOpen =
            mobileSidebar &&
            mobileSidebar.classList.contains('active');

        const popupOpen =
            document.querySelector('.popup-panel.active');

        const modalOpen =
            modal &&
            modal.classList.contains('active');

        if (
            !menuOpen &&
            !popupOpen &&
            !modalOpen
        ) {

            document.body.classList.remove(
                'menu-open'
            );

            document.body.style.overflow = '';

        }

    }



    /* =========================================================
       HEADER SCROLL EFFECT
       ========================================================= */

    function updateHeader() {

        if (!header) {
            return;
        }

        if (window.scrollY > 40) {

            header.classList.add('scrolled');

        } else {

            header.classList.remove('scrolled');

        }

    }


    window.addEventListener(
        'scroll',
        updateHeader,
        {
            passive: true
        }
    );


    updateHeader();



    /* =========================================================
       ACTIVE DESKTOP NAVIGATION
       ========================================================= */

    function updateActiveNavigation() {

        if (!sections.length) {
            return;
        }

        let current =
            sections[0]?.getAttribute('id') || '';


        sections.forEach(section => {

            const sectionTop =
                section.offsetTop - 180;

            if (
                window.scrollY >= sectionTop
            ) {

                current =
                    section.getAttribute('id');

            }

        });


        navLinks.forEach(link => {

            const href =
                link.getAttribute('href');

            link.classList.toggle(
                'active',
                href === `#${current}`
            );

        });

    }


    window.addEventListener(
        'scroll',
        updateActiveNavigation,
        {
            passive: true
        }
    );


    window.addEventListener(
        'resize',
        updateActiveNavigation
    );


    updateActiveNavigation();



    /* =========================================================
       MOBILE NAVIGATION
       HAMBURGER → X
       ========================================================= */

    function setSidebar(open) {

        if (
            !hamburger ||
            !mobileSidebar
        ) {
            return;
        }


        /*
         * IMPORTANT:
         * CSS uses .hamburger.active
         * so JS must use .active too.
         */

        hamburger.classList.toggle(
            'active',
            open
        );


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


        hamburger.setAttribute(
            'aria-expanded',
            String(open)
        );


        hamburger.setAttribute(
            'aria-label',
            open
                ? 'Close navigation'
                : 'Open navigation'
        );


        if (open) {

            lockBody();

        } else {

            unlockBody();

        }

    }



    /* =========================================================
       HAMBURGER CLICK
       ========================================================= */

    if (hamburger) {

        hamburger.setAttribute(
            'type',
            'button'
        );

        hamburger.setAttribute(
            'aria-expanded',
            'false'
        );

        hamburger.setAttribute(
            'aria-label',
            'Open navigation'
        );


        hamburger.addEventListener(
            'click',
            event => {

                event.preventDefault();

                const isOpen =
                    hamburger.classList.contains(
                        'active'
                    );


                setSidebar(!isOpen);

            }
        );

    }



    /* =========================================================
       MOBILE NAVIGATION LINKS
       ========================================================= */

    mobileLinks.forEach(link => {

        link.addEventListener(
            'click',
            () => {

                setSidebar(false);

            }
        );

    });



    /* =========================================================
       MOBILE OVERLAY
       ========================================================= */

    if (mobileOverlay) {

        mobileOverlay.addEventListener(
            'click',
            () => {

                setSidebar(false);

            }
        );

    }



    /* =========================================================
       OPEN POPUP
       ========================================================= */

    window.openPopup =
        function (popupId) {

            const popup =
                document.getElementById(
                    popupId
                );


            if (!popup) {

                console.warn(
                    `Popup "${popupId}" was not found.`
                );

                return;

            }


            /*
             * Close mobile navigation
             * before opening a form.
             */

            setSidebar(false);


            /*
             * Close any other popup.
             */

            document
                .querySelectorAll(
                    '.popup-panel.active'
                )
                .forEach(panel => {

                    panel.classList.remove(
                        'active'
                    );

                });


            /*
             * Open requested popup.
             */

            popup.classList.add(
                'active'
            );


            lockBody();


            /*
             * Wait for the smooth slide-up
             * animation before focusing.
             */

            setTimeout(() => {

                const firstField =
                    popup.querySelector(
                        'input:not([type="hidden"]), select, textarea'
                    );


                if (firstField) {

                    firstField.focus();

                }

            }, 650);

        };



    /* =========================================================
       CLOSE POPUP
       ========================================================= */

    window.closePopup =
        function (popupId) {

            const popup =
                document.getElementById(
                    popupId
                );


            if (!popup) {
                return;
            }


            popup.classList.remove(
                'active'
            );


            /*
             * Give CSS time to complete
             * its slide-down animation.
             */

            setTimeout(() => {

                unlockBody();

            }, 850);

        };



    /* =========================================================
       CLOSE ALL POPUPS
       ========================================================= */

    function closeAllPopups() {

        document
            .querySelectorAll(
                '.popup-panel.active'
            )
            .forEach(popup => {

                popup.classList.remove(
                    'active'
                );

            });


        unlockBody();

    }



    /* =========================================================
       ESCAPE KEY
       ========================================================= */

    document.addEventListener(
        'keydown',
        event => {

            if (
                event.key !== 'Escape'
            ) {
                return;
            }


            /*
             * Priority 1:
             * confirmation modal
             */

            if (
                modal &&
                modal.classList.contains(
                    'active'
                )
            ) {

                window.closeConfirmationModal();

                return;

            }


            /*
             * Priority 2:
             * popup forms
             */

            const openPopup =
                document.querySelector(
                    '.popup-panel.active'
                );


            if (openPopup) {

                closeAllPopups();

                return;

            }


            /*
             * Priority 3:
             * mobile menu
             */

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



    /* =========================================================
       FORM SUBMISSION
       FORMSPREE / AJAX
       ========================================================= */

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
                 * Prevent double submissions.
                 */

                if (submitButton) {

                    submitButton.disabled =
                        true;

                    submitButton.innerHTML = `
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
                                    Accept:
                                        'application/json'
                                }
                            }
                        );


                    if (!response.ok) {

                        throw new Error(
                            'Form submission failed.'
                        );

                    }


                    /*
                     * Find the popup containing
                     * the submitted form.
                     */

                    const activePopup =
                        form.closest(
                            '.popup-panel'
                        );


                    /*
                     * Close popup smoothly.
                     */

                    if (activePopup) {

                        activePopup.classList.remove(
                            'active'
                        );

                    }


                    /*
                     * Reset form.
                     */

                    form.reset();


                    /*
                     * Wait for the popup to
                     * slide down before
                     * showing confirmation.
                     */

                    setTimeout(() => {

                        unlockBody();


                        if (modal) {

                            modal.classList.add(
                                'active'
                            );

                            lockBody();

                        }

                    }, 850);


                } catch (error) {

                    console.error(
                        'Form submission error:',
                        error
                    );


                    alert(
                        'There was a problem submitting your form. Please try again.'
                    );


                } finally {

                    /*
                     * Restore button.
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



    /* =========================================================
       CONFIRMATION MODAL
       ========================================================= */

    window.closeConfirmationModal =
        function () {

            if (!modal) {
                return;
            }


            modal.classList.remove(
                'active'
            );


            setTimeout(() => {

                unlockBody();

            }, 450);

        };



    /* =========================================================
       CLOSE CONFIRMATION WHEN CLICKING
       OUTSIDE THE CONTENT
       ========================================================= */

    if (modal) {

        modal.addEventListener(
            'click',
            event => {

                if (
                    event.target === modal
                ) {

                    window.closeConfirmationModal();

                }

            }
        );

    }



    /* =========================================================
       PREVENT POPUP BACKGROUND CLICK-THROUGH
       ========================================================= */

    document
        .querySelectorAll(
            '.popup-panel'
        )
        .forEach(popup => {

            popup.addEventListener(
                'click',
                event => {

                    /*
                     * Clicking the empty
                     * popup background does
                     * nothing.
                     */

                    if (
                        event.target === popup
                    ) {

                        event.stopPropagation();

                    }

                }
            );

        });



    /* =========================================================
       SMOOTH INTERNAL NAVIGATION
       ========================================================= */

    document
        .querySelectorAll(
            'a[href^="#"]'
        )
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


                    /*
                     * Close mobile menu
                     * before scrolling.
                     */

                    setSidebar(false);


                    const headerHeight =
                        header
                            ? header.offsetHeight
                            : 0;


                    const targetPosition =
                        target
                            .getBoundingClientRect()
                            .top +
                        window.scrollY -
                        headerHeight;


                    window.scrollTo({

                        top:
                            targetPosition,

                        behavior:
                            'smooth'

                    });

                }
            );

        });



    /* =========================================================
       MOBILE MENU — CLOSE ON RESIZE
       ========================================================= */

    window.addEventListener(
        'resize',
        () => {

            /*
             * If user rotates a phone
             * or moves to desktop size,
             * close the mobile navigation.
             */

            if (
                window.innerWidth > 1024 &&
                mobileSidebar &&
                mobileSidebar.classList.contains(
                    'active'
                )
            ) {

                setSidebar(false);

            }

        }
    );



    /* =========================================================
       FORM LABEL / FIELD POLISH
       ========================================================= */

    document
        .querySelectorAll(
            '.custom-form input, .custom-form select, .custom-form textarea'
        )
        .forEach(field => {

            field.addEventListener(
                'focus',
                () => {

                    const group =
                        field.closest(
                            '.custom-form-group'
                        );


                    if (group) {

                        group.classList.add(
                            'focused'
                        );

                    }

                }
            );


            field.addEventListener(
                'blur',
                () => {

                    const group =
                        field.closest(
                            '.custom-form-group'
                        );


                    if (group) {

                        group.classList.remove(
                            'focused'
                        );

                    }

                }
            );

        });



    /* =========================================================
       INITIAL STATE
       ========================================================= */

    setSidebar(false);

});
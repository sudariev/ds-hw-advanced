document.addEventListener(`DOMContentLoaded`, () => {
    const header = () => {
        const body = document.body;
        const menu = document.querySelector(".menu");
        const menuBtn = document.querySelector(".header__menu-btn");
        const menuBtnTopLine = document.querySelector(".header__menu-btn-top");
        const menuBtnMiddleLine = document.querySelector(
            ".header__menu-btn-middle"
        );
        const menuBtnBottomLine = document.querySelector(
            ".header__menu-btn-bottom"
        );

        const menuBtnOnClick = (e) => {
            e.stopPropagation();
            menuBtnTopLine.classList.toggle("header__menu-btn-top--close");
            menuBtnMiddleLine.classList.toggle(
                "header__menu-btn-middle--close"
            );
            menuBtnBottomLine.classList.toggle(
                "header__menu-btn-bottom--close"
            );

            menu.classList.toggle("menu--shown");

            body.classList.toggle("nav-is-open");
        };

        const bodyOnClick = () => {
            if (body.classList.contains("nav-is-open")) {
                menuBtnTopLine.classList.remove("header__menu-btn-top--close");
                menuBtnMiddleLine.classList.remove(
                    "header__menu-btn-middle--close"
                );
                menuBtnBottomLine.classList.remove(
                    "header__menu-btn-bottom--close"
                );

                menu.classList.remove("menu--shown");

                body.classList.remove("nav-is-open");
            }
        };

        document.body.addEventListener("click", bodyOnClick);
        menuBtn.addEventListener("click", menuBtnOnClick);
    };

    header();
});

// index.js
import { initKeyboardNav,sideBarLinks } from "../nav/keyboard-nav.js";

import { getPageHeader, getPageHeaderLinks, getNavLessonTitle, getDarkModeBtn, getSideBar, getSideBarBtn, initSideBarLinks, getMainTargetDiv, getMainContainer } from "../utils/dom-utils.js";
import { toggleSidebar } from "../ui/toggle-sideBar.js";
import { dragHideSidebar } from "../ui/drag-hide-sideBar.js";
import { injectContent } from "../core/inject-content.js";
document.addEventListener("DOMContentLoaded", () => {
    const homePagelink = document.querySelector('#homePagelink')
    const pageHeader = getPageHeader();
    const pageHeaderLinks = getPageHeaderLinks();
    const navLessonTitle = getNavLessonTitle();
    const darkModeBtn = getDarkModeBtn();
    const sideBar = getSideBar();
    const sideBarBtn = getSideBarBtn();
    
    const mainTargetDiv = getMainTargetDiv();
    const mainContainer = getMainContainer();
    
    


    // Initialize sideBar toggle and drag
    toggleSidebar(navLessonTitle, sideBar, sideBarBtn, mainContainer);
    dragHideSidebar(mainContainer, sideBar);

    // Initialize keyboard navigation
    initKeyboardNav({
        pageHeader: getPageHeader(),
        pageHeaderLinks: getPageHeaderLinks(),
        darkModeBtn: getDarkModeBtn(),
        navLessonTitle: navLessonTitle,
        sideBar: getSideBar(),
        sideBarBtn: sideBarBtn,
        // sideBarLinks: Array.from(initSideBarLinks()), // <-- convert NodeList to array
        mainTargetDiv: getMainTargetDiv(),
        mainContainer: mainContainer
    });

    // Initial content load
    const initialLink = sideBarLinks.find(el => el.hasAttribute("autofocus")) ;
    if (initialLink) {
        initialLink.focus();
        initialLink.removeAttribute('autofocus')
        // Load initial content into mainTargetDiv
        // import("../core/inject-content.js").then(module => {
        //     module.injectContent(initialLink.href, mainTargetDiv, sideBarLinks, sideBarLinks.indexOf(initialLink), navLessonTitle);
        // });
        injectContent(initialLink.href, mainTargetDiv, sideBarLinks, sideBarLinks.indexOf(initialLink), navLessonTitle);
    }

    else {
        injectContent('home-page.html', mainTargetDiv, sideBarLinks, sideBarLinks.indexOf(initialLink), navLessonTitle);
        
    }
});

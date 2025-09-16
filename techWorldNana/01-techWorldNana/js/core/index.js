// index.js
import { initKeyboardNav } from "../nav/keyboard-nav.js";

import { getPageHeader, getPageHeaderLinks, getNavLessonTitle, getDarkModeBtn, getSideBar, getSideBarBtn, initSideBarLinks, getMainTargetDiv, getMainContainer } from "../utils/dom-utils.js";
import { toggleSidebar } from "../ui/toggle-sidebar.js";
import { dragHideSidebar } from "../ui/drag-hide-sidebar.js";
import { injectContent } from "../core/inject-content.js";
document.addEventListener("DOMContentLoaded", () => {
    const homePagelink = document.querySelector('#homePagelink')
    const pageHeader = getPageHeader();
    const pageHeaderLinks = getPageHeaderLinks();
    const navLessonTitle = getNavLessonTitle();
    const darkModeBtn = getDarkModeBtn();
    const sidebar = getSideBar();
    const sidebarBtn = getSideBarBtn();
    const sidebarLinks = Array.from(initSideBarLinks());
    const mainTargetDiv = getMainTargetDiv();
    const mainContainer = getMainContainer();
    
    


    // Initialize sidebar toggle and drag
    toggleSidebar(navLessonTitle, sidebar, sidebarBtn, mainContainer);
    dragHideSidebar(mainContainer, sidebar);

    // Initialize keyboard navigation
    initKeyboardNav({
        pageHeader: getPageHeader(),
        pageHeaderLinks: getPageHeaderLinks(),
        darkModeBtn: getDarkModeBtn(),
        navLessonTitle: navLessonTitle,
        sidebar: getSideBar(),
        sidebarBtn: sidebarBtn,
        sidebarLinks: Array.from(initSideBarLinks()), // <-- convert NodeList to array
        mainTargetDiv: getMainTargetDiv(),
        mainContainer: mainContainer
    });

    // Initial content load
    const initialLink = sidebarLinks.find(el => el.hasAttribute("autofocus")) ;
    if (initialLink) {
        initialLink.focus();
        initialLink.removeAttribute('autofocus')
        // Load initial content into mainTargetDiv
        // import("../core/inject-content.js").then(module => {
        //     module.injectContent(initialLink.href, mainTargetDiv, sidebarLinks, sidebarLinks.indexOf(initialLink), navLessonTitle);
        // });
        injectContent(initialLink.href, mainTargetDiv, sidebarLinks, sidebarLinks.indexOf(initialLink), navLessonTitle);
    }

    else {
        injectContent('home-page.html', mainTargetDiv, sidebarLinks, sidebarLinks.indexOf(initialLink), navLessonTitle);
        
    }
});

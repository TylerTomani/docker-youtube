// dom-utils.js
export function getPageHeader() {
    return document.querySelector("header.page-header");
}
export function getPageHeaderLinks() {
    return document.querySelectorAll("header.page-header a");
}
export function getDarkModeBtn() {
    return document.querySelector("#darkModeBtn");
}

export function getNavLessonTitle() {
    return document.querySelector("#navLessonTitle");
}
export function getSideBar() {
    return document.querySelector(".side-bar");
}
export function getSideBarBtn() {
    return document.querySelector("#sideBarBtn");
}
export function initSideBarLinks() {
    return document.querySelectorAll("ul.sidebar-links-ul li a");
}
export function getMainTargetDiv() {
    return document.querySelector("#mainTargetDiv");
}
export function getMainContainer() {
    return document.querySelector(".main-container");
}
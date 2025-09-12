// toggle-sidebar.js
// import { getSideBar, getNavLessonTitle, getMainContainer } from "../utils/dom-utils.js";
// export const sideBarBtn = document.querySelector('#sideBarBtn');
// const darkmodeBtn = document.getElementById('darkmodeBtn'); // reference to dark mode button
// const sideBar = getSideBar()
// const navLessonTitle = getNavLessonTitle()
// const mainContainer = getMainContainer()
export function toggleSidebar(navLessonTitle, sideBar, sideBarBtn, mainContainer) {
  [navLessonTitle,sideBarBtn].forEach(el => {
    el.addEventListener('click', e => {
      mainContainer?.classList.toggle('collapsed')
    });
  })
  sideBarBtn.addEventListener('keydown', e => {
    let key = e.key.toLowerCase()
    if (key === 'enter') {
      mainContainer?.classList.toggle('collapsed')
    }
  });
  navLessonTitle.addEventListener('keydown', e => {
    let key = e.key.toLowerCase()
    if (key === 'enter') {
      mainContainer?.classList.toggle('collapsed')
    }
  });
  sideBar.addEventListener('click', e => {
    if(e.target == sideBar){
      mainContainer.classList.toggle('collapsed')
    }
  })
}

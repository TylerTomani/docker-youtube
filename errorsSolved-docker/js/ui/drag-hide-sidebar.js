
export function dragHideSidebar(mainContainer, sideBar) {
    let startX, endX;
    
    sideBar.addEventListener('touchstart', (e) => {
        startX = e.changedTouches[0].clientX;
    },{passive:true});

    sideBar.addEventListener('touchend', (e) => {
        endX = e.changedTouches[0].clientX;
        const swipeDistance = endX - startX;

        if (swipeDistance < -50 && !sideBar.classList.contains('collapsed')) {
            mainContainer.classList.toggle('collapsed');
        }
        
    },{passive:true});
}
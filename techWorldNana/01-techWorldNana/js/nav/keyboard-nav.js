// keyboard-nav.js
// THIS is BAD, BIGGEST Problemo is sideBarLinks is the same as dropDowns
import { injectContent } from "../core/inject-content.js";
import { copyCodesStepFocused, handleStepKeys, lastStep } from "./step-txt.js";
import { denlargeAllImages } from "./step-txt.js";
import { denlargeAllVideos, pauseDenlargeAllVideos } from "./playStepVid.js";

export let lastFocusedLink = null;
export let lastClickedLink = null;
export const endNxtLessonBtn = document.querySelector('#endNxtLessonBtn');
const prevLessonBtn = document.querySelector('#prevLessonBtn');
export const tutorialLink = document.querySelector('#tutorialLink');
export const sideBarLinks = Array.from(document.querySelectorAll('.sidebar-links-ul a'));
export const subSidebarLinks = Array.from(document.querySelectorAll('.sidebar-links-ul li ul li a'));
import { dropDowns } from "../ui/drop-down.js";
let dropDownFocused = true
let iDropDowns = 0
let iSideBarLinks = 0;
let iSubSideBarLinks = 0;
let subSideBarLinksFocus = false;
let currentSubSidebarLinksAs = null


dropDowns.forEach(el => {
    el.addEventListener('focus', e => {
        dropDownFocused = true
        subSideBarLinksFocus = false
        iDropDowns = [...dropDowns].indexOf(e.target)
    })
})
subSidebarLinks.forEach(el => {
    el.addEventListener('focus', e => {
        dropDownFocused = false
        subSideBarLinksFocus = true
    })
    el.addEventListener('keydown', e => {
        let key = e.key.toLowerCase()
        if(!dropDownFocused && key == 's'){
            e.preventDefault()
            const dropDown = e.target.closest('a')
            dropDown.focus()
        }
        const parentUl = e.target.closest('ul')
        currentSubSidebarLinksAs = parentUl.querySelectorAll('li a')
        
        if(key === 'f'){
            // console.log(parentUl)
            if(subSideBarLinksFocus){
                // console.log(console.log())
                iSubSideBarLinks = (iSubSideBarLinks + 1) % currentSubSidebarLinksAs.length
                currentSubSidebarLinksAs[iSubSideBarLinks].focus()
            }
        }
        if(key === 'a'){
            console.log(subSideBarLinksFocus)
            console.log(currentSubSidebarLinksAs[iSubSideBarLinks])
            if(subSideBarLinksFocus){
                iSubSideBarLinks = (iSubSideBarLinks - 1 + currentSubSidebarLinksAs.length) % currentSubSidebarLinksAs.length
                currentSubSidebarLinksAs[iSubSideBarLinks].focus()
            }
        }
        if(!isNaN(key)){
            const intKey = parseInt(key)
            
            currentSubSidebarLinksAs[intKey - 1].focus()

        }
    })
})
export function initKeyboardNav({
    pageHeader, pageHeaderLinks, navLessonTitle, darkModeBtn,
    sideBar, sideBarBtn, mainTargetDiv, mainContainer
}) {
    let focusZone = "header"; // "header" | "sideBar" | "main"
    
    let suppressIndexUpdate = false; // prevent focus handler from resetting index after keyboard nav
    // --- Focus zone tracking ---
    pageHeader.addEventListener("focusin", () => { 
        const allVids = document.querySelectorAll('video')
        pauseDenlargeAllVideos({ allVids })
        focusZone = "header";
     });
    sideBar.addEventListener("focusin", () => {
        const allVids = document.querySelectorAll('video')
        pauseDenlargeAllVideos({ allVids })
        focusZone = "sideBar";

     });
    sideBarBtn.addEventListener("focusin", () => { focusZone = "sideBar"; });
    mainTargetDiv.addEventListener("focusin", () => { focusZone = "main"; });
    // --- Sidebar button behavior ---
    sideBarBtn.addEventListener("keydown", e => {
        const key = e.key.toLowerCase();
        if (key === 's') {
            if (lastClickedLink) lastClickedLink.focus();
            else if (lastFocusedLink) lastFocusedLink.focus();
            else sideBarLinks[0].focus();
        }
        if (key === 'm') {
            focusZone = 'main'
            mainTargetDiv.focus()
        }
        if(key === 'f'){
            e.preventDefault()
            iDropDowns = 0
            dropDowns[0].focus()
        }
    });
    // --- Sidebar links ---
    sideBarLinks.forEach(el => {
        if (el.hasAttribute("autofocus")) {
            lastClickedLink = el;
            iSideBarLinks = [...sideBarLinks].indexOf(el);
            focusZone = "sideBar";
            injectContent(el.href, mainTargetDiv, sideBarLinks, iSideBarLinks, navLessonTitle);
        }

        el.addEventListener("focus", (e) => {
            focusZone = 'sideBar';
            lastFocusedLink = e.target;
            scrollTo(0,0)
        });

        el.addEventListener("click", e => {
            e.preventDefault();
            e.stopPropagation();
            const targetLink = e.target.closest("a");
            if (targetLink) {
                iSideBarLinks = [...sideBarLinks].indexOf(el);
                changeTutorialLink(targetLink);
                injectContent(targetLink.href, mainTargetDiv, sideBarLinks, iSideBarLinks, navLessonTitle);
            }
            lastClickedLink = e.target;
        });

        el.addEventListener("keydown", e => {
            const key = e.key.toLowerCase();
            if (key === 'enter') {
                focusZone = 'sideBar';
                const targetLink = e.target.closest("a");
                if (targetLink) injectContent(targetLink.href, mainTargetDiv);
                if (e.target === lastClickedLink && !e.target.classList.contains('drop-down')) {
                    mainTargetDiv.focus();
                }
                lastClickedLink = e.target;
            }else if (key === 'm') {
                mainTargetDiv.focus();
                focusZone = 'main';
                mKeyFocusOrder(e);
            }
        });
    });
    // --- End/Prev lesson buttons ---
    endNxtLessonBtn.addEventListener('click', e => {
        e.preventDefault();
        iSideBarLinks = (iSideBarLinks + 1) % sideBarLinks.length;
        window.scrollTo({ top: 0, behavior: 'instant' });
        sideBarLinks[iSideBarLinks].click();
        lastClickedLink = sideBarLinks[iSideBarLinks];
        if(mainContainer.classList.contains('collapsed')){
            mainContainer.classList.remove('collapsed')
        }
    });

    endNxtLessonBtn.addEventListener('keydown', e => {
        let key = e.key.toLowerCase();
        if(key === 'enter'){
            if (mainContainer.classList.contains('collapsed')){

                mainContainer.classList.remove('collapsed')
            }
            sideBar.scrollIntoView({inline: 'start'})
        }
        if (key === 'm') {
            const steps = document.querySelectorAll('.step-float');
            if (!steps) {
                mainTargetDiv.focus();
                return;
            }
            mKeyFocusOrder();
        }
    });
    prevLessonBtn.addEventListener('click', e => {
        iSideBarLinks = (iSideBarLinks - 1 + sideBarLinks.length) % sideBarLinks.length;
        deHighlightSideBarLink();
        sideBarLinks[iSideBarLinks].click();
    });
    function deHighlightSideBarLink() {
        sideBarLinks.forEach(el => el.classList.remove('hlight'));
    }
    // --- Helper functions ---
    function sKeyFocusOrder() {
        if (sideBar.classList.contains('expand')){
            sideBar.classList.remove('expand')
        }
        if (lastClickedLink) lastClickedLink.focus();
        else if (lastFocusedLink) lastFocusedLink.focus();
        else sideBarLinks[0].focus();
    }
    function mKeyFocusOrder(e) {
        const steps = document.querySelectorAll('.step-float');
        // This block below isn't really working, logic is in step-txt??
        if (lastStep) {
            lastStep.focus()
        } else if (steps[0]) {
            steps[0].focus();
        } else {
            mainTargetDiv.scrollIntoView({ block: 'start',inline: 'start' })
        }
    }

    function headerElementsFocus(key, e) {
        // Only active while focusZone === "header"
        pageHeaderLinks.forEach(el => { if (key === el.id[0]) el.focus(); });
        switch (key) {
            case "s": sKeyFocusOrder(); break;
            case "c": {
                const codeComShortcutsLink = document.querySelector("#codeComShortcutsLink");
                const chatGptProjLink = document.querySelector("#chatGptProjLink");
                if (e.target === codeComShortcutsLink) chatGptProjLink.focus();
                else codeComShortcutsLink.focus();
                break;
            }
            case "d": darkModeBtn.focus(); break;
            case "n": navLessonTitle.focus(); break;
            case "t": document.querySelector("#tutorialLink").focus(); break;
        }
    }
    function numberShortcut(key) {
        const intKey = parseInt(key) - 1;
        // This might be unnecessary, maybe put logic in dropDowns.forEach el.addEventListener('keydown')??????
        if(dropDownFocused){
            dropDowns[intKey].focus()
        } 
    }
    // --- Global key handling ---
    addEventListener("keydown", e => {
        const key = e.key.toLowerCase();
        if (e.shiftKey || e.metaKey) return;
        switch (focusZone) {
            case "header":    
                headerElementsFocus(key, e);
                if (key === 'f') {
                    focusZone = "sideBar";
                    iSideBarLinks = 0;
                    sideBarLinks[0].focus();
                    break;
                }
                if (key === 's') {
                    if (mainContainer.classList.contains('collapsed')) {
                        mainContainer.classList.remove('collapsed');
                    }
                }
                if (key === 'm') {
                    focusZone = 'main';
                    mKeyFocusOrder(e);
                }
                if (!isNaN(key)) numberShortcut(key);
                break;
            case "sideBar":
                // IMPORTANT: no headerElementsFocus here (prevents 'a' from being hijacked)
                headerElementsFocus(key,e)
                if (key === 'f') {
                    if(document.activeElement.classList.contains('drop-down') ){
                    
                       const sideBarLinkLi = document.activeElement.parentElement 
                       const childUl = sideBarLinkLi.querySelector('ul li ul')
                        if (e.target == sideBarBtn) {
                            dropDowns[0].focus()
                            return
                        } else {
                            iDropDowns = (iDropDowns + 1) % dropDowns.length
                            dropDowns[iDropDowns].focus()
                        }
                       if(!childUl.classList.contains('hide')){
                           const firstLiInUl = childUl.querySelector('li a')
                           dropDownFocused = false
                           firstLiInUl.focus()
                           return
                       }else {
                           return
                       }
                    }
                    if(e.target.id == 'sideBarBtn'){
                        dropDowns[0].focus();
                    }
                } else if (key === 'a') {
                    if (document.activeElement.classList.contains('drop-down')) {
                        const sideBarLinkLi = document.activeElement.parentElement
                        const childUl = sideBarLinkLi.querySelector('ul li ul')
                        if (!childUl.classList.contains('hide')) {
                            const firstLiInUl = childUl.querySelector('li a')
                            dropDownFocused = false
                            firstLiInUl.focus()
                            return
                        } else {
                            if (e.target == sideBarBtn) {
                                lastClickedLink.focus()
                            } else {
                                iDropDowns = (iDropDowns - 1 + dropDowns.length) % dropDowns.length
                                dropDowns[iDropDowns].focus()
                            }
                            return
                        }
                    }
                    // if((document.activeElement == ))
                    console.log()
                    // if(dropDownFocused){
                    //     e.preventDefault()
                    //     e.stopPropagation()
                    //     iDropDowns = (iDropDowns - 1 + dropDowns.length) % dropDowns.length
                    //     dropDowns[iDropDowns].focus()
                    //     return
                    // } else {
                    //     e.preventDefault();
                    //     e.stopPropagation();
                    //     iSideBarLinks = (iSideBarLinks === -1)
                    //         ? sideBarLinks.length - 1
                    //         : (iSideBarLinks - 1 + sideBarLinks.length) % sideBarLinks.length;
                    //     sideBarLinks[iSideBarLinks].focus();
                    // }
                    
                } else if (key === 'm') {
                    mKeyFocusOrder(e);
                } else if (key === 's') {
                    denlargeAllImages();
                    if (e.target == sideBarBtn) {
                        if (lastClickedLink) {
                            lastClickedLink.focus();
                        } else {
                            console.log('here')
                            lastFocusedLink.focus()
                        }
                    }
                    if (e.target === lastClickedLink || e.target === lastFocusedLink){
                        sideBarBtn.focus();
                    } 
                    else if (lastClickedLink) lastClickedLink.focus();
                    else {
                        // sideBarBtn.focus()
                    }
                } else if (!isNaN(key)) numberShortcut(key);
                break;

            case "main":
                // IMPORTANT: no headerElementsFocus here either
                handleStepKeys(key, e, mainTargetDiv);
                headerElementsFocus(key,e)
                if (key === 's') {
                    denlargeAllImages();
                    if (mainContainer.classList.contains("collapsed")) {
                        mainContainer.classList.remove("collapsed");
                    }
                    sKeyFocusOrder();
                }
                
                if (key === 'e' || key === 'p') {
                    const steps = mainTargetDiv.querySelectorAll(".step-float, .step");
                    if (key === 'e') {
                        if (e.target === steps[steps.length - 1]) {
                            endNxtLessonBtn.focus();
                        } else if (e.target === prevLessonBtn) {
                            endNxtLessonBtn.focus();
                        } else {
                            steps[steps.length - 1].focus();
                        }
                    }
                    if (key === 'p') prevLessonBtn.focus();
                }
                break;
        }
        
    });
    document.addEventListener("click", e => {
        const isVideo = e.target.tagName === "VIDEO";
        const isImg = e.target.tagName === "IMG";
        const isEnlarged = e.target.closest("#targetDiv");
        if ((!isVideo || !isImg) && isEnlarged ) {
            
            const allVids = document.querySelectorAll("video");
            const allImgs = document.querySelectorAll("img");
            
            denlargeAllVideos({ allVids });
            // denlargeAllImages({ allImgs });
        }
    }, true); // use capture so it fires before bubbling stops
}
export function changeTutorialLink(targetLink) {
    const vidBase = targetLink.getAttribute("data-video");
    const ts = targetLink.getAttribute("data-timestamp");
    let vidHref = vidBase;

    if (ts) {
        vidHref += (vidBase.includes("?") ? "&" : "?") + `t=${ts}s`;
        tutorialLink.href = vidHref;
    }
}
// No idea what happened, had to put eventListener on tutorialLink
tutorialLink.addEventListener('keydown', e => {
    let key = e.key.toLowerCase()
    if (key === 'enter') {
        console.log('tutorialLink')
        window.open(e.target.href, '_blank')

    }
})
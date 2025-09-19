// step-txt.js
import { changeTutorialLink, tutorialLink, endNxtLessonBtn } from "./keyboard-nav.js";
import { handleVideo,handleClickVideo,toggleVideoSize} from "./playStepVid.js";
export let lastStep = null;
const pageWrapper = document.querySelector('.page-wrapper')
let steps = [];
let allImgs = [];
let allVids = [];
let stepImageIndexes = new WeakMap();
let iStep = 0;
let iCopyCodes = 0;
let currentIndex = 0; // bad namae, index for imgs-container imgs
let stepClicked = false
export let copyCodesStepFocused = false;


/**
 * Initialize step navigation and image/code behavior
 * @param {HTMLElement} mainTargetDiv
 */
export function initStepNavigation(mainTargetDiv) {
    if (!mainTargetDiv) return;
    steps = Array.from(mainTargetDiv.querySelectorAll(".steps-container > .step-float"));
    const copyCodes = mainTargetDiv.querySelectorAll(".copy-code");
    const stepTxtPAs = document.querySelectorAll('.step-txt p a')
    allImgs = Array.from(mainTargetDiv.querySelectorAll(".step-img > img"));
    allVids = Array.from(mainTargetDiv.querySelectorAll('video'))
    // Initialize first step
    if (steps.length && !lastStep) {
        // lastStep = steps[0];
        // iStep = 0;
    }
    stepTxtPAs.forEach(el => {
        el.addEventListener('focus',e => {
            copyCodesStepFocused = true

        })
        
    })
    
    // Add step event listeners
    steps.forEach((step, index) => {
        if (!step.dataset.listenerAdded) {
            step.setAttribute("tabindex", "0");

            step.addEventListener("focus", (e) => {
                removeStepsFocusEffects(steps)
                e.target.classList.add('efxFocus')
                copyCodesStepFocused = false
                iStep = index;
                currentIndex = 0;
                iCopyCodes = 0
                denlargeAllImages();
                pauseEnlargeAllVids(allVids)
                stepClicked = false
                // step.scrollIntoView({behavior: 'instant' , inline: 'center'})
                // step.scrollIntoView({behavior: 'instant'})
                
            });

            step.addEventListener("focusin", (e) => { 
                timeTutorialVid(e)
                
                iStep = index;
            })
            step.addEventListener("focusout", () => { denlargeAllImages()})
            
            step.addEventListener("keydown", e => {
                let key = e.key.toLowerCase();
                const hasVideo = step.querySelector('video') ? true : false
                if(hasVideo){
                    const vid = step.querySelector('video')
                    // console.log(vid.currentTime)
                    handleVideo({vid, e,steps,allVids})
                    changeTutorialLink(e.target)
                    // const copyCodes = document.querySelectorAll('.copy-code, a')
                    if(key === 'enter'){
                        // copyCodesStepFocused = true
                    }
                    
                    return
                }
                
                if (key === "enter") {
                    toggleStepImages(step,e);
                    // step.scrollIntoView({ behavior: 'instant', block: 'center' });
                    // step.scrollIntoView({ behavior: 'instant', block: 'center' });
                    const firstCopyCode = e.target.querySelector('.copy-code')
                    // copyCodesStepFocused = true
                    if(step == lastStep && stepClicked){
                        copyCodesStepFocused = true
                        firstCopyCode?.focus()
                    }
                    changeTutorialLink(e.target)
                    lastStep = step
                    stepClicked = true
                }
                
              
            });
            // --- unified pointerdown for click/tap ---
            step.addEventListener("pointerdown", e => {
                e.preventDefault();
                e.stopPropagation();
                removeStepsFocusEffects(steps)
                e.target.classList.add('efxFocus')
                console.log('here')
                const stepFloat = getStepFloat(e.target)
                // stepFloat.style.border = '20px solid blue !important'
                // stepFloat.style.background = ' blue !important'
                console.log(stepFloat)
                if (e.target.tagName !== "IMG") {
                    denlargeAllImages();
                    lastStep = step;
                    changeTutorialLink(e.target)
                }
            });

            step.dataset.listenerAdded = "true";
        }
    });

    // Add image click/touch listeners (now redundant, so left empty)
    allImgs.forEach(img => {
        if (!img.dataset.listenerAdded) {
            img.addEventListener('click', e => {
                toggleSingleImage(img)
            })
            img.dataset.listenerAdded = "true";
        }
    });
    allVids.forEach(vid => {
        if (!vid.dataset.listenerAdded) {
            vid.addEventListener('click', e => {
                // toggleSingleImage(vid)
                const stepFloat = getStepFloat(e.target.parentElement)
                // console.log(stepFloat)
                handleClickVideo({vid,e,steps,allVids,stepFloat})
            })
            vid.addEventListener('keydown', e => {
                // toggleSingleImage(vid)
                handleVideo({vid,e,steps,allVids})
            })
            vid.dataset.listenerAdded = "true";
        }
    });

    // Initialize copy-code focus behavior
    
    copyCodes.forEach(code => {
        if (!code.dataset.listenerAdded) {
            code.addEventListener("focus", (e) => {
                denlargeAllImages();
                pauseEnlargeAllVids(allVids)
                copyCodesStepFocused = true 


            });
            code.addEventListener('keydown', e => {
                // console.log('add video toggle enlarge here one copy-codes')
                const stepFloat = getStepFloat(e.target.parentElement)
                const vid = stepFloat.querySelector('video')
                console.log(e.target)
                let key = e.key.toLowerCase()
                if(key === 'm'){
                    stepFloat.focus()
                }
                toggleVideoSize({ vid, e, steps, stepFloat })
                handleVideo({ vid, e, steps, allVids })
            })
            code.dataset.listenerAdded = "true";
        }
    });
}

// --- Handle step navigation keys ---
export function handleStepKeys(key, e, mainTargetDiv) {
    if (!steps.length) return;

    if (!isNaN(key)) {
        if (!copyCodesStepFocused){

            const index = parseInt(key, 10) - 1;
            if (index >= 0 && index < steps.length) {
                iStep = index;
                steps[iStep].focus();
                lastStep = steps[iStep];
                
            } else if(index > steps.length){
                endNxtLessonBtn.focus()
            }

        } else {
            const stepFloat = getStepFloat(e.target)
            const copyCodes = stepFloat.querySelectorAll('.copy-code')
            if(copyCodes){

                if(copyCodes.length > 1){
                    let intKey = parseInt(key)
                    copyCodes[intKey - 1].focus()
                } else {
                    const index = parseInt(key, 10) - 1;
                    if (index >= 0 && index < steps.length) {
                        iStep = index;
                        steps[iStep].focus();
                        lastStep = steps[iStep];
                    } 
                }
            }
        }
    }
    switch (key) {
        case "enter":
            if (e.target == mainTargetDiv) {
                steps[0].focus()
            }
            else {
//  I need to put this in a function 
                timeTutorialVid(e)
                
            }
            break;
        case "f" : // next step

            if (!copyCodesStepFocused) {
                if (e.target == mainTargetDiv) {
                    iStep = 0;
                    goToStep(steps[iStep]);
                } else {
                    iStep = (iStep + 1) % steps.length;
                }
                steps[iStep].focus();
                goToStep(steps[iStep]);
                lastStep = steps[iStep];
            } else {
                const stepFloat = getStepFloat(e.target)
                const imgs = stepFloat.querySelectorAll('img')
                imgs.forEach(el => el.classList.contains('enlarge'))
                const copyCodes = stepFloat.querySelectorAll('.copy-code')
                iCopyCodes = (iCopyCodes + 1) % copyCodes.length
                copyCodes[iCopyCodes].focus()

            }
            break;
        case "a": // previous step
            if (!copyCodesStepFocused) {
                iStep = (iStep - 1 + steps.length) % steps.length;
                steps[iStep].focus();
                lastStep = steps[iStep];
            } else {
                const stepFloat = getStepFloat(e.target)
                const imgs = stepFloat.querySelectorAll('img')
                imgs.forEach(el => el.classList.contains('enlarge'))
                const copyCodes = stepFloat.querySelectorAll('.copy-code')
                iCopyCodes = (iCopyCodes - 1 + copyCodes.length) % copyCodes.length
                copyCodes[iCopyCodes].focus()

            }
            break;
        case "e": // go to last stepm
            break;
        case "m": // focus last step or container
            if (e.target === mainTargetDiv) {
                // scroll page to top if container itself has focus
                window.scrollTo({ top: 0, behavior: "instant" });
            } else if (e.target === lastStep) {
                // go back to container
                mainTargetDiv.focus();
            } else if (lastStep) {
                // otherwise focus the last step we tracked
                lastStep.focus();
            }
            if (e.target === mainTargetDiv && !lastStep) {
                steps[0].focus();
            }
            break;
        default:
            
            break;
    }
}

// --- Image handling ---
function toggleSingleImage(img) {
    img.classList.toggle("enlarge");
    // img.style.zIndex = img.classList.contains("enlarge") ? 100 : 0;
}

function toggleStepImages(step,e) {
    
    const images = Array.from(step.querySelectorAll(".step-img > img"));
    if (!images.length) return;
    if (images.length === 1) {
        toggleSingleImage(images[0]);
    } else {
        // Multi-image cycling
        if (currentIndex == 2) {
            step.focus();
            denlargeAllImages();
            currentIndex = 0;
        } else {
            denlargeAllImages();
            if (images[currentIndex]) {
                images[currentIndex].classList.add("enlarge");
                // images[currentIndex].style.zIndex = 100;
                currentIndex += 1;
            }
        }
    }
    
}

// --- Utility ---
export function denlargeAllImages() {
    allImgs.forEach(img => {
        if(img.classList.contains('enlarge'))img.classList.remove("enlarge");
        // img.style.zIndex = 0;
    });
    allVids.forEach(vid => {
        if (vid.classList.contains('first-vid-enlarge')) vid.classList.remove("first-vid-enlarge");

    })
}
export function pauseEnlargeAllVids() {
    allVids.forEach(vid => {
        if (vid.classList.contains('enlarge')) {
            vid.classList.remove('enlarge')
        }
        if (vid.classList.contains('first-vid-enlarge')) {
            vid.classList.remove('.first-vid-enlarge')
        }
        // console.log(vid.playing)
        if(vid.playing){
            vid.pause()
        }
    })
}

function getStepFloat(target) {
    if (target.classList.contains('step-float')) {
        return target;
    } else if (target.parentElement) {
        return getStepFloat(target.parentElement);
    } else {
        return null;
    }
}
function goToStep(step) {
    // step.scrollIntoView({ behavior: 'instant', inline: 'end', block: 'end' });
    // step.scrollIntoView({ behavior: 'instant' });
}
function timeTutorialVid(e){
    const vidBase = e.target.getAttribute("data-video");
    const ts = e.target.getAttribute("data-timestamp");

    let vidHref = vidBase;
    if (ts) {
        vidHref += (vidBase.includes("?") ? "&" : "?") + `t=${ts}s`;
        tutorialLink.href = vidHref;

    }
}

function removeStepsFocusEffects(steps) {
    steps.forEach(el => el.classList.remove('efxFocus'))
}
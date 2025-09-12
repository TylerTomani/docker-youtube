// step-txt.js

// import { handleVideo,handleClickVideo,toggleVideoSize} from "./playStepVid.js";
import { handleClickVideo,toggleVideoSize} from "./playStepVid.js";
const mainTargetDiv = document.querySelector('#mainTargetDiv')
let lastStep = null;
const pageWrapper = document.querySelector('.page-wrapper')
const pageH1 = document.querySelector('#pageH1')
let steps = [];
let allImgs = [];
let allVids = [];
let stepImageIndexes = new WeakMap();
let iStep = 0;
let iCopyCodes = 0;
let currentIndex = 0; // bad namae, index for imgs-container imgs
let stepClicked = false
let copyCodesStepFocused = false;
const copyCodes = mainTargetDiv.querySelectorAll(".copy-code");
const stepTxtPAs = document.querySelectorAll('.step-txt p a')
// const mainTargetDiv = document.getElementById("#targetDiv")
// if (!mainTargetDiv) return;
steps = Array.from(mainTargetDiv.querySelectorAll(".steps-container > .step-float"));
allImgs = Array.from(mainTargetDiv.querySelectorAll(".step-img > img"));
allVids = Array.from(mainTargetDiv.querySelectorAll('video'))
// Initialize first step
if (steps.length && !lastStep) {
    // lastStep = steps[0];
    // iStep = 0;
}
stepTxtPAs.forEach(el => {
    el.addEventListener('focus',e => {copyCodesStepFocused = true})
})
copyCodes.forEach(el => {
    el.addEventListener('focus',e => {copyCodesStepFocused = true})
})

document.addEventListener('keydown', e => {
    let key = e.key.toLowerCase()
    handleStepKeys({key,e})
})
const backlink = document.querySelector('#backlink')
function handleStepKeys({key, e}) {
    if (!steps.length) return;
    if (!isNaN(key)) {
        if (!copyCodesStepFocused) {
            console.log(e.target)
            const index = parseInt(key, 10) - 1;
            if (index >= 0 && index < steps.length) {
                iStep = index;
                steps[iStep].focus();
                lastStep = steps[iStep];

            } else if (index > steps.length) {
                endNxtLessonBtn.focus()
            }

        } else {
            const stepFloat = getStepFloat(e.target)
            const copyCodes = stepFloat.querySelectorAll('.copy-code')
            if (copyCodes.length > 1) {
                let intKey = parseInt(key)
                copyCodes[intKey - 1].focus()
            } else {
                const index = parseInt(key, 10) - 1;
                if (index >= 0 && index < steps.length) {
                    iStep = index;
                    steps[iStep]?.focus();
                    lastStep = steps[iStep];
                }
            }
        }
    }
    console.log(copyCodesStepFocused)
    switch (key) {
        case "enter":
            if (e.target == mainTargetDiv) {
                steps[0].focus()
            }
            else {
                //  I need to put this in a function 
                // timeTutorialVid(e)

            }
            break;
        case "f": // next step

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
            break
        case "b":
            backlink.focus()
            break
        case "h":
            homelink.focus()
            break
        case "e": // go to last stepm
            break;
        case "m": // focus last step or container
            const stepFloat = getStepFloat(e.target)
            lastStep = stepFloat
            if(copyCodesStepFocused){
                lastStep.focus()
                return
            }
            if(e.target == mainTargetDiv){
                lastStep.focus()
                // console.log('yes')
            }
            if(!copyCodesStepFocused){
                // pageH1.focus()
                // scrollTo(0,0)
                pageH1.scrollIntoView({behavior:'instant', inline: 'center'})
                mainTargetDiv.focus()
            } else {
                lastStep.focus()
            }
            break;
        case 'c':
            const codeCommandShorcuts = document.querySelector('#codeComandShortcuts')
            const chatGpt = document.querySelector('#chatGpt')
            if (e.target.id != 'codeCommandShorcuts' || e.target.id != 'chatGpt' ){
                codeCommandShorcuts.focus()
            } else if(e.target.id === 'codeComandShortcuts'){
                chatGpt.focus()
            } else {
                codeCommandShorcuts.focus()
            }
            break
        default:

            break;
    }
}

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
            denlargeAllImages(allImgs, allVids);
            pauseEnlargeAllVids(allVids)
            stepClicked = false
            step.scrollIntoView({ behavior: 'instant', inline: 'center' })
        });
        step.addEventListener("focusin", (e) => {
            // timeTutorialVid(e) 
            iStep = index;
        })
        step.addEventListener("focusout", () => { denlargeAllImages(allImgs, allVids) })

        step.addEventListener("keydown", e => {

            let key = e.key.toLowerCase();
            const hasVideo = step.querySelector('video') ? true : false
            if (hasVideo) {
                const vid = step.querySelector('video')
                // console.log(vid.currentTime)
                // handleVideo({vid, e,steps,allVids})
                // const copyCodes = document.querySelectorAll('.copy-code, a')
                if (key === 'enter') {
                    // copyCodesStepFocused = true
                }
                return
            }

            if (key === "enter") {
                toggleStepImages(step, e);
                step.scrollIntoView({ behavior: 'instant', block: 'center' });
                const firstCopyCode = e.target.querySelector('.copy-code')
                // copyCodesStepFocused = true
                if (step == lastStep && stepClicked) {
                    copyCodesStepFocused = true
                    // firstCopyCode?.focus()
                }
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
            const stepFloat = getStepFloat(e.target)
            // stepFloat.style.border = '20px solid blue !important'
            // stepFloat.style.background = ' blue !important'
            if (e.target.tagName !== "IMG") {
                denlargeAllImages(allImgs, allVids);
                lastStep = step;
            }
        });

        step.dataset.listenerAdded = "true";
    }
});
function toggleSingleImage(img) {
    img.classList.toggle("enlarge");
    // img.style.zIndex = img.classList.contains("enlarge") ? 100 : 0;
}
function toggleStepImages(step, e) {
    const images = Array.from(step.querySelectorAll(".step-img > img"));
    if (!images.length) return;
    if (images.length === 1) {
        toggleSingleImage(images[0]);
    } else {
        // Multi-image cycling
        if (currentIndex == 2) {
            step.focus();
            denlargeAllImages(allImgs, allVids);
            currentIndex = 0;
        } else {
            // denlargeAllImages(allImgs, allVids);
            if (images[currentIndex]) {
                images[currentIndex].classList.add("enlarge");
                // images[currentIndex].style.zIndex = 100;
                currentIndex += 1;
            }
        }
    }
}
function denlargeAllImages(allImgs, allVids) {
    allImgs.forEach(img => {
        if (img.classList.contains('enlarge')) img.classList.remove("enlarge");
        // img.style.zIndex = 0;
    });
    allVids.forEach(vid => {
        if (vid.classList.contains('first-vid-enlarge')) vid.classList.remove("first-vid-enlarge");

    })
}
function removeStepsFocusEffects(steps) {steps.forEach(el => el.classList.remove('efxFocus'))}
function getStepFloat(target) {
    if (target.classList.contains('step-float')) {
        return target;
    } else if (target.parentElement) {
        return getStepFloat(target.parentElement);
    } else {
        return null;
    }
}
function pauseEnlargeAllVids(allVids) {
    allVids.forEach(vid => {
        if (vid.classList.contains('enlarge')) {
            vid.classList.remove('enlarge')
        }
        if (vid.classList.contains('first-vid-enlarge')) {
            vid.classList.remove('.first-vid-enlarge')
        }
        // console.log(vid.playing)
        if (vid.playing) {
            vid.pause()
        }
    })
}
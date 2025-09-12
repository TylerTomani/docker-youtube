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
            denlargeAllImages(allImgs,allVids);
            pauseEnlargeAllVids(allVids)
            stepClicked = false
            step.scrollIntoView({behavior: 'instant' , inline: 'center'})                
        });
        step.addEventListener("focusin", (e) => { 
            // timeTutorialVid(e) 
            iStep = index;
        })
        step.addEventListener("focusout", () => { denlargeAllImages(allImgs, allVids)})
        
        step.addEventListener("keydown", e => {
            
            let key = e.key.toLowerCase();
            const hasVideo = step.querySelector('video') ? true : false
            if(hasVideo){
                const vid = step.querySelector('video')
                // console.log(vid.currentTime)
                // handleVideo({vid, e,steps,allVids})
                // const copyCodes = document.querySelectorAll('.copy-code, a')
                if(key === 'enter'){
                    // copyCodesStepFocused = true
                }        
                return
            }
            
            if (key === "enter") {
                toggleStepImages(step,e);
                step.scrollIntoView({ behavior: 'instant', block: 'center' });
                const firstCopyCode = e.target.querySelector('.copy-code')
                // copyCodesStepFocused = true
                if(step == lastStep && stepClicked){
                    copyCodesStepFocused = true
                    firstCopyCode?.focus()
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
            handleClickVideo({vid,e,steps,allVids,stepFloat})
        })
        vid.addEventListener('keydown', e => {
            // toggleSingleImage(vid)
            console.log(e.target)
            // handleVideo({vid,e,steps,allVids})
        })
        vid.dataset.listenerAdded = "true";
    }
});

// Initialize copy-code focus behavior

copyCodes.forEach(code => {
    if (!code.dataset.listenerAdded) {
        code.addEventListener("focus", (e) => {
            denlargeAllImages(allImgs, allVids);
            pauseEnlargeAllVids(allVids)
            copyCodesStepFocused = true 


        });
        code.addEventListener('keydown', e => {
            // console.log('add video toggle enlarge here one copy-codes')
            const stepFloat = getStepFloat(e.target.parentElement)
            const vid = stepFloat.querySelector('video')
            toggleVideoSize({ vid, e, steps, stepFloat })
            // handleVideo({vid})
        })
        code.dataset.listenerAdded = "true";
    }
});

// --- Handle step navigation keys ---
 function handleStepKeys(key, e, mainTargetDiv) {
    if (!steps.length) return;

    if (!isNaN(key)) {
        if (!copyCodesStepFocused){
            console.log(e.target)
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



    
// --- Utility ---



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
    step.scrollIntoView({ behavior: 'instant', inline: 'start', block: 'start' });
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


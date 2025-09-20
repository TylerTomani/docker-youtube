// numberNav.js
import { mainTargetDiv, mainTargetDivFocused } from '../core/main-script.js';
import { sideBarLinks } from '../core/inject-content.js';
let lastStep = null;

export function initNumberNav() {
    addEventListener('keydown', e => {
        const key = e.key.toLowerCase();

        // --- Number shortcuts ---
        if (!isNaN(key)) {
            const index = parseInt(key) - 1;
            if (index < 0) return;

            if (!mainTargetDivFocused) {
                // Sidebar navigation
                if (index < sideBarLinks.length) {
                    sideBarLinks[index].focus();
                }
            } else {
                // Lesson navigation
                // const steps = mainTargetDiv.querySelectorAll('.step-float');
                // if (index < steps.length) {
                //     steps[index].focus();
                //     lastStep = steps[index];
                // }
            }
        }

        // --- "m" shortcut ---
        
    });
}

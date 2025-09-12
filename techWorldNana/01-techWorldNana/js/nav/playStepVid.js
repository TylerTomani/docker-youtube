// playStepVid.js
let playing = false;

function playPauseVideo({ vid, e }) {
    if (vid.currentTime === vid.duration) {
        vid.style.border = '2px solid red';
        if (e?.keyCode !== 13) {
            playing = false;
        } else {
            vid.currentTime = 0;
            playing = true;
        }
    }

    if (vid.currentTime === 0) {
        playing = true;
    }

    if (playing) {
        vid.play().catch(err => {
            if (err.name !== "AbortError") {
                console.error("Video play failed:", err);
            }
        });
        vid.playing = true;
        vid.style.border = 'none';
    } else {
        vid.pause();
        vid.playing = false;
        if (vid.currentTime !== vid.duration) {
            vid.style.border = '1px solid blue';
        }
    }
}

export function handleClickVideo({ vid, e, steps, allVids,stepFloat }) {
    playing = !playing;
    toggleVideoSizeClick({ vid, e, steps,stepFloat })
    playPauseVideo({ vid,e });
}

export function handleVideo({ vid, e, steps, allVids }) {    
    videoControls({ vid, e, steps, allVids });
}

function videoControls({ vid, e, steps, allVids }) {
    let key = e.keyCode;
    
    if ((e.shiftKey && key === 39) && vid.currentTime < vid.duration) {
        // console.log('skip +5');
        vid.currentTime += 5;
        return;
    }
    if ((e.shiftKey && key === 37) && vid.currentTime < vid.duration) {
        // console.log('rewind -5');
        vid.currentTime -= 5;
        return;
    }

    switch (key) {
        case 13: // Enter
            if (!vid.classList.contains('enlarge') || vid.classList.contains('first-vid-enlarge')) {
                playing = true;
            }
            toggleVideoSize({ vid, e, steps });
            break;

        case 32: // Space
            e.preventDefault();
            if (vid.currentTime === vid.duration) {
                vid.style.border = 'none';
                vid.currentTime = 0;
                playing = false;
            } else {
                playing = !playing;
            }
            break;

        case 9: // Tab
            denlargeAllVideos({ allVids });
            break;

        case 37: // Left
            vid.currentTime -= 0.5;
            playing = true;
            break;

        case 39: // Right
            vid.currentTime += 0.5;
            playing = true;
            break;
    }

    playPauseVideo({ vid, e });
}

export function toggleVideoSizeClick({ vid, e, steps,stepFloat }) {
    e.preventDefault()
    if (e.target === steps[0] || stepFloat == steps[0]) {
        vid.classList.add('first-vid-enlarge');
    }else {
        vid.classList.add('enlarge');
    }
    
    if(innerWidth < 500){
        // vid.setAttribute('controls','')
    }
    
    videoControls({vid,e})
    e.target.scrollIntoView({ behavior: 'instant', block: 'center' });
}
export function toggleVideoSize({ vid, e, steps,stepFloat }) {
    let key = e.key.toLowerCase();
    
    if (key === 'enter') {
        
        // if (stepFloat === steps[0]) {
        //     vid.classList.toggle('first-vid-enlarge');
        // } else if(e.target === steps[0]){
        //     vid.classList.toggle('first-vid-enlarge');

        // }
        // else {
        // }
        vid.classList.toggle('enlarge');
        vid.scrollIntoView({ behavior: 'instant', block: 'center' });
    }

    if (key === ' ') {
        playing = !playing;
    }
}

export function denlargeAllVideos({ allVids }) {
    allVids.forEach(vid => {
        if (vid.classList.contains('enlarge')) {
            vid.classList.remove('enlarge');
        }
        if (vid.classList.contains('first-vid-enlarge')) {
            vid.classList.remove('first-vid-enlarge');
        }
    });
    playing = !playing
}

export function pauseDenlargeAllVideos({ allVids }) {
    if(!allVids) {
        // allVids = document.querySelectorAll('video')
        vid.classList.remove("enlarge");
        vid.classList.remove("first-vid-enlarge");
    }
    allVids.forEach(vid => {
        vid.classList.remove("enlarge");
        vid.classList.remove("first-vid-enlarge");
        vid.style.border = "none";
        // console.log('vid')
        if (!vid.paused) {
            vid.pause();
        }
    });
}


(function () {
    const darkModeBtn = document.getElementById('darkModeBtn')
    const body = document.querySelector('body')
    addEventListener('keydown', e => {
        let key = e.key.toLowerCase()
        let isShiftPressed = e.shiftKey
        if(key === 'enter'){
        }
        if (isShiftPressed && key == 'k') {
            body.classList.toggle('dark-mode')
        }
    })


    if (darkModeBtn) {

        darkModeBtn.addEventListener('click', (e) => {
            e.preventDefault()
            body.classList.toggle('dark-mode')
        })
        darkModeBtn.addEventListener('keydown', (e) => {
            let key = e.key.toLowerCase()
            if (key == 'enter') {
                e.preventDefault()
                body.classList.toggle('dark-mode')
            }

        })

    }

}())
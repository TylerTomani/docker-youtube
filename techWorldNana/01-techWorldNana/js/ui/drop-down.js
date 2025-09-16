// drop-downs.js
export function initDropDowns() {
    if (!document.listenersAdded) {
        document.addEventListener("click", handleToggle);
        document.addEventListener("keydown", handleToggle);
        document.listenersAdded = true
    }
    hideUlLiUls()
    // const dropChilds = document.querySelectorAll('.code-cmd') ? document.querySelectorAll('.code-cmd') : document.querySelectorAll('.topic-snips')
    function handleToggle(e) {
        let target;
        if (e.type === "keydown") {
            if ((e.key === "Enter" || e.key === " ") && document.activeElement.classList.contains("drop-down")) {
                e.preventDefault();
                target = document.activeElement;
            } else {
                return; // ignore other keys
            }
        } else if (e.type === "click") {
            // Ignore clicks triggered by keyboard
            if (e.detail === 0) return;
            target = e.target.closest(".drop-down");
            if (!target) return;
        }
        // Unified toggle logic
        const li = target.closest("li");
        if (li) {
            toggleTopicSnips(li)
            return
        }
    }
    
}
function hideUlLiUls() {
    const sideBarLinkSubLinks = document.querySelectorAll('.sidebar-links-ul > li > ul')
    sideBarLinkSubLinks.forEach(el => {
        el.classList.toggle('hide')
    })
}
function hideAllCodeCmds() {
    const codeCmds = document.querySelectorAll('.code-cmd')
    codeCmds.forEach(el => {
        if (!el.classList.contains('show')) {
            el.classList.add('hide')
        }
    })


}
function toggleTopicSnips(li) {
    const ul = li.querySelector('ul')
    // console.log(topic)
    ul.classList.toggle("hide"); // example toggle
}


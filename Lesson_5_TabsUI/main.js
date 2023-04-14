    const $ = document.querySelector.bind(document)
    const $$ = document.querySelectorAll.bind(document)

    const tabs = $$('.tab-item')
    const panes = $$('.tab-pane')

    const tabActive = $('.tab-item.active');
    const tabLine = $('.tabs .tab-line')

    
    tabLine.style.left = tabActive.offsetLeft + 'px'
    tabLine.style.width = tabActive.offsetWidth + 'px'


    tabs.forEach((tab, index) => {
        const pane = panes[index];
        tab.onclick = function () {
            $('.tab-item.active').classList.remove('active')
            $('.tab-pane.active').classList.remove('active')

            tabLine.style.left = this.offsetLeft + 'px'
            tabLine.style.width = this.offsetWidth + 'px'

            this.classList.add('active')
            pane.classList.add('active')
        }
})
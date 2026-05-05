const state = {
    currentTemplate: null,
    userData: userData
}

document.addEventListener('DOMContentLoaded', () => {

    const tabsContainer = document.getElementById('template-tabs')

    for (let i = 0; i < letterExample.length; i++) {
        const template = letterExample[i]
        const btn = document.createElement('button')
        btn.textContent = template.name
        btn.addEventListener('click', () => {
            const allBtns = tabsContainer.querySelectorAll('button')
            for (let j = 0; j < allBtns.length; j++) {
                allBtns[j].classList.remove('active')
            }
            btn.classList.add('active')

            state.currentTemplate = findTemplate(template.id)

            const preview = document.getElementById('preview')
            preview.textContent = makeLetter(state.currentTemplate, state.userData, {})
        })
        tabsContainer.appendChild(btn)
    }

})
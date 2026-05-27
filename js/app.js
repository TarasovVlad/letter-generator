import { profile, letterExample } from './data.js';
import { findTemplate, makeLetter, renderExtraFields } from './templates.js';
import { checkKeyPhrases, highlightProblems } from './validation.js'
import { downloadDocx } from './export.js'

const state = {
    currentTemplate: null,
    profile: profile
}

const updatePreview = () => {
    if (state.currentTemplate === null) return

    const extraContainer = document.getElementById('extra-fields')
    const isExtraVisible = extraContainer.classList.contains('extra-fields-visible')

    const fields = {}
    if (isExtraVisible) {
        extraContainer.querySelectorAll('input').forEach(inp => {
            fields[inp.dataset.fieldId] = inp.value
        })
    }

    const preview = document.getElementById('preview')
    const text = makeLetter(state.currentTemplate, state.profile, fields)
    preview.innerHTML = highlightProblems(text)

    document.getElementById('preview').addEventListener('input', () => {
    const text = document.getElementById('preview').textContent
    const warnings = checkKeyPhrases(text, state.currentTemplate?.id)
    const warningsContainer = document.getElementById('style-warnings')
    warningsContainer.innerHTML = ''

    for (let i = 0; i < warnings.length; i++) {
        const p = document.createElement('p')
        p.className = 'warning'
        p.textContent = '⚠ ' + warnings[i]
        warningsContainer.appendChild(p)
    }
})
}

const showHints = (template) => {
    const hintsBox = document.getElementById('hints-box')
    const hintsList = document.getElementById('hints-list')

    if (template === null || !template.hints) {
        hintsBox.style.display = 'none'
        return
    }

    hintsList.innerHTML = ''
    for (let i = 0; i < template.hints.length; i++) {
        const item = document.createElement('p')
        item.className = 'hint-item'
        item.textContent = template.hints[i]
        hintsList.appendChild(item)
    }

    hintsBox.style.display = 'block'
}

const showNotification = (message, type) => {
    const el = document.getElementById('notification')
    el.textContent = message
    el.className = 'notification ' + type
    el.style.display = 'block'

    setTimeout(() => {
        el.style.display = 'none'
    }, 3000)
}

document.addEventListener('DOMContentLoaded', () => {

    const tabsContainer = document.getElementById('template-tabs')
    const toggle = document.getElementById('extra-toggle')
    const extraContainer = document.getElementById('extra-fields')
    const arrow = toggle.querySelector('.arrow')

    document.getElementById('btn-export').addEventListener('click', async () => {
        if (state.currentTemplate === null) {
            showNotification('Сначала выберите тип письма', 'error')
            return
        }
        const preview = document.getElementById('preview')
        const text = preview.textContent
        await downloadDocx(text)
        showNotification('Файл скачан!', 'success')
    })

    toggle.addEventListener('click', () => {
        const isOpen = extraContainer.classList.contains('extra-fields-visible')

        if (isOpen) {
            extraContainer.classList.remove('extra-fields-visible')
            extraContainer.classList.add('extra-fields-hidden')
            arrow.classList.remove('open')
        } else {
            extraContainer.classList.remove('extra-fields-hidden')
            extraContainer.classList.add('extra-fields-visible')
            arrow.classList.add('open')
        }
        
        updatePreview()
    })

    document.getElementById('input-name').addEventListener('input', (e) => {
        state.profile.fullName = e.target.value
        updatePreview()
    })
    document.getElementById('input-pos').addEventListener('input', (e) => {
        state.profile.position = e.target.value
        updatePreview()
    })
    document.getElementById('input-org').addEventListener('input', (e) => {
        state.profile.organization = e.target.value
        updatePreview()
    })
    document.getElementById('input-email').addEventListener('input', (e) => {
        state.profile.email = e.target.value
        updatePreview()
    })
    document.getElementById('input-phone').addEventListener('input', (e) => {
        state.profile.phone = e.target.value
        updatePreview()
    })
    document.getElementById('btn-save').addEventListener('click', () => {
    showNotification('Реквизиты сохранены!', 'success')
    })

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

            toggle.style.display = 'flex'
            extraContainer.classList.remove('extra-fields-visible')
            extraContainer.classList.add('extra-fields-hidden')
            arrow.classList.remove('open')

            renderExtraFields(extraContainer, state.currentTemplate)

            extraContainer.querySelectorAll('input').forEach(input => {
                input.addEventListener('input', () => updatePreview())
            })

            updatePreview()

            showHints(state.currentTemplate)
        })
        tabsContainer.appendChild(btn)
    }

})
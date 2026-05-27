import { letterExample } from './data.js';

const findTemplate = (templateID) => {
    for (let i = 0; i < letterExample.length; i++) {
        if (letterExample[i].id === templateID) {
            return letterExample[i]
        }
    }
    return null
}

const makeLetter = (template, user, fields) => {
    if (template === null) {
        return ''
    }
    return template.generate(user, fields)
}

const renderExtraFields = (container, template) => {
    container.innerHTML = ''
    if (template === null) return

    for (let i = 0; i < template.extraFields.length; i++) {
        const field = template.extraFields[i]

        const wrapper = document.createElement('div')
        wrapper.className = 'field-group'

        const label = document.createElement('label')
        label.textContent = field.label + (field.required ? ' *' : '')

        const input = document.createElement('input')
        input.type = 'text'
        input.dataset.fieldId = field.id
        input.placeholder = field.required ? 'Обязательное поле' : 'Необязательно'

        wrapper.appendChild(label)
        wrapper.appendChild(input)
        container.appendChild(wrapper)
    }
}

export { findTemplate, makeLetter, renderExtraFields };
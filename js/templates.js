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
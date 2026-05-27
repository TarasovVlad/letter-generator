const checkKeyPhrases = (text, templateId) => {
    const warnings = []

    if (!text.toLowerCase().includes('с уважением')) {
        warnings.push('Добавьте вежливую подпись "С уважением,"')
    }

    if (templateId === 'dayoff') {
        if (!text.toLowerCase().includes('прошу')) {
            warnings.push('Заявление должно содержать слово "Прошу"')
        }
        if (!text.toLowerCase().includes('заявление')) {
            warnings.push('Документ должен содержать заголовок "ЗАЯВЛЕНИЕ"')
        }
    }

    if (templateId === 'commercial') {
        if (!text.toLowerCase().includes('предлагаем')) {
            warnings.push('Коммерческое предложение должно содержать слово "предлагаем"')
        }
        if (!text.toLowerCase().includes('действительно до')) {
            warnings.push('Укажите срок действия предложения "действительно до"')
        }
    }

    if (templateId === 'complaint') {
        if (!text.toLowerCase().includes('прошу')) {
            warnings.push('Претензия должна содержать требование "прошу"')
        }
        if (!text.toLowerCase().includes('договор')) {
            warnings.push('Укажите номер договора')
        }
    }

    if (templateId === 'cover') {
        if (!text.toLowerCase().includes('резюме')) {
            warnings.push('Сопроводительное письмо должно упоминать резюме')
        }
    }

    if (templateId === 'invitation') {
        if (!text.toLowerCase().includes('дата и время')) {
            warnings.push('Укажите дату и время мероприятия')
        }
        if (!text.toLowerCase().includes('подтвердить участие')) {
            warnings.push('Попросите подтвердить участие')
        }
    }

    return warnings
}

const highlightProblems = (text) => {
    const bureaucraticWords = [
        'осуществить', 'осуществляет', 'произвести', 'является', 'данный',
        'вышеуказанный', 'нижеследующий', 'надлежащий', 'соответствующий',
        'в целях', 'во избежание', 'принять меры', 'довести до сведения'
    ]

    let result = text

    bureaucraticWords.forEach(word => {
        const regex = new RegExp(`(${word})`, 'gi')
        result = result.replace(regex, '<mark class="highlight-bureaucratic">$1</mark>')
    })

    result = result.replace(/([^.!?\n]+[.!?])/g, (sentence) => {
        const wordCount = sentence.trim().split(/\s+/).length
        if (wordCount > 20) {
            return `<span class="highlight-long">${sentence}</span>`
        }
        return sentence
    })

    return result
}

export { checkKeyPhrases, highlightProblems }
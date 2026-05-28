// validation.js - проверка стиля и подсветка проблем в тексте

// Проверяет корректность email
// Паттерн: текст @ текст . текст (например ivanov@example.com)
const isValidEmail = (email) => {
    const pattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    return pattern.test(email)
}

// Проверяет корректность телефона
// Допускает: +7, 8, скобки, дефисы, пробелы
const isValidPhone = (phone) => {
    const pattern = /^[+]?[78][\s-]?\(?\d{3}\)?[\s-]?\d{3}[\s-]?\d{2}[\s-]?\d{2}$/
    return pattern.test(phone.replace(/\s/g, ''))
}

// Проверяет обязательные поля формы перед экспортом
// Возвращает массив ошибок — если пустой, всё ок
const validateForm = (profile) => {
    const errors = []

    if (!profile.fullName.trim()) {
        errors.push('Укажите ФИО')
    }
    if (!profile.organization.trim()) {
        errors.push('Укажите организацию')
    }
    if (!profile.position.trim()) {
        errors.push('Укажите должность')
    }
    if (profile.email && !isValidEmail(profile.email)) {
        errors.push('Некорректный email — пример: ivanov@example.com')
    }
    if (profile.phone && !isValidPhone(profile.phone)) {
        errors.push('Некорректный телефон — пример: +7 (999) 000-00-00')
    }

    return errors
}

// Проверяет текст письма на наличие ключевых фраз.
// Принимает:
//   text       - текст письма из предпросмотра
//   templateId - id текущего шаблона ('dayoff', 'commercial' и т.д.)
// Возвращает массив предупреждений (строк)
// Если массив пустой - всё в порядке
const checkKeyPhrases = (text, templateId) => {
    const warnings = []

    // Проверка для всех шаблонов - вежливая подпись
    if (!text.toLowerCase().includes('с уважением')) {
        warnings.push('Добавьте вежливую подпись "С уважением,"')
    }

    // Проверки специфичные для заявления на отгул
    if (templateId === 'dayoff') {
        if (!text.toLowerCase().includes('прошу')) {
            warnings.push('Заявление должно содержать слово "Прошу"')
        }
        if (!text.toLowerCase().includes('заявление')) {
            warnings.push('Документ должен содержать заголовок "ЗАЯВЛЕНИЕ"')
        }
    }

    // Проверки для коммерческого предложения
    if (templateId === 'commercial') {
        if (!text.toLowerCase().includes('предлагаем')) {
            warnings.push('Коммерческое предложение должно содержать слово "предлагаем"')
        }
        if (!text.toLowerCase().includes('действительно до')) {
            warnings.push('Укажите срок действия предложения "действительно до"')
        }
    }

    // Проверки для претензии
    if (templateId === 'complaint') {
        if (!text.toLowerCase().includes('прошу')) {
            warnings.push('Претензия должна содержать требование "прошу"')
        }
        if (!text.toLowerCase().includes('договор')) {
            warnings.push('Укажите номер договора')
        }
    }

    // Проверки для сопроводительного письма
    if (templateId === 'cover') {
        if (!text.toLowerCase().includes('резюме')) {
            warnings.push('Сопроводительное письмо должно упоминать резюме')
        }
    }

    // Проверки для приглашения
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

// Подсвечивает проблемные места в тексте письма
// Принимает: text - plain текст письма
// Возвращает: HTML строку с тегами подсветки
const highlightProblems = (text) => {

    // Список канцеляризмов - слова которые делают текст тяжёлым
    const bureaucraticWords = [
        'осуществить', 'осуществляет', 'произвести', 'является', 'данный',
        'вышеуказанный', 'нижеследующий', 'надлежащий', 'соответствующий',
        'в целях', 'во избежание', 'принять меры', 'довести до сведения'
    ]

    let result = text

    // Шаг 1: оборачиваем каждый канцеляризм в тег <mark>
    // RegExp с флагом 'gi' - ищет без учёта регистра, все вхождения
    bureaucraticWords.forEach(word => {
        const regex = new RegExp(`(${word})`, 'gi')
        result = result.replace(regex, '<mark class="highlight-bureaucratic">$1</mark>')
    })

    // Шаг 2: ищем длинные предложения (больше 20 слов)
    // Разбиваем текст по точке, восклицательному и вопросительному знакам
    result = result.replace(/([^.!?\n]+[.!?])/g, (sentence) => {
        const wordCount = sentence.trim().split(/\s+/).length
        if (wordCount > 20) {
            return `<span class="highlight-long">${sentence}</span>`
        }
        return sentence
    })

    return result
}

export { checkKeyPhrases, highlightProblems, validateForm }
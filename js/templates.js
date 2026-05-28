// templates.js - логика поиска шаблона и сборки письма

import { letterExample } from './data.js';

// Ищет шаблон в массиве letterExample по его уникальному id
// Перебирает массив циклом и возвращает первый совпавший элемент
// Если шаблон не найден - возвращает null
const findTemplate = (templateID) => {
    for (let i = 0; i < letterExample.length; i++) {
        if (letterExample[i].id === templateID) {
            return letterExample[i]
        }
    }
    return null
}

// Собирает итоговый текст письма.
// Принимает:
//   template - объект шаблона из letterExample
//   user     - объект профиля пользователя (profile)
// Вызывает функцию generate из шаблона и возвращает готовый текст
// Если шаблон не выбран (null) возвращает пустую строку
const makeLetter = (template, user) => {
    if (template === null) {
        return ''
    }
    return template.generate(user)
}


export { findTemplate, makeLetter };
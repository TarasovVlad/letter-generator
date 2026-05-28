// app.js - точка входа, связывает все модули вместе
// Отвечает за: инициализацию, обработчики событий, состояние

import { profile, letterExample } from './data.js';
import { findTemplate, makeLetter } from './templates.js';
import { checkKeyPhrases, highlightProblems, validateForm } from './validation.js'
import { downloadDocx } from './export.js'

// Глобальное состояние приложения
// Все модули работают через этот объект - не через глобальные переменные
const state = {
    currentTemplate: null, // текущий выбранный шаблон (объект или null)
    profile: profile // данные пользователя (ссылка на объект из data.js)
}


// Сохраняет данные профиля в localStorage
// Вызывается при нажатии кнопки «Сохранить реквизиты»
// JSON.stringify превращает объект в строку для хранения
const saveUserData = () => {
    localStorage.setItem('profile', JSON.stringify(state.profile))
}

// Загружает данные профиля из localStorage при старте страницы
// Если данных нет - используется профиль по умолчанию из data.js
// JSON.parse превращает строку обратно в объект
const loadUserData = () => {
    const saved = localStorage.getItem('profile')
    if (saved) {
        const data = JSON.parse(saved)
        state.profile.fullName = data.fullName
        state.profile.position = data.position
        state.profile.organization = data.organization
        state.profile.email = data.email
        state.profile.phone = data.phone
    }
}

// Проверяет текст письма на ключевые фразы и показывает предупреждения
// Вызывается при каждом обновлении предпросмотра
const showWarnings = (text) => {
    const warnings = checkKeyPhrases(text, state.currentTemplate?.id)
    const warningsContainer = document.getElementById('style-warnings')
    warningsContainer.innerHTML = ''
    for (let i = 0; i < warnings.length; i++) {
        const p = document.createElement('p')
        p.className = 'warning'
        p.textContent = '⚠ ' + warnings[i]
        warningsContainer.appendChild(p)
    }
}

// Обновляет предпросмотр письма
// Собирает текст из текущего шаблона и профиля
// Подсвечивает проблемные места и показывает предупреждения
const updatePreview = () => {
    if (state.currentTemplate === null) return

    const preview = document.getElementById('preview')
    const text = makeLetter(state.currentTemplate, state.profile, {})

    // innerHTML позволяет вставить HTML с тегами подсветки
    preview.innerHTML = highlightProblems(text)
    showWarnings(text)
}

// Показывает подсказки по стилю для выбранного шаблона
// Берёт hints из объекта шаблона и рендерит их в блок hints-box
// Если подсказок нет - скрывает блок
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

// Показывает всплывающее уведомление внизу экрана.
// Принимает:
//   message - текст уведомления
//   type    - 'success' (зелёный) или 'error' (красный)
// Уведомление исчезает автоматически через 3 секунды
const showNotification = (message, type) => {
    const el = document.getElementById('notification')
    el.textContent = message
    el.className = 'notification ' + type
    el.style.display = 'block'

    // setTimeout - встроенная функция браузера, выполняет код через N мс
    setTimeout(() => {
        el.style.display = 'none'
    }, 3000)
}

// Переключает тёмную/светлую тему.
// Сохраняет выбор в localStorage чтобы тема сохранялась после перезагрузки.
const toggleTheme = () => {
    document.body.classList.toggle('dark')
    const isDark = document.body.classList.contains('dark')
    localStorage.setItem('theme', isDark ? 'dark' : 'light')
    document.getElementById('theme-toggle').textContent = isDark ? '☀️' : '🌙'
}

// Инициализация - запускается когда HTML страница полностью загружена
document.addEventListener('DOMContentLoaded', () => {

    // Загружаем сохранённую тему
    const savedTheme = localStorage.getItem('theme')
    if (savedTheme === 'dark') {
    document.body.classList.add('dark')
    document.getElementById('theme-toggle').textContent = '☀️'
    }

    // Вешаем обработчик на кнопку
    document.getElementById('theme-toggle').addEventListener('click', toggleTheme)
    // Загружаем сохранённые реквизиты и заполняем форму
    loadUserData()
    document.getElementById('input-name').value = state.profile.fullName
    document.getElementById('input-pos').value = state.profile.position
    document.getElementById('input-org').value = state.profile.organization
    document.getElementById('input-email').value = state.profile.email
    document.getElementById('input-phone').value = state.profile.phone

    const tabsContainer = document.getElementById('template-tabs')

    // Кнопка «Скачать DOCX» - генерирует и скачивает файл
    document.getElementById('btn-export').addEventListener('click', async () => {
        if (state.currentTemplate === null) {
            showNotification('Сначала выберите тип письма', 'error')
            return
        }

        // Проверяем форму перед экспортом
        const errors = validateForm(state.profile)
            if (errors.length > 0) {
            showNotification(errors[0], 'error')
            return
        }
        const preview = document.getElementById('preview')
        const text = preview.textContent
        await downloadDocx(text)
        showNotification('Файл скачан!', 'success')
    })

    // Кнопка «Сохранить реквизиты» - записывает данные в localStorage
    document.getElementById('btn-save').addEventListener('click', () => {
        const errors = validateForm(state.profile)
        if (errors.length > 0) {
            showNotification(errors[0], 'error')
            return
        }
        saveUserData()
        showNotification('Реквизиты сохранены!', 'success')
    })

    // При редактировании текста прямо в предпросмотре - обновляем предупреждения
    document.getElementById('preview').addEventListener('input', () => {
        const text = document.getElementById('preview').textContent
        showWarnings(text)
    })

    // Обновляем state.profile и предпросмотр при вводе в поля реквизитов
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

    // Создаём кнопку для каждого шаблона из массива letterExample
    for (let i = 0; i < letterExample.length; i++) {
        const template = letterExample[i]
        const btn = document.createElement('button')
        btn.textContent = template.name
        btn.addEventListener('click', () => {
            // Убираем активный класс со всех кнопок
            const allBtns = tabsContainer.querySelectorAll('button')
            for (let j = 0; j < allBtns.length; j++) {
                allBtns[j].classList.remove('active')
            }
            // Ставим активный класс на нажатую кнопку
            btn.classList.add('active')

            // Обновляем состояние и перерисовываем предпросмотр
            state.currentTemplate = findTemplate(template.id)
            updatePreview()
            showHints(state.currentTemplate)
        })
        tabsContainer.appendChild(btn)
    }

})
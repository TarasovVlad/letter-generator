const profile = {
    fullName: 'Иванов Иван Иванович',
    position: 'Менеджер',
    organization: 'ООО "Компания"',
    email: 'ivanov@example.com',
    phone: '+7 (999) 000-00-00',
};

const letterExample = [
    {
    id: 'dayoff',
    name: 'Отгул',
    extraFields: [
        { id: 'managerPosition', label: 'Должность руководителя', required: true },
        { id: 'managerOrg',      label: 'Организация руководителя', required: true },
        { id: 'managerName',     label: 'ФИО руководителя', required: true },
        { id: 'dates',           label: 'Дата(ы) отгула', required: true },
        { id: 'reason',          label: 'Основание (отработанного времени / без сохранения з/п)', required: true },
        { id: 'basis',           label: 'Обоснование (работа в выходной ДД.ММ.ГГГГ)', required: false },
        { id: 'date',            label: 'Дата заявления', required: true },
    ],
    hints: [
    'Укажите точную дату отгула в формате ДД.ММ.ГГГГ',
    'Основание: "в счёт ранее отработанного времени" или "без сохранения з/п"',
    'Обязательно укажите должность и ФИО руководителя',
    'Дата заявления должна быть не позже даты отгула'
    ],
    generate(profile, fields) {
  return `
${fields.managerPosition || ''}
${fields.managerOrg || ''}
${fields.managerName || ''}

от ${profile.fullName}
должность: ${profile.position}
тел.: ${profile.phone}

ЗАЯВЛЕНИЕ

Прошу предоставить мне отгул ${fields.dates || ''}
в счёт ${fields.reason || ''}.

Основание: ${fields.basis || ''}.

${fields.date || ''}          ___________/ ${profile.fullName}
  `.trim();
}
},

{
    id: 'commercial',
    name: 'Коммерческое предложение',
    extraFields: [
        { id: 'companyAddress', label: 'Адрес компании',          required: true },
        { id: 'docNumber',      label: 'Номер документа',         required: true },
        { id: 'docDate',        label: 'Дата (ДД.ММ.ГГГГ)',       required: true },
        { id: 'recipient',      label: 'ФИО/должность получателя', required: true },
        { id: 'description',    label: 'Описание товара/услуги',   required: true },
        { id: 'item1',          label: 'Позиция 1 (название / цена / срок)', required: true },
        { id: 'item2',          label: 'Позиция 2 (название / цена / срок)', required: false },
        { id: 'item3',          label: 'Позиция 3 (название / цена / срок)', required: false },
        { id: 'conditions',     label: 'Условия (сроки, оплата, гарантии)', required: true },
        { id: 'validUntil',     label: 'Предложение действительно до', required: true },
    ],
    hints: [
    'Обращайтесь к получателю по имени и отчеству',
    'Опишите товар/услугу конкретно — цена, сроки, условия',
    'Укажите срок действия предложения',
    'Избегайте канцеляризмов: "осуществить", "произвести"'
    ],
    generate(profile, fields) {
        return `${profile.organization}
${fields.companyAddress || ''}
${profile.email} · ${profile.phone}

КОММЕРЧЕСКОЕ ПРЕДЛОЖЕНИЕ
№ ${fields.docNumber || ''} от ${fields.docDate || ''}

Уважаемый(-ая) ${fields.recipient || ''},

Компания ${profile.organization} рада предложить вам ${fields.description || ''}.

Что мы предлагаем:
— ${fields.item1 || ''}${(fields.item2 || '') ? '\n— ' + (fields.item2 || '') : ''}${(fields.item3 || '') ? '\n— ' + (fields.item3 || '') : ''}

Условия: ${fields.conditions || ''}.

Предложение действительно до ${fields.validUntil || ''}.

Будем рады ответить на ваши вопросы и обсудить детали.


МЕНЕДЖЕР
${profile.fullName}
${profile.position}

ПОДПИСЬ / ПЕЧАТЬ
_____________________`
    }
},

{
    id: 'cover',
    name: 'Сопроводительное письмо',
    extraFields: [
        { id: 'vacancy',      label: 'Название вакансии',               required: true },
        { id: 'recipient',    label: 'ФИО или «команда HR»',            required: true },
        { id: 'experience',   label: 'Лет опыта и сфера',               required: true },
        { id: 'skill1',       label: 'Навык / достижение 1',            required: true },
        { id: 'skill2',       label: 'Навык / достижение 2',            required: false },
        { id: 'skill3',       label: 'Навык / достижение 3',            required: false },
        { id: 'motivation',   label: 'Что привлекает в компании',       required: true },
        { id: 'date',         label: 'Дата (ДД.ММ.ГГГГ)',               required: true },
    ],
    hints: [
    'Укажите конкретную вакансию на которую претендуете',
    'Навыки должны соответствовать требованиям вакансии',
    'Не пересказывайте резюме — покажите мотивацию',
    'Письмо не должно быть длиннее одной страницы'
    ],
    generate(profile, fields) {
        return `${profile.fullName}
${profile.position}
${profile.email} · ${profile.phone}

СОПРОВОДИТЕЛЬНОЕ ПИСЬМО
к резюме на позицию ${fields.vacancy || ''}

Уважаемый(-ая) ${fields.recipient || ''},

Меня заинтересовала вакансия ${fields.vacancy || ''} в компании ${profile.organization}. Имею ${fields.experience || ''}.

Ключевые компетенции, которые я готов(а) предложить:
— ${fields.skill1 || ''}${fields.skill2 ? '\n— ' + fields.skill2 : ''}${fields.skill3 ? '\n— ' + fields.skill3 : ''}

Меня привлекает ${fields.motivation || ''}.

Готов(а) рассмотреть детали в удобное для вас время. Резюме приложено.

С уважением,
${profile.fullName}

ДАТА
${fields.date || ''}

ПОДПИСЬ
_____________________`
    }
},

{
    id: 'complaint',
    name: 'Претензия',
    extraFields: [
        { id: 'recipientOrg',   label: 'Наименование организации-получателя', required: true },
        { id: 'recipientAddr',  label: 'Адрес организации-получателя',        required: true },
        { id: 'claimantAddr',   label: 'Ваш адрес',                           required: true },
        { id: 'docNumber',      label: 'Номер претензии',                     required: true },
        { id: 'docDate',        label: 'Дата претензии (ДД.ММ.ГГГГ)',         required: true },
        { id: 'contractDate',   label: 'Дата договора/покупки (ДД.ММ.ГГГГ)', required: true },
        { id: 'contractNumber', label: 'Номер договора',                      required: true },
        { id: 'violation1',     label: 'Нарушение 1',                         required: true },
        { id: 'violation2',     label: 'Нарушение 2',                         required: false },
        { id: 'evidence',       label: 'Подтверждающие документы',            required: true },
        { id: 'lawBase',        label: 'Правовое основание (ст. ГК РФ и т.д.)', required: true },
        { id: 'deadline',       label: 'Срок исполнения (ДД.ММ.ГГГГ)',        required: true },
        { id: 'demand',         label: 'Требование',                          required: true },
        { id: 'attachments',    label: 'Приложения (список документов)',       required: false },
    ],
    hints: [
    'Укажите номер и дату договора — это обязательно',
    'Описывайте нарушения конкретно: дата, сумма, факт',
    'Приложите подтверждающие документы: чек, акт, фото',
    'Укажите разумный срок для ответа — обычно 10-30 дней'
    ],
    generate(profile, fields) {
        return `${fields.recipientOrg || ''}
${fields.recipientAddr || ''}

от ${profile.fullName}
адрес: ${fields.claimantAddr || ''}
тел.: ${profile.phone} · ${profile.email}

ПРЕТЕНЗИЯ
№ ${fields.docNumber || ''} от ${fields.docDate || ''}

${fields.contractDate || ''} между мной и ${fields.recipientOrg || ''} был заключён договор № ${fields.contractNumber || ''}.

В ходе исполнения были выявлены следующие нарушения:
— ${fields.violation1 || ''}${fields.violation2 ? '\n— ' + fields.violation2 : ''}

Данные нарушения подтверждаются: ${fields.evidence}.

На основании ${fields.lawBase || ''} прошу в срок до ${fields.deadline || ''}:
— ${fields.demand || ''}

При неурегулировании претензии в указанный срок оставляю за собой право обратиться в суд и/или контролирующие органы.

ПРИЛОЖЕНИЯ
${fields.attachments || '—'}

ПОДПИСЬ / ПЕЧАТЬ
_____________________ / ${profile.fullName}`
    }
},

{
    id: 'invitation',
    name: 'Приглашение',
    extraFields: [
        { id: 'companyAddress', label: 'Адрес организации',              required: true },
        { id: 'recipient',      label: 'ФИО / должность приглашённого',  required: true },
        { id: 'eventName',      label: 'Название мероприятия',           required: true },
        { id: 'eventType',      label: 'Тип (конференция / встреча...)', required: true },
        { id: 'eventDate',      label: 'Дата и время (ДД.ММ.ГГГГ ЧЧ:ММ)', required: true },
        { id: 'eventPlace',     label: 'Место / ссылка на площадку',     required: true },
        { id: 'eventFormat',    label: 'Формат (очный / онлайн...)',     required: true },
        { id: 'program',        label: 'Программа мероприятия',          required: true },
        { id: 'confirmDate',    label: 'Подтвердить участие до',         required: true },
        { id: 'contactName',    label: 'ФИО ответственного за контакт', required: true },
        { id: 'contactPos',     label: 'Должность ответственного',       required: true },
        { id: 'contactPhone',   label: 'Телефон / email ответственного', required: true },
    ],
    hints: [
    'Укажите точную дату, время и место мероприятия',
    'Попросите подтвердить участие заранее',
    'Укажите формат: очный, онлайн или гибридный',
    'Добавьте контакт ответственного для вопросов'
    ],
    generate(profile, fields) {
        return `${profile.organization}
${fields.companyAddress || ''}
${profile.email} · ${profile.phone}

ПРИГЛАШЕНИЕ
на ${fields.eventName || ''}

Уважаемый(-ая) ${fields.recipient || ''},

${profile.organization} приглашает вас принять участие в ${fields.eventName || ''}: ${fields.eventType || ''}.

Дата и время: ${fields.eventDate || ''}
Место проведения: ${fields.eventPlace || ''}
Формат: ${fields.eventFormat || ''}

Программа мероприятия включает: ${fields.program || ''}.

Просим подтвердить участие до ${fields.confirmDate || ''} по контактам ниже.

Будем рады видеть вас!

КОНТАКТ ДЛЯ ПОДТВЕРЖДЕНИЯ
${fields.contactName || ''}
${fields.contactPos || ''}
${fields.contactPhone || ''}

ПОДПИСЬ / ПЕЧАТЬ
_____________________`
    }
}
]

export { profile, letterExample };
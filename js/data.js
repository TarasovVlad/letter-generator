const userData = {
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
            { 
                id: 'date',
                label: 'Дата отгула',
                required: true
            }
        ],
        generate(user, fields) {
            return `Прошу предоставить мне отгул ${fields.date}.
            
C уважением,
${user.fullName}`
        }
    }
]
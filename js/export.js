// export.js - генерация и скачивание файла .docx
// Использует библиотеку docx подключённую через index.html

// Генерирует файл .docx из текста письма и скачивает его
// Принимает: text - plain текст из предпросмотра
// Алгоритм:
//   1. Разбивает текст на строки
//   2. Каждую строку превращает в параграф docx
//   3. Заголовки (ЗАЯВЛЕНИЕ, ПРЕТЕНЗИЯ и т.д.) - по центру жирным
//   4. Создаёт документ с полями страницы как в ГОСТ
//   5. Генерирует blob и скачивает через временную ссылку
const downloadDocx = async (text) => {

    // Берём нужные классы из библиотеки docx (подключена в index.html)
    const { Document, Packer, Paragraph, TextRun, AlignmentType } = window.docx

    // Разбиваем текст на строки - каждая строка станет отдельным параграфом
    const lines = text.split('\n')

    // Превращаем каждую строку в параграф документа
    const paragraphs = lines.map(line => {
        const trimmed = line.trim()

        // Определяем заголовок: строка полностью заглавными буквами
        // длиной от 3 до 29 символов (ЗАЯВЛЕНИЕ, ПРЕТЕНЗИЯ и т.д.)
        const isHeader = trimmed === trimmed.toUpperCase() && trimmed.length > 2 && trimmed.length < 30

        return new Paragraph({
            
            // Заголовки выравниваем по центру, остальное по левому краю
            alignment: isHeader ? AlignmentType.CENTER : AlignmentType.LEFT,
            spacing: { after: 120 }, // отступ после параграфа
            children: [
                new TextRun({
                    text: line,
                    font: 'Times New Roman', // шрифт по ГОСТ для деловых писем
                    size: 24, // 12pt (размер в half-points: 24 = 12pt)
                    bold: isHeader, // заголовки жирным
                    color: "000000"
                })
            ]
        })
    })
    
    // Создаём документ с полями страницы (в twips: 1440 twips = 1 дюйм = 2.54 см)
    // top: 2 см, right: 1.5 см, bottom: 2 см, left: 2.5 см - стандарт ГОСТ
    const doc = new Document({
        sections: [{
            properties: {
                page: {
                    margin: { top: 1440, right: 1008, bottom: 1440, left: 1800 }
                }
            },
            children: paragraphs
        }]
    })

    // Генерируем бинарные данные файла
    const blob = await Packer.toBlob(doc)

    // Создаём временную ссылку и программно кликаем по ней -
    // браузер начинает скачивание файла
    const url = URL.createObjectURL(blob)
    const link = document.createElement('a')
    link.href = url
    link.download = 'letter.docx'
    link.click()

    // Освобождаем память - временная ссылка больше не нужна
    URL.revokeObjectURL(url)
}

export { downloadDocx }
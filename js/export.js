const downloadDocx = async (text) => {
    const { Document, Packer, Paragraph, TextRun, AlignmentType } = window.docx

    const lines = text.split('\n')

    const paragraphs = lines.map(line => {
        const trimmed = line.trim()

        const isHeader = trimmed === trimmed.toUpperCase() && trimmed.length > 2 && trimmed.length < 30

        return new Paragraph({
            alignment: isHeader ? AlignmentType.CENTER : AlignmentType.LEFT,
            spacing: { after: 120 },
            children: [
                new TextRun({
                    text: line,
                    font: 'Times New Roman',
                    size: 24,
                    bold: isHeader
                })
            ]
        })
    })

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

    const blob = await Packer.toBlob(doc)
    const url = URL.createObjectURL(blob)
    const link = document.createElement('a')
    link.href = url
    link.download = 'letter.docx'
    link.click()
    URL.revokeObjectURL(url)
}

export { downloadDocx }
const inq = require('inquirer')
const fs = require('fs')
const inquirer = require('inquirer')

const questionPrompts = [
    'Title',
    'Description',
    'Installation Instructions',
    'Usage Information',
    'Contribution Guidelines',
    'Test Instructions'
]

let questions = []
for (questionPrompt of questionPrompts) questions.push({
    type: 'input',
    name: questionPrompt,
    message: questionPrompt
})

inquirer.prompt(questions).then(createReadme).catch(error => console.error(error))

function createReadme(answers) {
    console.log(answers)
    let title = `# ${answers['Title']}`
    saveReadme(title)
}

function saveReadme(content) {
    fs.writeFile('README_created.md', content, err => {
        if (err) throw err;
        console.log('Saved!')
    })
}
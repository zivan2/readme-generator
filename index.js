const inq = require('inquirer')
const fs = require('fs')
const inquirer = require('inquirer')
const https = require('https')

let questions = []
for (questionPrompt of [
    'Title',
    'Description',
    'Installation Instructions',
    'Usage Information',
    'Contribution Guidelines',
    'Test Instructions'
]) questions.push({
    type: 'input',
    name: questionPrompt,
    message: questionPrompt
})

questions = questions.concat([
    {
        type: 'list',
        name: 'License',
        message: 'Choose a License',
        choices: ['GNU AGPLv3', 'GNU GPLv3', 'GNU LGPLv3', 'Mozilla Public License 2.0', 'Apache License 2.0', 'MIT License', 'Boost Software License 1.0']
    },
    {
        type: 'input',
        name: 'Github Username',
        message: "Github Username",
        validate: async function (value) {
            return await checkExistingUser(value)
        },
    },
    {
        type: 'input',
        name: 'Email Address',
        message: 'Email Address',
        validate: function(email) {
            let re = /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
            if (!re.test(String(email).toLowerCase())) {
                return 'Invalid Email.'
            } else {
                return true
            }
        }
    }
])

function checkExistingUser(user) {
    let outsideResolve
    https.request({
        host: 'api.github.com',
        path: `/users/${user}`,
        method: 'GET',
        headers: {'user-agent': 'node.js'}
    }, (response) => {
        let respDat = ''
        response.on('data', chunk => respDat += chunk)
        response.on('end', () => {
            if (response.statusCode.toString()[0] == '4') {

                outsideResolve('Invalid username.')
            } else {
                outsideResolve(true)
            }
        })
    }).end()

    return new Promise(resolve => outsideResolve = resolve)
}


inquirer.prompt(questions).then(createReadme).catch(error => console.error(error))



function createReadme(answers) {
    console.log(answers)
    let licenseBadge
    ['GNU AGPLv3', 'GNU GPLv3', 'GNU LGPLv3', 'Mozilla Public License 2.0', 'Apache License 2.0', 'MIT License', 'Boost Software License 1.0']
    switch (answers['License']) {
        case 'GNU AGPLv3':
            licenseBadge = '[![License: AGPL v3](https://img.shields.io/badge/License-AGPL%20v3-blue.svg)](https://www.gnu.org/licenses/agpl-3.0)'
            break
        case 'GNU GPLv3':
            licenseBadge = '[![License: GPL v3](https://img.shields.io/badge/License-GPLv3-blue.svg)](https://www.gnu.org/licenses/gpl-3.0)'
            break
        case 'Mozilla Public License 2.0':
            licenseBadge = '[![License: MPL 2.0](https://img.shields.io/badge/License-MPL%202.0-brightgreen.svg)](https://opensource.org/licenses/MPL-2.0)'
            break
        case 'MIT License':
            licenseBadge = '[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)'
            break
        case 'Apache License 2.0':
            licenseBadge = '[![License](https://img.shields.io/badge/License-Apache%202.0-blue.svg)](https://opensource.org/licenses/Apache-2.0)'
            break
        case 'Boost Software License 1.0':
            licenseBadge = '[![License](https://img.shields.io/badge/License-Boost%201.0-lightblue.svg)](https://www.boost.org/LICENSE_1_0.txt)'
            break

    }
    
    let content = `
# ${answers['Title']}
${licenseBadge}
## Description
${answers['Description']}
## Table of Contents
- [Installation](#installation)
- [Usage](#usage)
- [Contributing](#contributing)
- [License](#license)
- [Tests](#tests)
- [Questions](#questions)
## Installation
${answers['Installation Instructions']}
## Usage
${answers['Usage Information']}
## Contributing
${answers['Contribution Guidelines']}
## License
This work is licensed under the ${answers['License']}
## Tests
${answers['Test Instructions']}
## Questions
[My github profile](https://github.com/${answers['Github Username']})  
Additional questions via email: [${answers['Email Address']}](mailto:${answers['Email Address']})
    `
    saveReadme(content)
}

function saveReadme(content) {
    fs.writeFile('README_created.md', content, err => {
        if (err) throw err
        console.log('Saved!')
    })
}

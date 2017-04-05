var Generator = require('yeoman-generator');

module.exports = class extends Generator {
    // The name `constructor` is important here
    constructor(args, opts) {
        // Calling the super constructor is important so our generator is correctly set up
        super(args, opts);

        // Next, add your custom code
        this.option('babel'); // This method adds support for a `--babel` flag
    }

    prompting() {
        return this.prompt([{
            type: 'input',
            name: 'name',
            message: 'Your project name',
            default: this.appname // Default to current folder name
        }]).then((answers) => {
            this.log('app name', answers.name);

            this.answers = answers;
        });
    }

    writing() {
        console.log(`haha ${this.appname}`);
        this.fs.copyTpl(
            this.templatePath('./'),
            this.destinationPath('./'),
            {name: this.answers.name}
        );
        // Copy all dotfiles
        this.fs.copy(
            this.templatePath('./**/.*'),
            this.destinationRoot('./')
        );
    }


    install() {
        this.spawnCommand('cnpm', ['install']);
        this.spawnCommand('cnpm', ['install'], {
            cwd: './static/'
        });
    }
};

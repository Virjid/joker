const ejs = require('ejs');
const fs = require('fs');

module.exports = {
    _import(file, context) {
        console.log(file);
        return ejs.render(fs.readFileSync(file).toString(), context);
    }
}
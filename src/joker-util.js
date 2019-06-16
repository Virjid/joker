const ejs = require('ejs');
const fs = require('fs');
const sass = require('node-sass');
const colors = require('colors');

module.exports = {
    _import(file, context) {
        return ejs.render(
            fs.readFileSync(file).toString(),
            context);
    },
    _link(url, content, _class) {
        return `<a href="${url}" class="${_class}">${content}</a>`;
    },
    _style(src, dest) {
        console.log(colors.green('[INFO]'), src, '>', dest);
        sass.render({
            file: src,
            outFile: dest,
            outputStyle: 'compressed'
        }, (error, result) => {
            if (error) {
                console.log(colors.red('[ERROR]', error));
                return;
            }
            let dir = dest.substring(0, dest.lastIndexOf('/'));
            fs.exists(dir, (exists)=>{
                if (!exists) fs.mkdirSync();
                fs.writeFileSync(dest, result.css);
            });
        });
    }
}
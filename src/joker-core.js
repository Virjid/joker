const path = require('path');
const fs = require('fs');
const yaml = require('yamljs');
const ejs = require('ejs');
const context = require('./loader').load();
const parser = require('./joker-parser');

const PUBLIC_DIR = path.join('.', 'public');
const POST_DIR = path.join('.', 'source', 'posts');
const THEME_DIR = path.join('.', 'theme', context.config['theme']);

const layout = {
    post: path.join(THEME_DIR, 'layout', 'post.ejs'),
    index: path.join(THEME_DIR, 'layout', 'index.ejs')
};

function render(src, dest, context) {
    let data = ejs.render(fs.readFileSync(src).toString(), context);
    fs.writeFileSync(dest, data);
}

function build() {
    let names = fs.readdirSync(POST_DIR);
    names.forEach((name, index) => {
        let file = path.join(POST_DIR, name);
        parser.parsePost(file, (info, content) => {
            context['post'] = yaml.parse(info);
            context['post'].content = content;
            let i = name.lastIndexOf(".");
            render(layout.post, path.join(PUBLIC_DIR, 'posts', name.substring(0, i)+'.html'), context);
        });
    });
}

module.exports = {
    build: build
};
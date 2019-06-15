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
    index: path.join(THEME_DIR, 'layout', 'index.ejs'),
    layout: path.join(THEME_DIR, 'layout', 'layout.ejs')
};

function _render(src, dest, context) {
    let data = ejs.render(fs.readFileSync(src).toString(), context);
    fs.writeFileSync(dest, data);
}

function render(dest) {
    _render(layout.layout, dest, context);
}


function build() {
    /**
     * 渲染首页
     */
    context.body = ejs.render(fs.readFileSync(layout.index).toString(), context);
    render(path.join(PUBLIC_DIR, 'index.html'));

    /**
     * 渲染博文
     */
    let names = fs.readdirSync(POST_DIR);
    names.forEach((name, index) => {
        let file = path.join(POST_DIR, name);
        parser.parsePost(file, (info, content) => {
            context.post = yaml.parse(info);
            context.post.content = content;
            context.body = ejs.render(fs.readFileSync(layout.post).toString(), context);
            let i = name.lastIndexOf(".");
            let _path = path.join(PUBLIC_DIR, 'posts', name.substring(0, i)+'.html');
            render(_path);
        });
    });
}

module.exports = {
    build: build
};
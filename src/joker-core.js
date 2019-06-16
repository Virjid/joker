require('./loader').load();
const path = require('path');
const fs = require('fs');
const yaml = require('yamljs');
const ejs = require('ejs');
const colors = require('colors');
const parser = require('./joker-parser');
const global = require('./global');
const context = global.context;
const layout = global.layout(global.THEME_DIR);

function _render(src, dest, context) {
    let data = ejs.render(fs.readFileSync(src).toString(), context);
    fs.writeFileSync(dest, data);
    console.log(colors.green('[INFO]'), dest);
}

function render(dest) {
    _render(layout.layout, dest, context);
}


function build() {
    /**
     * 渲染博文、收集信息
     */
    let tagnames = [];
    let names = fs.readdirSync(global.POST_DIR);
    names.forEach((name, index) => {
        let file = path.join(global.POST_DIR, name);
        parser.parsePost(file, (info, content) => {
            context.post = yaml.parse(info);
            context.post.content = content;
            context.body = 
                ejs.render(fs.readFileSync(layout.post).toString(), context);
            let i = name.lastIndexOf(".");
            let _path = path.join(global.PUBLIC_DIR, 'posts', name.substring(0, i)+'.html');
            context.page.url = `/posts/${name.substring(0, i)+'.html'}`;
            context.posts.push(yaml.parse(info));
            render(_path);
            context.post.tags.forEach((value, index) => {
                if (!(value in tagnames)) {
                    tagnames.push(value);
                    context.tags.push({
                        name: value,
                        posts: []
                    });
                }
                for (let i = 0; i < context.tags.length; i++) {
                    if (context.tags[i].name === value) {
                        context.tags[i].posts.push(context.post);
                        break;
                    }
                }
            });
        });
    });
    /**
     * 渲染首页
     */
    context.page.url = `/`;
    context.body = ejs.render(fs.readFileSync(layout.index).toString(), context);
    render(path.join(global.PUBLIC_DIR, 'index.html'));
    /**
     * 标签首页
     */
    context.page.url = `/tags/`;
    context.body = ejs.render(fs.readFileSync(layout.tag).toString(), context);
    render(path.join(global.PUBLIC_DIR, 'tags', 'index.html'));

    /**
     * 渲染标签页
     */
    context.tags.forEach((tag, index)=>{
        context.tag = tag;
        context.page.url = `/tags/${tag.name.replace(/\ /g, '-')+'.html'}`;
        context.body = ejs.render(fs.readFileSync(layout.tag).toString(), context);
        render(path.join(global.PUBLIC_DIR, 'tags', tag.name.replace(/\ /g, '-')+'.html'))
    });
}

module.exports = {
    build: build
};
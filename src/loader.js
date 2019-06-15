const fs = require('fs');
const yaml = require('yamljs');
const path = require('path');
const util = require('./joker-util');

const CONFIG_FILE = path.join('.', '_config.yml');
const POST_DATA_FILE = path.join('.', 'db.json');


module.exports = {
    load() {
        let context = {};
        context.config = yaml.parse(fs.readFileSync(CONFIG_FILE).toString());
        
        const THEME_DIR = path.join('.', 'theme', context.config.theme);
        const LAYOUT_DIR = path.join(THEME_DIR, 'layout');
        const STYLE_DIR = path.join(THEME_DIR, 'style');
        const PUBLIC_STYLE_DIR = path.join('.', 'public', 'css');
        const THEME_CONFIG_FILE = path.join(THEME_DIR, '_config.yml');

        context.theme = yaml.parse(fs.readFileSync(THEME_CONFIG_FILE).toString());
        context.posts = JSON.parse(fs.readFileSync(POST_DATA_FILE).toString());
        context.md2html = require('./joker-md').md2html;
        context._link = util._link;
        context._import = (file)=>{return util._import(path.join(LAYOUT_DIR, file), context);}
        context._style = (file)=>{
            let i = file.lastIndexOf(".");
            let dest = file.substring(0, i)+'.css';
            util._style(path.join(STYLE_DIR, file), 
                path.join(PUBLIC_STYLE_DIR, dest));

            return `<link rel="stylesheet" href="/css/${dest}">`;
        }
        return context;
    }
};
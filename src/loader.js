const path = require('path');
const fs = require('fs');
const yaml = require('yamljs');
const util = require('./joker-util');
const global = require('./global');
const context = global.context;


module.exports = {
    load() {
        context.config = 
            yaml.parse(fs.readFileSync(global.CONFIG_FILE).toString());

        global.THEME_DIR         = path.join('.', 'theme', global.context.config.theme);
        global.LAYOUT_DIR        = path.join(global.THEME_DIR, 'layout');
        global.THEME_STYLE_DIR   = path.join(global.THEME_DIR, 'style');
        global.THEME_CONFIG_FILE = path.join(global.THEME_DIR, '_config.yml');

        context.theme = 
            yaml.parse(fs.readFileSync(global.THEME_CONFIG_FILE).toString());
        
        context.md2html = require('./joker-md').md2html;
        context._link = util._link;
        context._import = file => {
            let _path = path.join(global.LAYOUT_DIR, file);
            return util._import(_path, context);
        };
        context._style = file => {
            let i = file.lastIndexOf(".");
            let dest = file.substring(0, i)+'.css';
            util._style(
                path.join(global.THEME_STYLE_DIR, file), 
                path.join(global.PUBLIC_STYLE_DIR, dest));

            return `<link rel="stylesheet" href="/css/${dest}">`;
        }
    }
};
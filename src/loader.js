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
        const THEME_CONFIG_FILE =
                path.join('.', 'theme', context.config.theme, '_config.yml');
        context.theme = yaml.parse(fs.readFileSync(THEME_CONFIG_FILE).toString());
        context.posts = JSON.parse(fs.readFileSync(POST_DATA_FILE).toString());
        context.md2html = require('./joker-md').md2html;
        context._import = (file)=>{return util._import(path.join('.', 'theme', context.config.theme, 'layout', file), context);};
        return context;
    }
};
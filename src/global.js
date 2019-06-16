const path = require('path');

module.exports = {
    PUBLIC_DIR: path.join('.', 'public'),
    PUBLIC_STYLE_DIR: path.join('.', 'public', 'css'),
    THEME_DIR: null,
    LAYOUT_DIR: null,
    THEME_STYLE_DIR: null,
    CONFIG_FILE: path.join('.', '_config.yml'),
    THEME_CONFIG_FILE: null,
    POST_DATA_FILE: path.join('.', 'db.json'),
    POST_DIR: path.join('.', 'source', 'posts'),
    layout(theme_dir) {
        return {
            post: path.join(theme_dir, 'layout', 'post.ejs'),
            index: path.join(theme_dir, 'layout', 'index.ejs'),
            layout: path.join(theme_dir, 'layout', 'layout.ejs'),
            tag: path.join(theme_dir, 'layout', 'tag.ejs')
        };
    },
    context: {
        config: {
            theme: null
        },
        theme: null,
        posts: [],
        post: {
            title: null,
            tags: [],
            date: null,
            content: null
        },
        tags: [],
        tag: {
            name: null,
            posts: []
        },
        body: null,
        page: {
            url: null
        }
    },

}
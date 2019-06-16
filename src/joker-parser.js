const fs = require('fs');
const readline = require('readline');


module.exports = {
    parsePost(file, handler) {
        let raw = fs.readFileSync(file).toString();
        let count = 0;
        let info = '';
        let content = '';

        let lines = raw.split('\n');
        for (let i = 0; i < lines.length; i++) {
            if (count >= 2) {
                content = content+lines[i]+"\n";
                continue;
            }
            if (lines[i].trim()==='---' && count<2) count++;
            else {
                info = info+lines[i]+"\n";
            }
        }

        handler(info, content);
    }
}
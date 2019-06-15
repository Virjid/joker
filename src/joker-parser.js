const fs = require('fs');
const yaml = require('yamljs');
const readline = require('readline');


module.exports = {
    parsePost(file, handler) {
        const rl = readline.createInterface({
            input: fs.createReadStream(file)
        });
        let count = 0;
        let info = '';
        let content = '';
        rl.on('line', function(line){ //事件监听
            if (count == 2) {
                content = content+line+"\n";
                return;
            }
            if (line.trim()==='---' && count<2) count++;
            else {
                info = info+line+"\n";
            }
        });

        rl.on('close', ()=>{
            handler(info, content);
        });
    }
}
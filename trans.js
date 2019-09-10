const check = require('./qna.json');

module.exports = (sub) => {
    for(x in check) {
        if((sub.toLowerCase() === check[x].toLowerCase())) return sub;
    }
    var s = JSON.parse(sub);
    var t = '';
    for(x in s) {
        if(x == 0) return JSON.parse(sub);
        if(x == 'pid' || x == 'unique_id') continue;
        t += x + ': ' + s[x] + '\n\n';
    }
    return t;
}
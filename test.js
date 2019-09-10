const qna = require("./qna.json");
const cricapi = require('cricapi');
const util = require('util');

cricapi.setAPIKey('9YinLGTZ9GdrodAPoyIf1AmPF9F2');

var m = (mess) => {
    for(x in qna) {
        if(mess.toLowerCase() == x) return qna[x];
    }
    let playerFinder = util.promisify(cricapi.playerFinder);
    let playerStats = util.promisify(cricapi.playerStats);
    let r = playerFinder(mess);
    let s = r.then((data) => { return data; }, (err) => { if(err) throw err; });
    return ((async() => {
        var t = JSON.parse(await s);
        let u = playerStats(t.data[0].pid);
        let v = u.then((data) => { return data }, (err) => { throw err });
        return v;
    })());
}
return m("Babar Azam");
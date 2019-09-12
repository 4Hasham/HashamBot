const qna = require("./qna.json");
const quotes = require('./quotes.json');
const cricapi = require('cricapi');
const util = require('util');

cricapi.setAPIKey('9YinLGTZ9GdrodAPoyIf1AmPF9F2');

module.exports = (mess) => {
    var tempp = mess;
    var punctuationless = tempp.replace(/[.,\/#!$%\^&\*;:{}=\-_`~()]/g, "");
    var messs = punctuationless.replace(/\s{2,}/g, " ");
    var mes = messs.toLowerCase();
    var cut;
    if(mes.includes('say')) {
        cut = mes.split('say');
        return JSON.stringify(cut[1]);
    }

    for(x in qna) {
        var mes_s = mes.split(' ');
        var x_s = x.split(' ');
        var simc = 0;
        for(var i = 0; i < mes_s.length; i++) {
            for(var j = 0; j < x_s.length; j++) {
                if(x_s[j] === mes_s[i]) {
                    simc++;
                    break;
                }
            }
            if(simc >= (mes_s.length)/2) return qna[x];
        }
    }

    if(mes.includes('vs') === true || mes.includes(" v ") === true) {
        //var tempo = new Object();
        if (mes.includes('live') || mes.includes('score')) {
            var sss, ssss;
            if(mes.includes('live')) sss = mess.split(' live');
            else if(mes.includes('score')) sss = mess.split(' score');
            if(mes.includes('vs')) ssss = sss[0].split(' vs ');
            else if(mes.includes('v')) ssss = sss[0].split(' v ');
            let cricketMatches = util.promisify(cricapi.cricketMatches);
            let cr = cricketMatches();
            return cr.then((data) => {
                var dataa = JSON.parse(data);
                for(var i = 0; i < dataa.data.length; i++) {
                    if((dataa.data[i].description).match(ssss[0]) || (dataa.data[i].description).match(ssss[1])) {
                        return JSON.stringify(dataa.data[i].description);
                    }
                }
            }, (err) => { if(err) throw err; } ); 
        }
        else if(mes.includes('schedule') === true || mes.includes('next') === true) {
            var sssss, ssssss;
            if(mes.includes('schedule')) sssss = mess.split(' schedule');
            else if(mes.includes('next')) sssss = mess.split(' next');
            if(mes.includes('vs')) ssssss = sssss[0].split(' vs ');
            else if(mes.includes('v')) ssssss = sssss[0].split(' v ');
            let matchCalendar =  util.promisify(cricapi.matchCalendar);
            let mat = matchCalendar();
            return mat.then((data) => {
                var dataa = JSON.parse(data);
                for(var i = 0; i < dataa.data.length; i++) {
                    if((dataa.data[i].name).match(ssssss[0]) && (dataa.data[i].name).match(ssssss[1]) && (dataa.data[i].name).includes(ssssss[0]) === true && (dataa.data[i].name).includes(ssssss[1]) === true) {
                        return JSON.stringify(dataa.data[i].name + ' on ' + dataa.data[i].date);
                    }
                }
            }, (err) => { if(err) throw err; });
        }
        else {
            var ss;
            if(mes.includes('vs')) ss = mess.split(' vs ')
            else if(mes.includes('v')) ss = mess.split(' v ');
            let matches = util.promisify(cricapi.matches);
            let ma = matches();
            return ma.then((data) => {
                var dataa = JSON.parse(data);
                for(var i = 0; i < dataa.matches.length; i++) {
                    if((dataa.matches[i]['team-1']).match(ss[0]) || (dataa.matches[i]['team-2']).match(ss[1]) || (dataa.matches[i]['team-1']).match(ss[1]) || (dataa.matches[i]['team-2']).match(ss[0])) {
                        if(dataa.matches[i]['winner-team']) {
                            return JSON.stringify(dataa.match[i]['winner-team'] + " won the " + dataa.match[i]['type'] + " match.");
                        } else {                        
                            return JSON.stringify(dataa.matches[i]['type'] + " match between " + dataa.matches[i]['team-1'] + " & " + dataa.matches[i]['team-2'] + " starts at " + dataa.matches[i]['dateTimeGMT'] + ".");
                        }
                    }
                }
            }, (err) => { if(err) throw err; });
        }
    }       
    else if(mes.includes('upcoming') === true) {
        var some = mes.split('upcoming ');
        let matches = util.promisify(cricapi.matches);
        let ma = matches();
        return ma.then((data) => {
            var dataa = JSON.parse(data);
            var temp = "";
            for(var i = 0; i < dataa.matches.length; i++) {
                if(some[1].toLowerCase() == (dataa.matches[i].type).toLowerCase()) {
                    temp += dataa.matches[i]['team-1'] + " vs " + dataa.matches[i]['team-2'] + " on " + dataa.matches[i]['dateTimeGMT'] + ".\n\n";
                    return JSON.stringify(temp);
                }
            }
        }, (err) => { if(err) throw err; });
    }
    else if(mes.includes('tell me a quote') === true) {
        var rando = Math.floor(Math.random() * 27);
        console.log(rando);
        return JSON.stringify(quotes.quotes[rando]['legend'] + ' said, "' + quotes.quotes[rando]['cont'] + '"');
    }

    let playerFinder = util.promisify(cricapi.playerFinder);
    let playerStats = util.promisify(cricapi.playerStats);
    if(mes.includes('stats') === true || mes.includes('100s') || mes.includes('50s') || mes.includes('ave') || mes.includes('sr') || mes.includes('bbi') || mes.includes('bbm') || mes.includes('wkts') || mes.includes('runs') || mes.includes('matches') || mes.includes('economy') || mes.includes('inns') || mes.includes('4s') || mes.includes('6s') || mes.includes('hs') || mes.includes('st') || mes.includes('ct') || mes.includes('5w') || mes.includes('10') || mes.includes('4w') || mes.includes('balls') || mes.includes('not-outs')) {
        var sr;
        if(mes.includes('stats')) sr = mes.split(' stats');
        else if(mes.includes('100s')) sr = mes.split(' 100s');
        else if(mes.includes('50s')) sr = mes.split(' 50s');
        else if(mes.includes('ave')) sr = mes.split(' ave');
        else if(mes.includes('sr')) sr = mes.split(' sr');
        else if(mes.includes('bbi')) sr = mes.split(' bbi');
        else if(mes.includes('bbm')) sr = mes.split(' bbm');
        else if(mes.includes('wkts')) sr = mes.split(' wkts');
        else if(mes.includes('runs')) sr = mes.split(' runs');
        else if(mes.includes('matches')) sr = mes.split(' matches');
        else if(mes.includes('economy')) sr = mes.split(' economy');
        else if(mes.includes('inns')) sr = mes.split(' inns');
        else if(mes.includes('4s')) sr = mes.split(' 4s');
        else if(mes.includes('6s')) sr = mes.split(' 6s');
        else if(mes.includes('hs')) sr = mes.split(' hs');
        else if(mes.includes('st')) sr = mes.split(' st');
        else if(mes.includes('ct')) sr = mes.split(' ct');
        else if(mes.includes('5s')) sr = mes.split(' 5s');
        else if(mes.includes('10')) sr = mes.split(' 10');
        else if(mes.includes('4s')) sr = mes.split(' 4s');
        else if(mes.includes('not-outs')) sr = mes.split(' not-outs');
        else if(mes.includes('balls')) sr = mes.split(' balls');
        var um;
        if(mes.includes('bowling') === true) {
            um = sr[0].split(' bowling');
            if(mes.includes('odi') === true) {
                var asa = um[0].split(' odi');
                let sd = playerFinder(asa[0]);
                let sds = sd.then((data) => { return data; }, (err) => { if(err) throw err; });
                return  ((async() => {
                    var t = JSON.parse(await sds);
                    var u = playerStats(t.data[0].pid);
                    let v = u.then((data) => {
                        var dataa = JSON.parse(data);
                        if(mes.includes('stats')) return JSON.stringify(dataa.data.bowling.ODIs);
                        else if(mes.includes('5w')) return JSON.stringify(dataa.data.bowling.ODIs['5w']);
                        else if(mes.includes('4w')) return JSON.stringify(dataa.data.bowling.ODIs['4w']);
                        else if(mes.includes('ave')) return JSON.stringify(dataa.data.bowling.ODIs['Ave']);
                        else if(mes.includes('sr')) return JSON.stringify(dataa.data.bowling.ODIs['SR']);
                        else if(mes.includes('bbi')) return JSON.stringify(dataa.data.bowling.ODIs['BBI']);
                        else if(mes.includes('bbm')) return JSON.stringify(dataa.data.bowling.ODIs['BBM']);
                        else if(mes.includes('runs')) return JSON.stringify(dataa.data.bowling.ODIs['Runs']);
                        else if(mes.includes('balls')) return JSON.stringify(dataa.data.bowling.ODIs['Balls']);
                        else if(mes.includes('inns')) return JSON.stringify(dataa.data.bowling.ODIs['Inns']);
                        else if(mes.includes('matches')) return JSON.stringify(dataa.data.bowling.ODIs['Mat']);
                        else if(mes.includes('economy')) return JSON.stringify(dataa.data.bowling.ODIs['Econ']);
                        else if(mes.includes('wkts')) return JSON.stringify(dataa.data.bowling.ODIs['Wkts']);
                    }, (err) => { if(err) throw err; });
                    return v;
                })());
            }
            else if(mes.includes('t20')) {
                var asa = um[0].split(' t20');
                let sd = playerFinder(asa[0]);
                let sds = sd.then((data) => { return data; }, (err) => { if(err) throw err; });
                return  ((async() => {
                    var t = JSON.parse(await sds);
                    var u = playerStats(t.data[0].pid);
                    let v = u.then((data) => {
                        var dataa = JSON.parse(data);
                        if(mes.includes('stats')) return JSON.stringify(dataa.data.bowling.T20Is);
                        else if(mes.includes('5w')) return JSON.stringify(dataa.data.bowling.T20Is['5w']);
                        else if(mes.includes('4w')) return JSON.stringify(dataa.data.bowling.T20Is['4w']);
                        else if(mes.includes('ave')) return JSON.stringify(dataa.data.bowling.T20Is['Ave']);
                        else if(mes.includes('sr')) return JSON.stringify(dataa.data.bowling.T20Is['SR']);
                        else if(mes.includes('bbi')) return JSON.stringify(dataa.data.bowling.T20Is['BBI']);
                        else if(mes.includes('bbm')) return JSON.stringify(dataa.data.bowling.T20Is['BBM']);
                        else if(mes.includes('runs')) return JSON.stringify(dataa.data.bowling.T20Is['Runs']);
                        else if(mes.includes('balls')) return JSON.stringify(dataa.data.bowling.T20Is['Balls']);
                        else if(mes.includes('inns')) return JSON.stringify(dataa.data.bowling.T20Is['Inns']);
                        else if(mes.includes('matches')) return JSON.stringify(dataa.data.bowling.T20Is['Mat']);
                        else if(mes.includes('economy')) return JSON.stringify(dataa.data.bowling.T20Is['Econ']);
                        else if(mes.includes('wkts')) return JSON.stringify(dataa.data.bowling.T20Is['Wkts']);                    }, (err) => { if(err) throw err; });
                    return v;
                })());
            }
            else if(mes.includes('fc')) {
                var asa = um[0].split(' fc');
                let sd = playerFinder(asa[0]);
                let sds = sd.then((data) => { return data; }, (err) => { if(err) throw err; });
                return  ((async() => {
                    var t = JSON.parse(await sds);
                    var u = playerStats(t.data[0].pid);
                    let v = u.then((data) => {
                        var dataa = JSON.parse(data);
                        if(mes.includes('stats')) return JSON.stringify(dataa.data.bowling.firstClass);
                        else if(mes.includes('5w')) return JSON.stringify(dataa.data.bowling.firstClass['5w']);
                        else if(mes.includes('4w')) return JSON.stringify(dataa.data.bowling.firstClass['4w']);
                        else if(mes.includes('ave')) return JSON.stringify(dataa.data.bowling.firstClass['Ave']);
                        else if(mes.includes('sr')) return JSON.stringify(dataa.data.bowling.firstClass['SR']);
                        else if(mes.includes('bbi')) return JSON.stringify(dataa.data.bowling.firstClass['BBI']);
                        else if(mes.includes('bbm')) return JSON.stringify(dataa.data.bowling.firstClass['BBM']);
                        else if(mes.includes('runs')) return JSON.stringify(dataa.data.bowling.firstClass['Runs']);
                        else if(mes.includes('balls')) return JSON.stringify(dataa.data.bowling.firstClass['Balls']);
                        else if(mes.includes('inns')) return JSON.stringify(dataa.data.bowling.firstClass['Inns']);
                        else if(mes.includes('matches')) return JSON.stringify(dataa.data.bowling.firstClass['Mat']);
                        else if(mes.includes('economy')) return JSON.stringify(dataa.data.bowling.firstClass['Econ']);
                        else if(mes.includes('wkts')) return JSON.stringify(dataa.data.bowling.firstClass['Wkts']);
                    }, (err) => { if(err) throw err; });
                    return v;
                })());
            } else if(mes.includes('list-a')) {
                var asa = um[0].split(' list-a');
                let sd = playerFinder(asa[0]);
                let sds = sd.then((data) => { return data; }, (err) => { if(err) throw err; });
                return  ((async() => {
                    var t = JSON.parse(await sds);
                    var u = playerStats(t.data[0].pid);
                    let v = u.then((data) => {
                        var dataa = JSON.parse(data);
                        if(mes.includes('stats')) return JSON.stringify(dataa.data.bowling.listA);
                        else if(mes.includes('5w')) return JSON.stringify(dataa.data.bowling.listA['5w']);
                        else if(mes.includes('4w')) return JSON.stringify(dataa.data.bowling.listA['4w']);
                        else if(mes.includes('ave')) return JSON.stringify(dataa.data.bowling.listA['Ave']);
                        else if(mes.includes('sr')) return JSON.stringify(dataa.data.bowling.listA['SR']);
                        else if(mes.includes('bbi')) return JSON.stringify(dataa.data.bowling.listA['BBI']);
                        else if(mes.includes('bbm')) return JSON.stringify(dataa.data.bowling.listA['BBM']);
                        else if(mes.includes('runs')) return JSON.stringify(dataa.data.bowling.listA['Runs']);
                        else if(mes.includes('balls')) return JSON.stringify(dataa.data.bowling.listA['Balls']);
                        else if(mes.includes('inns')) return JSON.stringify(dataa.data.bowling.listA['Inns']);
                        else if(mes.includes('matches')) return JSON.stringify(dataa.data.bowling.listA['Mat']);
                        else if(mes.includes('economy')) return JSON.stringify(dataa.data.bowling.listA['Econ']);
                        else if(mes.includes('wkts')) return JSON.stringify(dataa.data.bowling.listA['Wkts']);                    }, (err) => { if(err) throw err; });
                    return v;
                })());
            }
            else if(mes.include('test')) {
                var asa = um[0].split(' test');
                let sd = playerFinder(asa[0]);
                let sds = sd.then((data) => { return data; }, (err) => { if(err) throw err; });
                return  ((async() => {
                    var t = JSON.parse(await sds);
                    var u = playerStats(t.data[0].pid);
                    let v = u.then((data) => {
                        var dataa = JSON.parse(data);
                        if(mes.includes('stats')) return JSON.stringify(dataa.data.bowling.tests);
                        else if(mes.includes('5w')) return JSON.stringify(dataa.data.bowling.tests['5w']);
                        else if(mes.includes('4w')) return JSON.stringify(dataa.data.bowling.tests['4w']);
                        else if(mes.includes('ave')) return JSON.stringify(dataa.data.bowling.tests['Ave']);
                        else if(mes.includes('sr')) return JSON.stringify(dataa.data.bowling.tests['SR']);
                        else if(mes.includes('bbi')) return JSON.stringify(dataa.data.bowling.tests['BBI']);
                        else if(mes.includes('bbm')) return JSON.stringify(dataa.data.bowling.tests['BBM']);
                        else if(mes.includes('runs')) return JSON.stringify(dataa.data.bowling.tests['Runs']);
                        else if(mes.includes('balls')) return JSON.stringify(dataa.data.bowling.tests['Balls']);
                        else if(mes.includes('inns')) return JSON.stringify(dataa.data.bowling.tests['Inns']);
                        else if(mes.includes('matches')) return JSON.stringify(dataa.data.bowling.tests['Mat']);
                        else if(mes.includes('economy')) return JSON.stringify(dataa.data.bowling.tests['Econ']);
                        else if(mes.includes('wkts')) return JSON.stringify(dataa.data.bowling.tests['Wkts']);                           }, (err) => { if(err) throw err; });
                    return v;
                })());
            }
        }
        else if(mes.includes('batting') === true) {
            um = sr[0].split(' batting');
            if(mes.includes('odi')) {
                var ada = um[0].split(' odi');
                let rd = playerFinder(ada[0]);
                let rdr = rd.then((data) => { return data; }, (err) => { if(err) throw err; });
                return  ((async() => {
                    var t = JSON.parse(await rdr);
                    var u = playerStats(t.data[0].pid);
                    let v = u.then((data) => {
                        var dataa = JSON.parse(data);
                        if(mes.includes('stats')) return JSON.stringify(dataa.data.batting.ODIs);
                        else if(mes.includes('ct')) return JSON.stringify(dataa.data.batting.ODIs['Ct']);
                        else if(mes.includes('st')) return JSON.stringify(dataa.data.batting.ODIs['St']);
                        else if(mes.includes('ave')) return JSON.stringify(dataa.data.batting.ODIs['Ave']);
                        else if(mes.includes('sr')) return JSON.stringify(dataa.data.batting.ODIs['SR']);
                        else if(mes.includes('100s')) return JSON.stringify(dataa.data.batting.ODIs['100']);
                        else if(mes.includes('50s')) return JSON.stringify(dataa.data.batting.ODIs['50']);
                        else if(mes.includes('runs')) return JSON.stringify(dataa.data.batting.ODIs['Runs']);
                        else if(mes.includes('not-outs')) return JSON.stringify(dataa.data.batting.ODIs['NO']);
                        else if(mes.includes('inns')) return JSON.stringify(dataa.data.batting.ODIs['Inns']);
                        else if(mes.includes('matches')) return JSON.stringify(dataa.data.batting.ODIs['Mat']);
                        else if(mes.includes('6s')) return JSON.stringify(dataa.data.batting.ODIs['6s']);
                        else if(mes.includes('4s')) return JSON.stringify(dataa.data.batting.ODIs['4s']);
                        else if(mes.includes('hs')) return JSON.stringify(dataa.data.batting.ODIs['HS']);
                    }, (err) => { if(err) throw err; });
                    return v;
                })());
            }
            else if(mes.includes('t20')) {
                var ada = um[0].split(' t20');
                let rd = playerFinder(ada[0]);
                let rdr = rd.then((data) => { return data; }, (err) => { if(err) throw err; });
                return  ((async() => {
                    var t = JSON.parse(await rdr);
                    var u = playerStats(t.data[0].pid);
                    let v = u.then((data) => {
                        var dataa = JSON.parse(data);
                        if(mes.includes('stats')) return JSON.stringify(dataa.data.batting.T20Is);
                        else if(mes.includes('ct')) return JSON.stringify(dataa.data.batting.T20Is['Ct']);
                        else if(mes.includes('st')) return JSON.stringify(dataa.data.batting.T20Is['St']);
                        else if(mes.includes('ave')) return JSON.stringify(dataa.data.batting.T20Is['Ave']);
                        else if(mes.includes('sr')) return JSON.stringify(dataa.data.batting.T20Is['SR']);
                        else if(mes.includes('100s')) return JSON.stringify(dataa.data.batting.T20Is['100']);
                        else if(mes.includes('50s')) return JSON.stringify(dataa.data.batting.T20Is['50']);
                        else if(mes.includes('runs')) return JSON.stringify(dataa.data.batting.T20Is['Runs']);
                        else if(mes.includes('not-outs')) return JSON.stringify(dataa.data.batting.T20Is['NO']);
                        else if(mes.includes('inns')) return JSON.stringify(dataa.data.batting.T20Is['Inns']);
                        else if(mes.includes('matches')) return JSON.stringify(dataa.data.batting.T20Is['Mat']);
                        else if(mes.includes('6s')) return JSON.stringify(dataa.data.batting.T20Is['6s']);
                        else if(mes.includes('4s')) return JSON.stringify(dataa.data.batting.T20Is['4s']);
                        else if(mes.includes('hs')) return JSON.stringify(dataa.data.batting.T20Is['HS']);                    }, (err) => { if(err) throw err; });
                    return v;
                })());
            }
            else if(mes.includes('fc')) {
                var ada = um[0].split(' fc');
                let rd = playerFinder(ada[0]);
                let rdr = rd.then((data) => { return data; }, (err) => { if(err) throw err; });
                return  ((async() => {
                    var t = JSON.parse(await rdr);
                    var u = playerStats(t.data[0].pid);
                    let v = u.then((data) => {
                        var dataa = JSON.parse(data);
                        if(mes.includes('stats')) return JSON.stringify(dataa.data.batting.firstClass);
                        else if(mes.includes('ct')) return JSON.stringify(dataa.data.batting.firstClass['Ct']);
                        else if(mes.includes('st')) return JSON.stringify(dataa.data.batting.firstClass['St']);
                        else if(mes.includes('ave')) return JSON.stringify(dataa.data.batting.firstClass['Ave']);
                        else if(mes.includes('sr')) return JSON.stringify(dataa.data.batting.firstClass['SR']);
                        else if(mes.includes('100s')) return JSON.stringify(dataa.data.batting.firstClass['100']);
                        else if(mes.includes('50s')) return JSON.stringify(dataa.data.batting.firstClass['50']);
                        else if(mes.includes('runs')) return JSON.stringify(dataa.data.batting.firstClass['Runs']);
                        else if(mes.includes('not-outs')) return JSON.stringify(dataa.data.batting.firstClass['NO']);
                        else if(mes.includes('inns')) return JSON.stringify(dataa.data.batting.firstClass['Inns']);
                        else if(mes.includes('matches')) return JSON.stringify(dataa.data.batting.firstClass['Mat']);
                        else if(mes.includes('6s')) return JSON.stringify(dataa.data.batting.firstClass['6s']);
                        else if(mes.includes('4s')) return JSON.stringify(dataa.data.batting.firstClass['4s']);
                        else if(mes.includes('hs')) return JSON.stringify(dataa.data.batting.firstClass['HS']);                    }, (err) => { if(err) throw err; });
                    return v;
                })());
            }
            else if(mes.includes('list-a')) {
                var ada = um[0].split(' list-a');
                let rd = playerFinder(ada[0]);
                let rdr = rd.then((data) => { return data; }, (err) => { if(err) throw err; });
                return  ((async() => {
                    var t = JSON.parse(await rdr);
                    var u = playerStats(t.data[0].pid);
                    let v = u.then((data) => {
                        var dataa = JSON.parse(data);
                        if(mes.includes('stats')) return JSON.stringify(dataa.data.batting.listA);
                        else if(mes.includes('ct')) return JSON.stringify(dataa.data.batting.listA['Ct']);
                        else if(mes.includes('st')) return JSON.stringify(dataa.data.batting.listA['St']);
                        else if(mes.includes('ave')) return JSON.stringify(dataa.data.batting.listA['Ave']);
                        else if(mes.includes('sr')) return JSON.stringify(dataa.data.batting.listA['SR']);
                        else if(mes.includes('100s')) return JSON.stringify(dataa.data.batting.listA['100']);
                        else if(mes.includes('50s')) return JSON.stringify(dataa.data.batting.listA['50']);
                        else if(mes.includes('runs')) return JSON.stringify(dataa.data.batting.listA['Runs']);
                        else if(mes.includes('not-outs')) return JSON.stringify(dataa.data.batting.listA['NO']);
                        else if(mes.includes('inns')) return JSON.stringify(dataa.data.batting.listA['Inns']);
                        else if(mes.includes('matches')) return JSON.stringify(dataa.data.batting.listA['Mat']);
                        else if(mes.includes('6s')) return JSON.stringify(dataa.data.batting.listA['6s']);
                        else if(mes.includes('4s')) return JSON.stringify(dataa.data.batting.listA['4s']);
                        else if(mes.includes('hs')) return JSON.stringify(dataa.data.batting.listA['HS']);                    }, (err) => { if(err) throw err; });
                    return v;
                })());
            }
            else if(mes.includes('test')) {
                var ada = um[0].split(' test');
                let rd = playerFinder(ada[0]);
                let rdr = rd.then((data) => { return data; }, (err) => { if(err) throw err; });
                return  ((async() => {
                    var t = JSON.parse(await rdr);
                    var u = playerStats(t.data[0].pid);
                    let v = u.then((data) => {
                        var dataa = JSON.parse(data);
                        if(mes.includes('stats')) return JSON.stringify(dataa.data.batting.tests);
                        else if(mes.includes('ct')) return JSON.stringify(dataa.data.batting.tests['Ct']);
                        else if(mes.includes('st')) return JSON.stringify(dataa.data.batting.tests['St']);
                        else if(mes.includes('ave')) return JSON.stringify(dataa.data.batting.tests['Ave']);
                        else if(mes.includes('sr')) return JSON.stringify(dataa.data.batting.tests['SR']);
                        else if(mes.includes('100s')) return JSON.stringify(dataa.data.batting.tests['100']);
                        else if(mes.includes('50s')) return JSON.stringify(dataa.data.batting.tests['50']);
                        else if(mes.includes('runs')) return JSON.stringify(dataa.data.batting.tests['Runs']);
                        else if(mes.includes('not-outs')) return JSON.stringify(dataa.data.batting.tests['NO']);
                        else if(mes.includes('inns')) return JSON.stringify(dataa.data.batting.tests['Inns']);
                        else if(mes.includes('matches')) return JSON.stringify(dataa.data.batting.tests['Mat']);
                        else if(mes.includes('6s')) return JSON.stringify(dataa.data.batting.tests['6s']);
                        else if(mes.includes('4s')) return JSON.stringify(dataa.data.batting.tests['4s']);
                        else if(mes.includes('hs')) return JSON.stringify(dataa.data.batting.tests['HS']);                    }, (err) => { if(err) throw err; });
                    return v;
                })());
            }
        }
        else {
            um = sr;
            let td = playerFinder(um[0]);
            let tdt = td.then((data) => { return data; }, (err) => { if(err) throw err; });
            return  ((async() => {
                var t = JSON.parse(await tdt);
                var u = playerStats(t.data[0].pid);
                let v = u.then((data) => {
                    var dataa = JSON.parse(data);
                    var temp = new Object();
                    temp = {
                        Name: dataa.fullName,
                        Country: dataa.country,
                        Age: dataa.currentAge,
                        Teams: dataa.majorTeams,
                        Role: dataa.playingRole,
                        Bat: dataa.battingStyle,
                        Bowl: dataa.bowlingStyle
                    }
                    return JSON.stringify(temp);
                }, (err) => { if(err) throw err; });
                return v;
            })());
        }
    }
    let r = playerFinder(mess);
    let s = r.then((data) => { return data; }, (err) => { if(err) throw err; });
    return ((async() => {
        var t = JSON.parse(await s);
        let u = playerStats(t.data[0].pid);
        let v = u.then((data) => {
            var w  = JSON.parse(data);
            return JSON.stringify(w['profile']);
        }, (err) => { throw err });
        return v;
    })());
}
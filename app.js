const data = require("./data.js");
const readline = require('readline');

function rand(end, start = 0) {
    const dif = end - start + 1;
    return ~~(Math.random() * dif + start);
}

process.on('exit', function (code) {
    console.log();
    console.log("已退出", code);
});
process.stdin.setEncoding('utf8');

// 控制台输入

// process.stdin.on会报错：MaxListenersExceededWarning: Possible EventEmitter memory leak detected
/*
function input(tips) {
    process.stdout.write(tips);
    process.stdin.resume();
    return new Promise((res, rej) => {
        process.stdin.on('data', (value) => {
            value = value.toString().trim();
            process.stdin.pause();
            res(value);
            // if ([ 'NO', 'no'].indexOf(input) > -1) process.exit(0);
        });
    });
}
*/

function input(tips) {
    const rl = readline.createInterface({
        input: process.stdin,
        output: process.stdout
    });
    return new Promise((res, rej) => {
        rl.question(tips, (words) => {
            words = words.toString().trim();
            rl.close();
            res(words);
        });
    });
}

async function inputLoop(tips, conditionFn) {
    let words;
    do {
        words = await input(tips);
    } while (!await conditionFn(words));
    return words;
}


async function run(key) {
    const value = data[key].toLowerCase();
    await inputLoop(key + ": ", function (words) {
        const flag = value === words.toLowerCase();
        console.log(flag ? "bingo\n" : "error");
        return flag;
    });
}

async function runAll() {
    const keys = Object.keys(data);
    while (keys.length) {
        const index = rand(keys.length - 1);
        const key = keys.splice(index, 1)[0];
        try {
            await run(key);
        } catch (e) {
            console.log(index, key);
            console.log(e);
        }

    }
}

(async function () {
    // await run(415);
    let loop;
    do {
        await runAll();
        console.log("finish");
        loop = (await input("是否继续(Y/N)? ")).toUpperCase() === "N" ? "N" : "Y";
    } while (loop === "Y");

    process.exit(0);
})();

const readline = require("readline");
const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout,
});

rl.question("What is you take input news ? ", function (news) {
    console.log(`this is ${news}`);
    rl.close();
});

rl.on("close", function () {
    process.exit(0);
});

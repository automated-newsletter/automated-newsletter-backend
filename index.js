const readline = require("readline");
const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout,
});

rl.question("Topic you want to search ? ", function (news) {
    rl.question("Article you want to date: ? ", function (date) {
        console.log(`${news}, is a from ${date}`);
        rl.close();
    });
});

rl.on("close", function () {
    process.exit(0);
});

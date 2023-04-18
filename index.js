const readline = require("readline");
const { calulateDate } = require("./utils/utils");
const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout,
});

rl.question("Topic you want to search ? ", function (news) {
    rl.question("Article you want to date: ? ", function (date) {
        const formatDate = calulateDate(date);
        console.log(`this is topic: ${news} and ${formatDate}`);
        rl.close();
    });
});

rl.on("close", function () {
    process.exit(0);
});

const calulateDate = (inputDays) => {
    const today = new Date();

    const todayYear = today.getFullYear();
    const todayMonth = String(today.getMonth() + 1).padStart(2, "0"); // Month is zero-indexed, so we add 1
    const todayDay = String(today.getDate()).padStart(2, "0");

    const formattedTodayDate = `${todayYear}-${todayMonth}-${todayDay}`;
    // Calculate the target date by adding the specified number of days to today's date
    const targetDate = new Date(today.getTime() - inputDays * 24 * 60 * 60 * 1000);
    const year = targetDate.getFullYear();
    const month = String(targetDate.getMonth() + 1).padStart(2, "0"); // Add leading zero if needed
    const day = String(targetDate.getDate()).padStart(2, "0"); // Add leading zero if needed

    // Combine the year, month, and day into the desired format
    const formattedDate = `${year}-${month}-${day}`;

    // Return the formatted date string
    return { formattedDate, formattedTodayDate };
};

const filterUniqueNews = (newsArray, property) => {
    return newsArray.filter(function (obj, index, self) {
        // Return true for the first occurrence of each value of the specified property
        return (
            self
                .map(function (innerObj) {
                    return innerObj[property];
                })
                .indexOf(obj[property]) === index
        );
    });
};

const pickFirstTenNews = (newsArray) => {
    // Use the slice method to extract the first ten elements of the array
    return newsArray.slice(0, 10); // Starting index is 0, ending index is 10 (exclusive)
};

module.exports = { calulateDate, filterUniqueNews, pickFirstTenNews };

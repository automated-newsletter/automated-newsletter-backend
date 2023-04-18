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

const pickRandomNews = (newsArray, noOfNews) => {
    // Clone the original array to avoid modifying the original array
    const clonedArray = newsArray.slice();

    // Array to store picked random objects
    const pickedObjects = [];

    // Pick 'n' random objects
    for (let i = 0; i < noOfNews && clonedArray.length > 0; i++) {
        const randomIndex = Math.floor(Math.random() * clonedArray.length);
        pickedObjects.push(clonedArray[randomIndex]);
        clonedArray.splice(randomIndex, 1); // Remove the picked object from the cloned array
    }

    return pickedObjects;
};

module.exports = { calulateDate, filterUniqueNews, pickRandomNews };

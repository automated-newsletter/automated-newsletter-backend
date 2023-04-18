module.exports.calulateDate = (inputDays) => {
    const today = new Date();

    // Calculate the target date by adding the specified number of days to today's date
    const targetDate = new Date(today.getTime() - inputDays * 24 * 60 * 60 * 1000);
    const year = targetDate.getFullYear();
    const month = String(targetDate.getMonth() + 1).padStart(2, "0"); // Add leading zero if needed
    const day = String(targetDate.getDate()).padStart(2, "0"); // Add leading zero if needed

    // Combine the year, month, and day into the desired format
    const formattedDate = `${year}-${month}-${day}`;

    // Return the formatted date string
    return formattedDate;
};

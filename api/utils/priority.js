export const setTaskPriority = (dueDate) => {
    // Calculate the difference between dueDate and today's date
    const today = new Date();
    const differenceInDays = Math.ceil((dueDate - today) / (1000 * 60 * 60 * 24));

    // Set priority based on the calculated difference
    if (differenceInDays <= 0) {
        return 0; // Due date is today
    } else if (differenceInDays <= 2) {
        return 1; // Due date is between tomorrow and day after tomorrow
    } else if (differenceInDays <= 4) {
        return 2; // Due date is 3-4 days
    } else {
        return 3; // Due date is 5+ days
    }
}

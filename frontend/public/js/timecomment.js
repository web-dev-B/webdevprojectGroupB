export const timecomment = (date) => {
    const databaseTimestamp = date;
    const dbDate = new Date(databaseTimestamp);
    const currentDate = new Date();
    const timeDifference = Math.abs(currentDate - dbDate); // Absolute difference in milliseconds
    const secondsDifference = Math.floor(timeDifference / 1000); // Convert milliseconds to seconds
  
    if (secondsDifference < 60) {
      return "Just now";
    } else if (secondsDifference < 3600) {
      const minutesDifference = Math.floor(secondsDifference / 60);
      const timeDifferenceText = `${minutesDifference} mins ago`;
      return timeDifferenceText;
    } else if (secondsDifference < 86400) {
      const hoursDifference = Math.floor(secondsDifference / 3600);
      const timeDifferenceText = `${hoursDifference} hours ago`;
      return timeDifferenceText;
    } else {
      const daysDifference = Math.floor(secondsDifference / 86400);
      const timeDifferenceText = `${daysDifference} days ago`;
      return timeDifferenceText;
    }
  };
  
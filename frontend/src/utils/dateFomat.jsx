export const formatDateValue = (date, type) => {
    if (!(date instanceof Date)) {
      throw new Error('Invalid date object');
    }
  
    const day = ('0' + date.getDate()).slice(-2);
    const month = ('0' + (date.getMonth() + 1)).slice(-2); // Months are zero-based
    const year = date.getFullYear();
  
    if (type === 'day') {
      return `${day}-${month}-${year}`;
    } else if (type === 'month') {
      return `${month}-${year}`;
    } else {
      throw new Error('Invalid type, expected "day" or "month"');
    }
  }
export const formatNumberWithNaira = (number) => {
    if (isNaN(number)) {
      return 'Invalid number';
    }
    
    return `₦${number.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',')}`;
  };
export const formatDate = (dateString) => {
    const date = new Date(dateString);

    const day = date.getDate();

    const month = date.toLocaleString('default', { month: 'long' });

    const year = date.getFullYear();

    const getOrdinalSuffix = (n) => {
      const s = ["th", "st", "nd", "rd"],
            v = n % 100;
      return n + (s[(v-20)%10] || s[v] || s[0]);
    };
  
    return `${getOrdinalSuffix(day)} ${month}, ${year}`;
  };
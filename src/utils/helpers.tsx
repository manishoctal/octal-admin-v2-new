import dayjs from "dayjs";

const helpers = {
  
  ternaryCondition: (condition, first, second) => {
    return condition ? first : second;
  },
  andCondition: (first, second) => {
    return first && second;
  },
   orCondition: (first, second) => {
    return first || second;
  },

  convertDateFormat: (fmt: string) => {
    if(fmt){
    return fmt?.replace(/DD/g, "dd")?.replace(/YYYY/g, "yyyy"); 
    }
  },

  formattedAmount: (amount) => {
    return amount?.toLocaleString("en-US", {
      style: "currency",
      currency: "USD",
      currencyDisplay: "symbol",
    });
  },

  capitalizeFirstWord: (sentence) => {
    if (sentence) {
      return sentence?.charAt(0)?.toUpperCase() + sentence?.slice(1);
    }
    return 'N/A'
  },
  formateNull: (text) => {
    let result = "";
    if (text) {
      result = text;
    }
    return result;
  },


  getMatchStatus: (status) => {
    switch (status) {
      case 'Live':
        return 'text-blue-600 font-bold';
      case 'Not Started':
        return 'text-yellow-400 font-bold';
      case 'Finished': case 'In Progress':
        return 'text-green-600 font-bold';
      case 'Cancelled': case 'Canceled':
        return 'text-red-600 font-bold';
      case 'Delayed':
        return 'text-[#ec9630] font-bold';
    }
  },
  getFormattedDate: (date, format) => {
    return date ? dayjs(date).format(format || 'YYYY-MM-DD') : null
  },

  showFormattedDate: (date, format) => {
    return date ? dayjs(date).format(format || 'YYYY-MM-DD') : null
  },

  turboConsole: (message, data) => {
    return console.log(
      `%c ${message || ''}, ${data || ''}`, "color: white; font-size: 16px; background: red");
  },
  normalizeSpaces: (str) => {
    return str?.replace(/\s+/g, ' ')?.trim();
  },

 

};

export default helpers;

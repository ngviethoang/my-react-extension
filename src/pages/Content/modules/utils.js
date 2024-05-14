export const sleep = (m) => new Promise((r) => setTimeout(r, m));

export const getLocalStorage = (key) => {
  const value = localStorage.getItem(key);
  return value ? JSON.parse(value) : null;
};

export const setLocalStorage = (key, value) => {
  localStorage.setItem(key, JSON.stringify(value));
};

export const convertDateString = (input) => {
  if (!input) {
    return null;
  }
  // Create a Date object from the input string
  const date = new Date(input);

  // Check if the date is valid
  if (isNaN(date)) {
    throw new Error('Invalid date string');
  }

  // Extract year, month, and day
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0'); // getMonth() returns 0-11, so add 1 and pad with 0
  const day = String(date.getDate()).padStart(2, '0'); // pad with 0 for single digit days

  if (year < 1000) {
    return null;
  }

  // Format as 'YYYY-MM-DD'
  return `${year}-${month}-${day}`;
};
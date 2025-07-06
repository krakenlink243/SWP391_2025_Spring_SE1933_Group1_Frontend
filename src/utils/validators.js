//@author: Vu Hoang
export const validatePrice = (value) => {
  // Must be a valid number format
  if (!/^\d*\.?\d*$/.test(value)) return false;

  // Allow "0" or "0.xx", but disallow other leading-zero formats
  if (
    value.length > 1 &&
    value[0] === '0' &&
    value[1] !== '.'
  ) return false;

  // Limit to 2 decimal places
  if (
    value.includes('.') &&
    value.split('.')[1].length > 2
  ) return false;

  return true;
};
export const validateMemory = (value) => {
  const pattern = /^\d+(\.\d{1,2})?(GB|MB)$/i;
  return pattern.test(value);
}
export const validateEmail = (value) => {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);
};

export const validateEmty = (value) => {
  return value.length > 0;
};
export const trimValue = (value) => {
  return value
    .trim()
    .replace(/[ \t]+/g, ' '); // replace multiple spaces or tabs, not newlines
};

export const validateMedia = ([]) => {
  console.log([].length)
  return [].length
}

export const isTokenExpired = () => {

  const expDate = localStorage.getItem("expDate");
  const currentTime = Math.floor(Date.now() / 1000);
  if (expDate === null || expDate < currentTime) {
    console.log("Token is outdate, clear storage");
    return true;
  }
  console.log("Token is not outdate");
  return false;
};
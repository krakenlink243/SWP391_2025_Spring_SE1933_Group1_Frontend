//@author: Vu Hoang
export const validatePrice = (value) => {
  // Must be a valid number format
  if (!/^\d*\.?\d*$/.test(value)) return false;
  if(value[0]==='0') return false;
  // Limit to 2 decimal places
  if (value.includes('.') && value.split('.')[1].length > 2) return false;
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
  return value.trim().replace(/\s+/g, ' ');
}
export const validateMedia = ([]) =>{
  console.log([].length)
  return [].length
}
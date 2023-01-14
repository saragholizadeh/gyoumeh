function randomNumber () {
    const number = Math.floor(Math.random() * 10);
    return number.toString();
  }
  
  function generateRandomCode (length = 4) {
    let result = '';
    for (let i = 0; i < length; i++) {
      result += randomNumber();
    }
    return result;
  }
  
  module.exports = generateRandomCode;
  
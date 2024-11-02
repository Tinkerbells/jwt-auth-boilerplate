const generateOtpCode = () => {
  const randomNum = Math.floor(Math.random() * (999999 - 100000 + 1)) + 100000;
  return randomNum.toString().padStart(6, '0');
}

export default generateOtpCode

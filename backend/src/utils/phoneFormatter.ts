export const formatPhoneNumber = (phone: string): string | null => {
  const croatianPhonePattern = /^(?:\+385|09)[0-9]{8,9}$/;
  if (!croatianPhonePattern.test(phone)) {
    return null;
  }
  
  if (phone.startsWith('09')) {
    return `+385${phone.slice(1)}`;
  }

  return phone;
}
export const generateCaseId = () => {
  return `CASE-${Math.random().toString(36).substr(2, 9).toUpperCase()}`;
};
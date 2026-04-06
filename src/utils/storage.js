export const getUserScenarios = () => {
  return JSON.parse(localStorage.getItem("userScenarios")) || [];
};

export const saveUserScenarios = (data) => {
  localStorage.setItem("userScenarios", JSON.stringify(data));
};
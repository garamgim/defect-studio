export const loginRequest = async (username: string, password: string) => {
  const response = await fetch("https://13.125.235.189/login", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ username, password }),
  });
  return response;
};

// src/api.js
const API = {
  login: async (email, password) => {
    console.log("Mock login with:", email, password);
    return { success: true, token: "mock-token" }; 
  }
};

export default API;

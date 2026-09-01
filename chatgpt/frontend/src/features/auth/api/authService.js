import axios from "axios";

const API = axios.create({
  baseURL: "http://localhost:3000/api",
  withCredentials: true,
});

export const registerApi = async (data) => {
  const response = await API.post("/auth/register", data);
  return response.data;
};

export const loginApi = async (data) => {
  const response = await API.post("/auth/login", data);
  return response.data;
};

export const logoutApi = async () => {
  const response = await API.post("/auth/logout");
  return response.data;
};

export const meApi = async () => {
  const response = await API.get("/auth/me");
  return response.data;
};
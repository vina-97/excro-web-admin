import axios from "axios";
import cookie from "react-cookies";
import GBLVAR from "../Global Variables/GlobalVariables";

const instance = axios.create({
  baseURL: GBLVAR.BASE_URL,
  withCredentials: true,
  headers: {
    "Content-Type": "application/json",
  },
});

instance.interceptors.request.use(
  (config) => {
    const token = cookie.load("AdminWeb");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
      config.withCredentials = true;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

instance.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error?.response?.status === 401) {
      cookie.remove("AdminWeb", { path: "/", domain: ".xylium.com" });
      cookie.remove("AdminWeb", { path: "/" });
      window.location.href = `${window.location.origin}/signin`;
      return;
    }
    return Promise.reject(error);
  }
);

export default instance;

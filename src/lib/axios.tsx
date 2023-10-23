import axios from "axios";

export const axiosInstance = axios.create({
  baseURL: "https://api2.jubelio.com/",
});

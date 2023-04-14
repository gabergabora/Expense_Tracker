import axios from "axios"; 
const token = localStorage.getItem("token");
console.log(token)
const CustomHttp = axios.create({
  baseURL : 'http://127.0.0.1:3000/'
  // .. other options
});

export default CustomHttp;

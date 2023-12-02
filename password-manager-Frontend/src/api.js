import axios from "axios";

export default (function API() {
  axios.defaults.baseURL =
    "https://9c05-2603-3015-501-5f00-641d-f798-dbd1-fd5f.ngrok.io/api";
  axios.defaults.withCredentials = true;
  return axios;
})();

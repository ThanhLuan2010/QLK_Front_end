import axios from "axios";

const interceptor = () => {
  axios.interceptors.request.use(
    (config) => {
      const apiToken = localStorage.getItem("token");
      let result = { ...config };
      if (apiToken) {
        result.headers.Authorization = `Bearer ${apiToken}`;
      }
      delete result.headers["Access-Control-Allow-Origin"];
      return result;
    },
    (error) => {
      console.log(error);
      return Promise.reject(error);
    }
  );

  axios.interceptors.response.use(
    (res) => {
      return Promise.resolve(res.data);
    },
    (error) => {
      if (!axios.isCancel(error)) {
      }
      return Promise.reject(error);
    }
  );
};

export default { interceptor };

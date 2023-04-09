import axios from "axios";

const axiosInstance = axios.create();

axiosInstance.interceptors.response.use(
	function (response) {
		// Any status code that lie within the range of 2xx cause this function to trigger
		return response;
	},
	function (error) {
		// Any status codes that falls outside the range of 2xx cause this function to trigger
		// console.log("Error: ", error);
		throw error;
	}
);

export default axiosInstance;

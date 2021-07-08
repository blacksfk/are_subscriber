import debounce from "./debounce";
import ajax from "./ajax";

function install(Vue) {
	Vue.use(debounce);

	let config = {
		baseURL: process.env.VUE_APP_API_URL,
		timeout: process.env.VUE_APP_API_TIMEOUT
	};

	Vue.use(ajax, config);
}

export default {
	install
};

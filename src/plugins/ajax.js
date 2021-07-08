import Axios from "axios";

function install(Vue, config) {
	let axios = Axios.create(config);

	Vue.prototype.$ajax = axios;
}

export default {
	install
};

import Axios from "axios";

function install(app, config) {
	let axios = Axios.create(config);

	app.config.globalProperties.$ajax = axios;
}

export default {
	install
};

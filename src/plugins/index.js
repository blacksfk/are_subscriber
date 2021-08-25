import timesince from "./timesince";
import debounce from "./debounce";
import ajax from "./ajax";
import auth from "./auth";

function install(app) {
	app.use(debounce);
	app.use(timesince);
	app.use(auth, {storage: window.sessionStorage});

	let config = {
		baseURL: process.env.VUE_APP_API_URL,
		timeout: process.env.VUE_APP_API_TIMEOUT
	};

	app.use(ajax, config);
}

export default {
	install
};

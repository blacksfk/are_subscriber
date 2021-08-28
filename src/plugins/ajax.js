import Axios from "axios";

function install(app, config) {
	let withAuth = Axios.create(config);
	let auth = app.config.globalProperties.$auth;

	// intercept requests and add an
	// "Authorization" header
	withAuth.interceptors.request.use(conf => {
		let base = conf.baseURL;
		let path = conf.url;

		if (path[0] !== "/") {
			// prefix the path
			path = `/${path}`;
		}

		// generate an authorization header
		// and add it to the config
		conf.headers.Authorization = auth.header(
			`${base}${path}`, conf.method);

		return conf;
	});

	app.config.globalProperties.$ajaxWithAuth = withAuth;
	app.config.globalProperties.$ajax = Axios.create(config);
}

export default {
	install
};

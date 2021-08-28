import {createRouter, createWebHistory} from "vue-router";

const routes = [
	{
		path: "/",
		component: () => import("@/views/Home.vue")
	},
	{
		path: "/login",
		component: () => import("@/views/Login.vue"),
		props: route => ({redirect: route.query.redirect})
	},
	{
		path: "/channel",
		meta: {authGuard: true},
		component: () => import("@/views/Channel/Index.vue"),
		children: [
			{
				path: "create",
				component: () => import("@/views/Channel/Create.vue")
			},
			{
				path: ":id",
				props: true,
				component: () => import("@/views/Channel/Edit.vue")
			}
		]
	}
];

function install(app, conf) {
	let auth = app.config.globalProperties.$auth;
	let router = createRouter({
		routes,
		history: createWebHistory(conf.baseURL)
	});

	router.beforeEach(to => {
		if (to.meta.authGuard && !auth.authenticated) {
			return {
				path: "/login",
				query: {redirect: to.fullPath}
			}
		}
	});

	app.use(router);
}

export default {
	install
};

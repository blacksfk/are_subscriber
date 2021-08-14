import Vue from "vue";
import VueRouter from "vue-router";

Vue.use(VueRouter);

const routes = [
	{
		path: "/",
		component: () => import("@/views/Home.vue")
	},
	{
		path: "/channel",
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

let router = new VueRouter({
	mode: "history",
	base: process.env.BASE_URL,
	routes
});

export default router;

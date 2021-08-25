import {createRouter, createWebHistory} from "vue-router";

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

let router = createRouter({
	routes,
	history: createWebHistory(process.env.BASE_URL)
});

export default router;

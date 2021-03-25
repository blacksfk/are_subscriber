import Vue from "vue";
import App from "./App.vue";
import router from "./router";

// Vue.config.productionTip = false;

let vue = new Vue({
	router,
	render: (h) => h(App)
});

vue.$mount("#app");

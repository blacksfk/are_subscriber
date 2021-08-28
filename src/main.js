import App from "./App.vue";
import {createApp} from "vue";
import router from "./router";
import plugins from "./plugins";

let app = createApp(App);

app.use(plugins);
app.use(router, {baseURL: process.env.BASE_URL});

app.mount("#app");

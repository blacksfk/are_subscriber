import App from "./App.vue";
import {createApp} from "vue";
import router from "./router";
import plugins from "./plugins";

let app = createApp(App);

app.use(router);
app.use(plugins);

app.mount("#app");

import debounce from "./debounce";

function install(Vue) {
	Vue.use(debounce);
}

export default {
	install
};

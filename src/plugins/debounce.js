/**
 * Super simple debounce function. Example:
 * function log(str) {
 *     console.log(str);
 * }
 * // wait 1000ms before logging to the console
 * let debouncedLog = debounce(log, 1000);
 * debouncedLog("Shao Khan, Ruler of Outworld");
 * debouncedLog("Kotal Khan, Ruler of Outworld");
 * debouncedLog("Kitana Khan, Ruler of Outworld");
 * // -> "Kitana Khan, Ruler of Outworld"
 *
 * @param  Function f     The function to run once `delay` is reached.
 * @param  Number   delay How long to wait until running the function (in milliseconds).
 * @return void
 */
function debounce(f, delay) {
	let timeout;

	return function() {
		// clear the existing timeout
		clearTimeout(timeout);

		// create a new timeout
		timeout = setTimeout(run, delay, f, this, arguments);
	}
}

/**
 * Run `f` on `args` with `f`'s "this-context" set to `context`.
 *
 * @param  Function f
 * @param  Object   context
 * @param  Array    args
 * @return void
 */
function run(f, context, args) {
	f.apply(context, args);
}

export default {
    install(app) {
        app.config.globalProperties.$debounce = debounce;
    }
};

import Hawk from "hawk"
import {reactive} from "vue";

/**
 * Hawk algorithm.
 */
const HAWK_ALGORITHM = "sha256";

/**
 * Key used in browser storage.
 */
const STORAGE_USER_KEY = "user";

/**
 * User prototype.
 * @param {String} id
 * @param {String} key
 * @param {String} name
 */
function User(id = "", key = "", name = "") {
	this.id = id;
	this.key = key;
	this.name = name;
}

/**
 * Auth prototype.
 * @param {User}    reactiveUser   Must be made reactive with Vue.reactive.
 * @param {Storage} browserStorage Browser storage API.
 */
function Auth(reactiveUser, browserStorage) {
	// private
	let offset = 0;
	let storage = browserStorage;

	this._user = reactiveUser;

	/**
	 * Store the current user in browser storage in JSON format.
	 * @return {void}
	 */
	this.save = function() {
		storage.setItem(STORAGE_USER_KEY, JSON.stringify(this.user));
	}

	/**
	 * Set the storage to be used for the user.
	 * @param  {Storage} s
	 * @return {void}
	 */
	this.setStorage = function(s) {
		storage = s;

		// save the user to the new storage
		this.save();
	}

	/**
	 * Calculate a hawk authorisation header.
	 * @param  {String} url    Complete URL. Eg.: "https://example.com/char/johnny_cage"
	 * @param  {String} method HTTP verb. Eg.: "GET", "POST", etc.
	 * @return {String}        To be used as req.headers.Authorization's value.
	 */
	this.header = function(url, method) {
		let config = {
			localtimeOffsetMsec: offset,
			credentials: {
				id: this._user.id,
				key: this._user.key,
				algorithm: HAWK_ALGORITHM
			}
		};

		// generate a hawk authorization header
		let h = Hawk.client.header(url, method, config);

		return h.header;
	}

	/**
	 * Set the offset (in seconds) that is passed down to the hawk library.
	 * @param {Number} o
	 */
	this.setOffset = function(o) {
		offset = o;
	}
}

// define an accessor and a mutator for the authenticated user
Object.defineProperty(Auth.prototype, "user", {
	/**
	 * Get the current user.
	 * @return {User}
	 */
	get() {
		return this._user;
	},

	/**
	 * Set the curently authenticated user.
	 * @param {Object} obj Must contain the keys: "id", "key", "name".
	 */
	set(obj) {
		this._user.id = obj.id;
		this._user.key = obj.key;
		this._user.name = obj.name;

		// update the user in storage
		this.save();
	}
});

// define accessors for the authenticated state
Object.defineProperty(Auth.prototype, "authenticated", {
	/**
	 * Determine the current authentication state.
	 * @return {Boolean}
	 */
	get() {
		return (this._user.id.length > 0 &&
			this._user.key.length > 0);
	}
});

/**
 * Load a user from the given browser storage.
 * @param  {Storage} storage Eg.: window.localStorage, window.sessionStorage.
 * @return {User}            Empty if a user wasn't found in storage.
 */
function load(storage) {
	let user = new User();
	let str = storage.getItem(STORAGE_USER_KEY);

	if (str) {
		// user exists in storage, parse as JSON
		let obj = JSON.parse(str);

		user.id = obj.id;
		user.key = obj.key;
		user.name = obj.name;
	}

	return user;
}

/**
 * Embed an instance of `Auth` into `app`'s global properties as $auth.
 * config: {
 * 	// required
 * 	storage: window.sessionStorage // either of the storage APIs
 * }
 * @param  {Vue}    app
 * @param  {Object} config
 * @return {void}
 */
function install(app, config) {
	// make the user's properties reactive
	let user = reactive(load(config.storage));
	let auth = new Auth(user, config.storage);

	app.config.globalProperties.$auth = auth;
}

export default {
	install
};

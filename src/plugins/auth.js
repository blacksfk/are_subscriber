import Hawk from "hawk"

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
 * @param {User}    reactiveUser   Must be made reactive with Vue.observable.
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
	 * Update the hawk client's offset from the server's clock.
	 * @param  {Number} serverTime
	 * @return {void}
	 */
	this.updateOffset = function(serverTime) {
		// update the local offset by calculating an absolute value
		offset = Math.abs(Date.now() - serverTime);
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
 * Embed an instance of `Auth` into Vue's prototype as $auth.
 * config: {
 * 	// required
 * 	storage: window.sessionStorage // either of the storage APIs
 * }
 * @param  {Vue}    Vue
 * @param  {Object} config
 * @return {void}
 */
function install(Vue, config) {
	let user;
	let str = config.storage.getItem(STORAGE_USER_KEY);

	if (str) {
		// user exists in storage, parse as JSON
		let obj = JSON.parse(str);

		user = new User(obj.id, obj.key, obj.name);
	} else {
		// user does not exist in storage
		user = new User();
	}

	// make the user object's properties reactive
	let reactive = Vue.observable(user);

	// embed into Vue's prototype
	Vue.prototype.$auth = new Auth(reactive, config.storage);
}

export default {
	install
};

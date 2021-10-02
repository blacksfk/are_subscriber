import Modal from "@/components/Modal.vue";
import Tyres from "@/components/Tyres.vue";
import Status from "@/components/Status.vue";
import Inputs from "@/components/Inputs.vue";
import Pitstop from "@/components/Pitstop.vue";
import Conditions from "@/components/Conditions.vue";
import Motor from "@/components/Motor.vue";
import SearchableSelect from "@/components/SearchableSelect.vue";
import ClearableInput from "@/components/ClearableInput.vue";
import TabRow from "@/components/TabRow.vue";
import InGameClock from "@/components/InGameClock.vue";
import CurrLaptime from "@/components/CurrLaptime.vue";
import DrivingTime from "@/components/DrivingTime.vue";
import StintFuelEconomy from "@/components/StintFuelEconomy.vue";

import Lap from "@/util/lap";
import TelemetryBlueprint from "@/util/telemetryBlueprint";
import CARS from "@/util/carEnum";
import DriverTime from "@/util/driverTime";

/**
 * Number of laps in the recent lap times array.
 * @type {Number}
 */
const RECENT_LAP_COUNT = 5;

/**
 * Instance variables.
 */
function data() {
	return {
		/**
		 * True on first run or when the session has changed.
		 * @type {Boolean}
		 */
		firstRun: true,

		/**
		 * Current tab index.
		 * @type {Number}
		 */
		currTab: 0,

		/**
		 * Whether or not this client is connected to the server
		 * via a websocket.
		 * @type {Boolean}
		 */
		connected: false,

		/**
		 * Websocket connection.
		 * @type {WebSocket}
		 */
		ws: undefined,

		/**
		 * Selectable channels. Loaded at run time from the API.
		 * @type {Array}
		 */
		channels: [],

		/**
		 * Array of Lap objects.
		 * @type {Array}
		 */
		laps: [],

		/**
		 * The current lap that data is being received on.
		 * @type {Lap}
		 */
		currLap: undefined,

		/**
		 * The channel the user is currently connected to.
		 * @type {Object}
		 */
		channel: {
			id: "",
			name: "",
			password: ""
		},

		/**
		 * Telmetry data as defined in the publisher client.
		 * @type {Object}
		 */
		telemetry: new TelemetryBlueprint(),

		/**
		 * Array of DriverTime objects.
		 * @type {Array}
		 */
		driverTimes: []
	};
}

/**
 * Computed instance variables.
 */
let computed = {
	/**
	 * Session time remaining in the form: hh:mm:ss.
	 */
	timeRemaining() {
		let t = this.telemetry.session.timeLeft / 1000;
		let m = Math.floor(t / 60);
		let h = Math.floor(m / 60).toString().padStart(2, "0");
		let s = Math.floor(t % 60).toString().padStart(2, "0");

		m = (m % 60).toString().padStart(2, "0");

		return `${h}:${m}:${s}`;
	},

	/**
	 * LED colour based on the connection status.
	 */
	ledClass() {
		return (this.connected ? "led-green" : "led-red");
	},

	/**
	 * LED tooltip text based on the connection status.
	 */
	ledTooltip() {
		return (this.connected ? "Connected" : "Not connected");
	},

	/**
	 * Full player name.
	 */
	playerName() {
		return fullName(this.telemetry.player.firstname,
			this.telemetry.player.surname);
	},

	/**
	 * Car name.
	 */
	car() {
		return CARS[this.telemetry.car.model] || "";
	},

	/**
	 * RECENT_LAP_COUNT most recent laps in reverse order.
	 * I.e. The first element is the most recent lap.
	 */
	recentLaps() {
		// start at the second element to avoid the lap
		// in progress
		return this.laps.slice(1, RECENT_LAP_COUNT);
	}
};

/**
 * Created hook. Initialises the first lap and gets all
 * channel objects from the API.
 */
function created() {
	// get all channels
	return this.$ajax.get("channel")
		.then(r => this.channels = r.data || [])
		.catch(console.error);
}

/**
 * Websocket status enumeration.
 */
const WS_STATUS = {
	// challenges
	WS_CHALLENGE_SUCCESS: 4000,
	WS_CHALLENGE_PASSWORD: 4001,

	// informational
	WS_OK: 4200,

	// errors
	WS_ERROR_BAD_MSG: 4400,
	WS_ERROR_UNAUTHORISED: 4401,
	WS_ERROR_FORBIDDEN: 4402,
	WS_ERROR_NOT_FOUND: 4403,
	WS_ERROR_TIMEOUT: 4404,
	WS_ERROR_CHANNEL_FULL: 4405
};

/**
 * Application-defined websocket error code string enumerator.
 * @param  {Number} e The code to enumerate.
 * @return {String}   Description of the error code.
 */
function wsErrorToString(e) {
	switch (e) {
	case WS_STATUS.WS_ERROR_BAD_MSG:
		return "Bad message";
	case WS_STATUS.WS_ERROR_UNAUTHORISED:
		return "Unauthorised";
	case WS_STATUS.WS_ERROR_FORBIDDEN:
		return "Forbidden";
	case WS_STATUS.WS_ERROR_NOT_FOUND:
		return "Not found";
	case WS_STATUS.WS_ERROR_TIMEOUT:
		return "Timed out";
	case WS_STATUS.WS_ERROR_CHANNEL_FULL:
		return "Channel is full. Please try again later.";
	default:
		return `Unknown error code: ${e}`;
	}
}

/**
 * Connect the requested channel.
 * @return {void}
 */
function connect() {
	if (this.connected) {
		// ws is not undefined and therefore could still be connected
		console.error("Still connected. Please disconnect first.");

		return;
	}

	let url = `${process.env.VUE_APP_API_WS}/subscribe/${this.channel.id}`;

	this.ws = new WebSocket(url);

	// bind the vue instance context instead of the websocket's
	this.ws.onclose = this.onClose.bind(this);
	this.ws.onerror = this.onError.bind(this);
	this.ws.onmessage = this.onMessage.bind(this);
}

/**
 * Disconnect from the current channel.
 * @return {void}
 */
function disconnect() {
	if (!this.connected) {
		// websocket is not connected
		return;
	}

	this.ws.close();
}

/**
 * WebSocket onclose event handler.
 * @param  {CloseEvent} event
 * @return {void}
 */
function onClose(event) {
	this.ws = undefined;
	this.connected = false;
}

/**
 * WebSocket onerror event handler.
 * @param  {error} e
 * @return {void}
 */
function onError(e) {
	console.error("WebSocket error");
	console.error(e);
}

/**
 * WebSocket onmessage event handler.
 * @param  {MessageEvent} event
 * @return {void}
 */
function onMessage(event) {
	// parse the received data as JSON
	let msg = JSON.parse(event.data);

	switch (msg.status) {
	case WS_STATUS.WS_CHALLENGE_SUCCESS:
		// challenge succeeded; mark as connected
		this.connected = true;
		break;
	case WS_STATUS.WS_CHALLENGE_PASSWORD:
		// send the password to the server
		this.ws.send(this.channel.password);
		break;
	case WS_STATUS.WS_OK:
		// data or an all good message was received
		if (!msg.data) {
			break;
		}

		this.newTelemetryData(msg.data);
		break;
	default:
		// either an error occurred or an unsupported status was received
		console.error(msg.status, wsErrorToString(msg.status));
	}
}

/**
 * Firstly, start a new lap or add the previous sector time to the
 * current lap, then overwrite the old data with the new.
 * @param  {Object} data Expected to be a delta object matching the telemetry.
 * @return {void}
 */
function newTelemetryData(data) {
	if (data.newSession) {
		// reset all data
		this.laps = [];
		this.driverTimes = [];
		this.telemetry = new TelemetryBlueprint();
		this.firstRun = true;
	} else {
		this.updateLaptimes(data);
	}

	if (this.firstRun) {
		this.firstRun = false;

		// start a new lap
		this.currLap = new Lap(data.laps + 1 || 1);
		this.laps.push(this.currLap);
	}

	// overwrite the old data with the new
	recurse(this.telemetry, data);

	// update the driving time
	this.updateDrivingTime();
}

/**
 * Update lap time data.
 * @param  {Object} data
 * @return {void}
 */
function updateLaptimes(data) {
	if (data.laptimes.prevSector) {
		// sector completed
		this.currLap.sectorComplete(data.laptimes.prevSector);
	}

	if (data.laptimes.prev) {
		// lap completed
		this.currLap.complete(data.laptimes.prev);

		// start a new lap
		this.currLap = new Lap(
			data.laps + 1,
			this.telemetry.track.sectors,
			this.playerName
		);

		// insert as the first element
		this.laps.unshift(this.currLap);
	}

	if (data.laptimes.currSector) {
		// update the current sector time
		this.currLap.setSector(data.laptimes.currSector);
	}

	// notable events
	this.lapNotes(data);
}

/**
 * Update the current or previous lap with notable occurrences.
 * @param  {Object} data
 * @return {void}
 */
function lapNotes(data) {
	if (data.isInPitLane &&
		!this.telemetry.isInPitLane) {
		// in pit lane
		if (data.laps === this.telemetry.laps) {
			// on the same lap
			this.currLap.inLap();
		} else {
			// came in on the previous lap
			// ensure there are at least two laps
			if (this.laps.length > 1) {
				// the previous lap will always
				// be the second element while
				// unshift is being used
				this.laps[1].inLap();
			}
		}
	}

	if (data.isInPitLane === false &&
		this.telemetry.isInPitLane) {
		// no longer in pit lane
		this.currLap.outLap();
	}
}

/**
 * Update the driving time of the current driver.
 * Should be called after updating the telemetry
 * object.
 * @return {void}
 */
function updateDrivingTime() {
	let dt = undefined;
	let len = this.driverTimes.length;

	// find the current driver in the drivers array
	for (let i = 0; i < len; i++) {
		if (this.playerName === this.driverTimes[i].name) {
			dt = this.driverTimes[i];
			break;
		}
	}

	if (!dt) {
		// not found, add a new one
		dt = new DriverTime(
			this.playerName,
			this.telemetry.drivingTime.stintRemaining,
			this.telemetry.drivingTime.totalRemaining);

		this.driverTimes.push(dt);
	} else {
		// found, update the existing
		dt.stintRemaining = this.telemetry.drivingTime.stintRemaining;
		dt.totalRemaining = this.telemetry.drivingTime.totalRemaining;
	}
}

/**
 * Update the previous object's values with the new object's values
 * using a depth-first approach.
 * @param  {Object} prev
 * @param  {Object} next
 */
function recurse(prev, next) {
	for (let k in next) {
		if (typeof next[k] === "object") {
			// down a level
			recurse(prev[k], next[k]);
		} else {
			// update the old value with the new
			prev[k] = next[k];
		}
	}
}

/**
 * Concatenate the driver's name.
 * @param  {String} first
 * @param  {String} last
 * @return {String}
 */
function fullName(first, last) {
	return `${first} ${last}`;
}

/**
 * Channel object filter callback that determines whether or not the
 * given channel object matches the provided search term.
 * @param  {Object}  channel
 * @param  {String}  term
 * @return {Boolean}
 */
function filterChannel(channel, term) {
	return channel.name.toLowerCase().includes(term.toLowerCase());
}

export default {
	data,
	computed,
	created,
	methods: {
		connect,
		disconnect,
		onClose,
		onError,
		onMessage,
		newTelemetryData,
		filterChannel,
		updateLaptimes,
		lapNotes,
		updateDrivingTime,
	},
	components: {
		Modal,
		Tyres,
		Status,
		Inputs,
		Pitstop,
		Conditions,
		Motor,
		SearchableSelect,
		ClearableInput,
		TabRow,
		InGameClock,
		CurrLaptime,
		DrivingTime,
		StintFuelEconomy,
	}
};

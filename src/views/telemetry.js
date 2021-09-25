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
import fmtLaptime from "@/util/fmtLaptime";
import Lap from "@/util/lap";

// default to three sectors
const DEFAULT_SECTOR_COUNT = 3;

/**
 * Instance variables.
 */
function data() {
	return {
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
		 * Telemetry data as defined in the publisher client.
		 * See: https://github.com/blacksfk/are_publisher
		 * @type {Object}
		 */
		telemetry: {
			position: 0,
			distanceTraveled: 0.0,
			laps: 0,
			tyreSet: 0,
			isBoxed: false,
			isInPitLane: false,
			mandatoryPitDone: false,
			rainTyres: false,
			laptimes: {
				curr: 0,
				prev: 0,
				best: 0,
				estimated: 0,
				delta: 0,
				currSectorIndex: 0,
				currSector: 0,
				isDeltaPositive: false,
				isValidLap: false
			},
			electronics: {
				tc: 0,
				tcCut: 0,
				engineMap: 0,
				abs: 0,
				headlightState: 0,
				wiperState: 0,
				rainLight: false,
				flasher: false,
				leftIndicator: false,
				rightIndicator: false
			},
			session: {
				type: "",
				timeLeft: 0.0,
				activeCars: 0,
				clock: 0.0
			},
			conditions: {
				windSpeed: 0.0,
				windDirection: 0.0,
				track: "",
				rain: {
					curr: "",
					in10: "",
					in30: ""
				}
			},
			pitstop: {
				tyreSet: 0,
				fuel: 0,
				pressure: {
					fl: 0.0,
					fr: 0.0,
					rl: 0.0,
					rr: 0.0
				}
			},
			penalty: {
				type: 0,
				duration: 0.0
			},
			drivingTime: {
				totalRemaining: 0,
				stintRemaining: 0
			},
			fuel: {
				used: 0.0,
				rate: 0.0
			},
			flag: {
				curr: 0,
				green: false,
				chequered: false,
				red: false,
				white: false,
				yellow: {
					global: false,
					sector1: false,
					sector2: false,
					sector3: false
				}
			},
			speed: 0.0,
			gear: 0,
			tcIntervention: 0.0,
			absIntervention: 0.0,
			fuelRemaining: 0.0,
			input: {
				accelerator: 0.0,
				brake: 0.0,
				steering: 0.0,
				pitLimiter: false
			},
			brakes: {
				bias: 0.0,
				compound: {
					front: 0,
					rear: 0,
				},
				padDepth: {
					fl: 0.0,
					fr: 0.0,
					rl: 0.0,
					rr: 0.0
				},
				rotorDepth: {
					fl: 0.0,
					fr: 0.0,
					rl: 0.0,
					rr: 0.0
				},
				temp: {
					fl: 0.0,
					fr: 0.0,
					rl: 0.0,
					rr: 0.0
				}
			},
			temp: {
				ambient: 0.0,
				track: 0.0
			},
			motor: {
				rpm: 0,
				boostPressure: 0.0,
				running: false,
				starter: false,
				ignition: false
			},
			tyres: {
				pressure: {
					fl: 0.0,
					fr: 0.0,
					rl: 0.0,
					rr: 0.0
				},
				temp: {
					fl: 0.0,
					fr: 0.0,
					rl: 0.0,
					rr: 0.0
				}
			},
			damage: {
				front: 0.0,
				rear: 0.0,
				left: 0.0,
				right: 0.0,
				centre: 0.0
			},
			sessions: 0,
			sharedMemVer: "",
			accVer: "",
			player: {
				firstname: "",
				surname: "",
				nickname: ""
			},
			car: {
				model: "",
				maxRPM: 0,
				tankCap: 0.0
			},
			track: {
				name: "",
				sectors: DEFAULT_SECTOR_COUNT
			},
			pitWindow: {
				start: 0,
				end: 0
			}
		}
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
		return this.telemetry.player.firstname + " " +
			this.telemetry.player.surname;
	}
};

/**
 * Created hook. Initialises the first lap and ets all
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
	// if (data.laptimes.prevSector) {
	// 	this.currLap.setSector(data.laptimes.prevSector);
	// }

	// if (data.laptimes.prev) {
	// 	let sectorCount = 0;

	// 	if (data.track && data.track.sectors) {
	// 		// new circuit
	// 		sectorCount = data.track.sectors;
	// 	} else {
	// 		// same circuit
	// 		sectorCount = this.telemetry.track.sectors;
	// 	}

	// 	// lap complete
	// 	this.currLap.complete(data.laptimes.prev);

	// 	// start a new lap
	// 	this.currLap = new Lap(data.laps + 1, sectorCount);
	// 	this.laps.unshift(this.currLap);
	// }

	// if (data.laptimes.currSector) {
	// 	this.currLap.setSector(
	// 		data.laptimes.currSectorIndex || this.telemetry.laptimes.currSectorIndex,
	// 		data.laptimes.currSector
	// 	);
	// }

	// overwrite the old data with the new
	recurse(this.telemetry, data);
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
		filterChannel
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
	}
};

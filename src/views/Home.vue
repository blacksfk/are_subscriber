<template>
<div>
	<!-- connection modal -->
	<modal v-show="!connected" @close="connected = true">
		<h3>Join a channel</h3>
		<form action="connect" method="post" @submit.prevent="connect">
			<div class="input-group">
				<label for="id">Channel ID</label>
				<searchable-select name="id" :options="channels" v-model="channel" display-key="name" placeholder="Channel ID" :filter="filterChannel"/>
			</div>
			<div class="input-group">
				<label for="Password">Password</label>
				<clearable-input type="password" name="password" v-model="channel.password" placeholder="Channel password"/>
			</div>
			<input type="submit" value="Connect" class="btn btn-primary">
		</form>
	</modal>

	<!-- header -->
	<div class="header">
		<div class="row space-between">
			<div class="col-33 col-start">
				<span class="led led-sm" :class="ledClass" :title="ledTooltip"></span>&nbsp;<span v-show="connected">Connected to: {{ channel.name }}</span>
			</div>
			<div class="col-33 col-centre">
				<h2><span>{{ telemetry.session.type }}</span> &commat; <span>{{ telemetry.track.name }}</span> | <in-game-clock :clock="telemetry.session.clock"></in-game-clock></h2>
			</div>
			<div class="col-33 col-end"><span>{{ timeRemaining }} remaining</span></div>
		</div>
		<div class="row">
			<div class="col-33 col-centre">
				<curr-laptime :current="telemetry.laptimes.curr" :delta="telemetry.laptimes.delta" :delta-positive="telemetry.laptimes.isDeltaPositive" :valid="telemetry.laptimes.isValidLap"></curr-laptime>
			</div>
		</div>
		<tab-row v-model="currTab" :items="['Telemetry', 'Laps']"></tab-row>
	</div>

	<!-- telemetry tab -->
	<div class="grid-container" v-show="currTab === 0">

		<!-- grid row 1 -->
		<div class="grid-item">
			<status :position="telemetry.position" :laps="telemetry.laps" :distance-traveled="telemetry.distanceTraveled" :tyre-set="telemetry.tyreSet" :fuel-used="telemetry.fuel.used" :fuel-remaining="telemetry.fuelRemaining" :fuel-rate="telemetry.fuel.rate"></status>
		</div>
		<div class="grid-item">
			<conditions v-bind="telemetry.conditions" :temp="telemetry.temp"></conditions>
		</div>
		<div class="grid-item">
			<h2>Next Pit Stop</h2>
			<pitstop v-bind="telemetry.pitstop"></pitstop>
		</div>

		<!-- grid row 2 -->
		<div class="grid-item">
			<inputs :electronics="telemetry.electronics" :tc="telemetry.tc" :abs="telemetry.abs" :input="telemetry.input"></inputs>
		</div>
		<div class="grid-item">
			<motor :motor="telemetry.motor" :speed="telemetry.speed" :gear="telemetry.gear" :tc="telemetry.tcIntervention" :abs="telemetry.absIntervention"></motor>
		</div>
		<div class="grid-item">
			<tyres :brakes="telemetry.brakes" :tyres="telemetry.tyres"></tyres>
		</div>
	</div>

	<!-- lap times tab -->
	<div v-show="currTab === 1">
		<div class="table-responsive">
			<table class="table table-text-centre table-striped">
				<thead>
					<tr>
						<th>Lap</th>
						<th>Sector 1</th>
						<th>Sector 2</th>
						<th>Sector 3</th>
						<th>Lap time</th>
						<th>Delta</th>
					</tr>
				</thead>
				<tbody>
					<tr v-for="lap in reversedLaps" :key="lap.lapNo">
						<td>{{ lap.lapNo }}</td>
						<td>{{ lap.sectors[0] }}</td>
						<td>{{ lap.sectors[1] }}</td>
						<td>{{ lap.sectors[2] }}</td>
						<td>{{ lap.total }}</td>
						<td>{{ lap.delta(telemetry.laptimes.best) }}</td>
					</tr>
				</tbody>
			</table>
		</div>
	</div>
</div>
</template>
<style>
@import url('https://fonts.googleapis.com/css2?family=Fira+Mono&display=swap');

.grid-container {
	display: grid;
	grid-gap: 5px;
	padding: 5px;
	grid-template-areas: "item item item";
}

.grid-item {
	padding: 15px;
	background-color: var(--fg-primary);
	border-radius: 4px;
	font-family: "Fira Mono", monospace;
	grid-area: "item";
}

.header {
	position: sticky;
	top: 0;
	left: 0;
	background-color: var(--bg-primary);
}

.header h2 {
	margin: 0;
}

.header > .row:first-child {
	padding: 20px;
}
</style>
<script>
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

/**
 * Lap prototype.
 */
function Lap(lapNo) {
	let rawTotal = 0;
	let complete = false;

	// formatted total time (mm:ss.xxx)
	// becomes a non-empty string once the lap is complete
	this.total = "";

	// array of sector times in seconds (ss.xxx)
	this.sectors = [];

	// the lap number of that this lap time was set
	this.lapNo = lapNo;

	/**
	 * Add a sector time to the lap. Returns true when the lap is complete
	 * and false otherwise.
	 * @param  {Number}  time Sector time in milliseconds
	 * @return {Boolean}
	 */
	this.addSector = function(time) {
		rawTotal += time;
		this.sectors.push(time / 1000);

		// assumption: only 3 sectors per circuit. i.e. no nordschleife ;)
		if (this.sectors.length === 3) {
			// lap complete; format the total as a string
			this.total = fmtLaptime(rawTotal, 3, 6);

			return true;
		}

		return false;
	}

	/**
	 * Get a delta time (in seconds). This should always return a positive number.
	 * i.e. It is assumed that best will always be less than or equal to rawTotal.
	 * @param  {Number} best Best lap time in milliseconds.
	 * @return {String}      Difference between best and rawTotal.
	 */
	this.delta = function(best) {
		let diff = rawTotal - best;

		return (diff / 1000).toFixed(3);
	}
}

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
				prevSector: 0,
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
				sectors: 0
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
	 * Lap objects in reverse order.
	 */
	reversedLaps() {
		return this.laps.reverse();
	}
};

/**
 * Created hook. Gets all channel objects from the API.
 */
function created() {
	this.$ajax.get("channel")
		.then(r => this.channels = r.data)
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
	if (!this.currLap) {
		// new lap started
		this.currLap = new Lap(this.laps + 1);
	}

	if (data.laptimes &&
		data.laptimes.currSectorIndex != this.telemetry.laptimes.currSectorIndex
	) {
		// new sector started; add the old sector time to the lap
		let done = this.currLap.addSector(data.laptimes.prevSector);

		if (done) {
			// lap completed
			this.laps.push(this.currLap);
			this.currLap = undefined;
		}
	}

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
</script>

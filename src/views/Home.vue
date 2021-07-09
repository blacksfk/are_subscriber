<template>
<div>
	<!-- connection modal -->
	<modal v-show="!connected" @close="connected = true">
		<h3>Join a channel</h3>
		<form action="connect" method="post">
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
				<div class="led led-sm" :class="ledClass" :title="ledTooltip"></div>
			</div>
			<div class="col-33 col-centre">
				<h2><span>{{ telemetry.hud.session.type }}</span> &commat; <span>{{ telemetry.properties.track.name }}</span> | <in-game-clock :clock="telemetry.hud.session.clock"></in-game-clock></h2>
			</div>
			<div class="col-33 col-end"><span>{{ timeRemaining }} remaining</span></div>
		</div>
		<div class="row">
			<div class="col-33 col-centre">
				<curr-laptime :current="telemetry.hud.laptimes.current" :delta="telemetry.hud.laptimes.delta" :delta-positive="telemetry.hud.laptimes.isDeltaPositive" :valid="telemetry.hud.laptimes.isValidLap"></curr-laptime>
			</div>
		</div>
		<tab-row v-model="currTab" :items="['Telemetry', 'Laps']"></tab-row>
	</div>

	<!-- telemetry tab -->
	<div class="grid-container" v-show="currTab === 0">

		<!-- grid row 1 -->
		<div class="grid-item">
			<status :position="telemetry.hud.position" :laps="telemetry.hud.laps" :distance-traveled="telemetry.hud.distanceTraveled" :tyre-set="telemetry.hud.tyreSet"></status>
		</div>
		<div class="grid-item">
			<conditions v-bind="telemetry.hud.conditions" :temp="telemetry.physics.temp"></conditions>
		</div>
		<div class="grid-item">
			<h2>Next Pit Stop</h2>
			<pitstop v-bind="telemetry.hud.pitstop"></pitstop>
		</div>

		<!-- grid row 2 -->
		<div class="grid-item">
			<inputs :electronics="telemetry.hud.electronics" :tc="telemetry.physics.tc" :abs="telemetry.physics.abs" :input="telemetry.physics.input"></inputs>
		</div>
		<div class="grid-item">
			<motor :motor="telemetry.physics.motor" :speed="telemetry.physics.speed" :gear="telemetry.physics.gear" :tc="telemetry.physics.tc" :abs="telemetry.physics.abs"></motor>
		</div>
		<div class="grid-item">
			<tyres :brakes="telemetry.physics.brakes" :tyres="telemetry.physics.tyres"></tyres>
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
					<tr v-for="lt in laptimes" :key="lt.lapNo">
						<td>{{ lt.lapNo }}</td>
						<td>{{ lt.sectors[0] }}</td>
						<td>{{ lt.sectors[1] }}</td>
						<td>{{ lt.sectors[2] }}</td>
						<td>{{ lt.total }}</td>
						<td>{{ lt.delta(telemetry.hud.laptimes.best) }}</td>
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
 * Laptime prototype.
 */
function Laptime(lapNo) {
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
	 * @return {Number}      Positive difference between best and rawTotal.
	 */
	this.delta = function(best) {
		let diff = rawTotal - best;

		return (diff / 1000);
	}
}

/**
 * Instance variables.
 */
function data() {
	return {
		currTab: 0,
		connected: false,
		channels: [],
		laptimes: [],
		channel: {
			id: "",
			name: "",
			password: ""
		},
		telemetry: {
			hud: {
				trackStatus: "",
				tyreCompound: "",
				position: 0,
				distanceTraveled: 0,
				gameStatus: 0,
				laps: 0,
				tyreSet: 0,
				isBoxed: false,
				isInPitLane: false,
				mandatoryPitDone: false,
				rainTyres: false,
				laptimes: {
					current: 0,
					last: 0,
					best: 0,
					delta: 0,
					estimated: 0,
					lastSplit: 0,
					isDeltaPositive: false,
					isValidLap: true
				},
				electronics: {
					tc: 0,
					tcCut: 0,
					engineMap: 0,
					abs: 0,
					rainLight: 0,
					flashingLights: 0,
					lights: 0,
					wiperLevel: 0,
					leftIndicator: false,
					rightIndicator: false
				},
				session: {
					type: "<session type>",
					timeLeft: 0,
					activeCars: 0,
					clock: 0
				},
				conditions: {
					windSpeed: 0,
					windDirection: 0,
					track: "",
					rain: {
						current: "",
						in10: "",
						in30: ""
					}
				},
				pitstop: {
					tyreSet: 0,
					strategyTyreSet: 0,
					fuel: 0,
					pressure: {
						fl: 0,
						fr: 0,
						rl: 0,
						rr: 0
					}
				},
				penalty: {
					type: 0,
					duration: 0
				},
				drivingTime: {
					totalRemaining: 0,
					stintRemaining: 0
				},
				fuel: {
					used: 0,
					rate: 0
				},
				flag: {
					current: 0,
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
				}
			},
			physics: {
				speed: 0,
				gear: 0,
				tc: 0,
				abs: 0,
				input: {
					accelerator: 0,
					brake: 0,
					clutch: 0,
					steeringAngle: 0,
					pitLimiter: false
				},
				brakes: {
					bias: 0,
					pressure: {
						fl: 0,
						fr: 0,
						rl: 0,
						rr: 0
					},
					compound: {
						front: 0,
						rear: 0
					},
					padWear: {
						fl: 0,
						fr: 0,
						rl: 0,
						rr: 0
					},
					discWear: {
						fl: 0,
						fr: 0,
						rl: 0,
						rr: 0
					},
					temp: {
						fl: 0,
						fr: 0,
						rl: 0,
						rr: 0
					}
				},
				temp: {
					ambient: 0,
					track: 0
				},
				motor: {
					waterTemp: 0,
					rpm: 0,
					boostPressure: 0,
					running: false,
					starter: false,
					ignition: false
				},
				tyres: {
					pressure: {
						fl: 0,
						fr: 0,
						rl: 0,
						rr: 0
					},
					temp: {
						fl: 0,
						fr: 0,
						rl: 0,
						rr: 0
					}
				},
				angle: {
					pitch: 0,
					roll: 0,
					yaw: 0
				},
				damage: {
					front: 0,
					rear: 0,
					left: 0,
					right: 0,
					centre: 0
				},
				suspensionTravel: {
					fl: 0,
					fr: 0,
					rl: 0,
					rr: 0
				}
			},
			properties: {
				sharedMemVer: "",
				accVer: "",
				dryTyre: "",
				wetTyre: "",
				player: {
					firstname: "",
					lastname: "",
					nickname: ""
				},
				car: {
					model: "",
					maxRPM: 0,
					tankCap: 0
				},
				track: {
					name: "<track>",
					sectors: 0
				},
				pitWindow: {
					start: 0,
					end: 0
				},
				weekend: {
					penaltiesEnabled: false,
					tyreBlankets: 0,
					fuelRate: 0,
					tyreRate: 0,
					damageRate: 0,
					sessions: 0,
					cars: 0
				}
			}
		}
	};
}

const TWELVE_HOURS = 12 * 3600;

/**
 * Computed instance variables.
 */
let computed = {
	/**
	 * Session time remaining in the form: hh:mm:ss.
	 */
	timeRemaining() {
		let t = this.telemetry.hud.session.timeLeft;
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
	}
};

/**
 * Created hook. Gets all channel objects from the API.
 */
function created() {
	this.$ajax.get("channel")
		.then(r => this.channels = r.data)
		.catch(console.log);
}

function connect() {
	//
}

function disconnect() {
	//
}

/**
 * Only update the keys and values in this.telemetry with the ones
 * recieved in newTelemetry.
 * @param  {Object} newTelemetry
 */
function delta(newTelemetry) {
	recurse(this.telemetry, newTelemetry);
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

export default {
	data,
	computed,
	created,
	methods: {
		connect,
		disconnect,
		delta,
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

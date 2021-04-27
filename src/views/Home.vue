<template>
<div>
	<modal v-show="!connected" @ready="$refs.id.focus()" @close="connected = true">
		<h3>Join a channel</h3>
		<form action="connect" method="post">
			<div class="input-group">
				<label for="id">Channel ID</label>
				<input type="text" name="id" id="id" class="input" placeholder="Channel ID" v-model="channel.id" ref="id">
			</div>
			<div class="input-group">
				<label for="Password">Password</label>
				<input type="password" name="password" id="password" placeholder="Channel password" class="input" v-model="channel.password">
			</div>
			<input type="submit" value="Connect" class="btn btn-primary">
		</form>
	</modal>
	<div class="grid-container">
		<div class="grid-item header">
			<div class="row space-between">
				<div class="col-33 col-start">
					<div class="row">
						<div class="led led-sm led-red"></div>
					</div>
				</div>
				<div class="col-33 col-centre">
					<span>{{ telemetry.hud.session.type }}</span>
				</div>
				<div class="col-33 col-end"><span>{{ timeRemaining }}</span> remaining</div>
			</div>
		</div>
		<div class="grid-item">
			<laptimes v-bind="telemetry.hud.laptimes"></laptimes>
		</div>
		<div class="grid-item">
			<misc :player="telemetry.properties.player" :track="telemetry.properties.track.name" :pit-window="telemetry.properties.pitWindow" :clock="telemetry.hud.session.clock"></misc>
			<!-- <car :id="telemetry.properties.car.model"></car> -->
		</div>
		<div class="grid-item">
			<conditions v-bind="telemetry.hud.conditions" :temp="telemetry.physics.temp"></conditions>
		</div>
		<div class="grid-item">
			<status :position="telemetry.hud.position" :laps="telemetry.hud.laps" :distance-traveled="telemetry.hud.distanceTraveled" :tyre-set="telemetry.hud.tyreSet"></status>
		</div>
		<div class="grid-item">
		</div>
		<div class="grid-item">
			<h2>Next Pit Stop</h2>
			<pitstop v-bind="telemetry.hud.pitstop"></pitstop>
		</div>
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
</div>
</template>
<style>
@import url('https://fonts.googleapis.com/css2?family=Fira+Mono&display=swap');

.grid-container {
	display: grid;
	grid-gap: 5px;
	padding: 5px;
	grid-template-areas: 'header header header';
}

.grid-item {
	padding: 15px;
	background-color: var(--fg-primary);
	border-radius: 4px;
	font-family: "Fira Mono", monospace;
}

.header {
	grid-area: header;
}
</style>
<script>
import Modal from "@/components/Modal.vue";
import Laptimes from "@/components/Laptimes.vue";
import Tyres from "@/components/Tyres.vue";
import Status from "@/components/Status.vue";
import Inputs from "@/components/Inputs.vue";
import Pitstop from "@/components/Pitstop.vue";
import Car from "@/components/Car.vue";
import Misc from "@/components/Misc.vue";
import Conditions from "@/components/Conditions.vue";
import Motor from "@/components/Motor.vue";
import Flag from "@/components/Flag.vue";

function data() {
	return {
		connected: false,
		channel: {
			id: "",
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
					type: "Qualifying",
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
					model: "nissan_gt_r_gt3_2018",
					maxRPM: 0,
					tankCap: 0
				},
				track: {
					name: "",
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

let computed = {
	timeRemaining() {
		let t = this.telemetry.hud.session.timeLeft;
		let m = Math.floor(t / 60);
		let h = Math.floor(m / 60).toString().padStart(2, "0");
		let s = Math.floor(t % 60).toString().padStart(2, "0");

		m = (m % 60).toString().padStart(2, "0");

		return `${h}:${m}:${s}`;
	}
};

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
	methods: {
		connect,
		disconnect
	},
	methods: {
		connect,
		disconnect,
		delta
	},
	components: {
		Modal,
		Laptimes,
		Tyres,
		Status,
		Inputs,
		Pitstop,
		Car,
		Misc,
		Conditions,
		Motor,
		Flag
	}
};
</script>

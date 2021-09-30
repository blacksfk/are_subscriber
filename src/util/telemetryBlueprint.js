/**
 * Telemetry data as defined inthe publisher client.
 * See: https://github.com/blacksfk/are_publisher#broadcast-data-structure
 */
function TelemetryBlueprint() {
	this.position = 0;
	this.distanceTraveled = 0.0;
	this.newSession = false;
	this.laps = 0;
	this.tyreSet = 0;
	this.isBoxed = false;
	this.isInPitLane = false;
	this.mandatoryPitDone = false;
	this.rainTyres = false;
	this.laptimes = {
		curr: 0,
		prev: 0,
		best: 0,
		estimated: 0,
		delta: 0,
		currSectorIndex: 0,
		currSector: 0,
		isDeltaPositive: false,
		isValidLap: false
	};

	this.electronics = {
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
	};

	this.session = {
		type: "",
		timeLeft: 0.0,
		activeCars: 0,
		clock: 0.0
	};

	this.conditions = {
		windSpeed: 0.0,
		windDirection: 0.0,
		track: "",
		rain: {
			curr: "",
			in10: "",
			in30: ""
		}
	};

	this.pitstop = {
		tyreSet: 0,
		fuel: 0,
		pressure: {
			fl: 0.0,
			fr: 0.0,
			rl: 0.0,
			rr: 0.0
		}
	};

	this.penalty = {
		type: 0,
		duration: 0.0
	};

	this.drivingTime = {
		totalRemaining: 0,
		stintRemaining: 0
	};

	this.fuel = {
		used: 0.0,
		rate: 0.0
	};

	this.flag = {
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
	};

	this.speed = 0.0;
	this.gear = 0;
	this.tcIntervention = 0.0;
	this.absIntervention = 0.0;
	this.fuelRemaining = 0.0;
	this.input = {
		accelerator: 0.0,
		brake: 0.0,
		steering: 0.0,
		pitLimiter: false
	};

	this.brakes = {
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
	};

	this.temp = {
		ambient: 0.0,
		track: 0.0
	};

	this.motor = {
		rpm: 0,
		boostPressure: 0.0,
		running: false,
		starter: false,
		ignition: false
	};

	this.tyres = {
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
	};

	this.damage = {
		front: 0.0,
		rear: 0.0,
		left: 0.0,
		right: 0.0,
		centre: 0.0
	};

	this.sessions = 0;
	this.sharedMemVer = "";
	this.accVer = "";
	this.player = {
		firstname: "",
		surname: "",
		nickname: ""
	};

	this.car = {
		model: "",
		maxRPM: 0,
		tankCap: 0.0
	};

	this.track = {
		name: "",
		// default to three sectors
		sectors: 3
	};

	this.pitWindow = {
		start: 0,
		end: 0
	}
}

export default TelemetryBlueprint;

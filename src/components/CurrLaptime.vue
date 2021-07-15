<template>
	<span>
		<span :class="{'laptime-amiss': !valid}">{{ paddedCurr }}</span>&nbsp;
		<span :class="deltaClass">{{ paddedDelta }}</span>
	</span>
</template>
<style>
.laptime-good {
	color: #40d865;
}

.laptime-amiss {
	color: #df1212;
}
</style>
<script>
import fmtLaptime from "@/util/fmtLaptime";

/**
 * How long to wait between updating the current timer by the
 * same value used for the delay. I.e. Wait this amount of milliseconds
 * before incrementing by the same amount. Should be a value high enough
 * that the process has time to update the value but low enough that the
 * user doesn't notice the delay nor the janky increment.
 * @type {Number}
 */
const STEP = 11;

/**
 * Decimal places of the current laptime.
 * @type {Number}
 */
const CURR_PLACES = 3;

/**
 * Minimum characters (including the decimal point) of the current laptime.
 * @type {Number}
 */
const CURR_WIDTH = 6;

/**
 * Decimal places of laptimes that are not incremented via setInterval.
 * @type {Number}
 */
const NON_TIMER_PLACES = 3;

let props = {
	current: Number,
	delta: Number,
	deltaPositive: Boolean,
	valid: Boolean
};

function data() {
	return {
		curr: 0,
		paddedCurr: fmtLaptime(0, CURR_PLACES, CURR_WIDTH),
		currInterval: undefined
	};
}

let computed = {
	paddedDelta() {
		let symbol = (this.deltaPositive ? "+" : "");

		return `${symbol}${(this.delta / 1000).toFixed(NON_TIMER_PLACES)}`;
	},
	deltaClass() {
		if (this.deltaPositive) {
			return "laptime-amiss";
		}

		return "laptime-good";
	}
}

/**
 * Watched properties.
 */
let watch = {
	current(v) {
		this.curr = v;

		if (this.currInterval !== undefined) {
			// clear the existing interval
			clearInterval(this.currInterval);
		}

		// bind the this value of step otherwise it will be overwritten
		// by setInterval
		this.currInterval = setInterval(this.step.bind(this), STEP);
	}
};

/**
 * Increment curr by STEP and format curr.
 */
function step() {
	this.curr += STEP;
	this.paddedCurr = fmtLaptime(this.curr, CURR_PLACES, CURR_WIDTH);
}

export default {
	props,
	data,
	computed,
	watch,
	methods: {
		step
	}
};
</script>

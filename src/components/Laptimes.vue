<template>
	<div class="table-responsive">
		<table class="table">
			<tbody>
				<tr>
					<th>Current</th>
					<td :class="{'laptime-amiss': !isValidLap}">{{ paddedCurr }}</td>
					<td></td>
				</tr>
				<tr>
					<th>Best</th>
					<td>{{ paddedBest }}</td>
					<td :class="deltaClass">{{ paddedDelta }}</td>
				</tr>
				<tr>
					<th>Last</th>
					<td>{{ paddedLast }}</td>
					<td></td>
				</tr>
			</tbody>
		</table>
	</div>
</template>
<style>
.laptime-good {
	color: var(--secondary);
}

.laptime-amiss {
	color: var(--tertiary);
}
</style>
<script>
/**
 * Which character to pad with.
 * @type {String}
 */
const ZERO_STR = "0";

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

/**
 * Minimum characters (including the decimal point) of laptimes that are
 * not incremented with setInterval.
 * @type {Number}
 */
const NON_TIMER_WIDTH = 6;

/**
 * Injected properties.
 */
let props = {
	current: Number,
	last: Number,
	best: Number,
	delta: Number,
	estimated: Number,
	lastSplit: Number,
	isDeltaPositive: Boolean,
	isValidLap: Boolean
}

function data() {
	return {
		curr: 0,
		paddedCurr: format(0, CURR_PLACES, CURR_WIDTH),
		currInterval: undefined
	};
}

/**
 * Computed instance variables.
 */
let computed = {
	paddedDelta() {
		let symbol = (this.isDeltaPositive ? "+" : "-");

		return `${symbol}${(this.delta / 1000).toFixed(NON_TIMER_PLACES)}`;
	},
	deltaClass() {
		if (this.isDeltaPositive) {
			return "laptime-amiss";
		}

		return "laptime-good";
	},
	paddedBest() {
		return format(this.best, NON_TIMER_PLACES, NON_TIMER_WIDTH);
	},
	paddedLast() {
		return format(this.last, NON_TIMER_PLACES, NON_TIMER_WIDTH);
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
	this.paddedCurr = format(this.curr, CURR_PLACES, CURR_WIDTH);
}

/**
 * Split raw into mm:ss.xxx where:
 * m = minute
 * s = second
 * x = millisecond
 * @param  {Number} raw     Must be in milliseconds.
 * @param  {Number} places  Number of digits after the decimal point
 * @param  {Number} padding How wide the seconds part should be (including decimal point)
 * @return {String}
 */
function format(raw, places, padding) {
	// get the total seconds by dividing by 1000
	let s = raw / 1000;

	// determine how many minutes by dividing by 60 and flooring
	let m = Math.floor(s / 60);

	// re-calculate the seconds by getting the remainder of the above division
	// convieniently includes the milliseconds after the decimal point
	s = s % 60;

	// pad the strings appropriately
	let pm = m.toString().padStart(2, ZERO_STR);
	let ps = s.toFixed(places).padStart(padding, ZERO_STR);

	return `${pm}:${ps}`;
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

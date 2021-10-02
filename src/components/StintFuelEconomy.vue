<template>
	<div>
		<h2>Stint fuel economy</h2>
		<p v-show="recentLaps.length < minLaps">Run <span>{{ minLaps }}</span> laps to estimate fuel economy</p>
		<div class="table-responsive" v-show="recentLaps.length >= minLaps">
			<table class="table table-td-right">
				<tbody>
					<tr>
						<th>Current burn rate</th>
						<td>{{ burnRate }}</td>
					</tr>
					<tr>
						<th>Average lap time (last <span>{{ recentLaps.length }}</span> laps)</th>
						<td>{{ fmtLaptime(avgLap, 3, 6) }}</td>
					</tr>
					<tr>
						<th>Estimated stint laps remaining</th>
						<td>{{ estLapsTime }}</td>
					</tr>
					<tr>
						<th>Estimated laps remaining in fuel</th>
						<td>{{ estLapsFuel }}</td>
					</tr>
					<tr>
						<th>Required to complete stint</th>
						<td><span>{{ requiredBurnRate }}</span>L/lap</td>
					</tr>
				</tbody>
			</table>
		</div>
	</div>
</template>
<script>
import fmtLaptime from "@/util/fmtLaptime";

/**
 * Injected properties.
 */
let props = {
	/**
	 * Current fuel burn rate.
	 */
	burnRate: Number,

	/**
	 * Lap times to average and use to calculate estimates.
	 * @type {[Lap]}
	 */
	recentLaps: Array,

	/**
	 * Fuel remaining in the tank.
	 */
	fuelRemaining: Number,

	/**
	 * Time remaining in the stint.
	 */
	stintRemaining: Number,

	/**
	 * Total time remaining in the race.
	 */
	totalRemaining: Number,

	/**
	 * Minimum number of laps expected in `recentLaps` until
	 * estimates are calculated.
	 */
	minLaps: {type: Number, default: 3}
};

/**
 * Computed instance variables.
 */
let computed = {
	/**
	 * Calculate the average lap. Returns zero if the minimum laps
	 * haven't been completed.
	 * @return {Number}
	 */
	avgLap() {
		let avg = 0;
		let len = this.recentLaps.length;

		if (len < this.minLaps) {
			// only run if we have enough data
			// also convieniently avoid dividing by zero
			return 0;
		}

		for (let i = 0; i < len; i++) {
			avg += this.recentLaps[i].milliseconds();
		}

		return Math.ceil(avg / len);
	},

	/**
	 * Either the stint timer or the race timer (+ 1 lap).
	 * Whichever is lower.
	 * @return {Number}
	 */
	timeRemaining() {
		if (this.avgLap === 0) {
			return 0;
		}

		let stint = Math.floor(this.stintRemaining / this.avgLap);
		let total = Math.ceil(this.totalRemaining / this.avgLap) + 1;

		if (stint < total) {
			return this.stintRemaining;
		}

		return this.totalRemaining;
	},

	/**
	 * Calculate the number of laps remaining.
	 * @return {Number}
	 */
	estLapsTime() {
		if (this.avgLap === 0) {
			// avoid dividing by zero
			return 0;
		}

		return Math.floor(this.timeRemaining / this.avgLap);
	},

	/**
	 * Calculate the number of laps left in the tank
	 * according to the current burn rate.
	 * @return {Number}
	 */
	estLapsFuel() {
		if (this.burnRate < 1) {
			// avoid dividing by zero
			return 0;
		}

		return Math.floor(this.fuelRemaining / this.burnRate);
	},

	/**
	 * Calculate the required for burn rate to complete
	 * the current stint according to the stint timer.
	 * @return {Number|String}
	 */
	requiredBurnRate() {
		if (this.estLapsTime === 0) {
			// avoid dividing by zero
			return 0;
		}

		// avoid garbage data
		return (this.fuelRemaining / this.estLapsTime).toFixed(2);
	}
}

export default {
	props,
	computed,
	methods: {
		fmtLaptime
	}
};
</script>

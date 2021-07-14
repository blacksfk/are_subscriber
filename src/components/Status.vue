<template>
<div>
	<h2>{{ strPos }}</h2>
	<h3><span>{{ laps }}</span> laps</h3>
	<h3><span>{{ dist }}</span>km</h3>
	<h3>{{ status }}</h3>
	<div class="table-responsive">
		<table class="table">
			<tbody>
				<tr>
					<th>Tyre set</th>
					<td>{{ strTyreSet }}</td>
				</tr>
				<tr>
					<th>Fuel used</th>
					<td>{{ fuelUsed }}L</td>
				</tr>
				<tr>
					<th>Fuel remaining</th>
					<td>{{ fuelRemaining }}L</td>
				</tr>
				<tr>
					<th>Fuel rate</th>
					<td>{{ fuelRate }}L/lap</td>
				</tr>
			</tbody>
		</table>
	</div>
</div>
</template>
<script>
import rainOrSlicks from "@/util/rainOrSlicks";

/**
 * Injected properties.
 */
let props = {
	position: Number,
	laps: Number,
	distanceTraveled: Number,
	tyreSet: Number,
	isBoxed: Boolean,
	isInPitLane: Boolean,
	fuelUsed: Number,
	fuelRemaining: Number,
	fuelRate: Number
};

/**
 * Computed instance variables.
 */
let computed = {
	/**
	 * Determines the suffix based on the current position.
	 * @return {String}
	 */
	strPos() {
		let suffix = "";
		let rem = this.position % 10;

		if (rem == 1 && this.position !== 11) {
			suffix = "st";
		} else if (rem == 2 && this.position !== 12) {
			suffix = "nd";
		} else if (rem == 3 && this.position !== 13) {
			suffix = "rd";
		} else {
			suffix = "th";
		}

		return `${this.position}${suffix}`;
	},

	/**
	 * Determines the current status of the car.
	 * @return {String}
	 */
	status() {
		if (this.isBoxed) {
			return "BOXED";
		} else if (!this.isBoxed && this.isInPitLane) {
			return "PITTING";
		}

		return "RUNNING";
	},

	/**
	 * If `tyreSet` is zero "Rain tyres" is returned. Otherwise
	 * the number indicates the dry tyre set.
	 * @return {String|Number}
	 */
	strTyreSet() {
		return rainOrSlicks(this.tyreSet);
	},

	/**
	 * Sesssion distance covered in kilometres (3 decimal places).
	 * @return {String}
	 */
	dist() {
		return (this.distanceTraveled / 1000).toFixed(3);
	}
};

export default {
	props,
	computed
};
</script>

<template>
<div>
	<h2>{{ strPos }}</h2>
	<h3><span>{{ laps }}</span> laps</h3>
	<h3><span>{{ distanceTraveled }}</span>km</h3>
	<h3>{{ status }}</h3>
	<div class="table-responsive">
		<table class="table">
			<tbody>
				<tr>
					<th>Tyre set</th>
					<td>{{ tyreSet }}</td>
				</tr>
			</tbody>
		</table>
	</div>
</div>
</template>
<script>
/**
 * Injected properties.
 */
let props = {
	position: Number,
	laps: Number,
	distanceTraveled: Number,
	tyreSet: Number,
	isBoxed: Boolean,
	isInPitLane: Boolean
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
	}
};

export default {
	props,
	computed
};
</script>

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
		let suffix;

		// divide by 10 and get the remainder
		switch (this.position % 10) {
			case 1:
				suffix = "st";
				break;
			case 2:
				suffix = "nd";
				break;
			case 3:
				suffix = "rd";
				break;
			default:
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

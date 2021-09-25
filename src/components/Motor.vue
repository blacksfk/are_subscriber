<template>
<div class="table-responsive">
	<table class="table table-td-right">
		<tbody>
			<tr>
				<th>Speed</th>
				<td><span>{{ speed.toFixed(1) }}</span>km/h</td>
			</tr>
			<tr>
				<th>Gear</th>
				<td>{{ strGear }}</td>
			</tr>
			<tr>
				<th>RPM</th>
				<td>{{ motor.rpm }}</td>
			</tr>
			<tr>
				<th>Boost pressure</th>
				<td>{{ motor.boostPressure }}</td>
			</tr>
			<tr>
				<th>Running</th>
				<td>{{ motor.running }}</td>
			</tr>
			<tr>
				<th>Starter firing</th>
				<td>{{ motor.starter }}</td>
			</tr>
			<tr>
				<th>Ignition on</th>
				<td>{{ motor.ignition }}</td>
			</tr>
		</tbody>
	</table>
</div>
</template>
<script>
/**
 * Current gear enumeration.
 * @type {Array}
 */
const GEARS = ["R", "N", "1", "2", "3", "4", "5", "6", "7", "8"];

/**
 * Injected properties.
 */
let props = {
	speed: Number,
	gear: Number,
	motor: Object
};

/**
 * Computed instance variables.
 */
let computed = {
	/**
	 * Returns the current gear index as a string. Current max gear is 8 (index = 9)
	 * @return {String}
	 */
	strGear() {
		if (this.gear < GEARS.length && this.gear >= 0) {
			return GEARS[this.gear];
		}

		// this should never happen right?
		return "X";
	}
};

export default {
	props,
	computed
};
</script>

<template>
<div>
	<h2>Driving time</h2>
	<div class="table-responsive">
		<table class="table table-td-right">
			<thead>
				<tr>
					<th>Driver</th>
					<th>Stint remaining</th>
					<th>Total remaining</th>
				</tr>
			</thead>
			<tbody>
				<tr v-for="(dt, idx) in driverTimes" :key="idx">
					<td>{{ dt.name }}</td>
					<td>{{ fmtTime(dt.stintRemaining) }}</td>
					<td>{{ fmtTime(dt.totalRemaining) }}</td>
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
	driverTimes: Array
};

/**
 * Convert a timestamp expressed in milliseconds to "hh:mm:ss".
 * @param  {Number} ms
 * @return {String}
 */
function fmtTime(ms) {
	if (ms < 0) {
		return "-";
	}

	let h = Math.floor(ms / 1000 / 3600).toString().padStart(2, "0");
	let m = Math.floor(ms / 1000 % 3600 / 60).toString().padStart(2, "0");
	let s = Math.floor(ms / 1000 % 3600 % 60).toString().padStart(2, "0");

	return `${h}:${m}:${s}`;
}

export default {
	props,
	methods: {
		fmtTime
	}
};
</script>

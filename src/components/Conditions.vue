<template>
<div>
	<div class="conditions-wind-container">
		<div class="conditions-wind-direction" :style="rotation">&#129047;</div>
		<h3>{{ windSpeed }}m/s</h3>
	</div>
	<div class="table-responsive">
		<table class="table table-td-right">
			<tbody>
				<tr>
					<th>Ambient</th>
					<td>{{ temp.ambient.toFixed(1) }}&#8451;</td>
				</tr>
				<tr>
					<th>Track</th>
					<td>{{ temp.track.toFixed(1) }}&#8451;</td>
				</tr>
				<tr>
					<th>Track status</th>
					<td>{{ track }}</td>
				</tr>
				<tr>
					<th>Rain Intensity now</th>
					<td>{{ rain.curr }}</td>
				</tr>
				<tr>
					<th>Rain Intensity in 10 minutes</th>
					<td>{{ rain.in10 }}</td>
				</tr>
				<tr>
					<th>Rain Intensity in 30 minutes</th>
					<td>{{ rain.in30 }}</td>
				</tr>
			</tbody>
		</table>
	</div>
</div>
</template>
<style>
.conditions-wind-container {
	display: flex;
	flex-flow: column wrap;
	align-items: center;
}

.conditions-wind-direction {
	will-change: transform;
	transition: transform 0.1s;
	font-size: 200%;
}
</style>
<script>
let props = {
	windDirection: 0,
	windSpeed: 0,
	temp: Object,
	track: String,
	rain: Object
}

let computed = {
	rotation() {
		return {
			transform: `rotateZ(${this.windDirection}rad)`
		};
	}
};

export default {
	props,
	computed
};
</script>

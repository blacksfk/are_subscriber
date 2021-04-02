<template>
<div class="table-responsive">
	<table class="table">
		<tbody>
			<tr>
				<th>Speed</th>
				<td>{{ speed }}km/h</td>
			</tr>
			<tr>
				<th>Gear</th>
				<td>{{ gear }}</td>
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
				<th>TC intervention</th>
				<td>{{ tc }}</td>
			</tr>
			<tr>
				<th>ABS intervention</th>
				<td>{{ abs }}</td>
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
let props = {
	speed: Number,
	gear: Number,
	tc: Number,
	abs: Number,
	motor: Object
};

export default {
	props
};
</script>

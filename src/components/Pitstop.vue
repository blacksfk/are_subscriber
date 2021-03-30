<template>
<div class="table-responsive">
	<table class="table">
		<tbody>
			<tr>
				<th>Tyre set</th>
				<td>{{ tyreSet }}</td>
			</tr>
			<tr>
				<th>Fuel fill</th>
				<td>{{ fuel }}L</td>
			</tr>
			<tr>
				<th>FL</th>
				<td>{{ pressure.fl }}psi</td>
			</tr>
			<tr>
				<th>FR</th>
				<td>{{ pressure.fr }}psi</td>
			</tr>
			<tr>
				<th>RL</th>
				<td>{{ pressure.rl }}psi</td>
			</tr>
			<tr>
				<th>RR</th>
				<td>{{ pressure.rr }}psi</td>
			</tr>
		</tbody>
	</table>
</div>
</template>
<script>
let props = {
	tyreSet: Number,
	fuel: Number,
	pressure: Object
};

export default {
	props
};
</script>
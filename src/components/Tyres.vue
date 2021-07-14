<template>
	<div>
		<span>Brake bias: {{ brakes.bias }}</span>
		<div class="table-responsive">
			<table class="table">
				<thead>
					<tr>
						<th></th>
						<th>FL</th>
						<th>FR</th>
						<th>RL</th>
						<th>RR</th>
					</tr>
				</thead>
				<tbody>
					<tr>
						<th>Tyre pressure (psi)</th>
						<td>{{ tyres.pressure.fl }}</td>
						<td>{{ tyres.pressure.fr }}</td>
						<td>{{ tyres.pressure.rl }}</td>
						<td>{{ tyres.pressure.rr }}</td>
					</tr>
					<tr>
						<th>Tyre temperature (&deg;C)</th>
						<td>{{ tyres.temp.fl }}</td>
						<td>{{ tyres.temp.fr }}</td>
						<td>{{ tyres.temp.rl }}</td>
						<td>{{ tyres.temp.rr }}</td>
					</tr>
					<tr>
						<th>Brake pad compound</th>
						<td>{{ brakes.compound.front + 1}}</td>
						<td>{{ brakes.compound.front + 1}}</td>
						<td>{{ brakes.compound.rear + 1}}</td>
						<td>{{ brakes.compound.rear + 1}}</td>
					</tr>
					<tr>
						<th>Brake pad depth (mm)</th>
						<td>{{ brakes.padDepth.fl }}</td>
						<td>{{ brakes.padDepth.fr }}</td>
						<td>{{ brakes.padDepth.rl }}</td>
						<td>{{ brakes.padDepth.rr }}</td>
					</tr>
					<tr>
						<th>Brake rotor depth (mm)</th>
						<td>{{ brakes.rotorDepth.fl }}</td>
						<td>{{ brakes.rotorDepth.fr }}</td>
						<td>{{ brakes.rotorDepth.rl }}</td>
						<td>{{ brakes.rotorDepth.rr }}</td>
					</tr>
					<tr>
						<th>Brake temperature (&deg;C)</th>
						<td>{{ brakes.temp.fl }}</td>
						<td>{{ brakes.temp.fr }}</td>
						<td>{{ brakes.temp.rl }}</td>
						<td>{{ brakes.temp.rr }}</td>
					</tr>
				</tbody>
			</table>
		</div>
	</div>
</template>
<style>
.tyre-visualiser {
	width: 50%;
	margin: auto;
}

.tyre {
	height: 150px;
	width: 100px;
	border-width: 1px;
	border-style: solid;
	border-radius: 6px;
}

.rotor {
	height: 75px;
	width: 25px;
	border-width: 1px;
	border-style: solid;
	border-radius: 6px;
	align-self: center;
}
</style>
<script>
let props = {
	brakes: Object,
	tyres: Object
};

export default {
	props
};
</script>

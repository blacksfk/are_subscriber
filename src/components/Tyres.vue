<template>
	<div>
		<span>Brake bias: {{ brakes.bias }}</span>
		<div class="table-responsive">
			<table class="table table-td-right">
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
						<td>{{ tyres.pressure.fl.toFixed(2) }}</td>
						<td>{{ tyres.pressure.fr.toFixed(2) }}</td>
						<td>{{ tyres.pressure.rl.toFixed(2) }}</td>
						<td>{{ tyres.pressure.rr.toFixed(2) }}</td>
					</tr>
					<tr>
						<th>Tyre temperature (&deg;C)</th>
						<td>{{ tyres.temp.fl.toFixed(2) }}</td>
						<td>{{ tyres.temp.fr.toFixed(2) }}</td>
						<td>{{ tyres.temp.rl.toFixed(2) }}</td>
						<td>{{ tyres.temp.rr.toFixed(2) }}</td>
					</tr>
					<tr>
						<th>Brake pad compound</th>
						<td>{{ brakes.compound.front }}</td>
						<td>{{ brakes.compound.front }}</td>
						<td>{{ brakes.compound.rear }}</td>
						<td>{{ brakes.compound.rear }}</td>
					</tr>
					<tr>
						<th>Brake pad depth (mm)</th>
						<td>{{ brakes.padDepth.fl.toFixed(2) }}</td>
						<td>{{ brakes.padDepth.fr.toFixed(2) }}</td>
						<td>{{ brakes.padDepth.rl.toFixed(2) }}</td>
						<td>{{ brakes.padDepth.rr.toFixed(2) }}</td>
					</tr>
					<tr>
						<th>Brake rotor depth (mm)</th>
						<td>{{ brakes.rotorDepth.fl.toFixed(2) }}</td>
						<td>{{ brakes.rotorDepth.fr.toFixed(2) }}</td>
						<td>{{ brakes.rotorDepth.rl.toFixed(2) }}</td>
						<td>{{ brakes.rotorDepth.rr.toFixed(2) }}</td>
					</tr>
					<tr>
						<th>Brake temperature (&deg;C)</th>
						<td>{{ brakes.temp.fl.toFixed(2) }}</td>
						<td>{{ brakes.temp.fr.toFixed(2) }}</td>
						<td>{{ brakes.temp.rl.toFixed(2) }}</td>
						<td>{{ brakes.temp.rr.toFixed(2) }}</td>
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

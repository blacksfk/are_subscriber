<template>
	<div>
		<!-- TODO -->
		<!-- <div class="tyre-visualiser">
			<div class="row">
				<div class="tyre"></div>
				<div class="rotor"></div>
				<div class="rotor"></div>
				<div class="tyre"></div>
			</div>
			<div class="row">
				<div class="tyre"></div>
				<div class="rotor"></div>
				<div class="rotor"></div>
				<div class="tyre"></div>
			</div>
		</div> -->
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
						<th>Tyre temperature</th>
						<td>{{ tyres.temp.fl }}</td>
						<td>{{ tyres.temp.fr }}</td>
						<td>{{ tyres.temp.rl }}</td>
						<td>{{ tyres.temp.rr }}</td>
					</tr>
					<tr>
						<th>Brake pad compound</th>
						<td>{{ brakes.compound.front }}</td>
						<td>{{ brakes.compound.front }}</td>
						<td>{{ brakes.compound.rear }}</td>
						<td>{{ brakes.compound.rear }}</td>
					</tr>
					<tr>
						<th>Brake pad wear</th>
						<td>{{ brakes.padWear.fl }}</td>
						<td>{{ brakes.padWear.fr }}</td>
						<td>{{ brakes.padWear.rl }}</td>
						<td>{{ brakes.padWear.rr }}</td>
					</tr>
					<tr>
						<th>Brake disc wear</th>
						<td>{{ brakes.discWear.fl }}</td>
						<td>{{ brakes.discWear.fr }}</td>
						<td>{{ brakes.discWear.rl }}</td>
						<td>{{ brakes.discWear.rr }}</td>
					</tr>
					<tr>
						<th>Brake temperature</th>
						<td>{{ brakes.temp.fl }}</td>
						<td>{{ brakes.temp.fr }}</td>
						<td>{{ brakes.temp.rl }}</td>
						<td>{{ brakes.temp.rr }}</td>
					</tr>
					<tr>
						<th>Brake pressure</th>
						<td>{{ brakes.pressure.fl }}</td>
						<td>{{ brakes.pressure.fr }}</td>
						<td>{{ brakes.pressure.rl }}</td>
						<td>{{ brakes.pressure.rr }}</td>
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

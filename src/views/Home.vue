<template>
<div>
	<!-- connection modal -->
	<modal v-show="!connected">
		<h3>Join a channel</h3>
		<form action="connect" method="post" @submit.prevent="connect">
			<div class="input-group">
				<label for="id">Channel ID</label>
				<searchable-select name="id" :options="channels" v-model="channel" display-key="name" placeholder="Channel ID" :filter="filterChannel"/>
			</div>
			<div class="input-group">
				<label for="Password">Password</label>
				<clearable-input type="password" name="password" v-model="channel.password" placeholder="Channel password"/>
			</div>
			<input type="submit" value="Connect" class="btn btn-primary">
		</form>
	</modal>

	<!-- header -->
	<div class="header">
		<div class="row space-between">
			<div class="col-33 col-start">
				<span class="led led-sm" :class="ledClass" :title="ledTooltip"></span>&nbsp;<span v-show="connected">Connected to: {{ channel.name }}</span>
			</div>
			<div class="col-33 col-centre">
				<h2><span>{{ telemetry.session.type }}</span> &commat; <span>{{ telemetry.track.name }}</span> | <in-game-clock :clock="telemetry.session.clock"/></h2>
			</div>
			<div class="col-33 col-end"><span>{{ timeRemaining }} remaining</span></div>
		</div>
		<div class="row">
			<div class="col-33 col-centre"><span>{{ playerName }}</span> | <span>{{ car }}</span></div>
		</div>
		<div class="row">
			<div class="col-33 col-centre">
				<curr-laptime :current="telemetry.laptimes.curr" :delta="telemetry.laptimes.delta" :delta-positive="telemetry.laptimes.isDeltaPositive" :valid="telemetry.laptimes.isValidLap"/>
			</div>
		</div>
		<tab-row v-model="currTab" :items="['Telemetry', 'Laps', 'Strategy']"/>
	</div>

	<!-- telemetry tab -->
	<div class="telemetry-row-container" v-show="currTab === 0">
		<div class="row">
			<div class="telemetry-row-container-item">
				<status :position="telemetry.position" :laps="telemetry.laps" :distance-traveled="telemetry.distanceTraveled" :tyre-set="telemetry.tyreSet" :fuel-used="telemetry.fuel.used" :fuel-remaining="telemetry.fuelRemaining" :fuel-rate="telemetry.fuel.rate"/>
			</div>
			<div class="telemetry-row-container-item">
				<conditions v-bind="telemetry.conditions" :temp="telemetry.temp"/>
			</div>
			<div class="telemetry-row-container-item">
				<h2>Next Pit Stop</h2>
				<pitstop v-bind="telemetry.pitstop"></pitstop>
			</div>
		</div>
		<div class="row">
			<div class="telemetry-row-container-item">
				<inputs :electronics="telemetry.electronics" :tc="telemetry.tc" :abs="telemetry.abs" :input="telemetry.input"/>
			</div>
			<div class="telemetry-row-container-item">
				<motor :motor="telemetry.motor" :speed="telemetry.speed" :gear="telemetry.gear"/>
			</div>
			<div class="telemetry-row-container-item">
				<tyres :brakes="telemetry.brakes" :tyres="telemetry.tyres"/>
			</div>
		</div>
	</div>

	<!-- lap times tab -->
	<div v-show="currTab === 1">
		<div class="table-responsive">
			<table class="table table-td-centre table-striped">
				<thead>
					<tr>
						<th>Lap</th>
						<th>Driver</th>
						<th v-for="n in telemetry.track.sectors" :key="n">Sector {{ n }}</th>
						<th>Lap time</th>
						<th>Delta</th>
						<th>Notes</th>
					</tr>
				</thead>
				<tbody>
					<tr v-for="lap in laps" :key="lap.lapNo">
						<td>{{ lap.lapNo }}</td>
						<td>{{ lap.driver }}</td>
						<td v-for="n in telemetry.track.sectors" :key="n">{{ (lap.sectors[n-1] / 1000).toFixed(3) }}</td>
						<td>{{ lap.total }}</td>
						<td>{{ lap.delta(telemetry.laptimes.best) }}</td>
						<td>
							<ul>
								<li v-for="note in lap.notes">{{ note }}</li>
							</ul>
						</td>
					</tr>
				</tbody>
			</table>
		</div>
	</div>

	<!-- strategy tab -->
	<div v-show="currTab === 2">
		<div class="telemetry-row-container">
			<div class="row">
				<div class="telemetry-row-container-item">
					<driving-time :driver-times="driverTimes"/>
				</div>
				<div class="telemetry-row-container-item">
					<stint-fuel-economy :burn-rate="telemetry.fuel.rate" :fuel-remaining="telemetry.fuelRemaining" :stint-remaining="telemetry.drivingTime.stintRemaining" :total-remaining="telemetry.session.timeLeft" :recent-laps="recentLaps"/>
				</div>
				<div class="telemetry-row-container-item"></div>
			</div>
		</div>
	</div>
</div>
</template>
<style>
@import url('https://fonts.googleapis.com/css2?family=Fira+Mono&display=swap');

.header {
	position: sticky;
	top: 0;
	left: 0;
	background-color: var(--bg-primary);
	z-index: 10;
}

.header h2 {
	margin: 0;
}

.header > .row {
	padding: 2px 5px;
}

.telemetry-row-container {
	padding: 5px;
}

.telemetry-row-container-item {
	box-sizing: border-box;
	max-width: 100%;
	padding: 10px;
	background-color: var(--fg-primary);
	border-radius: 4px;
	font-family: "Fira Mono", monospace;
	margin: 2px;
	flex: 1 0 0;
}

@media only screen and (min-width: 1px) {
	.telemetry-row-container > .row {
		flex-direction: column;
	}
}

@media only screen and (min-width: 600px) {
	.telemetry-row-container > .row {
		flex-direction: row;
	}
}
</style>
<script src="./telemetry.js"></script>

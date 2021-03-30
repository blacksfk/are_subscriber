<template>
	<div>
		<div class="inputs-pedal-container">
			<div class="inputs-pedal inputs-accelerator" :style="accelerator"></div>
		</div>
		<div class="inputs-pedal-container">
			<div class="inputs-pedal inputs-brake" :style="brake"></div>
		</div>
		<div class="inputs-pedal-container">
			<div class="inputs-pedal inputs-clutch" :style="clutch"></div>
		</div>
		<div class="table-responsive">
			<table class="table">
				<tbody>
					<tr>
						<th>TC level</th>
						<td>{{ electronics.tc }}</td>
					</tr>
					<tr>
						<th>TC Cut level</th>
						<td>{{ electronics.tcCut }}</td>
					</tr>
					<tr>
						<th>ABS level</th>
						<td>{{ electronics.abs }}</td>
					</tr>
					<tr>
						<th>Engine map</th>
						<td>{{ electronics.engineMap }}</td>
					</tr>
					<tr>
						<th>Rain light</th>
						<td>{{ electronics.rainLight }}</td>
					</tr>
					<tr>
						<th>Pit Limiter on</th>
						<td>{{ input.pitLimiter }}</td>
					</tr>
				</tbody>
			</table>
		</div>
	</div>
</template>
<style>
.inputs-pedal-container {
	height: 20px;
	width: 150px;
	margin: 1% auto 1% 0;
}

.inputs-pedal {
	will-change: width;
	height: 100%;
	width: 0%;
	transition: width 0.1s;
}

.inputs-accelerator {
	background-color: #40d865;
}

.inputs-brake {
	background-color: #df1212;
}

.inputs-clutch {
	background-color: #276ce5;
}
</style>
<script>
/**
 * Injected properties.
 */
let props = {
	electronics: Object,
	tc: Number,
	abs: Number,
	input: Object
};

/**
 * Computed instance variables.
 */
let computed = {
	accelerator() {
		return {
			width: fmtPctg(this.input.accelerator)
		};
	},
	brake() {
		return {
			width: fmtPctg(this.input.brake)
		};
	},
	clutch() {
		return {
			width: fmtPctg(this.input.clutch)
		};
	}
};

/**
 * Format v as a string percentage. Assumes v < 1.
 * @param  {Number} v
 * @return {String}
 */
function fmtPctg(v) {
	return `${(v * 100)}%`;
}

export default {
	props,
	computed
};
</script>

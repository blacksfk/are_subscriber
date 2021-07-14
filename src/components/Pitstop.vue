<template>
<div class="table-responsive">
	<table class="table">
		<tbody>
			<tr>
				<th>Tyre set</th>
				<td>{{ strTyreSet }}</td>
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
import rainOrSlicks from "@/util/rainOrSlicks";

/**
 * Injected properties.
 */
let props = {
	/**
	 * The selected tyre set for the next pitstop
	 */
	tyreSet: Number,

	/**
	 * The amount of fuel to fill at the next pitstop.
	 */
	fuel: Number,

	/**
	 * Tyre pressures at the next pitstop. Should contain
	 * keys: fl, fr, rl, rr.
	 */
	pressure: Object
};

/**
 * Computed instance variables.
 */
let computed = {
	/**
	 * If `tyreSet` is zero "Rain tyres" is returned. Otherwise
	 * the number indicates the dry tyre set.
	 * @return {String|Number}
	 */
	strTyreSet() {
		return rainOrSlicks(this.tyreSet);
	}
}

export default {
	props,
	computed
};
</script>
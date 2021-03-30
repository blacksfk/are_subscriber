<template>
<div class="table-responsive">
	<table class="table">
		<tbody>
			<tr>
				<th>Driver</th>
				<td>{{ driverName }}</td>
			</tr>
			<tr>
				<th>Circuit</th>
				<td>{{ track }}</td>
			</tr>
			<tr v-show="hasPitWindow">
				<th>Pit window opens at</th>
				<td>{{ pitWindow.start }}</td>
			</tr>
			<tr v-show="hasPitWindow">
				<th>Pit window closes at</th>
				<td>{{ pitWindow.end }}</td>
			</tr>
		</tbody>
	</table>
</div>
</template>
<script>
/**
 * Injected properties.
 */
let props = {
	player: Object,
	track: String,
	pitWindow: Object
};

/**
 * Computed instance variables.
 */
let computed = {
	/**
	 * The player's complete name (and nickname if they have one).
	 * @return {String}
	 */
	driverName() {
		let name = this.player.firstname;

		if (this.player.nickname.length > 0) {
			name = `${name} "${this.player.nickname}"`;
		}

		return name + " " + this.player.lastname;
	},

	/**
	 * Whether or not the current session has a pit window.
	 * @return {Boolean}
	 */
	hasPitWindow() {
		return (this.pitWindow.start != 0 && this.pitWindow.end != 0);
	}
};

export default {
	props,
	computed
};
</script>

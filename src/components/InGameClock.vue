<template>
	<span>{{ time }}</span>
</template>
<script>
/**
 * Injected properties.
 */
let props = {
	/**
	 * In-game clock time. Expected to be a float expressing the
	 * time of day in seconds.
	 */
	clock: Number
};

/**
 * Computed instance variables.
 */
let computed = {
	/**
	 * Clock time in the form: "hh:mm".
	 */
	time() {
		// clock is expressed in seconds so get the raw minutes
		let m = Math.floor(this.clock / 60);

		// get the hours (in 24 hour time) and format
		let h = Math.floor(m / 60).toString().padStart(2, "0");

		// get the remaining minutes and format
		m = (m % 60).toString().padStart(2, "0");

		return `${h}:${m}`;
	}
};

export default {
	props,
	computed
};
</script>

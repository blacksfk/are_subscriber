<template>
	<div class="clearable-input">
		<input :type="type" :name="name" class="input" :value="value" @input="emit" :placeholder="placeholder" ref="input">
		<button class="clearable-input-btn" type="button" tabindex="-1" v-show="value && value.length > 0" @click="clear">&times;</button>
	</div>
</template>
<style>
.clearable-input {
	position: relative;
	display: flex;
	flex-flow: row nowrap;
	border-bottom: 1px solid var(--primary);
	transition: border-bottom-color var(--dur-input);
}

.clearable-input:focus-within {
	border-bottom-color: var(--input-focus-colour);
}

.clearable-input > input {
	border: 0;
	width: 100%;
}

.clearable-input-btn {
	color: var(--primary);
	border: 0;
	background-color: transparent;
	font-size: 150%;
}

.clearable-input-btn:hover {
	cursor: pointer;
}

.clearable-input-btn:active {
	color: var(--input-focus-colour);
}
</style>
<script>
/**
 * Injected properties.
 */
let props = {
	/**
	 * Type of input. Supported: text, password.
	 */
	type: String,

	/**
	 * Name attribute.
	 */
	name: String,

	/**
	 * Value attribute.
	 */
	value: String,

	/**
	 * Placeholder attribute.
	 */
	placeholder: String
};

function emit(event) {
	this.$emit("input", event.target.value);
}

function clear() {
	this.$emit("clear");
	this.$emit("input", "");
}

/**
 * Focus the native input element.
 */
function focus() {
	this.$refs.input.focus();
}

export default {
	props,
	methods: {
		emit,
		clear,
		focus
	}
};
</script>

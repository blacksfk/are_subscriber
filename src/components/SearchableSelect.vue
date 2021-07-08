<template>
<div class="searchable-select">
	<clearable-input class="searchable-select-input" type="text" :name="name" :placeholder="placeholder" :value="input" @input="debouncedInput" @clear="clearInput"/>
	<button type="button" tabindex="-1" class="btn btn-primary" @click="visible = !visible">
		<!-- show down arrow when options not visible -->
		<span v-show="!visible">&#8964;</span>
		<!-- show up arrow when options are visible -->
		<span v-show="visible">&#8963;</span>
	</button>
	<ul class="searchable-select-list" v-show="visible">
		<span v-show="filtered.length === 0">&lt; no options match the filter text &gt;</span>
		<li class="searchable-select-list-item" v-for="option in filtered" @click="emit(option)">{{ option[displayKey] }}</li>
	</ul>
</div>
</template>
<style>
.searchable-select {
	position: relative;
	display: flex;
	flex-flow: row nowrap;
}

.searchable-select-input {
	width: 100%;
}

.searchable-select-list {
	position: absolute;
	left: 0;
	top: 30px;
	border: 1px solid var(--primary);
	list-style-type: none;
	width: 100%;
	max-height: 200px;
	overflow-y: auto;
	background-color: hsla(0, 0%, 0%, 0.9);
	padding: 0;
	z-index: 1;
}

.searchable-select-list-item {
	padding: 10px;
	color: var(--primary);
}

.searchable-select-list-item:hover {
	cursor: pointer;
	color: var(--bg-primary);
	background-color: var(--primary);
}
</style>
<script>
import ClearableInput from "./ClearableInput.vue";

/**
 * Injected properties.
 */
let props = {
	/**
	 * Selected option.
	 */
	value: Object,

	/**
	 * HTML input name attribute value (passed down to clearable-input).
	 */
	name: String,

	/**
	 * Array of items to display.
	 */
	options: Array,

	/**
	 * Which key to use to display the options in the list and text input.
	 */
	displayKey: String,

	/**
	 * Given an item of the array and a search term. Should return either
	 * true if the given item matches (or more loosely contains) the search
	 * term and false otherwise. Items for which this function returns true
	 * for will be the options displayed when the user enters something into
	 * the text input.
	 */
	filter: Function,

	/**
	 * Text input placeholder. Passed down to clearable-input.
	 */
	placeholder: String
};

/**
 * Instance variables.
 */
function data() {
	return {
		/**
		 * Whether or not the drop down list is visible.
		 * @type {Boolean}
		 */
		visible: false,

		/**
		 * Text value of the input box. Initially set to the value
		 * of the key displayKey in the value object.
		 * @type {any}
		 */
		input: this.value[this.displayKey]
	};
}

/**
 * Computed instance variables.
 */
let computed = {
	/**
	 * Filtered options based on the current input.
	 */
	filtered() {
		if (this.input.length === 0) {
			// no input so return everything
			return this.options;
		}

		let array = [];

		for (let i = 0; i < this.options.length; i++) {
			if (this.filter(this.options[i], this.input)) {
				// provided filter function returned true so add it
				// to the array
				array.push(this.options[i]);
			}
		}

		return array;
	}
};

/**
 * Oberserved variables.
 */
let watch = {
	/**
	 * Watches the value property for changes.
	 * @return {void}
	 */
	value() {
		this.input = this.value[this.displayKey];
	}
};

/**
 * Vue created hook. Injects a debounced receive function.
 */
function created() {
	this.debouncedInput = this.$debounce(this.inputReceived, 250);
}

/**
 * Event emitter. Emits an "input" event and the clicked option value, along with
 * hiding the drop down list.
 * @param  {any}  option
 * @return {void}
 */
function emit(option) {
	this.visible = false;
	this.$emit("input", option);
}

/**
 * Updates the input instance variable with the value captured by the listener and displays
 * the drop down list.
 * @param  {any}  input
 * @return {void}
 */
function inputReceived(input) {
	this.input = input;
	this.visible = true;
}

/**
 * Resets the input instance variable to the empty string.
 * @return {void}
 */
function clearInput() {
	this.input = "";
}

export default {
	props,
	data,
	computed,
	watch,
	created,
	methods: {
		emit,
		inputReceived,
		clearInput
	},
	components: {
		ClearableInput
	}
};
</script>

<template>
<div class="tab-row">
	<div class="tab-row-item" v-for="(item, i) in items" :class="{'tab-row-item-active': modelValue === i}" @click="emit(i)">{{ item }}</div>
</div>
</template>
<style>
:root {
	--tab-row-border-style: 1px solid var(--primary);
}

.tab-row {
	display: flex;
	flex-flow: row wrap;
	width: 100%;
	background-color: var(--bg-primary);
	border-bottom: var(--tab-row-border-style);
}

.tab-row-item {
	padding: 10px;
	text-align: center;
	/* negative margin to hide .tab-row bottom border on currently selected tab */
	margin-bottom: -1px;
}

.tab-row-item:hover {
	cursor: pointer;
}

.tab-row-item:first-child {
	margin-left: 10px;
}

.tab-row-item-active {
	border: var(--tab-row-border-style);
	border-bottom-color: var(--bg-primary);
	border-radius: 4px 4px 0 0;
}

.tab-row-item-active:hover {
	cursor: default;
}
</style>
<script>
/**
 * Injected properties.
 */
let props = {
	/**
	 * The currently selected tab.
	 */
	modelValue: Number,

	/**
	 * Array of strings to be used for the tab names.
	 */
	items: Array
};

/**
 * Event emitter. Emits an "update:modelValue" event when a tab is clicked.
 * @param  {Number} i
 * @return {void}
 */
function emit(i) {
	this.$emit("update:modelValue", i);
}

export default {
	props,
	methods: {emit}
};
</script>

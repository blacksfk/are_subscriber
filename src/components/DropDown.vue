<template>
	<div class="drop-down" @click="visible = !visible">
		<button type="button" class="btn btn-borderless">
			<span class="drop-down-title">
				<slot></slot>
			</span>
			<!-- show down arrow when options not visible -->
			<span class="drop-down-arrow" v-show="!visible">&#8964;</span>
			<!-- show up arrow when options are visible -->
			<span class="drop-down-arrow" v-show="visible">&#8963;</span>
		</button>
		<ul class="drop-down-list" v-show="visible">
			<slot name="items"></slot>
		</ul>
	</div>
</template>
<style>
.drop-down {
	position: relative;
}

.drop-down-title {
	display: inline-block;
}

.drop-down-arrow {
	font-size: 150%;
}

.drop-down-list {
	position: absolute;
	top: 50px;
	left: 0;
	list-style-type: none;
	background-color: var(--bg-primary);
	border: 1px solid var(--primary);
	border-radius: 4px;
	padding: 0;
	width: 100%;
	max-height: 200px;
	overflow-y: auto;
}

.drop-down-list > li {
	padding: 10px;
	color: var(--primary);
}

.drop-down-list > li:hover {
	cursor: pointer;
	color: var(--bg-primary);
	background-color: var(--primary);
}
</style>
<script>
export default {
	data() {
		return {
			visible: false
		};
	}
};
</script>

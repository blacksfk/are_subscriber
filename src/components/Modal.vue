<template>
	<transition name="fade" appear @before-enter="beforeEnter" @before-leave="beforeLeave" @after-leave="afterLeave">
		<div class="modal-overlay">
			<transition name="slide-from-top" @after-enter="afterEnter">
				<div class="modal-content" v-show="visible">
					<button class="btn modal-close" @click="close">&times;</button>
					<slot></slot>
				</div>
			</transition>
		</div>
	</transition>
</template>
<style>
.modal-overlay {
	z-index: 1000;
	position: fixed;
	top: 0;
	left: 0;
	height: 100%;
	width: 100%;
	background-color: hsla(0, 0%, 0%, 0.6);
}

.modal-content {
	position: relative; /* enables positioning of the close button */
	padding: 20px 10px 10px 10px;
	margin: 50px auto auto auto;
	border: 1px solid var(--primary);
	border-radius: 4px;
	background-color: var(--bg-primary);
	box-sizing: border-box;
}

.modal-close {
	position: absolute;
	top: 5px;
	right: 5px;
	border: 0;
	color: var(--primary);
	background-color: transparent;
	font-size: 200%;
}

.modal-close:hover {
	color: var(--primary);
}

@media only screen and (min-width: 1px) {
	.modal-content {
		width: 100%;
	}
}

@media only screen and (min-width: 600px) {
	.modal-content {
		width: 80%;
	}
}

@media only screen and (min-width: 1200px) {
	.modal-content {
		width: 40%;
	}
}
</style>
<script>
/**
 * Name of the class to add/remove when the modal is shown/hidden.
 * @type {String}
 */
const HIDDEN_SCROLL_CLASS = "hidden-scrollbars";

/**
 * Instance variables.
 */
function data() {
	return {
		/**
		 * Whether or not the modal content is visible.
		 * @type {Boolean}
		 */
		visible: false,

		/**
		 * The Element object of the document's body tag.
		 * @type {Element}
		 */
		bodyEl: undefined
	};
}

/**
 * Created hook. Defines bodyEl.
 */
function created() {
	this.bodyEl = document.getElementsByTagName("body")[0];
}

/**
 * Mounted hook. Hides the body element's scrollbars.
 */
function mounted() {
	this.bodyEl.classList.add(HIDDEN_SCROLL_CLASS);
}

/**
 * Triggers the modal content transition animation on entry.
 */
function beforeEnter() {
	this.visible = true;
}

/**
 * Triggers the modal content transition animatino on leave.
 */
function beforeLeave() {
	this.visible = false;
}

/**
 * Notify the parent that the modal content is visible by emitting "ready".
 */
function afterEnter() {
	this.$emit("ready");
}

/**
 * Resets the state of the body element's scrollbars before the modal was shown.
 */
function afterLeave() {
	this.bodyEl.classList.remove(HIDDEN_SCROLL_CLASS);
}

/**
 * Notify the parent that the modal was closed from within this component by
 * emitting "close".
 */
function close() {
	this.$emit("close");
}

export default {
	data,
	created,
	mounted,
	methods: {
		beforeEnter,
		beforeLeave,
		afterEnter,
		afterLeave,
		close
	}
};
</script>

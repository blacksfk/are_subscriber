<template>
	<modal @close="redirect" @ready="$refs.name.focus()">
		<form action="new" method="post" @submit.prevent="create">
			<h3>Create a Channel</h3>
			<div class="input-group">
				<label>Name</label>
				<clearable-input type="text" name="name" id="name" v-model="chan.name" ref="name"/>
			</div>
			<div class="input-group">
				<label>Password</label>
				<clearable-input type="password" name="password" id="password" v-model="chan.password"/>
			</div>
			<div class="input-group">
				<label>Confirm password</label>
				<clearable-input type="password" name="confirm_password" id="confirm_password" v-model="chan.confirmPassword"/>
			</div>
			<div class="row">
				<div class="col-20 col-end">
					<input type="submit" value="Create" class="btn btn-green">	
				</div>
			</div>	
		</form>
	</modal>
</template>
<script>
import Modal from "@/components/Modal.vue";
import ClearableInput from "@/components/ClearableInput.vue";

/**
 * Instance variables.
 */
function data() {
	return {
		chan: {
			name: "",
			password: "",
			confirmPassword: ""
		}
	};
}

/**
 * Send the new channel to the API via an AJAX POST. On success,
 * "created" is emitted and the user is redirected to the 
 * channels index page.
 * @return {Promise}
 */
function create() {
	return this.$ajaxWithAuth.post("channel", this.chan)
		.then(r => this.$emit("created", r.data))
		.then(this.redirect)
		.catch(console.error);
}

/**
 * Redirect the channels index page.
 */
function redirect() {
	this.$router.push("/channel");
}

export default {
	data,
	methods: {
		create,
		redirect
	},
	components: {
		Modal,
		ClearableInput
	}
};
</script>

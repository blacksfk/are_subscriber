<template>
	<modal @close="redirect">
		<form action="new" method="post" @submit.prevent="update">
			<h3>{{ staticName }} ({{ id }})</h3>
			<div class="input-group">
				<label>Name</label>
				<clearable-input type="text" name="name" id="name" v-model="chan.name"/>
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
				<div class="col-50 col-start">
					<button class="btn btn-red" type="button" @click="remove">Delete</button>			
				</div>
				<div class="col-50 col-end">
					<input type="submit" value="Update" class="btn btn-green">
				</div>
			</div>
		</form>
	</modal>
</template>
<script>
import Modal from "@/components/Modal.vue";
import ClearableInput from "@/components/ClearableInput.vue";

/**
 * Injected properties.
 */
let props = {
	id: String
};

/**
 * Instance variables.
 */
function data() {
	return {
		staticName: "",
		chan: {
			name: "",
			password: "",
			confirmPassword: ""
		}
	};
}

/**
 * Send the updated channel to the API via an AJAX PUT. On success,
 * "updated" is emitted and the user is redirected to the
 * channels index page.
 * @return {Promise}
 */
function update() {
	return this.$ajaxWithAuth.put(`channel/${this.id}`, this.chan)
		.then(r => this.$emit("updated", r.data))
		.then(this.redirect)
		.catch(console.error);
}

/**
 * Send an AJAX DELETE request. On success, "deleted" is emitted and the
 * user is redirected to to the channels index page.
 * @return {Promise}
 */
function remove() {
	return this.$ajaxWithAuth.delete(`channel/${this.id}`)
		.then(r => this.$emit("deleted", r.data))
		.then(this.redirect)
		.catch(console.error);
}

/**
 * Redirect the channels index page.
 */
function redirect() {
	this.$router.push("/channel");
}

/**
 * Created hook. Get the channel from the API.
 * @return {Promise}
 */
function created() {
	return this.$ajaxWithAuth.get(`channel/${this.id}`).then(r => {
		this.chan.name = r.data.name;
		this.staticName = r.data.name;
	})
	.catch(console.error);
}

export default {
	data,
	props,
	created,
	methods: {
		update,
		remove,
		redirect
	},
	components: {
		Modal,
		ClearableInput
	}
};
</script>

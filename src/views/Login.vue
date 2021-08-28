<template>
	<div class="container">
		<div class="content content-narrow">
			<div class="content-body">
				<h2>Login</h2>
				<form action="login" method="post" @submit.prevent="login">
					<div class="input-group">
						<clearable-input type="text" name="name" v-model="creds.name" placeholder="Username" ref="name"/>
					</div>
					<div class="input-group">
						<clearable-input type="password" name="password" v-model="creds.password" placeholder="Password"/>
					</div>
					<div class="row">
						<div class="col-20 col-end">
							<input type="submit" value="Login" class="btn btn-primary">
						</div>
					</div>
				</form>
			</div>
		</div>
	</div>
</template>
<script>
import ClearableInput from "@/components/ClearableInput.vue";

/**
 * Injected properties.
 */
let props = {
	/**
	 * Redirect to this URL once login is successful.
	 */
	redirect: String
}

/**
 * Instance data.
 */
function data() {
	return {
		creds: {
			name: "",
			password: ""
		}
	};
}

/**
 * Vue mounted hook. Focus the name input.
 * @return {void}
 */
function mounted() {
	this.$refs.name.focus();
}

/**
 * Login with the given credentials and redirect.
 * @return {Promise}
 */
function login() {
	return this.$ajax.post("login", this.creds).then(r => {
		this.$auth.user = r.data;

		if (this.redirect.length > 0) {
			return this.$router.push(this.redirect);
		}
		// default to the index route
		return this.$router.push("/");
	})
	.catch(console.error);
}

export default {
	props,
	data,
	mounted,
	methods: {
		login
	},
	components: {
		ClearableInput
	}
};
</script>

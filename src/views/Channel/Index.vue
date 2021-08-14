<template>
	<div>
		<div class="container">
			<div class="content">
				<div class="content-body">
					<drop-down>
						<template #default><h2>Channels</h2></template>
						<template #items>
							<li @click="getChannels">Refresh Channels</li>
							<li @click="$router.push('/channel/create')">Create new Channel</li>
						</template>
					</drop-down>
				</div>
				<div class="table-responsive">
					<table class="table table-hover">
						<thead>
							<tr>
								<th>Name</th>
								<th>Created</th>
								<th>Updated</th>
							</tr>
						</thead>
						<tbody>
							<tr v-for="channel in channels">
								<td><router-link class="link" :to="`/channel/${channel.id}`">{{ channel.name }}</router-link></td>
								<td>{{ $timesince(channel.createdAt) }}</td>
								<td>{{ $timesince(channel.updatedAt) }}</td>
							</tr>
						</tbody>
					</table>
				</div>
			</div>
		</div>
		<router-view @created="chanCreated" @updated="chanUpdated" @deleted="chanDeleted"/>
	</div>
</template>
<script>
import DropDown from "@/components/DropDown.vue";

/**
 * Instance variables.
 */
function data() {
	return {
		channels: []
	};
}

/**
 * New channel created event handler. Appends the new channel to
 * the channels array.
 * @param  {Object} chan
 * @return {void}
 */
function chanCreated(chan) {
	this.channels.push(chan);
}

/**
 * Existing channel updated event handler. Finds the existing channel and
 * replaces it with the provided channel.
 * @param  {Object} chan
 * @return {void}
 */
function chanUpdated(chan) {
	for (let i = 0; i < this.channels.length; i++) {
		if (this.channels[i].id === chan.id) {
			this.channels.splice(i, 1, chan);
			break;
		}
	}
}

/**
 * Existing channel deleted event handler. Finds the exisiting channel and
 * removes it.
 * @param  {Object} chan
 * @return {void}
 */
function chanDeleted(chan) {
	for (let i = 0; i < this.channels.length; i++) {
		if (this.channels[i].id === chan.id) {
			this.channels.splice(i, 1);
			break;
		}
	}
}

/**
 * Get all channels from the API.
 * @return {Promise}
 */
function getChannels() {
	return this.$ajax.get("channel")
		.then(r => this.channels = r.data)
		.catch(console.error);
}

/**
 * Created hook. Gets all channels from the API.
 * @return {Promise}
 */
function created() {
	return this.getChannels();
}

export default {
	data,
	created,
	methods: {
		chanCreated,
		chanUpdated,
		chanDeleted,
		getChannels
	},
	components: {
		DropDown
	}
};
</script>

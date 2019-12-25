<template>
	<div id="container">
		<v-header/>

		<div class="main">
			<router-view/>
		</div>

		<v-footer/>
	</div>
</template>

<script>
import vHeader from '@/components/Header.vue'
import vFooter from '@/components/Footer.vue'

export default {
	data() {
		return {

		}
	},

	components: {
		vHeader,
		vFooter
	},

	created() {
		
	}
}
</script>
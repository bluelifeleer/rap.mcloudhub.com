const VUE = new Vue({
	delimiters: ['${', '}'],
	el: '#app',
	data: {
		text: 'index',
		userInfo: false,
		user: {
			id: '',
			name: ''
		}
	},
	created() {},
	methods: {
		init: function() {
			this.user = {
				name: utils.getCookie('name'),
				id: utils.getCookie('uid').substr(7, parseInt(utils.getCookie('uid').length - 10))
			}
		},
		userInfoToggle: function() {
			this.userInfo = !this.userInfo
		},
		loginout: function() {
			axios({
				url: '/user/loginout',
				method: 'POST',
				baseURL: 'https://rap.mcloudhub.com/api',
				data: {
					user: {
						id: this.user.id
					}
				}
			}).then(res => {
				if (res.data.code && res.data.ok) {
					window.location.href = '/login'
				}
			}).catch(err => {
				console.log(err)
			})
		},
	},
	mounted() {
		this.init();
	}
})
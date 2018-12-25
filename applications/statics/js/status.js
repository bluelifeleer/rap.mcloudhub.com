const VUE = new Vue({
	delimiters: ['${', '}'],
	el: '#app',
	data: {
		userInfo: false,
		newTeamToggle: false,
		user: {
			name: '',
			id: ''
		}
	},
	created() {

	},
	methods: {
		init: function() {
			this.user = {
				id: utils.getCookie('uid').substr(7, parseInt(utils.getCookie('uid').length - 10)),
				name: decodeURI(utils.getCookie('name'))
			}
			console.log(this.user)
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
		/**
		 * 显示警告信息
		 * @param {*} msg // 
		 * @param {*} type // success,info,error,warning
		 */
		messageAlert(msg, type) {
			this.$message({
				message: msg,
				type: type
			})
		}
	},
	mounted() {
		this.init();
	}
})
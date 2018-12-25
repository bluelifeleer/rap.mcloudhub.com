const VUE = new Vue({
	delimiters: ['${', '}'],
	el: '#app',
	data: {
		user: {
			id: '',
			name: ''
		}
	},
	created() {

	},
	methods: {
		init: function() {
			this.user = {
				id: utils.getCookie('uid').substr(7, parseInt(utils.getCookie('uid').length - 10)),
				name: decodeURI(utils.getCookie('name'))
			};
			this.getUsers(this.user.id)
		},
		getUsers: function(id) {
			axios({
				url: '/user/get',
				method: 'GET',
				baseURL: 'https://rap.mcloudhub.com/api',
				params: {
					id: id
				}
			}).then(user => {
				console.log(user)
			}).catch(err => {
				console.log(err)
			})
		}
	},
	mounted() {
		this.init()
	}
})
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
		this.user.id = utils.getCookie('uid');
		this.user.name = utils.getCookie('name');
		init: function() {
			this.getUsers(this.user.id)
		}
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
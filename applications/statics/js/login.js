const VUE = new Vue({
	delimiters: ['${', '}'],
	el: '#app',
	data: {
		redirect: '',
		form: {
			name: '',
			password: '',
			verify: '',
			checked: true
		}
	},
	created() {
		this.$http = axios
		this.redirect = utils.getUrlQueryString('redirect_uri')
	},
	methods: {
		refreshVerify: function() {
			console.log(this.redirect)
		},
		checkboxToggle: function() {
			this.form.checked = !this.form.checked;
		},
		loginFormSubmit: function() {
			// console.log(this.form)
			if (!this.form.name) {
				this.messageAlert('帐号不能为空', 'error')
				return false;
			}

			if (!this.form.password) {
				this.messageAlert('密码不能为空', 'error')
				return false;
			}

			if (!this.form.verify) {
				this.messageAlert('验证码不能为空', 'error')
				return false;
			}
			axios({
				url: '/user/login',
				method: 'POST',
				baseURL: 'https://rap.mcloudhub.com/api',
				data: this.form
			}).then(res => {
				console.log(res)
				if (res.data.code && res.data.ok) {
					window.location.href = this.redirect ? this.redirect : '/repository';
				} else {
					this.messageAlert(res.data.msg, 'error')
				}
			}).catch(err => {
				console.log(err)
			})
		},
		githubLogin: function() {

		},
		messageAlert(msg, type) {
			this.$message({
				message: msg,
				type: type
			})
		}
	},
	mounted() {}
})
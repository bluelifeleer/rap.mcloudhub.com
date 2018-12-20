const VUE = new Vue({
	delimiters: ['${', '}'],
	el: '#app',
	data: {
		form: {
			email: ''
		}
	},
	created() {},
	methods: {
		resetFormSubmit: function() {
			if(!(this.form.email)){
				this.messageAlert('邮箱不能为空', 'error');
				return false;
			}

			if(!(/^([a-zA-Z0-9]+[_|\_|\.]?)*[a-zA-Z0-9]+@([a-zA-Z0-9]+[_|\_|\.]?)*[a-zA-Z0-9]+\.[a-zA-Z]{2,3}$/ig.test(this.form.email))){
				this.messageAlert('请输入有效的邮箱格式', 'error');
				return false;
			}
			console.log(this.form)
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
	mounted() {}
})
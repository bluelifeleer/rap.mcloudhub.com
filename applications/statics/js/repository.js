const VUE = new Vue({
	delimiters: ['${', '}'],
	el: '#app',
	data: {
		userInfo: false,
		repositorys: [],
		selector: {
			value: 'create',
			options: [{
				label: '我创建的仓库',
				value: 'create'
			}, {
				label: '我加入的仓库',
				value: 'join'
			}]
		},
		search: {
			value: ''
		},
		createRepositoryDialog: false,
		type: true,
		butText: '创建',
		user: {
			id: '',
			name: ''
		},
		form: {
			uid: '',
			id: '',
			name: '',
			remark: '',
			icon: '',
			repository: '',
			permissions: 'public',
			url: ''
		}
	},
	created() {},
	methods: {
		init: function() {
			this.user = {
				id: utils.getCookie('uid').substr(7, parseInt(utils.getCookie('uid').length - 10)),
				name: decodeURIComponent(utils.getCookie('name'))
			}
			console.log(this.user)
			this.form.uid = this.user.id;
			this.getRepositorys();
		},
		getRepositorys: function() {
			axios({
				url: '/item/lists',
				method: 'GET',
				params: {
					uid: this.user.id
				},
				baseURL: 'https://rap.mcloudhub.com/api'
			}).then(res => {
				console.log(res)
				if (res.data.code && res.data.ok) {
					let items = res.data.data.items;
					items.forEach((item, index) => {
						item['link'] = '/repository/editor?id=' + item._id
					});
					this.repositorys = items;
					console.log(this.repositorys)
				}
			}).catch(err => {
				console.log(err)
			})
		},
		selectorRepository: function(e) {},
		userInfoToggle: function() {
			this.userInfo = !this.userInfo
		},
		createRepository: function() {
			let clientWidth = document.body.clientWidth || document.documentElement.clientWidth;
			this.$refs.rapDialog.style.left = parseInt((clientWidth - 550) / 2) + 'px';
			this.createRepositoryDialog = !this.createRepositoryDialog;
		},
		rapDialogClose: function() {
			this.createRepositoryDialog = !this.createRepositoryDialog;
			this.form = {
				uid: '',
				id: '',
				name: '',
				remark: '',
				icon: '',
				repository: '',
				permissions: 'public',
				url: ''
			};
		},
		createRepositoryFormSubmit: function() {
			console.log(axios)
			if (!this.form.name) {
				alert('仓库名不能为空')
			}

			if (this.form.icon) {
				if (!(/^(https\:\/\/)|(http\:\/\/)[\S]+/ig.test(this.form.icon))) {
					alert(1231213)
				}
			}

			if (this.form.repository) {
				if (!(/^(https\:\/\/)|(http\:\/\/)[\S]+/ig.test(this.form.repository))) {
					alert(1231213)
				}
			}

			if (this.form.url) {
				if (!(/^(https\:\/\/)|(http\:\/\/)[\S]+/ig.test(this.form.url))) {
					alert(1231213)
				}
			} else {
				alert('仓库接口URL不能为空')
			}

			let url = '',
				data = {};

			if (this.type) {
				url = '/item/add';
				data = {
					uid: this.form.uid,
					name: this.form.name,
					remark: this.form.remark,
					icon: this.form.icon,
					url: this.form.url,
					repository: this.form.repository,
					permissions: this.form.permissions
				}
			} else {
				url = '/item/editor';
				data = {
					uid: this.form.uid,
					id: this.form.id,
					name: this.form.name,
					remark: this.form.remark,
					icon: this.form.icon,
					url: this.form.url,
					repository: this.form.repository,
					permissions: this.form.permissions
				}
			}

			axios({
				url: url,
				method: 'POST',
				baseURL: 'https://rap.mcloudhub.com/api',
				data: data
			}).then(res => {
				console.log(res)
				if (res.data.code && res.data.ok) {
					this.type = true;
					this.messageAlert(this.butText + '仓库成功', 'success');
					this.createRepositoryDialog = !this.createRepositoryDialog;
					this.form = {
						uid: '',
						id: '',
						name: '',
						remark: '',
						icon: '',
						repository: '',
						permissions: 'publick',
						url: ''
					};
					this.getRepositorys();

				}
			}).catch(err => {
				console.log(err)
				this.messageAlert('服务器出错', 'error')
			})
		},
		createRepositoryFormCancle: function() {
			this.createRepositoryDialog = !this.createRepositoryDialog;
			this.form = {
				uid: '',
				id: '',
				name: '',
				remark: '',
				icon: '',
				repository: '',
				permissions: 'public',
				url: ''
			};
		},
		repositoryEditor: function(e, item) {
			this.createRepositoryDialog = !this.createRepositoryDialog;
			let clientWidth = document.body.clientWidth || document.documentElement.clientWidth;
			this.$refs.rapDialog.style.left = parseInt((clientWidth - 550) / 2) + 'px';
			this.type = false;
			this.butText = '修改';
			this.form.uid = item.uid;
			this.form.id = item._id;
			this.form.name = item.name;
			this.form.remark = item.remark;
			this.form.icon = item.icon;
			this.form.repository = item.repository;
			this.form.permissions = item.permissions;
			this.form.url = item.url;
		},
		repositoryDelete: function(e, id) {
			console.log(id);
			axios({
				url: '/item/delete',
				method: 'GET',
				baseURL: 'https://rap.mcloudhub.com/api',
				params: {
					id: id
				}
			}).then(res => {
				if (res.data.code && res.data.ok) {
					this.messageAlert('删除成功', 'success');
					this.getRepositorys();
				}
			}).catch(err => {
				console.log(err)
				this.messageAlert('删除失败', 'success');
			})
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
		},
	},
	mounted() {
		this.init();
	}
})
const VUE = new Vue({
	delimiters: ['${', '}'],
	el: '#app',
	data: {
		userInfo: false,
		current: {
			item: {
				id: '',
			},
			model: {
				index: 0
			},
			interface: {
				index: 0
			}
		},
		repository: {
			own: {
				_id: '',
				name: ''
			},
			name: '',
			models: []
		},
		rapDialogAddModel: false,
		rapDialogAddInterface: false,
		rapDialogAddInterfaceText: '添加接口',
		rapDialogADDInterfaceType: true,
		rapDialogAddInterfaceRequest: false,
		rapDialogAddInterfaceRequestExport: false,
		rapDialogAddInterfaceResponse: false,
		rapDialogAddInterfaceResponseExport: false,
		rapDialogInterfaceMove: false,
		interfaceFieldsPreview: false,
		fieldPreviewActive: false,
		interfaceResponsesPreview: false,
		responsePreviewActive: false,
		uid: '',
		user: {
			id: '',
			name: ''
		},
		modelForm: {
			item_id: '',
			id: '',
			name: '',
			remark: ''
		},
		interfaceForm: {
			uid: '',
			item_id: '',
			model_id: '',
			id: '',
			name: '',
			remark: '',
			request: {
				type: 'get',
				url: '',
				code: '200'
			},
			types: [{
				label: 'GET',
				value: 'get'
			}, {
				label: 'POST',
				value: 'post'
			}, {
				label: 'PUT',
				value: 'put'
			}, {
				label: 'DELETE',
				value: 'delete'
			}, {
				label: 'OPTIONS',
				value: 'options'
			}, {
				label: 'PATCH',
				value: 'patch'
			}, {
				label: 'HEAD',
				value: 'head'
			}],
			codes: [{
				label: '200',
				value: 200
			}, {
				label: '301',
				value: 301
			}, {
				label: '403',
				value: 403
			}, {
				label: '404',
				value: 404
			}, {
				label: '500',
				value: 500
			}, {
				label: '502',
				value: 502
			}, {
				label: '503',
				value: 503
			}, {
				label: '504',
				value: 504
			}]
		},
		interfaceRequestForm: {
			id: '',
			name: '',
			type: 'string',
			remark: '',
			default: '',
			indispensable: false,
			roles: '',
			requestJson: '{\r\nname:\'\',\r\ntype:\'string\',\r\nremark: \'\',\r\nroles:\'{"name\|0-20":""}\',\r\ndefault: \'\',\r\nindispensable: false\r\n}',
			types: [{
				label: 'String',
				value: 'string'
			}, {
				label: 'Number',
				value: 'number'
			}, {
				label: 'Array',
				value: 'array'
			}, {
				label: 'Boolean',
				value: 'boolean'
			}, {
				label: 'Object',
				value: 'object'
			}, {
				label: 'Function',
				value: 'function'
			}, {
				label: 'RegExp',
				value: 'regexp'
			}],
			indispensables: [{
				label: '否',
				value: false
			}, {
				label: '是',
				value: true
			}]
		},
		interfaceResponseForm: {
			id: '',
			name: '',
			type: 'string',
			remark: '',
			default: '',
			indispensable: false,
			roles: '',
			responseJson: '{\r\nname:\'\',\r\ntype:\'string\',\r\nremark: \'\',\r\nroles:\'{"name\|0-20":""}\',\r\ndefault: \'\',\r\nindispensable: false\r\n}',
			types: [{
				label: 'String',
				value: 'string'
			}, {
				label: 'Number',
				value: 'number'
			}, {
				label: 'Array',
				value: 'array'
			}, {
				label: 'Boolean',
				value: 'boolean'
			}, {
				label: 'Object',
				value: 'object'
			}, {
				label: 'Function',
				value: 'function'
			}, {
				label: 'RegExp',
				value: 'regexp'
			}],
			indispensables: [{
				label: '否',
				value: false
			}, {
				label: '是',
				value: true
			}]
		},
		moveInterface: {
			id: '',
			model_id: '',
			type: 0,
			models: [],
			radios: [{
				icon: '&#xe628;',
				selected: true,
				label: '移动',
				value: '0'
			}, {
				icon: '&#xe6f0;',
				selected: false,
				label: '复制',
				value: '1'
			}]
		},
		models: {},
		interfaces: [{
			_id: '',
			name: '',
			mock_url: '',
			request: {
				url: '',
				type: '',
				code: 200
			}
		}],
		interface: {
			_id: '',
				name: '',
				mock_url: '',
				request: {
					url: '',
					type: '',
					code: 200
				}
		},
		jsonFormate: {
			status: false,
			label: '<>'
		}
	},
	created() {},
	methods: {
		init: function() {
			this.current.item.id = utils.getUrlQueryString('id');
			this.modelForm.item_id = this.current.item.id;
			this.user = {
				id: utils.getCookie('uid').substr(7, parseInt(utils.getCookie('uid').length - 10)),
				name: decodeURI(utils.getCookie('name'))
			}
			this.getRepository();
		},
		getRepository: function() {
			axios({
				url: '/item/get',
				mehtod: 'GET',
				baseURL: 'https://rap.mcloudhub.com/api',
				params: {
					id: this.current.item.id
				}
			}).then(res => {
				if (res.data.code && res.data.ok) {
					let item = res.data.data.item;
					if (item.models.length) {
						item.models.forEach(model => {
							if (model.interfaces.length) {
								model.interfaces.forEach(interface => {
									interface.name = interface.name.length > 7 ? interface.name.substr(0, 6) + '...' : interface.name
									interface['item_title'] = interface.name
									interface['overed'] = false
									interface['mock_url'] = '/mock/test/data?id=' + interface._id,
										interface['fieldsFormateMockTemplate'] = this.interfaceFormateFields(interface.fields, false)
									interface['fieldsFormateMockData'] = this.interfaceFormateFields(interface.fields, true)
									interface['responseFormateMockTemplate'] = this.interfaceFormateFields(interface.response, false)
									interface['responseFormateMockData'] = this.interfaceFormateFields(interface.response, true)
								});
							}
						});
					}
					this.repository = item;
					this.models = item.models[this.current.model.index];
					this.interfaces = this.models.interfaces;
					this.interface = this.interfaces[this.current.interface.index];
				}
			}).catch(err => {
				console.log(err)
			})
		},
		userInfoToggle: function() {
			this.userInfo = !this.userInfo
		},
		modelToggle: function(e, index, item) {
			let modelTabs = this.$refs.modelTabs.getElementsByClassName('rap-tabs-items');
			for (let i = 0; i < modelTabs.length; i++) {
				modelTabs[i].className = 'rap-tabs-items';
				modelTabs[i].setAttribute('data-selected', false);
			}
			modelTabs[index].className = 'rap-tabs-items rap-tabs-items-selected';
			modelTabs[index].setAttribute('data-selected', true);
			this.current.model.index = index;
			this.current.interface.index = 0;
			this.models = item;
			this.interfaces = item.interfaces;
			this.interface = this.interfaces.length ? item.interfaces[this.current.interface.index] : {};
			let interfaceMenuItems = this.$refs.interfaceMenus.getElementsByClassName('interface-menus-item');
			if (interfaceMenuItems.length) {
				for (let j = 0; j < interfaceMenuItems.length; j++) {
					interfaceMenuItems[j].className = 'interface-menus-item';
					interfaceMenuItems[j].setAttribute('data-selected', false);
				}
				interfaceMenuItems[this.current.interface.index].className = 'interface-menus-item interface-menus-item-selected'
				interfaceMenuItems[this.current.interface.index].setAttribute('data-selected', true);
			}
			this.fieldPreviewActive = false;
			this.responsePreviewActive = false;
			this.interfaceFieldsPreview = false;
			this.interfaceResponsesPreview = false;
		},
		addModel: function(e, id) {
			const windowW = document.body.clientWidth || document.documentElement.clientWidth;
			const dialogWidth = this.getStyle(this.$refs.rapDialogAddMOdel, 'width');
			this.$refs.rapDialogAddMOdel.style.left = parseInt((windowW - dialogWidth) / 2) + 'px';
			this.rapDialogAddModel = !this.rapDialogAddModel;
			this.modelForm.item_id = id;
		},
		addModelFormSubmit: function() {
			if (!this.modelForm.name) {
				this.messageAlert('模块名不能为空', 'error')
				return false;
			}

			axios({
				url: '/model/add',
				method: 'POST',
				baseURL: 'https://rap.mcloudhub.com/api',
				data: {
					uid: this.user.id,
					item_id: this.modelForm.item_id,
					name: this.modelForm.name,
					remark: this.modelForm.remark
				}
			}).then(res => {
				if (res.data.code && res.data.ok) {
					this.messageAlert('模块添加成功', 'success');
					this.rapDialogAddModel = false;
					this.modelForm.item_id = '';
					this.modelForm.id = '';
					this.modelForm.name = '';
					this.modelForm.remark = '';
					this.getRepository();
				}
			}).catch(err => {
				console.log(err)
			})
		},
		addModelFormCancle: function() {
			this.rapDialogAddModel = false;
			this.modelForm.id = '';
			this.modelForm.name = '';
			this.modelForm.remark = '';
		},
		addInterface: function(e, item_id, model_id) {
			const windowW = document.body.clientWidth || document.documentElement.clientWidth;
			const dialogWidth = this.getStyle(this.$refs.rapDialogAddInterface, 'width');
			this.$refs.rapDialogAddInterface.style.left = parseInt((windowW - dialogWidth) / 2) + 'px';
			this.rapDialogAddInterfaceText = '添加接口';
			this.rapDialogADDInterfaceType = true;
			this.rapDialogAddInterface = !this.rapDialogAddInterface;
			this.interfaceForm.uid = this.user.id;
			this.interfaceForm.item_id = item_id;
			this.interfaceForm.model_id = model_id;
		},
		addInterfaceFormSubmit: function() {
			if (!this.interfaceForm.name) {
				this.messageAlert('接口名称不能为空', 'error');
				return false;
			}
			if (!this.interfaceForm.request.url) {
				this.messageAlert('接口请求地址不能为空', 'error');
				return false;
			}

			if ((/[\u2E80-\u9FFF]+/ig.test(this.interfaceForm.request.url))) {
				this.messageAlert('接口请求地址不能有中文字符', 'error');
				return false;
			}

			axios({
				url: '/interface/add',
				method: 'POST',
				baseURL: 'https://rap.mcloudhub.com/api',
				data: {
					uid: this.user.id,
					item_id: this.interfaceForm.item_id,
					model_id: this.interfaceForm.model_id,
					name: this.interfaceForm.name,
					remark: this.interfaceForm.remark,
					request: this.interfaceForm.request
				}
			}).then(res => {
				if (res.data.code && res.data.ok) {
					this.messageAlert('创建接口成功', 'success');
					this.getRepository();
					this.rapDialogAddInterface = !this.rapDialogAddInterface;
					this.interfaceForm.item_id = '';
					this.interfaceForm.model_id = '';
					this.interfaceForm.name = '';
					this.interfaceForm.remark = '';
					this.interfaceForm.request = {
						type: 'get',
						url: '',
						code: '200'
					};
				}
			}).catch(err => {
				console.log(err)
			})
		},
		editorInterfaceFormSubmit: function() {
			if (!this.interfaceForm.name) {
				this.messageAlert('接口名称不能为空', 'error');
				return false;
			}
			if (!this.interfaceForm.request.url) {
				this.messageAlert('接口请求地址不能为空', 'error');
				return false;
			}

			if ((/[\u2E80-\u9FFF]+/ig.test(this.interfaceForm.request.url))) {
				this.messageAlert('接口请求地址不能有中文字符', 'error');
				return false;
			}

			axios({
				url: '/interface/params/editor',
				method: 'POST',
				baseURL: 'https://rap.mcloudhub.com/api',
				data: {
					uid: this.user.id,
					item_id: this.interfaceForm.item_id,
					model_id: this.interfaceForm.model_id,
					id: this.interfaceForm.id,
					name: this.interfaceForm.name,
					remark: this.interfaceForm.remark,
					request: this.interfaceForm.request
				}
			}).then(res => {
				if (res.data.code && res.data.ok) {
					this.messageAlert('接口修改成功', 'success');
					this.getRepository();
					this.rapDialogAddInterface = !this.rapDialogAddInterface;
					this.interfaceForm.item_id = '';
					this.interfaceForm.model_id = '';
					this.interfaceForm.name = '';
					this.interfaceForm.remark = '';
					this.interfaceForm.request = {
						type: 'get',
						url: '',
						code: '200'
					};
				}
			}).catch(err => {
				console.log(err)
			})
		},
		addInterfaceFormCancle: function() {
			this.rapDialogAddModel = false;
			this.rapDialogAddInterface = false;
			this.rapDialogAddInterfaceRequest = false;
			this.rapDialogAddInterfaceRequestExport = false;
			this.rapDialogAddInterfaceResponse = false;
			this.rapDialogAddInterfaceResponseExport = false;
			this.rapDialogInterfaceMove = false;
			this.modelForm.item_id = '';
			this.modelForm.id = '';
			this.modelForm.name = '';
			this.modelForm.remark = '';
			this.interfaceForm.item_id = '';
			this.interfaceForm.model_id = '';
			this.interfaceForm.id = '';
			this.interfaceForm.name = '';
			this.interfaceForm.remark = '';
			this.interfaceForm.request.code = '200';
			this.interfaceForm.request.type = 'get';
			this.interfaceForm.request.url = '';
			this.interfaceRequestForm.id = '';
			this.interfaceRequestForm.name = '';
			this.interfaceRequestForm.remark = '';
			this.interfaceRequestForm.type = 'string';
			this.interfaceRequestForm.roles = '';
			this.interfaceRequestForm.default = '';
			this.interfaceRequestForm.indispensable = false;
			this.interfaceResponseForm.id = '';
			this.interfaceResponseForm.name = '';
			this.interfaceResponseForm.remark = '';
			this.interfaceResponseForm.type = 'string';
			this.interfaceResponseForm.roles = '';
			this.interfaceResponseForm.default = '';
			this.interfaceResponseForm.indispensable = false;
		},
		rapDialogClose: function() {
			this.rapDialogAddModel = false;
			this.rapDialogAddInterface = false;
			this.rapDialogAddInterfaceRequest = false;
			this.rapDialogAddInterfaceRequestExport = false;
			this.rapDialogAddInterfaceResponse = false;
			this.rapDialogAddInterfaceResponseExport = false;
			this.rapDialogInterfaceMove = false;
			this.modelForm.item_id = '';
			this.modelForm.id = '';
			this.modelForm.name = '';
			this.modelForm.remark = '';
			this.interfaceForm.item_id = '';
			this.interfaceForm.model_id = '';
			this.interfaceForm.id = '';
			this.interfaceForm.name = '';
			this.interfaceForm.remark = '';
			this.interfaceForm.request.code = '200';
			this.interfaceForm.request.type = 'get';
			this.interfaceForm.request.url = '';
			this.interfaceRequestForm.id = '';
			this.interfaceRequestForm.name = '';
			this.interfaceRequestForm.remark = '';
			this.interfaceRequestForm.type = 'string';
			this.interfaceRequestForm.roles = '';
			this.interfaceRequestForm.default = '';
			this.interfaceRequestForm.indispensable = false;
			this.interfaceResponseForm.id = '';
			this.interfaceResponseForm.name = '';
			this.interfaceResponseForm.remark = '';
			this.interfaceResponseForm.type = 'string';
			this.interfaceResponseForm.roles = '';
			this.interfaceResponseForm.default = '';
			this.interfaceResponseForm.indispensable = false;
		},
		addInterfaceRequest: function(e, id) {
			const windowW = document.body.clientWidth || document.documentElement.clientWidth;
			const dialogWidth = this.getStyle(this.$refs.rapDialogAddInterfaceRequest, 'width');
			this.$refs.rapDialogAddInterfaceRequest.style.left = parseInt((windowW - dialogWidth) / 2) + 'px';
			this.interfaceRequestForm.id = id;
			this.rapDialogAddInterfaceRequest = !this.rapDialogAddInterfaceRequest;
		},
		exportInterfaceRequest: function(e, id) {
			const windowW = document.body.clientWidth || document.documentElement.clientWidth;
			const dialogWidth = this.getStyle(this.$refs.rapDialogAddInterfaceRequestExport, 'width');
			this.$refs.rapDialogAddInterfaceRequestExport.style.left = parseInt((windowW - dialogWidth) / 2) + 'px';
			this.interfaceRequestForm.id = id;
			// var options = {
			//     // mode: 'tree'
			// };
			// var editor = new JSONEditor(this.$refs.jsoneditor, options);
			this.rapDialogAddInterfaceRequestExport = !this.rapDialogAddInterfaceRequestExport;
		},
		addInterfaceResponse: function(e, id) {
			const windowW = document.body.clientWidth || document.documentElement.clientWidth;
			const dialogWidth = this.getStyle(this.$refs.rapDialogAddInterfaceResponse, 'width');
			this.$refs.rapDialogAddInterfaceResponse.style.left = parseInt((windowW - dialogWidth) / 2) + 'px';
			this.interfaceResponseForm.id = id;
			this.rapDialogAddInterfaceResponse = !this.rapDialogAddInterfaceResponse;
		},
		exportInterfaceResponse: function(e, id) {
			const windowW = document.body.clientWidth || document.documentElement.clientWidth;
			const dialogWidth = this.getStyle(this.$refs.rapDialogAddInterfaceResponseExport, 'width');
			this.$refs.rapDialogAddInterfaceResponseExport.style.left = parseInt((windowW - dialogWidth) / 2) + 'px';
			this.interfaceResponseForm.id = id;
			this.rapDialogAddInterfaceResponseExport = !this.rapDialogAddInterfaceResponseExport;
		},
		addInterfaceRequestFormSubmit: function() {
			if (!this.interfaceRequestForm.name) {
				this.messageAlert('请求参数名称不能为空', 'error');
			}

			// if(!this.interfaceRequestForm.default){
			//     this.messageAlert('请求参数默认值不能为空', 'error');
			// }

			// if(!this.interfaceRequestForm.remark){
			//     this.messageAlert('请求参数描述不能为空', 'error');
			// }

			axios({
				url: '/interface/editor',
				method: 'POST',
				baseURL: 'https://rap.mcloudhub.com/api',
				data: {
					type: 'request',
					data: {
						id: this.interfaceRequestForm.id,
						name: this.interfaceRequestForm.name,
						remark: this.interfaceRequestForm.remark,
						type: this.interfaceRequestForm.type,
						roles: this.interfaceRequestForm.roles,
						default: this.interfaceRequestForm.default,
						indispensable: this.interfaceRequestForm.indispensable
					}
				}
			}).then(res => {
				if (res.data.code && res.data.ok) {
					this.messageAlert('添加请求参数成功', 'success');
					this.getRepository();
					this.rapDialogAddInterfaceRequest = false;
					this.interfaceRequestForm.id = '';
					this.interfaceRequestForm.name = '';
					this.interfaceRequestForm.remark = '';
					this.interfaceRequestForm.type = 'string';
					this.interfaceRequestForm.roles = '';
					this.interfaceRequestForm.default = '';
					this.interfaceRequestForm.indispensable = false;
				}
			}).catch(err => {
				console.log(err)
			})
		},
		addInterfaceRequestFormCancle: function() {
			this.rapDialogAddInterfaceRequest = false;
			this.interfaceRequestForm.id = '';
			this.interfaceRequestForm.name = '';
			this.interfaceRequestForm.remark = '';
			this.interfaceRequestForm.type = 'string';
			this.interfaceRequestForm.roles = '';
			this.interfaceRequestForm.default = '';
			this.interfaceRequestForm.indispensable = false;
		},
		addInterfaceResponseFormSubmit: function() {
			if (!this.interfaceResponseForm.name) {
				this.messageAlert('请求参数名称不能为空', 'error');
			}

			if (!this.interfaceResponseForm.default) {
				this.messageAlert('请求参数默认值不能为空', 'error');
			}

			if (!this.interfaceResponseForm.remark) {
				this.messageAlert('请求参数描述不能为空', 'error');
			}

			axios({
				url: '/interface/editor',
				method: 'POST',
				baseURL: 'https://rap.mcloudhub.com/api',
				data: {
					type: 'response',
					data: {
						id: this.interfaceResponseForm.id,
						name: this.interfaceResponseForm.name,
						remark: this.interfaceResponseForm.remark,
						type: this.interfaceResponseForm.type,
						roles: this.interfaceResponseForm.roles,
						default: this.interfaceResponseForm.default,
						indispensable: this.interfaceResponseForm.indispensable
					}
				}
			}).then(res => {
				if (res.data.code && res.data.ok) {
					this.messageAlert('添加响应参数成功', 'success');
					this.getRepository();
					this.rapDialogAddInterfaceResponse = false;
					this.interfaceResponseForm.id = '';
					this.interfaceResponseForm.name = '';
					this.interfaceResponseForm.remark = '';
					this.interfaceResponseForm.type = 'string';
					this.interfaceResponseForm.roles = '';
					this.interfaceResponseForm.default = '';
					this.interfaceResponseForm.indispensable = false;
				}
			}).catch(err => {
				console.log(err)
			})
		},
		addInterfaceResponseFormCancle: function() {
			this.rapDialogAddInterfaceResponse = false;
			this.interfaceResponseForm.id = '';
			this.interfaceResponseForm.name = '';
			this.interfaceResponseForm.remark = '';
			this.interfaceResponseForm.type = 'string';
			this.interfaceResponseForm.roles = '';
			this.interfaceResponseForm.default = '';
			this.interfaceResponseForm.indispensable = false;
		},
		ExportInterfaceRequestFormSubmit: function() {
			if (this.interfaceRequestForm.requestJson == '{}') {
				this.messageAlert('请输入正确的JSON格式', 'error');
				return false;
			}
		},
		exportInterfaceResponseFormSubmit: function() {
			if (this.interfaceResponseForm.responseJson == '{}') {
				this.messageAlert('请输入正确的JSON格式', 'error');
				return false;
			}
		},
		interfaceDelete: function(e, model_id, id) {
			if (this.interfaces.length <= 1) {
				this.messageAlert('当前只有一个实例接口不能删除，如果要删除请先创建一个接口再执行此操作。', 'warning');
				return false;
			} else {
				axios({
					url: '/interface/delete',
					method: 'GET',
					baseURL: 'https://rap.mcloudhub.com/api',
					params: {
						id: id,
						model_id: model_id
					}
				}).then(res => {
					if (res.data.code && res.data.ok) {
						this.messageAlert('接口删除成功', 'success');
						this.getRepository()
					}
				}).catch(err => {
					console.log(err)
				})
			}
		},
		interfaceEditor: function(e, item_id, model_id, item) {
			this.interfaceForm.uid = this.user.id;
			this.interfaceForm.item_id = item_id;
			this.interfaceForm.model_id = model_id;
			this.interfaceForm.id = item._id;
			this.interfaceForm.name = item.name;
			this.interfaceForm.remark = item.remark;
			this.interfaceForm.request.type = item.request.type;
			this.interfaceForm.request.url = item.request.url;
			this.interfaceForm.request.code = item.request.code;
			const windowW = document.body.clientWidth || document.documentElement.clientWidth;
			const dialogWidth = this.getStyle(this.$refs.rapDialogAddInterface, 'width');
			this.$refs.rapDialogAddInterface.style.left = parseInt((windowW - dialogWidth) / 2) + 'px';
			this.rapDialogAddInterfaceText = '修改接口';
			this.rapDialogADDInterfaceType = false;
			this.rapDialogAddInterface = !this.rapDialogAddInterface;
		},
		interfaceMove: function(e, id, model_id, item_id) {
			const windowW = document.body.clientWidth || document.documentElement.clientWidth;
			const dialogWidth = this.getStyle(this.$refs.rapDialogInterfaceMove, 'width');
			this.$refs.rapDialogInterfaceMove.style.left = parseInt((windowW - dialogWidth) / 2) + 'px';
			this.rapDialogInterfaceMove = !this.rapDialogInterfaceMove;
			this.moveInterface.id = id;
			this.moveInterface.model_id = model_id;
			this.getModels(item_id);
		},
		getModels: function(id) {
			axios({
				url: '/model/get',
				method: 'GET',
				baseURL: 'https://rap.mcloudhub.com/api',
				params: {
					id: id,
					select: ['name', '_id']
				}
			}).then(res => {
				console.log(res)
				if (res.data.code && res.data.ok) {
					this.moveInterface.models = res.data.data;
				}
			}).catch(err => {
				console.log(err)
			})
		},
		radioItem: function(e, value) {
			this.moveInterface.radios.forEach(radio => {
				radio.icon = '&#xe6f0;';
				radio.selected = false
			})
			this.moveInterface.radios[value].icon = '&#xe628;';
			this.moveInterface.radios[value].selected = true;
			this.moveInterface.type = value;
		},
		interfaceMoveSubmit: function() {
			axios({
				url: '/interface/move',
				method: 'POST',
				baseURL: 'https://rap.mcloudhub.com/api',
				data: {
					id: this.moveInterface.id,
					model_id: this.moveInterface.model_id,
					type: this.moveInterface.type
				}
			}).then(res => {
				console.log(res)
			}).catch(err => {
				console.log(err)
			})
		},
		showItemOperation: function(e, index, item) {
			this.interfaces.forEach(interface => {
				interface.overed = false
			})
			this.interfaces[index].overed = true
		},
		hiddenAllItemOperation: function(e) {
			// let _this = this;
			// setTimeout(function(){
			// 	_this.interfaces.forEach(interface=>{
			// 		interface.overed = false
			// 	})
			// },3000);
		},
		selectInterface: function(e, index, interface) {
			let interfaceMenuItems = this.$refs.interfaceMenus.getElementsByClassName('interface-menus-item');
			for (let i = 0; i < interfaceMenuItems.length; i++) {
				interfaceMenuItems[i].className = 'interface-menus-item';
				interfaceMenuItems[i].setAttribute('data-selected', false);
			}
			interfaceMenuItems[index].className = 'interface-menus-item interface-menus-item-selected'
			interfaceMenuItems[index].setAttribute('data-selected', true);
			this.current.interface.index = index;
			this.interface = interface;
			this.fieldPreviewActive = false;
			this.responsePreviewActive = false;
			this.interfaceFieldsPreview = false;
			this.interfaceResponsesPreview = false;
		},
		requestPreview: function() {
			this.interfaceFieldsPreview = !this.interfaceFieldsPreview;
			this.fieldPreviewActive = !this.fieldPreviewActive;
		},
		responsePreview: function() {
			this.interfaceResponsesPreview = !this.interfaceResponsesPreview;
			this.responsePreviewActive = !this.responsePreviewActive;
		},
		jsonFormateTextToggle() {
			this.jsonFormate.status = !this.jsonFormate.status;
			this.jsonFormate.label = this.jsonFormate.status ? '{}' : '<>';
			var editor = new JSONEditor(this.$refs.jsoneditor, this.interfaceRequestForm.requestJson);
		},
		requestMOckRefresh: function(e, item) {
			item['fieldsFormateMockTemplate'] = this.interfaceFormateFields(item.fields, false)
			item['fieldsFormateMockData'] = this.interfaceFormateFields(item.fields, true)
		},
		responseMOckRefresh: function(e, item) {
			item['responseFormateMockTemplate'] = this.interfaceFormateFields(item.response, false)
			item['responseFormateMockData'] = this.interfaceFormateFields(item.response, true)
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
		getStyle: function(el, attr) {
			let style = null;
			let filters = ['width', 'height', 'left', 'top', 'right', 'bottom', 'marginTop', 'marginLeft', 'marginRight', 'marginBottom', 'paddingLeft', 'paddingRight', 'paddingTop', 'paddingBottom']
			if (window.getComputedStyle) {
				style = window.getComputedStyle(el, null)[attr]
			} else {
				style = el.getCurrentStyle[attr]
			}
			if (utils.in_array(attr, filters)) {
				return parseInt(style);
			} else {
				return style;
			}
		},
		interfaceFormateFields: function(fileds, mock) {
			let data = {};
			fileds.forEach(field => {
				switch (field.type) {
					case 'array':
						if (!(field.default)) {
							if (field.roles) {
								let roles = JSON.parse(field.roles),
									key = '';
								for (key in roles) {
									data[key] = roles[key];
								}
							} else {
								data[field.name + "|1-10"] = [{
									"name|+1": [
										"Hello",
										"Mock.js",
										"!"
									]
								}];
							}
						} else {
							data[field.name] = field.default;
						}
						break;
					case 'boolean':
						if (!(field.default)) {
							if (field.roles) {
								let roles = JSON.parse(field.roles),
									key = '';
								for (key in roles) {
									data[key] = roles[key];
								}
							} else {
								data[field.name + "|1-2"] = true;
							}
						} else {
							data[field.name] = field.default;
						}
						break;
					case 'number':
						if (!(field.default)) {
							if (field.roles) {
								let roles = JSON.parse(field.roles),
									key = '';
								for (key in roles) {
									data[key] = roles[key];
								}
							} else {
								data[field.name + "|1-10"] = 0;
							}
						} else {
							data[field.name] = field.default;
						}
						break;
					case 'object':
						if (!(field.default)) {
							if (field.roles) {
								let roles = JSON.parse(field.roles),
									key = '';
								for (key in roles) {
									data[key] = roles[key];
								}
							} else {
								data[field.name + "|1-10"] = {
									"110000": "北京市",
									"120000": "天津市",
									"130000": "河北省",
									"140000": "山西省"
								};
							}
						} else {
							data[field.name] = field.default;
						}
						break;
					case 'function':
						if (!(field.default)) {
							if (field.roles) {
								let roles = JSON.parse(field.roles),
									key = '';
								for (key in roles) {
									data[key] = roles[key];
								}
							} else {
								data[field.name] = function() {};
							}
						} else {
							data[field.name] = field.default;
						}
						break;
					case 'regexp':
						if (!(field.default)) {
							if (field.roles) {
								let roles = JSON.parse(field.roles),
									key = '';
								for (key in roles) {
									data[key] = roles[key];
								}
							} else {
								data[field.name] = /[a-z][A-Z][0-9]/;
							}
						} else {
							data[field.name] = field.default;
						}
						break;
					default:
						if (!(field.default)) {
							if (field.roles) {
								let roles = JSON.parse(field.roles),
									key = '';
								for (key in roles) {
									data[key] = roles[key]
								}
							} else {
								data[field.name + "|1-12"] = '';
							}
						} else {
							data[field.name] = field.default;
						}
						break;
				}
			});
			return mock ? Mock.mock(data) : data;
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
		this.init()
	}
});
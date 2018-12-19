const VUE = new Vue({
	delimiters: ['${', '}'],
    el: '#app',
    data:{
        userInfo: false,
        newTeamToggle: false,
        type: false,
        user: {
            name: '',
            id: ''
        },
        pages: {
            num: 10,
            size: 1,
            count: 100
        },
        teams: [],
        selector: {
            value: 'create',
            options: [{
                label: '我创建的团队',
                value: 'create'
            }, {
                label: '我加入的团队',
                value: 'join'
            }]
        },
        search:{
            value: ''
        },
        form: {
            uid: '',
            id: '',
            name: '',
            remark: '',
            members: [],
            permissions: {
                value: 'public',
                options: [{
                    label: '公开',
                    value: 'public',
                    selected: true,
                    iconfont: '&#xe628;'
                }, {
                    label: '私有',
                    value: 'private',
                    selected: false,
                    iconfont: '&#xe6f0;'
                }]
            }
        }
    },
    created(){},
    methods: {
        init: function(){
            this.user = {
				name: utils.getCookie('name'),
				id: utils.getCookie('uid').substr(7, parseInt(utils.getCookie('uid').length - 10))
            }
            this.getTeams()
        },
        getTeams: function(){
            axios({
                url: '/team/lists',
                method: 'GET',
                baseURL: 'https://rap.mcloudhub.com/api',
                params: {
                    uid: this.user.id,
                    num: this.pages.num,
                    size: this.pages.size
                }
            }).then(res=>{
                console.log(res)
                if(res.data.code && res.data.ok){
                    let data = res.data.data;
                    if(data){
                        this.teams = data.teams;
                    }
                }
            }).catch(err=>{
                console.log(err)
            })
        },
        selectorTeamType: function(e){
        },
        addTeamToggle: function(){
            const windowW = document.body.clientWidth || document.documentElement.clientWidth;
            this.$refs.rapDialog.style.left = parseInt((windowW - 450)/2)+'px';
            this.newTeamToggle = !this.newTeamToggle;
            this.type = !this.type;
            this.form.uid = this.user.id;
        },
        rapDialogClose: function(){
            this.newTeamToggle = !this.newTeamToggle;
        },
        userInfoToggle: function() {
			this.userInfo = !this.userInfo
        },
        radioSelector: function(e, index, item){
            this.form.permissions.options.forEach(option=>{
                option.selected = false;
                option.iconfont = '&#xe6f0;';
            });
            this.form.permissions.options[index].selected = true;
            this.form.permissions.options[index].iconfont = '&#xe628;';
            this.form.permissions.value = this.form.permissions.options[index].value;
        },
        formSubmit: function(e){
            if(!(this.form.name)){
                this.messageAlert('团队名称不能为空', 'error');
                return false;
            }

            axios({
                url: '/team/add',
                method: 'POST',
                baseURL: 'https://rap.mcloudhub.com/api',
                data: {
                    uid: this.form.uid,
                    name: this.form.name,
                    remark: this.form.remark,
                    permissions: this.form.permissions.value,
                    members: this.form.members
                }
            }).then(res=>{
                console.log(res)
                if(res.data.code && res.data.ok){
                    this.messageAlert('新建团队成功', 'success');
                    this.getTeams();
                    this.form.uid = '';
                    this.form.id = '';
                    this.form.name = '';
                    this.form.remark = '';
                    this.form.members = [];
                    this.form.permissions.value = 'public';
                    this.form.permissions.options = [{
                        label: '公开',
                        value: 'public',
                        selected: true,
                        iconfont: '&#xe628;'
                    }, {
                        label: '私有',
                        value: 'private',
                        selected: false,
                        iconfont: '&#xe6f0;'
                    }]
                    this.newTeamToggle = !this.newTeamToggle;
                }
            }).catch(err=>{
                console.log(err)
            })
        },
        formCancle: function(e){
            this.form.uid = '';
            this.form.id = '';
            this.form.name = '';
            this.form.remark = '';
            this.form.members = [];
            this.form.permissions.value = 'public';
            this.form.permissions.options = [{
                label: '公开',
                value: 'public',
                selected: true,
                iconfont: '&#xe628;'
            }, {
                label: '私有',
                value: 'private',
                selected: false,
                iconfont: '&#xe6f0;'
            }]
            this.newTeamToggle = !this.newTeamToggle;
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
    mounted(){
        this.init()
    }
});
const VUE = new Vue({
    delimiters: ['${','}'],
    el: '#app',
    data: {
        userInfo: false,
        repositorys: [],
        createRepositoryDialog: false,
        type: true,
        butText: '创建',
        user: {
            id: '',
            name: ''
        },
        form:{
            id: '',
            name:'',
            remark: '',
            icon: '',
            repository: '',
            permissions: 'public',
            url: ''
        }
    },
    created() {
    },
    methods: {
        init: function(){
            this.user = {
                name: utils.getCookie('name'),
                id: utils.getCookie('uid')
            }
            this.getRepositorys();
        },
        getRepositorys: function(){
            axios({
                url:'/item/lists',
                method: 'GET',
                params: {
                    uid: this.user.uid
                },
                baseURL: 'https://rap.mcloudhub.com/api'
            }).then(res=>{
                console.log(res)
                if(res.data.code && res.data.ok){
                    let items = res.data.data.items;
                    items.forEach((item, index) => {
                        item['link'] = '/repository/editor?id='+item._id
                    });
                    this.repositorys = items;
                    console.log(this.repositorys)
                }
            }).catch(err=>{
                console.log(err)
            })
        },
        userInfoToggle: function(){
            this.userInfo = !this.userInfo
        },
        createRepository: function(){
            let clientWidth = document.body.clientWidth || document.documentElement.clientWidth;
            this.$refs.rapDialog.style.left = parseInt((clientWidth-550)/2)+'px';
            this.createRepositoryDialog = !this.createRepositoryDialog;
        },
        rapDialogClose: function(){
            this.createRepositoryDialog = !this.createRepositoryDialog;
        },
        createRepositoryFormSubmit:function(){
            console.log(axios)
            if(!this.form.name){
                alert('仓库名不能为空')
            }

            if(this.form.icon){
                if(!(/^(https\:\/\/)|(http\:\/\/)[\S]+/ig.test(this.form.icon))){
                    alert(1231213)
                }
            }

            if(this.form.repository){
                if(!(/^(https\:\/\/)|(http\:\/\/)[\S]+/ig.test(this.form.repository))){
                    alert(1231213)
                }
            }

            if(this.form.url){
                if(!(/^(https\:\/\/)|(http\:\/\/)[\S]+/ig.test(this.form.url))){
                    alert(1231213)
                }
            }else{
                alert('仓库接口URL不能为空')
            }
            
            axios({
                url: '/item/add',
                method: 'POST',
                baseURL: 'https://rap.mcloudhub.com/api',
                data:this.form
            }).then(res=>{
                console.log(res)
                if(res.data.code && res.data.ok){
                    this.messageAlert('创建仓库成功', 'success');
                    this.createRepositoryDialog = !this.createRepositoryDialog;
                    this.getRepositorys();

                }
            }).catch(err=>{
                console.log(err)
                this.messageAlert('服务器出错', 'error')
            })
        },
        createRepositoryFormCancle:function(){
            this.createRepositoryDialog = !this.createRepositoryDialog;
            this.form = {
                id: '',
                name: '',
                remark: '',
                icon: '',
                repository: '',
                permissions: '',
                url: ''
            };
        },
        repositoryEditor: function(e, item){
            this.createRepositoryDialog = !this.createRepositoryDialog;
            let clientWidth = document.body.clientWidth || document.documentElement.clientWidth;
            this.$refs.rapDialog.style.left = parseInt((clientWidth-550)/2)+'px';
            this.type = false;
            this.butText = '修改',
            this.form.id = item._id;
            this.form.name = item.name;
            this.form.remark = item.remark;
            this.form.icon = item.icon;
            this.form.repository = item.repository;
            this.form.permissions = item.permissions;
            this.form.url = item.url;
        },
        repositoryDelete: function(e, id){
            console.log(id);
        },
        loginout: function(){
            axios({
                url: '/user/loginout',
                method: 'POST',
                baseURL: 'https://rap.mcloudhub.com/api',
                data: {
                    user: {
                        id: this.user.id
                    }
                }
            }).then(res=>{
                if(res.data.code && res.data.ok){
                    window.location.href = '/login'
                }
            }).catch(err=>{
                console.log(err)
            })
        },
        /**
         * 显示警告信息
         * @param {*} msg // 
         * @param {*} type // success,info,error,warning
         */
        messageAlert(msg,type) {
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
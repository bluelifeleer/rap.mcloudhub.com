const VUE = new Vue({
    delimiters: ['${','}'],
    el: '#app',
    data: {
        userInfo: false,
        repository: {},
        rapDialogAddModel: false,
        rapDialogAddInterface: false,
        rapDialogAddInterfaceRequest: false,
        rapDialogAddInterfaceRequestExport: false,
        rapDialogAddInterfaceResponse: false,
        rapDialogAddInterfaceResponseExport: false,
        uid: '',
        user: {
            id: '',
            name: ''
        },
        modelForm:{
            item_id:'',
            id:'',
            name:'',
            remark:''
        },
        interfaceForm: {
            uid:'',
            item_id: '',
            model_id:'',
            id:'',
            name:'',
            remark:'',
            request:{
                type:'get',
                url:'',
                code:'200'
            },
            types: [
                {
                    label:'GET',
                    value:'get'
                },
                {
                    label:'POST',
                    value:'post'
                },
                {
                    label:'PUT',
                    value:'put'
                },
                {
                    label:'DELETE',
                    value:'delete'
                },
                {
                    label:'OPTIONS',
                    value:'options'
                },
                {
                    label:'PATCH',
                    value:'patch'
                },
                {
                    label:'HEAD',
                    value:'head'
                }
            ],
            codes: [
                {
                    label: '200',
                    value: 200
                },
                {
                    label: '301',
                    value: 301
                },
                {
                    label: '403',
                    value: 403
                },
                {
                    label: '404',
                    value: 404
                },
                {
                    label: '500',
                    value: 500
                },
                {
                    label: '502',
                    value: 502
                },
                {
                    label: '503',
                    value: 503
                },
                {
                    label: '504',
                    value: 504
                }
            ]
        },
        interfaceRequestForm: {
            id: '',
            name:'',
            type:'string',
            remark: '',
            default: '',
            indispensable: false,
            requestJson: '{\r\nname:\'\',\r\ntype:\'string\',\r\nremark: \'\',\r\ndefault: \'\',\r\nindispensable: false\r\n}',
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
            name:'',
            type:'string',
            remark: '',
            default: '',
            indispensable: false,
            responseJson: '{\r\nname:\'\',\r\ntype:\'string\',\r\nremark: \'\',\r\ndefault: \'\',\r\nindispensable: false\r\n}',
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
        }
    },
    created() {
        this.uid = utils.getCookie('uid');
    },
    methods: {
        init: function(){
            let id = utils.getUrlQueryString('id');
            this.modelForm.item_id = id;
            this.user = {
                name: utils.getCookie('name'),
                id: utils.getCookie('uid')
            }
            this.getRepository(id);
        },
        getRepository: function(id){
            axios({
                url: '/item/get',
                mehtod: 'GET',
                baseURL: 'https://rap.mcloudhub.com/api',
                params: {
                    id :id
                }
            }).then(res=>{
                console.log(res)
                if(res.data.code && res.data.ok){
                    let item = res.data.data.item;
                    let models = item.models;
                    // models.forEach(model=>{
                    //     if(model.interfaces.length){
                    //         model.interfaces.forEach(interface=>{
                    //             interface.request = JSON.parse(interface.request);
                    //             interface.fields = JSON.parse(interface.fields);
                    //             interface.response = JSON.parse(interface.response);
                    //         })
                    //     }
                        
                    // })
                    this.repository = item;
                    console.log(this.repository)
                }
            }).catch(err=>{
                console.log(err)
            })
        },
        userInfoToggle: function(){
            this.userInfo = !this.userInfo
        },
        modelToggle: function(item){
            
        },
        addModel: function(){
            const windowW = document.body.clientWidth || document.documentElement.clientWidth;
            const dialogWidth = this.getStyle(this.$refs.rapDialogAddMOdel,'width');
            this.$refs.rapDialogAddMOdel.style.left = parseInt((windowW-dialogWidth)/2)+'px';
            this.rapDialogAddModel = !this.rapDialogAddModel;
        },
        addModelFormSubmit: function(){
            if(!this.modelForm.name){
                this.messageAlert('模块名不能为空', 'error')
                return false;
            }

            axios({
                url: '/model/add',
                method: 'POST',
                baseURL: 'https://rap.mcloudhub.com/api',
                data: {
                    uid: this.uid,
                    item_id: this.modelForm.item_id,
                    name:this.modelForm.name,
                    remark: this.modelForm.remark
                }
            }).then(res=>{
                if(res.data.code && res.data.ok){
                    this.messageAlert('模块添加成功', 'success');
                    this.getRepository();
                }
            }).catch(err=>{
                console.log(err)
            })
        },
        addModelFormCancle: function(){
            this.rapDialogAddModel = false;
            this.modelForm = {
                item_id:'',
                id:'',
                name:'',
                remark:''
            };
        },
        addInterface: function(e, item_id, model_id){
            const windowW = document.body.clientWidth || document.documentElement.clientWidth;
            const dialogWidth = this.getStyle(this.$refs.rapDialogAddInterface,'width');
            this.$refs.rapDialogAddInterface.style.left = parseInt((windowW-dialogWidth)/2)+'px';
            this.rapDialogAddInterface = !this.rapDialogAddInterface;
            this.interfaceForm.uid = this.uid;
            this.interfaceForm.item_id = item_id;
            this.interfaceForm.model_id = model_id;
            console.log(this.interfaceForm)
        },
        addInterfaceFormSubmit: function(){
            if(!this.interfaceForm.name){
                this.messageAlert('接口名称不能为空','error');
                return false;
            }
            if(!this.interfaceForm.request.url){
                this.messageAlert('接口请求地址不能为空','error');
                return false;
            }

            if((/[\u2E80-\u9FFF]+/ig.test(this.interfaceForm.request.url))){
                this.messageAlert('接口请求地址不能有中文字符','error');
                return false;
            }
            axios({
                url: '/interface/add',
                method: 'POST',
                baseURL: 'https://rap.mcloudhub.com/api',
                data: {
                    uid: this.uid,
                    item_id: this.interfaceForm.item_id,
                    model_id: this.interfaceForm.model_id,
                    name:this.interfaceForm.name,
                    remark: this.interfaceForm.remark,
                    request: this.interfaceForm.request
                }
            }).then(res=>{
                if(res.data.code && res.data.ok){
                    this.messageAlert('创建接口成功', 'success');
                    this.getRepository();
                    this.rapDialogAddInterface = !this.rapDialogAddInterface;
                }
            }).catch(err=>{
                console.log(err)
            })
        },
        addInterfaceFormCancle: function(){
            this.rapDialogAddModel = false;
            this.rapDialogAddInterface = false;
            this.rapDialogAddInterfaceRequest = false;
            this.rapDialogAddInterfaceRequestExport = false;
            this.rapDialogAddInterfaceResponse = false;
            this.rapDialogAddInterfaceResponseExport = false;

            this.modelForm = {
                item_id:'',
                id:'',
                name:'',
                remark:''
            };
            this.interfaceForm = {
                item_id: '',
                model_id:'',
                id:'',
                name:'',
                remark:'',
                request:{
                    methods:'get',
                    url:'',
                    status_code:'200'
                }
            }

            this.interfaceRequestForm = {
                id: '',
                name:'',
                type:'string',
                remark: '',
                default: '',
                indispensable: false,
                requestJson: '{\r\nname:\'\',\r\ntype:\'string\',\r\nremark: \'\',\r\ndefault: \'\',\r\nindispensable: false\r\n}'
            }

            this.interfaceResponseForm = {
                id: '',
                name:'',
                type:'string',
                remark: '',
                default: '',
                indispensable: false,
                responseJson: '{\r\nname:\'\',\r\ntype:\'string\',\r\nremark: \'\',\r\ndefault: \'\',\r\nindispensable: false\r\n}'
            }
        },
        rapDialogClose: function(){
            this.rapDialogAddModel = false;
            this.rapDialogAddInterface = false;
            this.rapDialogAddInterfaceRequest = false;
            this.rapDialogAddInterfaceRequestExport = false;
            this.rapDialogAddInterfaceResponse = false;
            this.rapDialogAddInterfaceResponseExport = false;

            this.modelForm = {
                item_id:'',
                id:'',
                name:'',
                remark:''
            };
            this.interfaceForm = {
                item_id: '',
                model_id:'',
                id:'',
                name:'',
                remark:'',
                request:{
                    methods:'get',
                    url:'',
                    status_code:'200'
                }
            }
            this.interfaceRequestForm = {
                id: '',
                name:'',
                type:'string',
                remark: '',
                default: '',
                indispensable: false,
                requestJson: '{\r\nname:\'\',\r\ntype:\'string\',\r\nremark: \'\',\r\ndefault: \'\',\r\nindispensable: false\r\n}'
            }

            this.interfaceResponseForm = {
                id: '',
                name:'',
                type:'string',
                remark: '',
                default: '',
                indispensable: false,
                responseJson: '{\r\nname:\'\',\r\ntype:\'string\',\r\nremark: \'\',\r\ndefault: \'\',\r\nindispensable: false\r\n}'
            }
        },
        addInterfaceRequest:function(e, id){
            const windowW = document.body.clientWidth || document.documentElement.clientWidth;
            const dialogWidth = this.getStyle(this.$refs.rapDialogAddInterfaceRequest,'width');
            this.$refs.rapDialogAddInterfaceRequest.style.left = parseInt((windowW-dialogWidth)/2)+'px';
            this.interfaceRequestForm.id = id;
            this.rapDialogAddInterfaceRequest = !this.rapDialogAddInterfaceRequest;
        },
        exportInterfaceRequest: function(e, id){
            const windowW = document.body.clientWidth || document.documentElement.clientWidth;
            const dialogWidth = this.getStyle(this.$refs.rapDialogAddInterfaceRequestExport,'width');
            this.$refs.rapDialogAddInterfaceRequestExport.style.left = parseInt((windowW-dialogWidth)/2)+'px';
            this.interfaceRequestForm.id = id;
            // var options = {
            //     // mode: 'tree'
            // };
            // var editor = new JSONEditor(this.$refs.jsoneditor, options);
            this.rapDialogAddInterfaceRequestExport = !this.rapDialogAddInterfaceRequestExport;
        },
        addInterfaceResponse: function(e, id){
            const windowW = document.body.clientWidth || document.documentElement.clientWidth;
            const dialogWidth = this.getStyle(this.$refs.rapDialogAddInterfaceResponse,'width');
            this.$refs.rapDialogAddInterfaceResponse.style.left = parseInt((windowW-dialogWidth)/2)+'px';
            this.interfaceResponseForm.id = id;
            this.rapDialogAddInterfaceResponse = !this.rapDialogAddInterfaceResponse;
        },
        exportInterfaceResponse: function(e, id){
            const windowW = document.body.clientWidth || document.documentElement.clientWidth;
            const dialogWidth = this.getStyle(this.$refs.rapDialogAddInterfaceResponseExport,'width');
            this.$refs.rapDialogAddInterfaceResponseExport.style.left = parseInt((windowW-dialogWidth)/2)+'px';
            this.interfaceResponseForm.id = id;
            this.rapDialogAddInterfaceResponseExport = !this.rapDialogAddInterfaceResponseExport;
        },
        addInterfaceRequestFormSubmit: function(){
            if(!this.interfaceRequestForm.name){
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
                        default: this.interfaceRequestForm.default,
                        indispensable: this.interfaceRequestForm.indispensable
                    }
                }
            }).then(res=>{
                console.log(res)
                if(res.data.code && res.data.ok){
                    this.messageAlert('添加请求参数成功', 'success');
                    this.getRepository();
                    this.rapDialogAddInterfaceRequest = false;
                }
            }).catch(err=>{
                console.log(err)
            })
        },
        addInterfaceRequestFormCancle: function(){
            this.rapDialogAddInterfaceRequest = false;
            this.interfaceRequestForm = {
                id: '',
                name:'',
                type:'string',
                remark: '',
                default: '',
                indispensable: false
            }
        },
        addInterfaceResponseFormSubmit: function(){
            if(!this.interfaceResponseForm.name){
                this.messageAlert('请求参数名称不能为空', 'error');
            }

            if(!this.interfaceResponseForm.default){
                this.messageAlert('请求参数默认值不能为空', 'error');
            }

            if(!this.interfaceResponseForm.remark){
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
                        default: this.interfaceResponseForm.default,
                        indispensable: this.interfaceResponseForm.indispensable
                    }
                }
            }).then(res=>{
                console.log(res)
                if(res.data.code && res.data.ok){
                    this.messageAlert('添加响应参数成功', 'success');
                    this.getRepository();
                    this.rapDialogAddInterfaceResponse = false;
                }
            }).catch(err=>{
                console.log(err)
            })
        },
        addInterfaceResponseFormCancle: function(){
            this.rapDialogAddInterfaceResponse = false;
            this.interfaceResponseForm = {
                id: '',
                name:'',
                type:'string',
                remark: '',
                default: '',
                indispensable: false
            }
        },
        ExportInterfaceRequestFormSubmit: function(){
            if(this.interfaceRequestForm.requestJson == '{}'){
                this.messageAlert('请输入正确的JSON格式', 'error');
                return false;
            }
        },
        exportInterfaceResponseFormSubmit: function(){
            if(this.interfaceResponseForm.responseJson == '{}'){
                this.messageAlert('请输入正确的JSON格式', 'error');
                return false;
            }
        },
        getStyle: function(el,attr){
            let style = null;
            let filters = ['width','height','left','top','right','bottom','marginTop','marginLeft','marginRight','marginBottom','paddingLeft','paddingRight','paddingTop','paddingBottom']
            if(window.getComputedStyle){
                style = window.getComputedStyle(el,null)[attr]
            }else{
                style = el.getCurrentStyle[attr]
            }
            if(utils.in_array(attr, filters)){
                return parseInt(style);
            }else{
                return style;
            }
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
        }
    },
    mounted() {
        this.init()
    }
});
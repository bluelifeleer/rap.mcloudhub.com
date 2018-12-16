const VUE = new Vue({
    delimiters: ['${','}'],
    el: '#app',
    data:{
        form:{
            name: '',
            email: '',
            password: '',
            confirm_password: ''
        }
    },
    created(){},
    methods:{
        registerFormSubmit: function(){
            console.log(this.form)
            if(!this.form.name){
                this.messageAlert('用户名不能为空', 'error');
                return false;
            }
            
            if(this.form.password != this.form.confirm_password){
                this.messageAlert('两次输入密码不同', 'error');
                return false;
            }

            axios({
                url: '/user/register',
                method: 'POST',
                baseURL: 'https://rap.mcloudhub.com/api',
                data: {
                    name: this.form.name,
                    password: this.form.password,
                    email: this.form.email
                }
            }).then(res=>{
                // console.log(err)
                if(res.data.code && res.data.ok){
                    window.location.href = '/login';
                }else{
                    this.messageAlert(res.data.msg, 'error')
                }
            }).catch(err=>{
                console.log(err)
                // this.messageAlert(res.data.msg, 'error')
            })
        },
        messageAlert(msg,type) {
            this.$message({
                message: msg,
                type: type
            })
        }
    },
    mounted(){}
})
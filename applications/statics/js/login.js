const VUE = new Vue({
    delimiters: ['${','}'],
    el: '#app',
    data:{
        redirect: '',
        form:{
            name:'',
            password:'',
            verify:'',
            checked:true
        }
    },
    created(){
        this.$http = axios
        this.redirect = utils.getUrlQueryString('redirect_uri')
    },
    methods:{
        refreshVerify:function(){
            console.log(this.redirect)
        },
        checkboxToggle:function(){
            this.form.checked = !this.form.checked;
        },
        loginFormSubmit:function(){
            // console.log(this.form)
            axios({
                url: '/user/login',
                method: 'POST',
                baseURL: 'https://rap.mcloudhub.com/api',
                data: this.form
            }).then(res=>{
                console.log(res)
                if(res.data.code && res.data.ok){
                    window.location.href= this.redirect;
                }else{
                    this.messageAlert(res.data.msg, 'error')
                }
            }).catch(err=>{
                console.log(err)
            })
        },
        githubLogin:function(){

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
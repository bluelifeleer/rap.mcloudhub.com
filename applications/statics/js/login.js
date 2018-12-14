const VUE = new Vue({
    delimiters: ['${','}'],
    el: '#app',
    data:{
        form:{
            name:'',
            password:'',
            verify:'',
            checked:true
        }
    },
    created(){},
    methods:{
        refreshVerify:function(){
        },
        checkboxToggle:function(){
            this.form.checked = !this.form.checked;
        },
        loginFormSubmit:function(){
            console.log(this.form)
        },
        githubLogin:function(){

        }
    },
    mounted(){}
})
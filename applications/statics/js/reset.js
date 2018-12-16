const VUE = new Vue({
    delimiters: ['${','}'],
    el: '#app',
    data:{
        form:{
            email: ''
        }
    },
    created(){},
    methods:{
        resetFormSubmit: function(){
            console.log(this.form)
        }
    },
    mounted(){}
})
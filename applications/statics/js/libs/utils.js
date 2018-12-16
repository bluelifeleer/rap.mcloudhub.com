(function(o){
    o.utils = {
        getCookie: function(key){
            var v = window.document.cookie.match('(^|;) ?' + key + '=([^;]*)(;|$)');
            return v ? v[2] : null;
        },
        setCookie: function(key, value, days){
            days = days || 7;
            var d = new Date;
            d.setTime(d.getTime() + 24 * 60 * 60 * 1000 * days);
            window.document.cookie = key + '=' + value + ';path=/;expires=' + d.toGMTString();
        },
        deleteCookie: function(key){
            this.set(key, '', -1);
        },
        getUrlQueryString: function(name){
            var reg = new RegExp("(^|&)" + name + "=([^&]*)(&|$)");
            var r = window.location.search.substr(1).match(reg);
            return r != null ? unescape(r[2]): null;
        },
        in_array: function(el,arr,fl){
            let bf = false,i=0;
            fl = fl || false;
            for(i;i<arr.length;i++){
                if(el == arr[i]){
                    bf = true;
                    if(fl){
                        break;
                    }
                }
            }
            return bf;
        }
    }
})(window)
var Response = {
    
    error:function(data,code){
        return this.handleResponse(data,code,'error');
    },

    success:function(data){
        return this.handleResponse(data,null,'success');
    },

    handleResponse:function(data,code,type){
        var _status = false, _resp = [], _msg = '',_code=200;
        if(type == "error") _status = true;
        if(data.resp) _resp = data.resp;
        if(data.msg) _msg = data.msg;
        if(code) _code = code;

        var response = {'error':_status,
                        'message':_msg,
                        'code':_code,
                        'response':_resp};

        response.code = '';

        return response;
    }
};

module.exports = Response;
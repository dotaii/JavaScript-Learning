function Validator(formSelector){
    var _this = this;
    var formRules = {};

    function getParent(element,parentSelector){
        while(element.parentElement){
            if(element.parentElement.matches(parentSelector)){
                return element.parentElement;
            }
            element = element.parentElement;
        }
        return null;
    }

    /**
     * Quy ước tạo rules:
     * - Nếu không có lỗi (true) thì trả về undefined
     * - Nếu có lỗi (false) thì trả về error msg
     */
    var validatorRules = {
        required: function(value){
            return value ? undefined : `Vui lòng nhập`;
        },
        email: function(value){
            var regex = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;
            return regex.test(value) ? undefined : `Vui lòng nhập email`;//hàm test để kiểm tra có khớp biểu thứ chính quy không (regular expression)
        },
        min : function(min){
            return function(value){
                return value.length >= min ? undefined : `Vui lòng nhập ít nhất ${min} kí tự`
            }
        }
    }

    var formElement = document.querySelector(formSelector);
    if(formElement){
        var inputElenments = formElement.querySelectorAll('[name][rules]');
        for (var input of inputElenments) {
            var rules = input.getAttribute('rules').split('|');
            for(var rule of rules){
                if(rule.includes(':')){
                    var ruleInfor = rule.split(':');
                    rule = ruleInfor[0];
                    validatorRules[rule] = validatorRules[ruleInfor[0]](ruleInfor[1]);
                }
                if(!Array.isArray(formRules[input.name])){
                    formRules[input.name] = [validatorRules[rule]];
                }
                else{
                    formRules[input.name].push(validatorRules[rule]);
                }
            }
            //Lắng nghe sự kiện để validate (blur, change, click ... )
            input.onblur = handleValidate;
            input.oninput = handleClearError;

            function handleValidate(event) {
                var rules = formRules[event.target.name];
                var errorMessage;
                for(var rule of rules){
                    errorMessage = rule(event.target.value);
                    if(errorMessage) break;
                }

                if(errorMessage){
                    var formGroup = getParent(event.target, '.form-group');
                    if(formGroup){
                        formGroup.classList.add('invalid');
                        var formMessage = formGroup.querySelector('.form-message');
                        if(formMessage){
                            formMessage.innerText = errorMessage;
                        }
                    }
                }
                
                return !errorMessage;
            }
            function handleClearError(event){
                var formGroup = getParent(event.target, '.form-group');
                if(formGroup.classList.contains('invalid')){
                    formGroup.classList.remove('invalid');
                    var formMessage = formGroup.querySelector('.form-message');
                    if(formMessage){
                        formMessage.innerText = '';
                    }

                }
            }
        }
    }
    //submit form
    formElement.onsubmit = function(event){
        event.preventDefault();

        var inputElenments = formElement.querySelectorAll('[name][rules]');
        var isValid = true;
        for (var input of inputElenments) {
            
            if(!handleValidate({target : input})){
                isValid = false;
            }
            
        }
        if(isValid){
            if(typeof _this.onSubmit === 'function'){
                var enableInputs = formElement.querySelectorAll('[name][rules]');
                var formValues = Array.from(enableInputs).reduce(function(values,input){
                    values[input.name] = input.value;
                    return values;
                },{});
                _this.onSubmit(formValues);
            }else{
                formElement.submit();
            }
        }
    }

}

function validator(options) {

    function getParent(element, selector) {
        while (element.parentElement) {
            element = element.parentElement;
            if (element && element.matches(selector)) {
                return element;
            }
        }
        return null; // Nếu không tìm thấy phần tử cha thoả mãn selector
    }
   


    var selectorRules = {}; // lưu các rule vào Oject để tránh việc ghi đè rule

    //Hàm xử lí lỗi khi chưa có value cho input hoặc value không hợp lệ
    function validate(inputEl, rule) {
        var errorMessage;
        var errorEl = getParent(inputEl, options.formGroupSelector).querySelector(options.formMessage)

        var rules = selectorRules[rule.selector]

        for (var i=0; i < rules.length; i++) {
            switch (inputEl.type) {
                case 'radio':
                case 'checkbox':
                    errorMessage = rules[i](formEl.querySelector(rule.selector + ':checked'))
                    break;
                default:
                    errorMessage = rules[i](inputEl.value);
            }
            if (errorMessage) {
                break;
            }
        }


        if (errorMessage) {
            getParent(inputEl, options.formGroupSelector).classList.add('invalid');
            errorEl.innerText = errorMessage;
        } else {
            getParent(inputEl, options.formGroupSelector).classList.remove('invalid');
            errorEl.innerText = '';
        }

        return !errorMessage;
    }

    var formEl = document.querySelector(options.form);
    if (formEl) {
        formEl.addEventListener('submit', function(e) {
            e.preventDefault(); // Ngăn chặn sự kiện submit chuyển hướng

            var isFormValid = true;

            options.rules.forEach(function(rule) {
                var inputEl = formEl.querySelector(rule.selector)
                var isValid = validate(inputEl, rule);

                if (!isValid) {
                    isFormValid = false;
                }
            });
            if (isFormValid) {
                if (typeof options.onSubmit === 'function') {
                    var enableInputs = formEl.querySelectorAll('[name]');
                    var formValues = Array.from(enableInputs).reduce(function(values, input) {
                        switch (input.type) {
                            case 'radio':
                                if (input.checked) {
                                    values[input.name] = input.value
                                }
                                break;
                                case 'checkbox':
                                    if(!input.checked){                                       
                                        values[input.name] = "";
                                        return values;
                                    }
                                    if(!Array.isArray(values[input.name])){
                                        values[input.name] = []
                                    }
                                    values[input.name].push(input.value)
                                    break;
                                case 'file':
                                    values[input.name] = input.files;
                                    console.log(values[input.name]);
                                    break;
                                        
                                default:
                                    values[input.name] = input.value;
                        }
                        return values;
                    }, {})
                    options.onSubmit(formValues);
                } else {
                    formEl.submit();
                }
            }
        })


        options.rules.forEach(function(rule) {

            //Luu lai cac rule cho moi input
            if (!Array.isArray(selectorRules[rule.selector])) {
                selectorRules[rule.selector] = [rule.test];
            } else {
                selectorRules[rule.selector].push(rule.test);
            }
            var inputEl = formEl.querySelector(rule.selector)

            if (inputEl) {
                var errorEl = getParent(inputEl, options.formGroupSelector).querySelector(options.formMessage)
                inputEl.addEventListener('blur', function(e) {
                    validate(inputEl, rule);
                })
                inputEl.addEventListener('input', function(e) {
                    getParent(inputEl, options.formGroupSelector).classList.remove('invalid');
                    errorEl.innerText = '';
                })
            }
        })
    }




}
validator.onSubmit = function() {

}

validator.isRequired = function(selector) {
    return {
        selector: selector,
        test: function(value) {
            return value ? undefined : 'Vui long nhap truong nay';
        }
    };
}
validator.isEmail = function(selector) {
    return {
        selector: selector,
        test: function(value) {
            var regex = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;
            return regex.test(value) ? undefined : 'Truong nay phai la email';
        }
    };
}
validator.minLength = function(selector, min) {
    return {
        selector: selector,
        test: function(value) {
            return value.length >= min ? undefined : `Do dai toi thieu ${min} ki tu`;
        }
    };
}
validator.isConfirmed = function(selector, getConfirmValue) {
    return {
        selector: selector,
        test: function(value) {
            return value === getConfirmValue() ? undefined : `Nhap lai mat khau khong chinh xac`
        }
    }
}
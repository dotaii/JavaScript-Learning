function validator(options) {

    //xu ly viec ghi de rule
    //luu lai cac rules
    var selectorRules = {};

    function validateI(inputEl, rule) {
        var errorMessage;
        var errorEl = inputEl.parentElement.querySelector(options.formMessage)

        var rules = selectorRules[rule.selector]
        for (var i in rules) {
            errorMessage = rules[i](inputEl.value);
            if (errorMessage) break;
        }

        if (errorMessage) {
            inputEl.parentElement.classList.add('invalid');
            errorEl.innerText = errorMessage;
        } else {
            inputEl.parentElement.classList.remove('invalid');
            errorEl.innerText = '';
        }
    }

    var formEl = document.querySelector(options.form);

    if (formEl) {
        formEl.addEventListener('submit', function(e) {
            e.preventDefault();
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
                var errorEl = inputEl.parentElement.querySelector(options.formMessage)
                inputEl.addEventListener('blur', function(e) {
                    validateI(inputEl, rule);
                })
                inputEl.addEventListener('input', function(e) {
                    inputEl.parentElement.classList.remove('invalid');
                    errorEl.innerText = '';
                })
            }
        })
    }




}

validator.isRequired = function(selector) {
    return {
        selector: selector,
        test: function(value) {
            return value.trim() ? undefined : 'Vui long nhap truong nay';
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
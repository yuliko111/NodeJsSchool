'use strict';
class Helper {
    getInputValue (name)  {
        return document.querySelector('input[name="' + name+ '"]').value;
    }
    getElemByName (name) {
        return document.querySelector('input[name="' + name+ '"]');
    }
    getElem (elem) {
        return document.querySelector(elem);
    }
    setValue (name, value) {
        return this.getElemByName(name).value = value;
    }
    clear () {
        // TODO в цикле перебрать инпуты и очистить их стили
    }
}

class Validate {
    validateFio (data){
        const fioArr = data.fio.split(' ');
        const fioResultArr = fioArr.filter((item)=>{//TODO filter
           return item.length;
        });
        return (fioResultArr.length === 3);
    }

    validatePhone (data) {
        let phoneNumber = data.phone;
        let validNumber = phoneNumber.replace(/[^0-9]+/g, '');
        let arrNumber = validNumber.split('');
        let result = arrNumber.reduce(function(sum, current) {
            return parseInt(sum, 10) + parseInt(current, 10);
        }, 0);
        // self.value(validNumber);
        return (result <= 30);
    }

    validateEmail (data) {
        let mailName = data.email.split('@')[0];
        let mailDomen = data.email.split('@')[1];
        // TODO switch
        // console.log('email is valid?', (mailDomen === 'ya.ru' || mailDomen === 'yandex.ru' || mailDomen === 'yandex.ua' || mailDomen === 'yandex.by' || mailDomen === 'yandex.kz' || mailDomen === 'yandex.com'));
        return (mailDomen === 'ya.ru' || mailDomen === 'yandex.ru' || mailDomen === 'yandex.ua' || mailDomen === 'yandex.by' || mailDomen === 'yandex.kz' || mailDomen === 'yandex.com');
    }
}

class API {
    sendForm (form, submitBtn, resultNode) {
        const formAction = form.getAttribute('action');

        fetch('/rest/' + formAction)
            .then((resp) => {
                return resp.json();
            })
            .then((data) => {
                if (data.status !== 'success' && data.status !== 'error' && data.status !== 'progress') {
                    return;
                }

                resultNode.classList.add(data.status);

                if (data.status === 'success') {
                    submitBtn.removeAttribute('disabled');
                    resultNode.innerHTML = 'Success';
                }
                if (data.status === 'error') {
                    submitBtn.removeAttribute('disabled');
                    resultNode.innerHTML = data.reason;
                }
                if (data.status === 'progress') {
                    let time = 0;

                    if (!isNaN(data.timeout)) {
                        time = data.timeout;
                    }

                    setTimeout(() => {
                        api.sendForm(form, submitBtn, resultNode)
                    }, time);
                }

            })
            .catch();
    }
}

let helper = new Helper();
let validate = new Validate();
let api = new API();

let MyForm = {
    validate: () => {
        const data = MyForm.getData();
        const resultValid = {
            isValid: true,
            errorFields: []
        };

        if (!validate.validateFio(data)) {
            resultValid.errorFields.push('fio');
        }
        if (!validate.validatePhone(data)) {
            resultValid.errorFields.push('phone');
        }
        if (!validate.validateEmail(data)) {
            resultValid.errorFields.push('email');
        }

        if (resultValid.errorFields.length) {
            resultValid.isValid = false;
        }

        console.log('resultValid', resultValid);
        return resultValid;
    },

    getData: () => {
        return {
            fio: helper.getInputValue('fio'),
            email: helper.getInputValue('email'),
            phone: helper.getInputValue('phone')
        }
    },

    setData: (data) => {
        helper.setValue('fio', data.fio);
        helper.setValue('phone', data.phone);
        helper.setValue('email', data.email);
    },

    submit: () => {
        const form = helper.getElem('#myForm');
        const validateResult = MyForm.validate();
        const submitBtn = helper.getElem('#submitButton');
        const resultNode = helper.getElem('#resultContainer');

        if (validateResult.isValid) {
            submitBtn.setAttribute('disabled', 'disabled');
            api.sendForm(form, submitBtn, resultNode);
        } else {
            validateResult.errorFields.forEach((field)=>{
                helper.getElemByName(field).classList.add('form__input_error');
            });
        }
    }
};

document.addEventListener('DOMContentLoaded', () => {
    // MyForm.setData({fio: '  Иванов Иван    Иванович Иванович', phone: '+928347892 dskjf', email: 'kasjdas@ya.ru'});
    MyForm.setData({fio: 'Иванов Иван Иванович', phone: '+7123456', email: 'kasjdas@ya.ru'});

    let form = helper.getElem('#myForm');
    form.addEventListener('submit', (e) => {

        e.preventDefault();

        MyForm.submit();
    });
});

'use strict';
class Helper {
    getInputValue (name)  {
        return document.querySelector('input[name="' + name+ '"]').value;
    }
    getElemByName (name) {
        return document.querySelector('input[name="' + name+ '"]');
    }
    getElem (selector) {
        return document.querySelector(selector);
    }
    getElems (selector) {
        return document.querySelectorAll(selector);
    }
    setValue (name, value) {
        return this.getElemByName(name).value = value;
    }
    clear () {
        const inputs = this.getElems('#myForm input');

        inputs.forEach(input => {
            if (input.classList.contains('form__input_error')) {
                input.classList.remove('form__input_error');
            }
        })
    }
}

class Validate {
    validateFio (fio){
        const fioArr = fio.split(' ');
        const fioResultArr = fioArr.filter((item)=>{//TODO filter
           return item.length;
        });

        let result;

        fioResultArr.forEach(word => {
            if (/^[^0-9!-_+\.\$]+$/.test(word)) {
                return result = true;
            } else {
                return result = false;
            }
        });

        return (fioResultArr.length === 3 && result);
    }

    validatePhone (phone) {
        const onlyNumeric = phone.replace(/[^0-9]+/g, '');

        const arrForSum = onlyNumeric.split('');
        const resultSum = arrForSum.reduce(function(sum, current) {
            return parseInt(sum, 10) + parseInt(current, 10);
        }, 0);

        const phoneArr = phone.split('');
        let format;
        if (phoneArr[0] === '+'
            && phoneArr[1] === '7'
            && phoneArr[2] === '('
            && phoneArr[6] === ')'
            && phoneArr[10] === '-'
            && phoneArr[13] === '-') {

            format = true;
        } else {
            format = false;
        }
        let allNumeric = true;
        const indexesNumeric = [3, 4, 5, 7, 8, 9, 11, 12, 14, 15];

        indexesNumeric.forEach(item => {
            if (isNaN(phoneArr[item])) {
                allNumeric = false;
            }
        });

        return (resultSum <= 30 && format && allNumeric && phone.length === 16);
    }

    validateEmail (email) {
        let mailName = email.split('@')[0];
        let mailDomen = email.split('@')[1];

        let resultName = mailName.length ? true: false;
        // TODO switch
        let resultDomen = mailDomen === 'ya.ru' || mailDomen === 'yandex.ru' || mailDomen === 'yandex.ua' || mailDomen === 'yandex.by' || mailDomen === 'yandex.kz' || mailDomen === 'yandex.com';
        return (resultDomen && resultName);
    }
}

function unitTest(func, res, name){
    if (func === res) {
        console.log('%c success ' + name, 'color: green');
    } else {
        console.log('%c failed ' + name, 'color: red');
    }
}

class API {
    sendForm (form, submitBtn, resultNode) {
        const formAction = form.getAttribute('action');

        const formData = MyForm.getData();

        fetch('/rest/' + formAction + '?fio=' + encodeURIComponent(formData.fio) + '&email=' + encodeURIComponent(formData.email) + '&phone=' + encodeURIComponent(formData.phone))
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

        if (!validate.validateFio(data.fio)) {
            resultValid.errorFields.push('fio');
        }
        if (!validate.validatePhone(data.phone)) {
            resultValid.errorFields.push('phone');
        }
        if (!validate.validateEmail(data.email)) {
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

    // ----- фио ------

/*    unitTest(validate.validateFio('  Иванов Иван    Иванович '), true, `validate.validateFio('  Иванов Иван    Иванович ')`);
    unitTest(validate.validateFio('  Иванов Иван    Иванович Иванович'), false, `validate.validateFio('  Иванов Иван    Иванович Иванович')`);
    unitTest(validate.validateFio(''), false, `validate.validateFio('')`);
    unitTest(validate.validateFio(' '), false, `validate.validateFio(' ')`);
    unitTest(validate.validateFio('+ 209 ---'), false, `validate.validateFio('+ 209 ---')`);
    unitTest(validate.validateFio('123 123 123'), false, `validate.validateFio('123 123 123')`);
    unitTest(validate.validateFio('+ ++ +'), false, `validate.validateFio('+ ++ +')`);
    unitTest(validate.validateFio('- - -'), false, `validate.validateFio('- - -')`);*/

    // ----- неверный телефон ------

    unitTest(validate.validatePhone('+7(111)111-11-11'), true, `validate.validatePhone('+7(111)111-11-11')`);
    unitTest(validate.validatePhone('+71111111111'), false, `validate.validatePhone('+71111111111')`);
    unitTest(validate.validatePhone('kasj kasjd kjd'), false, `validate.validatePhone('kasj kasjd kjd')`);
    unitTest(validate.validatePhone('+7(11-)+$#-11-11'), false, `validate.validatePhone('+7(11-)+$#-11-11')`);
    unitTest(validate.validatePhone(''), false, `validate.validatePhone('')`);
    unitTest(validate.validatePhone(' '), false, `validate.validatePhone(' ')`);
    unitTest(validate.validatePhone('999999999'), false, `validate.validatePhone('999999999')`);
    unitTest(validate.validatePhone('+71111111111111'), false, `validate.validatePhone('+71111111111111')`);
    unitTest(validate.validatePhone('+7111'), false, `validate.validatePhone('+7111')`);
    unitTest(validate.validatePhone('+7(111)111-11-11--'), false, `validate.validatePhone('+7(111)111-11-11--')`);


    // ----- неверный email ------

/*    unitTest(validate.validateEmail('mail@ya.ru'), true, `validate.validateEmail('mail@ya.ru')`);
    unitTest(validate.validateEmail('привет@ya.ru'), true, `validate.validateEmail('привет@ya.ru')`);
    unitTest(validate.validateEmail('mail@@ya.ru'), false, `validate.validateEmail('mail@@ya.ru')`);
    unitTest(validate.validateEmail('mail@ya@.ru'), false, `validate.validateEmail('mail@ya@.ru')`);
    unitTest(validate.validateEmail('+mail@ya.ru'), false, `validate.validateEmail('+mail@ya.ru')`);// TODO !!!
    unitTest(validate.validateEmail(' mail@ya.ru'), false, `validate.validateEmail(' mail@ya.ru')`);// TODO !!!
    unitTest(validate.validateEmail(''), false, `validate.validateEmail('')`);
    unitTest(validate.validateEmail(' '), false, `validate.validateEmail(' ')`);
    unitTest(validate.validateEmail('mail@ya.ru.'), false, `validate.validateEmail('mail@ya.ru.')`);
    unitTest(validate.validateEmail('mail@ya .ru.'), false, `validate.validateEmail('mail@ya .ru.')`);
    unitTest(validate.validateEmail('mail@ya. ru.'), false, `validate.validateEmail('mail@ya. ru.')`);
    unitTest(validate.validateEmail('mailya.ru'), false, `validate.validateEmail('mailya.ru')`);
    unitTest(validate.validateEmail('mail@yammy.ru'), false, `validate.validateEmail('mail@yammy.ru')`);
    unitTest(validate.validateEmail('@ya.ru'), false, `validate.validateEmail('@ya.ru')`);*/


    MyForm.setData({fio: 'Иванов Иван Иванович', phone: '+7(111)111-11-11', email: 'ggg@ya.ru'});

    let form = helper.getElem('#myForm');
    form.addEventListener('submit', (e) => {

        e.preventDefault();
        helper.clear();
        MyForm.submit();
    });
});

'use strict';

let MyForm = {
    validate: () => {

    },
    getData: () => {
        let form = document.getElementById('myForm');
        let attrAction = form.getAttribute('action');
        let data = {};

        form.addEventListener('submit', (e) => {
           e.preventDefault();
        });

        fetch('/rest/' + attrAction)
            .then((resp) => {
                return resp.text();
            })
            .then((text) => {
                // console.log(text);
            })
            .catch();

        return data;
    },
    setData: (Object) => {
        let fio = document.getElementsByName('fio')[0].value;
        console.log('qqq', fio);
        return;
    },
    submit: () => {
        return;
    }
};

document.addEventListener('DOMContentLoaded', () => {
    MyForm.getData();
    MyForm.setData();
});

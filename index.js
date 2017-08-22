'use strict';

let MyForm = {
    validate: () => {

    },
    getData: () => {
        let form = document.getElementById('myForm');
        let attrAction = form.getAttribute('action');
        let data;

        form.addEventListener('submit', (e) => {
           e.preventDefault();
        });

        var xhr = new XMLHttpRequest();
        xhr.open('GET', '/rest/' + attrAction, false);
        xhr.send();

        if (xhr.status != 200) {
            console.log(xhr.status + ': ' + xhr.statusText);
        } else {
            data.fio = xhr.responseText.fio;
            data.email = xhr.responseText.email;
            data.phone = xhr.responseText.phone;
        }

        /*fetch('/rest/' + attrAction)
            .then((resp) => {
                data.fio = resp.fio;
                data.email = resp.email;
                data.phone = resp.phone;
            })
            .catch();*/

        return data;
    },
    setData: (Object) => {
        return;
    },
    submit: () => {
        return;
    }
};

document.addEventListener('DOMContentLoaded', () => {
    MyForm.getData();
});

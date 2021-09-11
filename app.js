// // let res = null;

// function render(data, id) {
//     // let output = document.getElementById("output");
//     let source = document.getElementById(id).innerHTML;
//     let template = Handlebars.compile(source);
//     let html = template(data);
//     // let html = "";
//     // for (i = 0; i < data.length; i++) {
//     //     html += "<div class='bg-danger mt-2 p-3 text-white rounded'>";
//     //     html += "<span>" + data[i].id + "</span>";
//     //     html += "<span> name:" + data[i].username + "</span>";
//     //     html += "<span> count:" + data[i].count + "</span>";
//     //     html += "<span> confirm:" + data[i].confirmation + "</span>";
//     //     html += "</div>";
//     // }
//     // output.innerHTML =  html;
//     return html;
// }

// function loadJson(m, u, callback) {
//     let xhr = new XMLHttpRequest;
//     xhr.open(m, u);
//     xhr.onreadystatechange = function() {
//         if (xhr.readyState == 4 && xhr.status == 200) {
//             // res = JSON.parse(xhr.response);
//             // callback(res);
//             callback(JSON.parse(xhr.response))
//         }
//     }
//     xhr.send();
// }
// loadJson("GET", "https://my-json-server.typicode.com/Amirhossein-2020/fake-jasons/users", function(r) {
//         document.getElementById("output").innerHTML = render(r, "user-template");
//     })
//     // loadJson("GET", "https://jsonplaceholder.typicode.com/users", function(r){
//     //     console.error(r);
//     // })

// // console.log(Handlebars);

// // let data = { name: "amir" };
// // let soursce = document.getElementById("users-template").innerHTML;
// // let template = Handlebars.compile(soursce);
// // console.log(template(data));
// let a = 10;
// try {
//     if (a < 15) {
//         throw 'error its too low';
//     }
// } catch (error) {
//     console.error(error);
// } finally {
//     console.error('mamad');
// }

let search = document.getElementById("search");
let select = document.getElementById("type");
let clear = document.getElementById("delete");
let form = document.querySelector('form[data-name="add-edit"]');
let errorText = document.querySelector('span[id="error"]');
let res = null;

function render(data, id) {
    let source = document.getElementById(id).innerHTML;
    let template = Handlebars.compile(source);
    let html = template(data);
    return html;
}



function loadJson(m, u, d, callback) {
    let xhr = new XMLHttpRequest;
    xhr.open(m, u);
    xhr.onreadystatechange = function() {
        if (xhr.readyState == 4 && xhr.status == 200) {
            res = JSON.parse(xhr.response);
            callback(res);
        } else if (xhr.readyState == 4 && xhr.status == 201) {
            callback();
            form.elements.sub.classList.remove("disabled");
        }
    }
    xhr.send(d);
}

function finder(input, selected, output) {
    switch (selected) {
        case "conf":
            for (var i in res) {
                if (res[i].username.toLowerCase().includes(input) && res[i].confirmation) {
                    output.push(res[i]);
                }
            }
            break;
        case "notConf":
            for (var i in res) {
                if (res[i].username.toLowerCase().includes(input) && !res[i].confirmation) {
                    output.push(res[i]);
                }
            }
            break;
        default:
            for (var i in res) {
                if (res[i].username.toLowerCase().includes(input)) {
                    output.push(res[i]);
                }
            }
    }
}

function eventHandler() {
    let result = [];
    finder(search.value, select.value, result);
    document.getElementById("output").innerHTML = render(result, "user-template");
}

function formValidation(d) {
    // if (!d.username) {
    //     document.querySelector('input[name="name"]').classList.add('error');
    //     return false;
    // } else if (!d.count || d.count <= 0) {
    //     document.querySelector('input[name="count"]').classList.add('error');
    //     return false;
    // } else {
    //     return true;
    // }
    try {
        if (!d.username) {
            document.querySelector('input[name="name"]').classList.add('error');
            throw ('Please enter a Name');
        } else if (!d.count || d.count <= 0) {
            document.querySelector('input[name="count"]').classList.add('error');
            throw ('Please enter a valid Number');
        } else if (d.count == res[res.length - 1].count && d.username == res[res.length - 1].username) {
            throw ('Please Do Not Create Repetetive Data');
        } else {
            form.elements.sub.classList.add("disabled");
            return true;
        }
    } catch (error) {
        errorText.innerHTML = '<i class="bi bi-exclamation-triangle-fill"></i> ' + error;
        return false;
    }
}

loadJson("GET", "https://my-json-server.typicode.com/Amirhossein-2020/fake-jasons/users", null, function(r) {
    document.getElementById("output").innerHTML = render(r, "user-template");
})

// search.addEventListener('keyup', function() {
//     // let value = this.value;
//     // let type = select.value;
//     let result = [];
//     finder(search.value, select.value, result);
//     document.getElementById("output").innerHTML = render(result, "user-template");
// })

// select.addEventListener('change', function() {
//     let result = [];
//     finder(search.value, select.value, result);
//     document.getElementById("output").innerHTML = render(result, "user-template");
// })

search.addEventListener('keyup', eventHandler);
select.addEventListener('change', eventHandler);
// clear.addEventListener('click', function() {
//     res = [];
//     loadJson
// })
form.addEventListener('submit', function() {
    event.preventDefault();
    errorText.innerHTML = "";
    document.querySelectorAll('.error').forEach(function(el) {
        el.classList.remove('error');
    });
    // let name = this.children[0].children[1].value;
    // let count = this.children[1].children[1].value;
    // let confirmed = this.children[2].children[0].checked;
    // console.log(name, count, confirmed);
    let data = {
        "id": res.length,
        "username": this.elements.name.value,
        "count": this.elements.count.value,
        "confirmation": this.elements.confirmation.checked
    };
    // console.log(data)
    if (formValidation(data)) {
        loadJson("POST", "https://my-json-server.typicode.com/Amirhossein-2020/fake-jasons/users", JSON.stringify(data), function(r) {
            res.push(data);
            document.getElementById("output").innerHTML = render(res, "user-template");
        })
    }
})
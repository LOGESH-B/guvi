

//checking session
// var cookie_email = getCookie("username");
var cookie_email = localStorage.getItem("username");;
console.log(cookie_email);
if (cookie_email != null) {
    location.href = "/guvi/profile.html";
}

//login fnc

$('#login').on('click', () => {
    var email = $('#email').val();
    var password = $('#password').val();

    var formdata = {
        email: email,
        password: password,
        login: true
    }

    alert(`${email} ${password}`);

    //Ajax call
    $.ajax({
        type: "POST",
        url: "/guvi/php/login.php",
        data: formdata,

        success: (response) => {
            var res = jQuery.parseJSON(response);
            alert(res.status);
            if (res.status == 200) {
                alert(res.message);
                console.log(res.user);
                var expires = (new Date(Date.now() + 1000 * 86400)).toUTCString();
                localStorage.setItem("username", email);
                // document.cookie = "username=" + res.user.email + ";expires=" + expires + ";path=/;";
                location.href = "/guvi/profile.html"
            } else if (res.status == 500) {
                alert(res.message);
            } else if (res.status == 202) {
                alert(res.message);
            } else if (res.status == 401) {
                alert(res.password);
            }
            else {
                alert(res.password);
            }
        }
    })

})

//fun to parse BrowserCookie

// const getCookie = (cname) => {
//     let name = cname + "=";
//     let decodedCookie = decodeURIComponent(document.cookie);
//     let ca = decodedCookie.split(';');
//     for (let i = 0; i < ca.length; i++) {
//         let c = ca[i];
//         while (c.charAt(0) == ' ') {
//             c = c.substring(1);
//         }
//         if (c.indexOf(name) == 0) {
//             return c.substring(name.length, c.length);
//         }
//     }
//     return "";
// }
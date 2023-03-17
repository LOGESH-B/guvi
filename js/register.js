
//session check
// var cookie_email = getCookie("username");
var cookie_email = localStorage.getItem("username");
console.log(cookie_email);
if (cookie_email != null) {
    location.href = "/guvi/profile.html";
}


//register
$('#register').on('click', () => {

    var email = $('#email').val();
    var password = $('#password').val();
    var cpass = $('#c_password').val();
    var name = $('#name').val();
    var dob = $('#dob').val();
    var address = $('#address').val();
    var pincode = $('#pincode').val();
    var p_num = $('#p_num').val();

    var form_data = {
        email: email,
        password: password,
        dob: dob,
        name: name,
        address: address,
        pincode: pincode,
        p_num: p_num,
        register: true
    }
    if(password!=cpass){
        console.log("Password != Confirm password");
        return;
        // location.href='/guvi/login.html'
    }

    alert(form_data);
    console.log(form_data)

    $.ajax({
        type: "POST",
        url: "/guvi/php/register.php",
        data: form_data,

        success: (response) => {
            console.log(response)
            var res = jQuery.parseJSON(response);
            console.log("sql post req:" + res.status);
            if (res.status == 200) {
                console.log("sql res:" + res.message);
                alert("sql res:" + res.message);
                var expires = (new Date(Date.now() + 1000 * 86400)).toUTCString();
                localStorage.setItem("username",email);
                // document.cookie = "username=" + email + ";expires=" + expires + ";path=/;";
                location.href = "/guvi/profile.html"
            } else if (res.status == 500) {
                console.log("sql res:" + res.message);
                alert("sql res:" + res.message);
                return;
            } else if (res.status == 202) {
                console.log("sql res:" + res.message);
                alert("sql res:" + res.message);
                return;
            }
            else {
                console.log("sql res:" + res.message);
                alert("sql res:" + res.message);
                return;
            }
        }
    })

})


// code done to seperate sql and mongodb call
    //     alert("On Mongo")
    //     $.ajax({
    //         type: "POST",
    //         url: "/guvi/php/register.php",
    //         data: form_data_mongo,

    //         success: (response) => {
    //             var res = jQuery.parseJSON(response);
    //             console.log("Mongo post req:" + res.status);
    //             if (res.status == 200) {
    //                 console.log("mongo res:" + res.message);
    //                 alert("mongo res:" + res.message);
    //                 var expires = (new Date(Date.now() + 1000 * 86400)).toUTCString();
    //                 // localStorage.setItem("username",res.user.email);
    //                 document.cookie = "username=" + email + ";expires=" + expires + ";path=/;";
    //                 location.href = "/guvi/profile.html"
    //             } else if (res.status == 500) {
    //                 console.log("mongo res:" + res.message);
    //                 alert("mongo res:" + res.message);
    //             } else if (res.status == 202) {
    //                 console.log("mongo res:" + res.message);
    //                 alert("mongo res:" + res.message);
    //             }
    //             else {
    //                 console.log("mongo res:" + res.message);
    //                 alert("mongo res:" + res.message);
    //             }
    //         }
    //     })


    
//parse cookie function
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
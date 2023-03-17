
var data = jQuery.parseJSON (localStorage.getItem("user"));
console.log(data);
$('#email').val(data.email)
$('#name').val(data.name)
$('#dob').val(data.dob)
$('#address').val(data.address)
$('#pincode').val(data.pincode)
$('#p_num').val(data.p_num)


//parse cookie function
const getCookie = (cname) => {
    let name = cname + "=";
    let decodedCookie = decodeURIComponent(document.cookie);
    let ca = decodedCookie.split(';');
    for (let i = 0; i < ca.length; i++) {
        let c = ca[i];
        while (c.charAt(0) == ' ') {
            c = c.substring(1);
        }
        if (c.indexOf(name) == 0) {
            return c.substring(name.length, c.length);
        }
    }
    return "";
}

$("#update").on('click', () => {
    var cookie_email = getCookie("username");
    if (cookie_email == "") {
        location.href = "/guvi/login.html";
        return;
    }
    var email = $('#email').val();
    var name = $('#name').val();
    var dob = $('#dob').val();
    var address = $('#address').val();
    var pincode = $('#pincode').val();
    var p_num = $('#p_num').val();

    var form_data = {
        email: email,
        dob: dob,
        name: name,
        address: address,
        pincode: pincode,
        p_num: p_num,
        oldemail: cookie_email,
        update: true
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
                // localStorage.setItem("username",res.user.email);
                document.cookie = "username=" + email + ";expires=" + expires + ";path=/;";
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
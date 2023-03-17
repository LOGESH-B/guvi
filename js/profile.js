
var gdata;
$("#logout").on('click',()=>{
    // document.cookie = "username=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;";
    var email=localStorage.getItem("username");
    localStorage.removeItem("username");
    var logout_data={
        logout:true,
        email:email
    }
    $.ajax({
        type: "POST",
        url: "/guvi/php/profile.php",
        data: logout_data,

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
    location.href = "/guvi/login.html";
})

$("#update").on('click',()=>{
    $("#update").css("display","none");
    $("#save").css("display","block");
    console.log("clicked")
    $("#content").html(`    <div class="table-responsive">  <table class="table  table-striped table-hover">
            <tbody>
                <tr>
                    <td class="fw-bold">Name</td>
                    <td><input type="text" class="form-control" name="name" value="${gdata.name}" id="name" placeholder="Enter your Name"> </td>
                </tr>
                <tr>
                    <td class="fw-bold">Email</td>
                    <td><input type="email" class="form-control" name="email" id="email" value="${gdata.email}" placeholder="Enter your Email"></td>
                </tr>
                <tr>
                    <td class="fw-bold">Phone number</td>
                    <td><input type="number" class="form-control" name="p_num" id="p_num" value="${gdata.p_num}" placeholder="Enter Phone Number"></td>
                </tr>
                <tr>
                    <td class="fw-bold">DOB</td>
                    <td><input type="date" name="dob" class="form-control" id="dob" value="${gdata.dob}" placeholder="Enter your DOB"></td>
                </tr>
                <tr>
                    <td class="fw-bold">Address</td>
                    <td><textarea name="address" class="form-control" id="address"  placeholder="Enter your Address">${gdata.address}</textarea></td>
                </tr>
                <tr>
                    <td class="fw-bold">Pincode</td>
                    <td><input type="text" class="form-control" name="pincode" value="${gdata.pincode}" id="pincode" placeholder="Enter your Pincode"></td>
                </tr>
            </tbody>

        </table></div>`);
})

$("#save").on('click',()=>{
    console.log("clicked save")
    // var cookie_email = getCookie("username");
    var cookie_email = localStorage.getItem("username");
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
                localStorage.removeItem(cookie_email);
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

$(document).ready(() => {
    var email=localStorage.getItem("username");
    // var email = getCookie("username");
    var data;
    console.log(email);
    if (email == null) {
        location.href = "/guvi/login.html";
    } else {
        var formdata = {
            profile: true,
            email: email
        }
        $.ajax({
            type: "POST",
            url: "/guvi/php/profile.php",
            data: formdata,
            success: (response) => {
                console.log(response);
                var res = jQuery.parseJSON(response);
                // alert(res.status);
                if (res.status == 200) {
                    // alert(res.message);
                    // console.log(res);
                    data=res.user;
                    gdata=res.user;
                    // localStorage.setItem("user",JSON.stringify(data));
                    setdata(data);
                 } else if (res.status == 500) {
                    alert(res.message);
                } else if (res.status == 202) {
                    alert(res.message);
                } else if (res.status == 401) {
                    alert(res.password);
                }
                else if (res.status == 404) {
                    location.href = "/guvi/login.html";
                }
                else {
                    alert(res.password);
                }
            }
        })

        const setdata=(data)=>{
            $("#content").html(`      <div class="table-responsive">  <table class="table  table-striped table-hover">
            <tbody>
                <tr>
                    <td class="fw-bold">Name</td>
                    <td>${data.name}</td>
                </tr>
                <tr>
                    <td class="fw-bold">Email</td>
                    <td>${data.email}</td>
                </tr>
                <tr>
                    <td class="fw-bold">Phone number</td>
                    <td>${data.p_num}</td>
                </tr>
                <tr>
                    <td class="fw-bold">DOB</td>
                    <td>${data.dob}</td>
                </tr>
                <tr>
                    <td class="fw-bold">Address</td>
                    <td>${data.address}</td>
                </tr>
                <tr>
                    <td class="fw-bold">Pincode</td>
                    <td>${data.pincode}</td>
                </tr>
            </tbody>

        </table>
        </div>`);
        }   
        
    }


})


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
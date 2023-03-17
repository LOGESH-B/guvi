<?php
require_once __DIR__ . '/../vendor/autoload.php';


$redis = new Redis();
$redis->connect("localhost",6379);

$con = new mysqli("localhost", "root", "");

if ($con->connect_error) {
    die("Connection failed: " . $con->connect_error);
}
$client = new MongoDB\Client('mongodb+srv://guvi:guvi@cluster0.iocqv1o.mongodb.net/?retryWrites=true&w=majority');

$users = $client->selectCollection('GUVI', 'userdetails');
mysqli_select_db($con, "phpdev");



if (isset($_POST['register'])) {
    try {
        $email = mysqli_real_escape_string($con, $_POST['email']);
        $password = mysqli_real_escape_string($con, $_POST['password']);
        $encpass = password_hash($password, PASSWORD_BCRYPT);

        $address = htmlspecialchars($_POST['address']);
        $dob = htmlspecialchars($_POST['dob']);
        $pincode = htmlspecialchars($_POST['pincode']);
        $p_num = htmlspecialchars($_POST['p_num']);
        $name = htmlspecialchars($_POST['name']);
        if ($email == NULL || $address == NULL || $pincode == NULL || $p_num == NULL || $dob == NULL || $name==NULL) {
            $res = [
                'status' => 422,
                'message' => 'All fields are mandatory'
            ];
            echo json_encode($res);
            die;
            return;
        }

        $query = "INSERT  INTO account (email,password) VALUES ('$email','$encpass')";
        $query_run = mysqli_query($con, $query);
        $insert_data=[
            'email' => $email,
            'address' => $address,
            'dob' => $dob,
            'pincode' => $pincode,
            'p_num' => $p_num,
            'name'=>$name
        ];
        if ($query_run) {
            $insertOneResult = $users->insertOne([
                'email' => $email,
                'address' => $address,
                'dob' => $dob,
                'pincode' => $pincode,
                'p_num' => $p_num,
                'name'=>$name
            ]);
            if ($insertOneResult->getInsertedCount() == 1) {
                    $redis->set($email, json_encode($insert_data));
                    $redis->expire($email, 86400);
                    $res = [
                        "message" => "Success mongo",
                        "status" => 200,
                        "user" => $insert_data
                    ];

                    echo json_encode($res);
                    return;
            } else {
                $res = [
                    "message" => "Mongo:Something Went Wrong",
                    "status" => 404,

                ];
                echo json_encode($res);
                die;
                return;
            }
        } else {
            $res = [
                "message" => "SQl:Something Went Wrong",
                "status" => 404,

            ];
            echo json_encode($res);
            die;
            return;
        }
    } catch (Exception $e) {
        $res = [
            "message" => "Server Error|" . $e->getMessage(),
            "status" => 500,
        ];
        echo json_encode($res);
        die;
        return;
    }
} else {
    try {
        $email = mysqli_real_escape_string($con, $_POST['email']);

        $address = htmlspecialchars($_POST['address']);
        $name = htmlspecialchars($_POST['name']);
        $dob = htmlspecialchars($_POST['dob']);
        $pincode = htmlspecialchars($_POST['pincode']);
        $p_num = htmlspecialchars($_POST['p_num']);
        $old_email = htmlspecialchars($_POST['oldemail']);
        if ($email == NULL || $address == NULL || $pincode == NULL || $p_num == NULL || $dob == NULL) {
            $res = [
                'status' => 422,
                'message' => 'All fields are mandatory'
            ];
            echo json_encode($res);
            die;
            return;
        }


        $query = "UPDATE account SET email='$email' WHERE email='$old_email'";
        $query_run = mysqli_query($con, $query);
        $redis->delete($old_email);
        $insert_data=[
            'email' => $email,
            'address' => $address,
            'dob' => $dob,
            'pincode' => $pincode,
            'p_num' => $p_num,
            'name'=>$name
        ];
        if ($query_run) {
            $updatedOneResult = $users->updateOne(
                ['email' =>  $old_email],
                ['$set' => [
                    'email' => $email,
                    'address' => $address,
                    'dob' => $dob,
                    'pincode' => $pincode,
                    'p_num' => $p_num,
                    'name' => $name
                ]]
            );
            if ($updatedOneResult->getMatchedCount() == 1) {
                $redis->set($email,json_encode($insert_data));
                $res = [
                    "message" => "Success",
                    "status" => 200,
                    "email" => $email
                ];
                echo json_encode($res);
                die;
                return;
            } else {
                $res = [
                    "message" => "Mongo:Something Went Wrong",
                    "status" => 404,

                ];
                echo json_encode($res);
                die;
                return;
            }
        } else {
            $res = [
                "message" => "Mongo:Something Went Wrong",
                "status" => 404,

            ];
            echo json_encode($res);
            die;
            return;
        }
    } catch (Exception $e) {
        $res = [
            "message" => "Server Error|" . $e->getMessage(),
            "status" => 500,
        ];
        echo json_encode($res);
        die;
        return;
    }
}



// if (isset($_POST['register_mongo'])) {
//     try {



//         if ($email == NULL || $address == NULL || $pincode == NULL || $p_num == NULL || $dob == NULL) {
//             $res = [
//                 'status' => 422,
//                 'message' => 'All fields are mandatory'
//             ];
//             echo json_encode($res);
//             die;
//             return;
//         }
//     } catch (Exception $e) {
//         $res = [
//             "message" => "Server Error|" + $e->getMessage(),
//             "status" => 500,
//         ];
//         echo json_encode($res);
//         die;
//         return;
//     }
// }

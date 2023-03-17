<?php
//import
require_once __DIR__ . '/../vendor/autoload.php';

//sql init
$con = new mysqli("localhost", "root", "");
if ($con->connect_error) {
    die("Connection failed: " . $con->connect_error);
}
mysqli_select_db($con, "phpdev");


//redis init
$redis = new Redis();
$redis->connect("localhost", 6379);


//login route
if (isset($_POST['login'])) {
    try {
        $email = mysqli_real_escape_string($con, $_POST['email']);
        $password = mysqli_real_escape_string($con, $_POST['password']);
        if ($password == NULL || $email == NULL) {
            $res = [
                'status' => 422,
                'message' => 'All fields are mandatory'
            ];
            echo json_encode($res);
            return;
        }

        $query = "SELECT * FROM account WHERE email='$email'";
        $query_run = mysqli_query($con, $query);
        $result = mysqli_fetch_assoc($query_run);
        $encpass = $result['password'];
        if (mysqli_num_rows($query_run) == 1) {

            //verifying the password
            if (password_verify($password, $encpass)) {
                //mongo db init
                $client = new MongoDB\Client('mongodb+srv://guvi:guvi@cluster0.iocqv1o.mongodb.net/?retryWrites=true&w=majority');
                if ($client) {
                    $users = $client->selectCollection('GUVI', 'userdetails');
                    $document = $users->findOne(['email' => htmlspecialchars($_POST['email'])]);
                    $redis->set($email, json_encode($document));
                    $redis->expire($email, 86400);
                    $res = [
                        "message" => "Success mongo",
                        "status" => 200,
                        "user" => $document
                    ];

                    echo json_encode($res);
                    return;
                } else {
                    $res = [
                        "message" => "Server Error",
                        "status" => 500
                    ];
                    echo json_encode($res);
                    return;
                }
            } else {
                $res = [
                    "message" => "Wrong Password",
                    "status" => 401,
                    "password" => $password
                ];
                echo json_encode($res);
                die;
                return;
            }
        } else {
            $res = [
                "message" => "User Not Found",
                "status" => 404,
            ];
            echo json_encode($res);
            die;
            return;
        }
    } catch (Exception $e) {
        $res = [
            "message" => "Server Error|" + $e->getMessage(),
            "status" => 500,
        ];
        echo json_encode($res);
        die;
        return;
    }
}

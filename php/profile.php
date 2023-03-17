

<?php

// require '/xampp/vendor/autoload.php';
require_once __DIR__.'/../vendor/autoload.php';

$redis = new Redis();
$redis->connect("localhost",6379);

if (isset($_POST['profile'])) {
    $email = htmlspecialchars($_POST['email']);
    $data=$redis->get($email);
    if($data){
        $res = [
            "message" => "Success Redis",
            "status" => 200,
            "user" => json_decode($data)

        ];
        echo json_encode($res);
        return;
    }else{
        $res = [
            "message" => "No session found on redis",
            "status" => 404,
            "user" => json_decode($data)
        ];
        echo json_encode($res);
        return;
    }
    
}
if (isset($_POST['logout'])) {
    $email = htmlspecialchars($_POST['email']);
    $data=$redis->delete($email);
    $res = [
        "message" => "Deleted Redis",
        "status" => 200,
        "user" => json_decode($data)

    ];
    echo json_encode($res);
    return;
}
<?php

error_reporting(-1); // reports all errors
ini_set("display_errors", "1"); // shows all errors
ini_set("log_errors", 1);
ini_set("error_log", "/tmp/php-error.log");

header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Headers: access");
header("Access-Control-Allow-Methods: POST,OPTIONS");
header("Content-Type: application/json; charset=UTF-8");
header("Access-Control-Allow-Headers: Content-Type, Access-Control-Allow-Headers, Authorization, X-Requested-With,origin");

require 'db_connection.php';

require  "./vendor/autoload.php";

use \Firebase\JWT\JWT;

// if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {    
//     return 0;    
// } 

$data = json_decode(file_get_contents("php://input"));//Converting JSON string to object

if (
    isset($data->email) //variables from frontend should not be empty and should be declared
    && isset($data->password)
    && isset($data->role)
    && !empty(trim($data->email))
    && !empty(trim($data->password))
    && !empty(trim($data->role))

) {

$email = mysqli_real_escape_string($conn, trim($data->email));
$password = mysqli_real_escape_string($conn, trim($data->password));
$password_hash = password_hash($password, PASSWORD_BCRYPT);
$role = mysqli_real_escape_string($conn, trim($data->role));

$insertUser = mysqli_query($conn,"INSERT INTO `users`(`email`,`password`,`role`) VALUES('$email','$password_hash','$role')");
if($insertUser){
    $last_id = mysqli_insert_id($conn);
    $getInsertedUser = mysqli_query($conn,"SELECT `id`,`email`,`password`,`role` FROM `users` WHERE `id` = '$last_id'");
    $get_user = mysqli_fetch_all($getInsertedUser,MYSQLI_ASSOC);
    
    $secret_key = "YOUR_SECRET_KEY";
    $issuer_claim = "THE_ISSUER"; // this can be the servername
    $audience_claim = "THE_AUDIENCE";
    $issuedat_claim = time(); // issued at
    $notbefore_claim = $issuedat_claim; //not before in seconds
    $expire_claim = $issuedat_claim + 3600; // expire time in seconds
    $token = array(
        "iss" => $issuer_claim,
        "aud" => $audience_claim,
        "iat" => $issuedat_claim,
        "nbf" => $notbefore_claim,
        "exp" => $expire_claim,
        "data" => array(
            "id" => $last_id,
            "email" => $get_user[0]['email']
    ));

    http_response_code(200);

    $jwt = JWT::encode($token, $secret_key);
    header("HTTP/1.1 200 OK");
    echo json_encode(
        array(
            "msg" => "User Logged In",
            "jwt" => $jwt,
            "email" => $get_user[0]['email'],
            "expireAt" => $expire_claim,
            "role" =>$get_user[0]['role'],
            "id" => $last_id
        ));
        return;
}
else{
    header("HTTP/1.1 403 Cannot Update");
    echo json_encode(["success"=>0,"msg"=>"User Not Created"]);
}
}

?>
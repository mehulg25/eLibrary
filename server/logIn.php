<?php

require  "./vendor/autoload.php";
use \Firebase\JWT\JWT;
require 'db_connection.php';

error_reporting(-1); // reports all errors
ini_set("display_errors", "1"); // shows all errors
ini_set("log_errors", 1);
ini_set("error_log", "/tmp/php-error.log");

header("Access-Control-Allow-Origin: *");
header("Content-Type: application/json; charset=UTF-8");
header("Access-Control-Allow-Methods: POST");
header("Access-Control-Max-Age: 3600");
header("Access-Control-Allow-Headers: Content-Type, Access-Control-Allow-Headers, Authorization, X-Requested-With");


$data = json_decode(file_get_contents("php://input"));

$email = $data->email;
$password = $data->password;

$getUser = mysqli_query($conn,"SELECT `id`,`email`,`password`,`role` FROM `users` WHERE `email` = '$email'");

if(mysqli_num_rows($getUser) > 0){
    $get_user = mysqli_fetch_all($getUser,MYSQLI_ASSOC); 
    $password_fromDB = $get_user[0]['password'];
    $id = $get_user[0]['id'];
    $role = $get_user[0]['role'];

    if(password_verify($password, $password_fromDB)) //Inbuilt function to check password and hashed pwd equality!
        {
            $secret_key = "YOUR_SECRET_KEY";
            $issuer_claim = "THE_ISSUER"; // this can be the servername
            $audience_claim = "THE_AUDIENCE";
            $issuedat_claim = time(); // issued at system current time
            $notbefore_claim = $issuedat_claim; //not before in seconds
            $expire_claim = $issuedat_claim + 3600; // expire time in seconds
            $token = array(
                "iss" => $issuer_claim,
                "aud" => $audience_claim,
                "iat" => $issuedat_claim,
                "nbf" => $notbefore_claim,
                "exp" => $expire_claim,
                "data" => array(
                    "id" => $id,
                    "email" => $email
            ));
    
            http_response_code(200);
    
            $jwt = JWT::encode($token, $secret_key);
            echo json_encode(
                array(
                    "msg" => "Successful login.",
                    "jwt" => $jwt,
                    "email" => $email,
                    "expireAt" => $expire_claim,
                    "role" => $role,
                    "id" => $id
                ));
                return;
        }
        else{
    
            http_response_code(401);
            echo json_encode(["msg" => "Invalid Credentials!"]);
        }
    }
else{
    http_response_code(404);
    echo json_encode(["msg"=>"No User Found"]);
}

?>



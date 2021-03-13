<?php

require  "./vendor/autoload.php";
use \Firebase\JWT\JWT;
require 'db_connection.php';

header("Access-Control-Allow-Origin: *");
header("Content-Type: application/json; charset=UTF-8");
header("Access-Control-Allow-Methods: POST");
header("Access-Control-Max-Age: 3600");
header("Access-Control-Allow-Headers: Content-Type, Access-Control-Allow-Headers, Authorization, X-Requested-With");


$email = '';
$password = '';

$data = json_decode(file_get_contents("php://input"));

$email = $data->email;
$password = $data->password;

$table_name = 'users';

$getUser = mysqli_query($conn,"SELECT `id`,`email`,`password`,`role` FROM `users` WHERE `email` = '$email'");
// echo $getUser;

if(mysqli_num_rows($getUser) > 0){
    $get_user = mysqli_fetch_all($getUser,MYSQLI_ASSOC); //fetches all result rows and returns the result-set as an associative array(id=0,name=sherlockholmes//key value pair), a numeric array, or both.
    $password_fromDB = $get_user[0]['password'];
    $id = $get_user[0]['id'];
    $role = $get_user[0]['role'];

    if(password_verify($password, $password_fromDB))
        {
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
                    "id" => $id,
                    "email" => $email
            ));
    
            http_response_code(200);
    
            $jwt = JWT::encode($token, $secret_key);
            echo json_encode(
                array(
                    "message" => "Successful login.",
                    "jwt" => $jwt,
                    "email" => $email,
                    "expireAt" => $expire_claim,
                    "role" => $role,
                    "id" => $id
                ));
        }
        else{
    
            http_response_code(401);
            echo json_encode(array("message" => "Login failed.", "password" => $password));
        }
    }
else{
    echo json_encode(["success"=>0]);
}

?>




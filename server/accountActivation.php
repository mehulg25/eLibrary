<?php
error_reporting(-1); // reports all errors
ini_set("display_errors", "1"); // shows all errors
ini_set("log_errors", 1);
ini_set("error_log", "/tmp/php-error.log");

header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Headers: access");
header("Access-Control-Allow-Methods: GET");
header("Content-Type: application/json; charset=UTF-8");
header("Access-Control-Allow-Headers: Content-Type, Access-Control-Allow-Headers, Authorization, X-Requested-With");

require  "./vendor/autoload.php";

use \Firebase\JWT\JWT;

require 'db_connection.php';
require 'conf.php';


    //keep it inside
    $email=$_GET['email'];
    $timestamp = $_GET['code'];


    $activateUser = mysqli_query($conn, "UPDATE `users` SET `isActivated`=1 WHERE `email`='$email'");

    $getInsertedUser = mysqli_query($conn, "SELECT `id`,`email`,`password`,`role` FROM `users` WHERE `email` = '$email'");
    $get_user = mysqli_fetch_all($getInsertedUser, MYSQLI_ASSOC); // assoc array bana diya using inbuilt function
    // ab front end pe JWT token bhejna hai to start the session. So now we will fetch the recently inserted data and generate a new JWT
    // all below fields are required for JWT and we just dont care
    $secret_key = "YOUR_SECRET_KEY";
    $issuer_claim = "THE_ISSUER"; // this can be the servername
    $audience_claim = "THE_AUDIENCE";
    $issuedat_claim = time(); // issued at
$notbefore_claim = $issuedat_claim; //not before in seconds
$expire_claim = $issuedat_claim + 3600; // expire time in seconds
$token = array( // boilerplate code for jwt
    "iss" => $issuer_claim,
    "aud" => $audience_claim,
    "iat" => $issuedat_claim,
    "nbf" => $notbefore_claim,
    "exp" => $expire_claim,
    "data" => array(
        "id" => $get_user[0]['id'],
        "email" => $get_user[0]['email'] // assoc array [0] index is needed. first object will be the result we want as unique id and we will get last created user that we want. here email is database ka email name
));

    $jwt = JWT::encode($token, $secret_key); // token ban gaya and now this is an inbuilt function
    header("HTTP/1.1 200 OK");
    echo json_encode( // sending data to front end that client will receieve in the response section.
    array(
        "msg" => "User Logged In",
        "jwt" => $jwt,
        "email" => $get_user[0]['email'],
        "expireAt" => $expire_claim, // can remove this line in future.
        "role" =>$get_user[0]['role'],
        "id" => $get_user[0]['id'],
        "currently_issued_bookid" => null,
        "isActivated" => 1
    ));
    // echo '<script type="text/JavaScript">localStorage.setItem("jwt",'.'$jwt'.');</script>';

    // header('Location: '.$client_url.'redirect/activateAccount');

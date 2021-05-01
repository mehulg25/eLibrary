<?php
//we are getting email,pass and role from client

// above 4 lines are for error reporting from stackoverflow as we are using vanilla php so our compiler is checking only for the compilation issue and not the run time error but through this we catch errors
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Headers: access");
header("Access-Control-Allow-Methods: POST,OPTIONS");
header("Content-Type: application/json; charset=UTF-8");
header("Access-Control-Allow-Headers: Content-Type, Access-Control-Allow-Headers, Authorization, X-Requested-With,origin");
// above 6 lines to avoid cors issue. localhost3000 se 8080 pe data transfer chal rha hai
use PHPMailer\PHPMailer\PHPMailer;
use PHPMailer\PHPMailer\SMTP;

require 'db_connection.php';
require 'conf.php';
require  "./vendor/autoload.php";

use \Firebase\JWT\JWT;

//autoload is to use external libraries like JWT. Composer is php ka npm i ek tareeke se. line 16and18 tells that we are using and allowing third party libraries.
//JWT=JSON Web Token -> using as this can act as a single data entity. Authentication and everything about user is here. One single token and is secure too.Sort of Encapsulation of data
// We are using JWT for Sessions.
$data = json_decode(file_get_contents("php://input"));//Converting JSON string to object that we get from client. $data contains everything that we are sending from client with post request.

if (
    isset($data->email) //variables from frontend should not be empty and should be declared
    && isset($data->password)
    // data->role is like data.role because object hai.
    && !empty(trim($data->email)) //variables from frontend should not be empty and should be declared
    && !empty(trim($data->password))
    //this is backend validation
) {
    $email = mysqli_real_escape_string($conn, trim($data->email));
    $password = mysqli_real_escape_string($conn, trim($data->password));
    $password_hash = password_hash($password, PASSWORD_BCRYPT); //inbuilt php function to encode the password
    
    //data object se humne php me variables me shift karlia hai and checking if there are any special or encoded characters or not.
    $updatePassword = mysqli_query($conn, "UPDATE `users` SET `password`='$password_hash'");
    // query ke baad true false value milegi
    if ($updatePassword) {
        header("HTTP/1.1 200 OK");
        echo json_encode(["msg"=>"Password Successfully Reset!"]);
    } else {
        header("HTTP/1.1 500 Some Error Occured");
        echo json_encode(["msg"=>"Some Error Occured"]);
    }
} else {
    header("HTTP/1.1 500 Some Error Occured");
    echo json_encode(["msg"=>"Please Fill All The Required Fields!"]);
}

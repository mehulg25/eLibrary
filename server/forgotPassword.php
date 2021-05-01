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

if (isset($data->email) && !empty(trim($data->email))) {
    $email = mysqli_real_escape_string($conn, trim($data->email));
    $checkUser = mysqli_query($conn, "SELECT count(*) FROM users WHERE `email`='$email'");
    $user_count_result = mysqli_fetch_all($checkUser, MYSQLI_ASSOC);
    $userCount = $user_count_result[0]['count(*)'];
    if ($userCount == 1) {
        //Send Activation Mail
        $mail = new PHPMailer;
        //smtp settings
                $mail->isSMTP(); // send as HTML
                $mail->Host = "smtp.gmail.com"; // SMTP servers
                $mail->SMTPAuth   = true;
        $mail->Username = $mailer_username; // Your mail
                $mail->Password = $mailer_password; // Your password mail
                $mail->Port = 587; //specify SMTP Port
                $mail->SMTPSecure = PHPMailer::ENCRYPTION_STARTTLS;
        ;
        $mail->setFrom('shaurya.mathur@abyeti.com');
        $mail->addAddress($email); // Your mail
        // $mail->addReplyTo($_POST['email'], $_POST['name']);
        // $mail->isHTML(true);
        $mail->Subject='E-Library | Account Password Reset';
        $code= mt_rand(100000, 999999);
        $message="OTP for Resetting Password : ".$code;
        $mail->Body = $message;
        $mail->send();
            
        header("HTTP/1.1 200 OK");
        echo json_encode(["otp"=>$code]);
    } else {
        header("HTTP/1.1 402 Some Error Occured");
        echo json_encode(["msg"=>"User Doesn't Exist"]); // will go on response
    }
} else {
    header("HTTP/1.1 401 Some Error Occured");
    echo json_encode(["msg"=>"Invalid Email ID"]); // will go on response
}

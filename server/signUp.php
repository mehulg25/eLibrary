<?php
//we are getting email,pass and role from client
error_reporting(-1); // reports all errors
ini_set("display_errors", "1"); // shows all errors
ini_set("log_errors", 1);
ini_set("error_log", "/tmp/php-error.log");
// above 4 lines are for error reporting from stackoverflow as we are using vanilla php so our compiler is checking only for the compilation issue and not the run time error but through this we catch errors
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Headers: access");
header("Access-Control-Allow-Methods: POST,OPTIONS");
header("Content-Type: application/json; charset=UTF-8");
header("Access-Control-Allow-Headers: Content-Type, Access-Control-Allow-Headers, Authorization, X-Requested-With,origin");
// above 6 lines to avoid cors issue. localhost3000 se 8080 pe data transfer chal rha hai
require 'db_connection.php';

require  "./vendor/autoload.php";

use \Firebase\JWT\JWT;

//autoload is to use external libraries like JWT. Composer is php ka npm i ek tareeke se. line 19and17 tells that we are using and allowing third party libraries.
//JWT=JSON Web Token -> using as this can act as a single data entity. Authentication and everything about user is here. One single token and is secure too.Sort of Encapsulation of data
// We are using JWT for Sessions.
$data = json_decode(file_get_contents("php://input"));//Converting JSON string to object that we get from client. $data contains everything that we are sending from client with post request.

if (
    isset($data->email) //variables from frontend should not be empty and should be declared
    && isset($data->password)
    && isset($data->role) // data->role is like data.role because object hai.
    && !empty(trim($data->email)) //variables from frontend should not be empty and should be declared
    && !empty(trim($data->password))
    && !empty(trim($data->role))
    //this is backend validation
) {
    $email = mysqli_real_escape_string($conn, trim($data->email));
    $password = mysqli_real_escape_string($conn, trim($data->password));
    $password_hash = password_hash($password, PASSWORD_BCRYPT);
    $role = mysqli_real_escape_string($conn, trim($data->role));
    //data object se humne php me variables me shift karlia hai and checking if there are any special or encoded characters or not.
    $insertUser = mysqli_query($conn, "INSERT INTO `users`(`email`,`password`,`role`) VALUES('$email','$password_hash','$role')");
    // query ke baad true false value milegi
    if ($insertUser) {
        $last_id = mysqli_insert_id($conn); // primary auto gen id will get
        $getInsertedUser = mysqli_query($conn, "SELECT `id`,`email`,`password`,`role` FROM `users` WHERE `id` = '$last_id'");
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
            "id" => $last_id,
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
            "id" => $last_id
        ));
        return;
    } else {
        header("HTTP/1.1 500 Some Error Occured");
        echo json_encode(["msg"=>"User Not Created"]); // will go on response
    }
}

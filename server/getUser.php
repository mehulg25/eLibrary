<?php
error_reporting(-1); // reports all errors
ini_set("display_errors", "1"); // shows all errors
ini_set("log_errors", 1);
ini_set("error_log", "/tmp/php-error.log");
require  "./vendor/autoload.php";

use \Firebase\JWT\JWT;

header("Access-Control-Allow-Origin: *");
header("Content-Type: application/json; charset=UTF-8");
header("Access-Control-Allow-Methods: GET,OPTIONS");
header("Access-Control-Max-Age: 3600");
header("Access-Control-Allow-Headers: Content-Type, Access-Control-Allow-Headers, Authorization, X-Requested-With,x-auth-token,origin");

require 'db_connection.php';
if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {    
    return 0;    
} 

$jwt = '';
$userId = '';
foreach(getallheaders() as $name=>$value){
    if($name == 'x-auth-token')
        $jwt = $value;
}

try{
    $secret_key = "YOUR_SECRET_KEY";
    $decoded = JWT::decode($jwt, $secret_key, array('HS256'));
    $userId = $decoded->data->id;
    
    if(!isset($userId) && empty(trim($userId))){
        header("HTTP/1.1 403 Forbidden");
        echo json_encode(["msg"=>"Unauthorised"]);
    }   
}catch(\Exception $e){
    header("HTTP/1.1 403 Forbidden");
    echo json_encode(["msg"=>"Unauthorised"]);
    return;

}

$user = mysqli_query($conn, "SELECT * FROM users where `id` = '$userId'"); //performs a query against a database. $conn is acquired from line 8
if (mysqli_num_rows($user) > 0) {
    $users = mysqli_fetch_all($user, MYSQLI_ASSOC); //fetches all result rows and returns the result-set as an associative array(id=0,name=sherlockholmes//key value pair), a numeric array, or both.
    header("HTTP/1.1 200 OK");
    echo json_encode(["user" => $users]); //all_books json encode send via echo. Book is key and all_books is value(in the response which is being sent)

} //doubt
else {
    header("HTTP/1.1 403 OK");
    echo json_encode(["msg" => "Access Denied!"]);
    return;
}
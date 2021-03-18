<?php
header("Access-Control-Allow-Origin: *"); 
header("Access-Control-Allow-Headers: access");
header("Access-Control-Allow-Methods: GET,OPTIONS");
header("Content-Type: application/json; charset=UTF-8");
header("Access-Control-Allow-Headers: Content-Type, Access-Control-Allow-Headers, Authorization, X-Requested-With,x-auth-token");


require  "./vendor/autoload.php";
use \Firebase\JWT\JWT;
require 'db_connection.php'; // type of import
if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {    
    return 0;    
} 

$jwt = '';
foreach(getallheaders() as $name=>$value){
    if($name == 'x-auth-token')
        $jwt = $value;
}

$secret_key = "YOUR_SECRET_KEY";
$decoded = JWT::decode($jwt, $secret_key, array('HS256'));
$userId = $decoded->data->id;

if(isset($userId) && is_numeric($userId)) {

    $allBooks = mysqli_query($conn,"SELECT * FROM `users_bookdata` WHERE `user_id` = '$userId'");
    if(mysqli_num_rows($allBooks) > 0){
        $all_books = mysqli_fetch_all($allBooks,MYSQLI_ASSOC);
        header("HTTP/1.1 200 OK");
        echo json_encode(["books"=>$all_books]);
    } 
    else{
        header("HTTP/1.1 404 Not Found!");
        echo json_encode(["msg"=>"No data for user exists"]);
    }
}else{
    header("HTTP/1.1 403 Forbidden");
    echo json_encode(["msg"=>"Unauthorised User"]);
}
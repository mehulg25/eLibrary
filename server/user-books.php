<?php


error_reporting(-1); // reports all errors
ini_set("display_errors", "1"); // shows all errors
ini_set("log_errors", 1);
ini_set("error_log", "/tmp/php-error.log");
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

// $actionType = $_GET['action'];
$jwt = '';
foreach(getallheaders() as $name=>$value){
    if($name == 'x-auth-token')
        $jwt = $value;
}

$secret_key = "YOUR_SECRET_KEY";

$decoded = JWT::decode($jwt, $secret_key, array('HS256'));
$userId = $decoded->data->id;

if(isset($userId) && is_numeric($userId)) {

    if(!empty($_GET['action']))
        $sqlQuery = "SELECT * FROM users_bookdata JOIN books ON users_bookdata.book_id=books.id WHERE users_bookdata.user_id = ".strval($userId)." and users_bookdata.action_type = '".strval($_GET['action'])."' ORDER BY users_bookdata.book_read_timestamp DESC";
    else
        $sqlQuery = "SELECT * FROM users_bookdata JOIN books ON users_bookdata.book_id=books.id WHERE users_bookdata.user_id = ".strval($userId)." ORDER BY users_bookdata.book_read_timestamp DESC";
    $allBooks = mysqli_query($conn,$sqlQuery);
    if(mysqli_num_rows($allBooks) > 0){
        $all_books = mysqli_fetch_all($allBooks,MYSQLI_ASSOC);
        header("HTTP/1.1 200 OK");
        echo json_encode(["books"=>$all_books]);
    } 
    else{
        header("HTTP/1.1 401 No Data Found!");
        echo json_encode(["msg"=>"No data for user exists"]);
    }
}else{
    header("HTTP/1.1 403 Forbidden");
    echo json_encode(["msg"=>"Unauthorised User"]);
}

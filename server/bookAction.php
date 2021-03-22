<?php
error_reporting(-1); // reports all errors
ini_set("display_errors", "1"); // shows all errors
ini_set("log_errors", 1);
ini_set("error_log", "/tmp/php-error.log");

require  "./vendor/autoload.php";

use \Firebase\JWT\JWT;

header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Headers: access");
header("Access-Control-Allow-Methods: POST,OPTIONS");
header("Content-Type: application/json; charset=UTF-8");
header("Access-Control-Max-Age: 3600");
header("Access-Control-Allow-Headers: Content-Type, Access-Control-Allow-Headers, Authorization, X-Requested-With,x-auth-token");


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
}


// POST DATA
$data = json_decode(file_get_contents("php://input"));

if (
    isset($data->bookId)
    && isset($data->action)
    && !empty(trim($data->bookId))
    && !empty(trim($data->action))
) {
    $bookId = mysqli_real_escape_string($conn, trim($data->bookId));
    $action = mysqli_real_escape_string($conn, trim($data->action));
    $currentTime = time();
    if ($action == "ISSUED") {
        $user = mysqli_query($conn, "SELECT * FROM users where `id` = '$userId'");
        $user_found = mysqli_fetch_all($user, MYSQLI_ASSOC);

        $temp = json_decode(json_encode($user_found));
        $book = mysqli_query($conn, "SELECT * FROM books where `id` = '$bookId'");
        $book_found = mysqli_fetch_all($book, MYSQLI_ASSOC);

        $temp2 = json_decode(json_encode($book_found));
        $currentlyIssuedBookId = $temp[0]->currently_issued_bookid;
        $availableCount = $temp2[0]->available_count;

        if($availableCount <=0 ){
            header("HTTP/1.1 203 Cannot Update");
            echo json_encode(["msg" => "No Copies Available at the moment :("]);
            return;
        }
        $availableCount = $availableCount - 1;


        if ($currentlyIssuedBookId != null || $currentlyIssuedBookId != "") {
            header("HTTP/1.1 202 Cannot Update");
            echo json_encode(["msg" => "Book already issued"]);
            return;
        }
       
        $bookAction = mysqli_query($conn, "INSERT INTO `users_bookdata` (`user_id`,`book_id`,`action_type`,`issue_timestamp`) VALUES('$userId','$bookId','$action','$currentTime')");
        if ($bookAction) {
            $last_id = mysqli_insert_id($conn);
        } else {
            header("HTTP/1.1 500 Cannot Update");
            echo json_encode(["msg" => "Book Not Issued!"]);
            return;
        }
        $user = mysqli_query($conn, "UPDATE users SET `currently_issued_bookid` = '$bookId' where `id` = '$userId'");
        $bookCountUpdate = mysqli_query($conn, "UPDATE books SET `available_count` = '$availableCount' where `id` = '$bookId'");
        header("HTTP/1.1 200 OK");
        echo json_encode(["msg" => "Book Successfully Issued"]);
    } else if ($action == "RETURNED") {
        $user = mysqli_query($conn, "SELECT * FROM users where `id` = '$userId'");
        $user_found = mysqli_fetch_all($user, MYSQLI_ASSOC);

        $temp = json_decode(json_encode($user_found));
        $currentlyIssuedBookId = $temp[0]->currently_issued_bookid;
        if ($currentlyIssuedBookId == null || $currentlyIssuedBookId == "") {
            header("HTTP/1.1 202 OK");
            echo json_encode(["msg" => "No Book Issued"]);
            return;
        }

        $bookAction = mysqli_query($conn, "UPDATE users_bookdata SET `book_returned_timestamp` = '$currentTime', `action_type` = '$action' WHERE `book_id` = '$bookId' AND `user_id` = '$userId'  ");
        $book2 = mysqli_query($conn, "SELECT * FROM books where `id` = '$bookId'");
        $book_found2 = mysqli_fetch_all($book2, MYSQLI_ASSOC);

        $temp2 = json_decode(json_encode($book_found2));
        $availableCount = $temp2[0]->available_count;
        $availableCount = $availableCount + 1;
        $bookCountUpdate = mysqli_query($conn, "UPDATE books SET `available_count` = '$availableCount' where `id` = '$bookId'");
        $updateUserCurrentBook = mysqli_query($conn, "UPDATE users SET `currently_issued_bookid` = NULL where `id` = '$userId'");
        header("HTTP/1.1 200 OK");
        echo json_encode(["msg" => "Book Returned."]);
    }else if ($action == "BOOKMARKED") {
        
        $bookAction = mysqli_query($conn, "INSERT INTO `users_bookdata` (`user_id`,`book_id`,`action_type`) VALUES('$userId','$bookId','$action')");
        if (!$bookAction) {
            header("HTTP/1.1 401 Cannot Update");
            echo json_encode(["msg" => "Book Already Saved."]);
            return;
        }
        header("HTTP/1.1 200 OK");
        echo json_encode(["msg" => "Book Bookmarked."]);
    }
} else {
    header("HTTP/1.1 200 Internal Server Error");
    echo json_encode(["msg" => "Some Error Occurred"]);
}
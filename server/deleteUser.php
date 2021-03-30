<?php
error_reporting(-1); // reports all errors
ini_set("display_errors", "1"); // shows all errors
ini_set("log_errors", 1);
ini_set("error_log", "/tmp/php-error.log");

header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Headers: access");
header("Access-Control-Allow-Methods: POST");
header("Content-Type: application/json; charset=UTF-8");
header("Access-Control-Allow-Headers: Content-Type, Access-Control-Allow-Headers, Authorization, X-Requested-With");

require 'db_connection.php';
if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    return 0;
}

$data = json_decode(file_get_contents("php://input"));
if (isset($data->id) && is_numeric($data->id)) {
    $delID = $data->id;
    $getUserCurrentBookId = mysqli_query($conn, "SELECT `currently_issued_bookid` FROM `users` WHERE `id`='$delID'");
    $book_arr = mysqli_fetch_all($getUserCurrentBookId, MYSQLI_ASSOC);
   
    $temp = $book_arr[0]['currently_issued_bookid'];
    if ($temp != null) {
        $updateBookCount = mysqli_query($conn, "UPDATE books SET `available_count`=`available_count`+1 WHERE `id`='$temp'");
        if ($updateBookCount) {
            $deleteUser = mysqli_query($conn, "DELETE FROM `users` WHERE `id`='$delID'");
    
            if ($deleteUser) {
                header("HTTP/1.1 200 OK");
                echo json_encode(["msg"=>"User Deleted"]);
            } else {
                header("HTTP/1.1 500 NOT DELETED");
                echo json_encode(["msg"=>"User Not Deleted!"]);
            }
        } else {
            header("HTTP/1.1 401 RESOURCE NOT FOUND");
            echo json_encode(["msg"=>"Update Failed!"]);
        }
    }
    else {
        $deleteUser = mysqli_query($conn, "DELETE FROM `users` WHERE `id`='$delID'");
    
        if ($deleteUser) {
            header("HTTP/1.1 200 OK");
            echo json_encode(["msg"=>"User Deleted"]);
        } else {
            header("HTTP/1.1 500 NOT DELETED");
            echo json_encode(["msg"=>"User Not Deleted!"]);
        }
    }
} else {
    header("HTTP/1.1 401 RESOURCE NOT FOUND");
    echo json_encode(["msg"=>"User Not Found!"]);
}

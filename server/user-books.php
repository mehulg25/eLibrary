<?php
header("Access-Control-Allow-Origin: *"); //shift imports in one file if possible
header("Access-Control-Allow-Headers: access");
header("Access-Control-Allow-Methods: POST");
header("Content-Type: application/json; charset=UTF-8");
header("Access-Control-Allow-Headers: Content-Type, Access-Control-Allow-Headers, Authorization, X-Requested-With");

require 'db_connection.php'; // type of import
$data = json_decode(file_get_contents("php://input"));
if(isset($data->id) && is_numeric($data->id)) {
    $userId = $data->id;
    $allBooks = mysqli_query($conn,"SELECT * FROM `users_bookdata` WHERE `user_id` = '$userId'   "); //performs a query against a database. $conn is acquired from line 8
if(mysqli_num_rows($allBooks) > 0){
    $all_books = mysqli_fetch_all($allBooks,MYSQLI_ASSOC); //fetches all result rows and returns the result-set as an associative array(id=0,name=sherlockholmes//key value pair), a numeric array, or both.
    echo json_encode(["books"=>$all_books]); //all_books json encode send via echo. Book is key and all_books is value(in the response which is being sent)
} //doubt
else{
    echo json_encode(["success"=>0]);
}
}

?>
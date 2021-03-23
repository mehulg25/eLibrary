<?php
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
if(isset($data->id) && is_numeric($data->id)){
    $delID = $data->id;
    $deleteBook = mysqli_query($conn,"DELETE FROM `books` WHERE `id`='$delID'");
    if($deleteBook){
        header("HTTP/1.1 200 OK");
        echo json_encode(["msg"=>"Book Deleted"]);
    }
    else{
        header("HTTP/1.1 500 NOT DELETED");
        echo json_encode(["msg"=>"Book Not Deleted!"]);
    }
}
else{
    header("HTTP/1.1 403 RESOURCE NOT FOUND");
    echo json_encode(["msg"=>"Book Not Found!"]);
}
<?php
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Headers: access");
header("Access-Control-Allow-Methods: POST");
header("Content-Type: application/json; charset=UTF-8");
header("Access-Control-Allow-Headers: Content-Type, Access-Control-Allow-Headers, Authorization, X-Requested-With");

require 'db_connection.php';



$email = '';
$password = '';
$role = '';




$data = json_decode(file_get_contents("php://input"));


$email = mysqli_real_escape_string($conn, trim($data->email));
$password = mysqli_real_escape_string($conn, trim($data->password));
$password_hash = password_hash($password, PASSWORD_BCRYPT);
$role = mysqli_real_escape_string($conn, trim($data->role));

$table_name = 'users';

$insertUser = mysqli_query($conn,"INSERT INTO `users`(`email`,`password`,`role`) VALUES('$email','$password_hash','$role')");
if($insertUser){
    $last_id = mysqli_insert_id($conn);
    echo json_encode(["success"=>1,"msg"=>"User Created.","id"=>$last_id]);
}
else{
    echo json_encode(["success"=>0,"msg"=>"User Not Created"]);
}

?>
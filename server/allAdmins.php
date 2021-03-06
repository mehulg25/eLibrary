<?php
header("Access-Control-Allow-Origin: *"); 
header("Access-Control-Allow-Headers: access");
header("Access-Control-Allow-Methods: GET");
header("Content-Type: application/json; charset=UTF-8");
header("Access-Control-Allow-Headers: Content-Type, Access-Control-Allow-Headers, Authorization, X-Requested-With");

require 'db_connection.php'; 

$allAdmins = mysqli_query($conn,"SELECT * FROM users WHERE `role` = 'ADMIN'"); 
if(mysqli_num_rows($allAdmins) > 0){
    $all_admins = mysqli_fetch_all($allAdmins,MYSQLI_ASSOC); 
    echo json_encode(["admins"=>$all_admins]);
} 
else{
    echo json_encode(["success"=>0]);
}
?>
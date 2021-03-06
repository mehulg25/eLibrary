<?php
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Headers: access");
header("Access-Control-Allow-Methods: GET");
header("Content-Type: application/json; charset=UTF-8");
header("Access-Control-Allow-Headers: Content-Type, Access-Control-Allow-Headers, Authorization, X-Requested-With");

require 'db_connection.php';
if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    return 0;
}

$allAdmins = mysqli_query($conn, "SELECT * FROM users WHERE `role` = 'ADMIN'");
if (mysqli_num_rows($allAdmins) > 0) {
    $all_admins = mysqli_fetch_all($allAdmins, MYSQLI_ASSOC);
    header("HTTP/1.1 200 OK");
    echo json_encode(["admins"=>$all_admins]);
} else {
    header("HTTP/1.0 404 Not Found");
    echo json_encode(["error"=>"No Admin found in the database!"]);
}

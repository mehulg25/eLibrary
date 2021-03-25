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

$allReaders = mysqli_query($conn, "SELECT * FROM users WHERE `role` = 'READER'");
if (mysqli_num_rows($allReaders) > 0) {
    $all_readers = mysqli_fetch_all($allReaders, MYSQLI_ASSOC);
    header("HTTP/1.1 200 OK");
    echo json_encode(["readers"=>$all_readers]);
} else {
    header("HTTP/1.0 404 Not Found");
    echo json_encode(["error"=>"No Reader found in the database!"]);
}

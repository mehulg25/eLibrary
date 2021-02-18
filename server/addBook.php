<?php
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Headers: access");
header("Access-Control-Allow-Methods: POST");
header("Content-Type: application/json; charset=UTF-8");
header("Access-Control-Allow-Headers: Content-Type, Access-Control-Allow-Headers, Authorization, X-Requested-With");

require 'db_connection.php';

// POST DATA
$data = json_decode(file_get_contents("php://input")); //data is coming so we have to decode from json to normal object| f_g_c method to get content from client side
echo json_encode(["success"=>$data]);

if(isset($data->bookName) //variables from frontend
    && isset($data->bookSynopsis)
  && isset($data->bookImage)
    && !empty(trim($data->bookImage))
    && !empty(trim($data->bookName))
  && !empty(trim($data->bookSynopsis))
    ){
    $bookName = mysqli_real_escape_string($conn, trim($data->bookName));
    $bookSynopsis = mysqli_real_escape_string($conn, trim($data->bookSynopsis));
    $bookImage = mysqli_real_escape_string($conn, trim($data->bookImage));
        $insertBook = mysqli_query($conn,"INSERT INTO `books`(`name`,`image_url`,`synopsis`) VALUES('$bookName','$bookImage','$bookSynopsis')");
        if($insertBook){
            $last_id = mysqli_insert_id($conn);
            echo json_encode(["success"=>1,"msg"=>"Book Inserted.","id"=>$last_id]);
        }
        else{
            echo json_encode(["success"=>0,"msg"=>"Book Not Inserted!"]);
        }
}
else{
    echo json_encode(["success"=>0,"msg"=>"Please fill all the required fields!"]);
}
?>
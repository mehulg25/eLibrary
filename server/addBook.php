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

// POST DATA
$data = json_decode(file_get_contents("php://input")); //data is coming so we have to decode from json to normal object| f_g_c method to get content from client side
echo json_encode(["success"=>$data]);

if(isset($data->bookName) //variables from frontend
    && isset($data->bookSynopsis)
  && isset($data->bookImage)
  && isset($data->bookAuthor)
  && isset($data->totalCount)
    && !empty(trim($data->bookImage)) 
    && !empty(trim($data->bookName))
  && !empty(trim($data->bookSynopsis))
  && !empty(trim($data->bookAuthor))
  && !empty(trim($data->totalCount))   
    ){
    $bookName = mysqli_real_escape_string($conn, trim($data->bookName));
    $bookSynopsis = mysqli_real_escape_string($conn, trim($data->bookSynopsis));
    $bookImage = mysqli_real_escape_string($conn, trim($data->bookImage)); 
    $bookAuthor = mysqli_real_escape_string($conn, trim($data->bookAuthor));
    $totalCount = mysqli_real_escape_string($conn, trim($data->totalCount));
        $insertBook = mysqli_query($conn,"INSERT INTO `books`(`name`,`image_url`,`synopsis`,`author_name`,`total_count`,`available_count`) VALUES('$bookName','$bookImage','$bookSynopsis','$bookAuthor','$totalCount','$totalCount')");
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

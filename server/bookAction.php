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

// POST DATA
$data = json_decode(file_get_contents("php://input"));

if (
    isset($data->bookId)
    && isset($data->userId)
    && isset($data->action)
    && !empty(trim($data->bookId))
    && !empty(trim($data->userId))
    && !empty(trim($data->action))
) {
    $bookId = mysqli_real_escape_string($conn, trim($data->bookId));
    $userId = mysqli_real_escape_string($conn, trim($data->userId));
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
        $availableCount = $availableCount - 1;


        if ($currentlyIssuedBookId != null || $currentlyIssuedBookId != "") {
            echo json_encode(["success" => 0, "msg" => "book already issued"]);
            return;
        }

        $bookAction = mysqli_query($conn, "INSERT INTO `users_bookdata`(`user_id`,`book_id`,`action_type`,`issue_timestamp`) VALUES('$userId','$bookId','$action','$currentTime')");
        if ($bookAction) {
            $last_id = mysqli_insert_id($conn);
        } else {
            echo json_encode(["success" => 0, "msg" => "Book Not Inserted!"]);
        }
        $user = mysqli_query($conn, "UPDATE users SET `currently_issued_bookid` = '$bookId' where `id` = '$userId'");
        $bookCountUpdate = mysqli_query($conn, "UPDATE books SET `available_count` = '$availableCount' where `id` = '$bookId'");
        echo json_encode(["success" => 1]);
    } else if ($action == "RETURNED") {
        $user = mysqli_query($conn, "SELECT * FROM users where `id` = '$userId'");
        $user_found = mysqli_fetch_all($user, MYSQLI_ASSOC);

        $temp = json_decode(json_encode($user_found));
        $currentlyIssuedBookId = $temp[0]->currently_issued_bookid;
        if ($currentlyIssuedBookId == null || $currentlyIssuedBookId == "") {
            echo json_encode(["success" => 0, "msg" => "No Book Issued"]);
            return;
        }

        $bookAction = mysqli_query($conn, "UPDATE `users_bookdata` SET `book_returned_timestamp` = '$currentTime', `action_type` = '$action' WHERE `book_id` = '$bookId' AND `user_id` = '$userId'  ");
        $book = mysqli_query($conn, "SELECT * FROM books where `id` = '$bookId'");
        $book_found = mysqli_fetch_all($book, MYSQLI_ASSOC);

        $temp2 = json_decode(json_encode($book_found));
        $availableCount = $temp2[0]->available_count;
        $availableCount = $availableCount + 1;
        $bookCountUpdate = mysqli_query($conn, "UPDATE books SET `available_count` = '$availableCount' where `id` = '$bookId'");
        $updateUserCurrentBook = mysqli_query($conn, "UPDATE users SET `currently_issued_bookid` = NULL where `id` = '$userId'");
        echo json_encode(["success" => 1]);
    }
} else {
    echo json_encode(["success" => 0, "msg" => "Please fill all the required fields!"]);
}

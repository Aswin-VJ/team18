<?php
include 'db.php';

if (isset($_POST['id'])) {
    $id = $_POST['id'];
    $sql = "DELETE FROM history WHERE id=$id";
    if ($conn->query($sql)) {
        echo "Deleted";
    } else {
        echo "Error: " . $conn->error;
    }
}
?>
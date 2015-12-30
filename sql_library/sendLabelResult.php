<?php
/**
 * Created by PhpStorm.
 * User: sla278
 * Date: 11/17/2015
 * Time: 3:07 PM
 */

include "db.php";

$labelResult = $_POST['labelResult'];
$shapeId = $_POST['shapeId'];
$username = $_POST['username'];


foreach ($labelResult as $item) {
    // Build the insert query
    $q = "INSERT INTO labelresult (id, partName, labelId, shapeId, username) VALUES (NULL, '$item[0]','$item[1]','$shapeId','$username')";

    // Execute to insert to DB
    $mysqli->query($q);
}








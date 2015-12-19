<?php
/**
 * Created by PhpStorm.
 * User: sla278
 * Date: 11/17/2015
 * Time: 3:07 PM
 */

include "db.php";

$matchResult = $_GET['matchResult'];
$pair_id = $_GET['pair_id'];
$username = $_GET['username'];

foreach ($matchResult as $item) {
    // Build the insert query
    $q = "INSERT INTO matchresult (id, partName1, partName2, pair_id, username) VALUES (NULL, '$item[0]','$item[1]','$pair_id','$username')";

    // Execute to insert to DB
    $mysqli->query($q);
}
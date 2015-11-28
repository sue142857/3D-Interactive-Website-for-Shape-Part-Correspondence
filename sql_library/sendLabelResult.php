<?php
/**
 * Created by PhpStorm.
 * User: sla278
 * Date: 11/17/2015
 * Time: 3:07 PM
 */

include "db.php";

$partName = $_GET['partName'];
$labelId = $_GET['labelId'];
$shapeId = $_GET['shapeId'];

// Build the insert query
$q = "INSERT INTO labelresult (id, partName, labelId, shapeId) VALUES (NULL, '$partName','$labelId','$shapeId')";

// Execute to insert to DB
$mysqli->query($q);



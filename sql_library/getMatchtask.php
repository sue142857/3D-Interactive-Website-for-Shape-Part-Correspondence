<?php
/**
 * Created by PhpStorm.
 * User: sla278
 * Date: 11/24/2015
 * Time: 3:55 PM
 */

include "db.php";

$result_query = $mysqli->query("SELECT * FROM matchtask");
$row = $result_query->fetch_all();

echo json_encode($row);
<?php
/**
 * Created by PhpStorm.
 * User: sla278
 * Date: 11/25/2015
 * Time: 11:22 AM
 */

include "db.php";

$result_query = $mysqli->query("SELECT * FROM labelmap");
$row = $result_query->fetch_all();

echo json_encode($row);
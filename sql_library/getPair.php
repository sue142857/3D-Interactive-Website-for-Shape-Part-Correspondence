<?php
/**
 * Created by PhpStorm.
 * User: sla278
 * Date: 11/28/2015
 * Time: 10:20 AM
 */

include "db.php";

$result_query = $mysqli->query("SELECT * FROM pair");
$row = $result_query->fetch_all();

echo json_encode($row);
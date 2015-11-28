<?php
/**
 * Created by PhpStorm.
 * User: sla278
 * Date: 11/23/2015
 * Time: 6:52 PM
 */

include "db.php";

$result_query = $mysqli->query("SELECT * FROM shape");
$row = $result_query->fetch_all();

echo json_encode($row);
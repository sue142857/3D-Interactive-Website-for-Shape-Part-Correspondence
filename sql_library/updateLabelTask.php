<?php
/**
 * Created by PhpStorm.
 * User: sla278
 * Date: 11/17/2015
 * Time: 3:07 PM
 */

include "db.php";

$shape_id = $_GET['shape_id'];
$number = $_GET['number'];

$queryUpdate = "UPDATE labeltask SET number = $number WHERE shape_id = $shape_id";
$mysqli->query($queryUpdate);
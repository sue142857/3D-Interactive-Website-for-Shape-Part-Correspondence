<?php
/**
 * Created by PhpStorm.
 * User: sla278
 * Date: 11/17/2015
 * Time: 3:07 PM
 */

include "db.php";

$pair_id = $_GET['pair_id'];
$number = $_GET['number'];

$queryUpdate = "UPDATE matchtask SET number = $number WHERE pair_id = $pair_id";
$mysqli->query($queryUpdate);
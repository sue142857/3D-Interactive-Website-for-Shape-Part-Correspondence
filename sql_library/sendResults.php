<?php
/**
 * Created by PhpStorm.
 * User: sla278
 * Date: 11/17/2015
 * Time: 3:07 PM
 */

include "db.php";

$shape1 = $_GET['shape1'];
$shape2 = $_GET['shape2'];
$part1 = $_GET['part1'];
$part2 = $_GET['part2'];

// Build the insert query
$q = "INSERT INTO result (id, shape1, shape2, part1, part2) VALUES (NULL, '$shape1','$shape2','$part1','$part2')";

// Execute to insert to DB
$mysqli->query($q);



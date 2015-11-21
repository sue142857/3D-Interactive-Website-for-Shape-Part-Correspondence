<?php
/**
 * Created by PhpStorm.
 * User: sla278
 * Date: 11/17/2015
 * Time: 1:15 PM
 */

// Connecting, selecting database
$mysqli = new mysqli("localhost", "drtopo", "12345678", "drtopo_example");


function giveMeNameNextJob( $id ) {
    global $mysqli;
    $result_query = $mysqli->query("SELECT filename FROM fine WHERE id = $id");
    $row = $result_query->fetch_row();
    return $row[0];
}

function addOneToCount( $id ){
    global $mysqli;
    $queryText = "SELECT * FROM fine WHERE id = $id";
    $row = $mysqli->query($queryText)->fetch_row();
    $oldCount = $row[2];
    $newCount = $oldCount + 1;
    $queryUpdate = "UPDATE fine SET count = $newCount WHERE id = $id";
    $mysqli->query($queryUpdate);
    return $newCount;
}


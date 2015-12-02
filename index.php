<?php
// Connect to the Database
include "sql_library/db.php";
?>

<html>
<head>
    <title> Dr Topo </title>
    <script src="js/jquery-2.1.4.min.js"></script>
    <script src="js/three.js"></script>
    <script src="js/TrackballControls.js"></script>
    <script src="js/OBJLoader.js"></script>
    <script src="js/loadShapes.js"></script>
    <script src="js/viewer.js"></script>
    <script src="js/sendLabelResult.js"></script>
    <script src="js/sendMatchResult.js"></script>
    <script src="js/updateTaskNumber.js"></script>
    <link rel="stylesheet" type="text/css" href="style/style.css">
</head>
<body>

<script>
    loadLabelTask();
</script>

<button type="button" onclick="doNextTask()">Save</button>

<div id="container"></div>
<script>
    init();
    animate();
</script>

</body>
</html>


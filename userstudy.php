<?php
    // Connect to the Database
    include "sql_library/db.php";
    
    // Create a sort of unique username
    $date = new DateTime();
    $username = $_GET["username"] . "_" . $date->getTimestamp();
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
    <script src="js/sendResult.js"></script>
    <link rel="stylesheet" type="text/css" href="style/style.css">
</head>
<body>

<input id="username" type="hidden" name="username" value="<?php echo $username; ?>">

<div id="container"></div>

<script>
    init();
    animate();
</script>

<script>
    loadLabelTask();
</script>

<button type="button" onclick="doNextTask()">Save</button>

</body>
</html>


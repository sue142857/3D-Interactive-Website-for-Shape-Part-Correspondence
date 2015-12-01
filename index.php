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
    <script src="js/sendResults.js"></script>
    <script src="js/viewer.js"></script>
    <script src="js/sendLabelResult.js"></script>
    <script src="js/sendMatchResult.js"></script>
    <link rel="stylesheet" type="text/css" href="style/style.css">
</head>
<body>


<div>Hello from HTML </div>

<div>New count is: <?php echo addOneToCount( 2 ); ?> </div>

<div id="job"><?php echo giveMeNameNextJob( 2 )?></div>

<div id="shapes"></div>

<script>
    loadTheShapes();
</script>

<button type="button" onclick="sendAllResults()">Click Me!</button>

<button type="button" onclick="loadAllShapes(shapesLoaded)">Load Shape</button>

<script>
    loadMatchTask();
</script>

<button type="button" onclick="doNextTask()">Save</button>

<div id="container"></div>
<script>
    init();
    animate();
</script>

</body>
</html>


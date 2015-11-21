/**
 * Created by sla278 on 11/17/2015.
 */
var shapesLoaded = new Array();
var selectionObject = new Array();

var createTable = function(tableName,x,y) {
    var t = "";
    var uid = 0;

    for (var i = 0; i < x; i++)
    {
        t += "<tr>\n";
        for(var j = 0; j < y; j++)
        {
            t += "\t<td id='" + uid + "'></td>\n";
            uid++;
        }
        t += "</tr>\n";
    }

    return "<table id='"+tableName+"'>" + t + "</table>";
}

var resetAllCells = function(tableName){
    $("#" + tableName + " td").css("background","white");
}

var addActionsToTable = function(tableName)
{
    var table = $("#" + tableName);

    // Add an action to all cells
    table.on("click", "td", function() {
        // Clear background of all cells
        resetAllCells( tableName );

        // Set the selection for the table to me (the td)
        selectionObject[ tableName ] = $(this).attr("id");

        // Change my background
        $(this).css("background","blue");
    });
}

var loadTheShapes = function(){
    // Select the element with id = 'job'
    var domObject = $("#job");

    // debug
    console.log( domObject );
    console.log( domObject.text() );

    var jobName = domObject.text();

    var arrayShapes = jobName.split("_");

    var shape1 = arrayShapes[0];
    var shape2 = arrayShapes[1];

    //$("#shapes").append( createTable(shape1,3,3) );
    //$("#shapes").append( createTable(shape2,3,3) );

    shapesLoaded.push(shape1);
    shapesLoaded.push(shape2);

    //addActionsToTable(shape1);
    //addActionsToTable(shape2);
}

var loadShapeGraph = function( shapeDirName,t )
{
    var shapeFilename = "data/" + shapeDirName + "/" + shapeDirName + ".xml";

    $.ajax({
    type: "GET" ,
    url: shapeFilename,
    dataType: "xml" ,
    success: function(xml) {
        //var xmlDoc = $.parseXML( xml );

        $(xml).find('node').each(function() {
            var meshFilename = $(this).find('mesh').text();
            var partName = $(this).find('id').text();

            // Get labels
            var meta = $(this).find('meta');
            var partLabel = $(meta[1]).find('value').text();
            var finePartLabel = $(meta[0]).find('value').text();

            // Debug
            console.log( meshFilename );

            // Load mesh into viewer
            meshFilename = "data/" + shapeDirName + "/" + meshFilename;
            console.log( meshFilename );

            addPart(partName, meshFilename, partLabel, finePartLabel, t);
        });

    },
    error: function(err){
        console.log(err);
    }
    });
}

var loadAllShapes = function( shapeNamesArray ) {
    for (var i = 0; i < shapeNamesArray.length; i++)
    {
        var t=4*i-2;
        loadShapeGraph(shapeNamesArray[i],t);
    }
}


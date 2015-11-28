/**
 * Created by sla278 on 11/17/2015.
 */
var shapesLoaded = new Array();
var selectionObject = new Array();
var nLabel = 15;  // the number of label tasks for each user
var nMatch = 20;  // the number of match tasks for each user

var nCompleted = 0; // record the number of completed tasks for each user
var labelTask_loc = 0;  // record the start location to search next label task
var matchTask_loc = 0;  // // record the start location to search next match task

// tabels sent to DB
var labelResult = new Array();
var shapeId = new Array();

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
           // console.log( meshFilename );

            // Load mesh into viewer
            meshFilename = "data/" + shapeDirName + "/" + meshFilename;
            //console.log( meshFilename );

            addPart(shapeDirName,partName, meshFilename, partLabel, finePartLabel, t);
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

var actionToLabelBar = function(labelId){
    $("#labelBar").click(function(event){

        // Only df there are selected parts, do ...
        if (typeof selectedPartsName[0] !== 'undefined' && selectedPartsName[0] !== null){
            // save selected part names and the label id
            var clicked = event.target;
            var id = clicked.id.split("_");
            var label_id = Number(id[1]);

            for (var i = 0; i < selectedPartsName.length;i++){
                // update labelResult
                var update = 0;
                for (var j = 0; j < labelResult.length;j++){
                    if (labelResult[j][0] == selectedPartsName[i][1] ){
                        labelResult[j][1] = label_id;
                        update = 1;

                        //Debug
                        //console.log(j);
                        //console.log(labelResult[j]);
                    }
                }
                // insert new result
                if (update == 0){
                    labelResult.push([selectedPartsName[i][1],label_id]);

                    //Debut
                    //console.log(labelResult.length-1);
                    //console.log(labelResult[labelResult.length-1]);
                }
            }
            //console.log(labelResult);
            // update selected parts' color
            var index = labelId.indexOf(label_id);
            var newColor = labelColors[index];
            updatePartColor(newColor);
            // empty selectedPartsName
            selectedPartsName = [];


        }

    });
}

var loadLabel = function(classId) {
     // load fixed label bars and initial labels of shape
    $.ajax({
        url: 'sql_library/getLabel.php',
        data: "",
        dataType: 'json',
        success:function(labelTable)
        {
            //add label bars with label names in viewer, labelId is needed to label parts.
            var labelId = new Array();
            var labelName = new Array();

            // no label
            labelId.push(0);
            labelName.push("no label");

            for (var i = 0; i < labelTable.length; i++) {
                var class_id = Number(labelTable[i][2]);
                if (classId == class_id){
                    var name = labelTable[i][1];
                    var id = Number(labelTable[i][0]);
                    labelName.push(name)
                    labelId.push(id);
                }
            }

            addLabelBar(labelId,labelName);
            actionToLabelBar(labelId);

            // load initial labels
            $.ajax({
                url: 'sql_library/getLabelmap.php',
                data: "",
                dataType: 'json',
                success:function(labelmapTable)
                {
                    addInitialLabel(classId,labelId,labelmapTable);
                },
                error: function(err){
                    console.log(err);
                }
            });

        },
        error: function(err){
            console.log(err);
        }
    });
}
var loadLabelTask = function(){
    // Select a shape to label
    $.ajax({
        url: 'sql_library/getLabeltask.php',
        data: "",
        dataType: 'json',
        success:function(labeltaskTable)
        {
            // only if there are unfinished label tasks
            var TotalLabelTask = 0;
            var labelTask = 0;
            for (var i = 0; i < labeltaskTable.length; i++)
            {
                labelTask = Number(labeltaskTable[i][1]);
                TotalLabelTask = TotalLabelTask + labelTask;
            }
            if (TotalLabelTask == 0 )
            {
                alert("Labeling tasks have been finished!");
            }
            else
            {
                $.ajax({
                        url: 'sql_library/getShape.php',
                        data: "",
                        dataType: 'json',
                        success:function(shapeTable)
                        {
                            // search next label task from labelTask_loc
                            // previous task is on (labeltaskTable.length - 1)
                            if (labelTask_loc == labeltaskTable.length) {
                                labelTask_loc = 0;
                            }
                            for (var i = labelTask_loc; i < labeltaskTable.length; i++) {
                                labelTask = Number(labeltaskTable[i][1]);
                                // next task is on/after labelTask_loc
                                if (labelTask > 0) {
                                    shapeId = [];
                                    shapeId.push(Number(labeltaskTable[i][0]));
                                    var loc = shapeId[0]-1;
                                    var shapeName = shapeTable[loc][1];
                                    var classId = Number(shapeTable[loc][2]);
                                    labelTask_loc = i + 1;
                                    break;
                                }
                                // next task is before labelTask_loc
                                if (labelTask_loc == labeltaskTable.length) {
                                    labelTask_loc = 0;
                                }
                            }
                            loadShapeGraph(shapeName,0);
                            loadLabel(classId);
                        },
                    error: function(err){
                        console.log(err);
                    }
                });
            }
        },
        error: function(err){
            console.log(err);
        }
    });

}
var loadMatchTask = function(){
    // Select a pair of shapes to match
    $.ajax({
        url: 'sql_library/getMatchtask.php',
        data: "",
        dataType: 'json',
        success:function(matchtaskTable)
        {
            // only if there are unfinished match tasks
            var TotalMatchTask = 0;
            var matchTask = 0;
            for (var i = 0; i < matchtaskTable.length; i++)
            {
                matchTask = Number(matchtaskTable[i][1]);
                TotalMatchTask = TotalMatchTask + matchTask;
            }
            if (TotalMatchTask == 0 )
            {
                alert("Matching tasks have been finished!");
            }
            else
            {
                // search next match task from matchTask_loc
                // previous task is on (matchtaskTable.length - 1)
                if (matchTask_loc == matchtaskTable.length) {
                    matchTask_loc = 0;
                }
                for (var i = matchTask_loc; i < matchtaskTable.length; i++) {
                    matchTask = Number(matchtaskTable[i][1]);
                    // next task is on/after matchTask_loc
                    if (matchTask > 0) {
                        var pair_id = matchtaskTable[i][0];
                        shapeId = [];
                        shapeId.push(Number(pairTable[pair_id][1]));
                        shapeId.push(Number(pairTable[pair_id][2]));
                        //var shapeName = shapeTable[i][1];
                        matchTask_loc = i + 1;
                        //loadShapeGraph(shapeName,0);
                        break;
                    }
                    // next task is before matchTask_loc
                    if (matchTask_loc == pairTable.length) {
                        matchTask_loc = 0;
                    }
                }

            }

        },
        error: function(err){
            console.log(err);
        }
    });

}
var doNextTask = function(){

    if (nCompleted < nLabel){
        // send previous label result
        sendLabelResult();

        // clear the interface
        clearInterface();

        // load the next label task
        loadLabelTask();
    }
    else if (nCompleted < nLabel + nMatch){
        nCompleted = nCompleted + 1;
        // send previous match result
        // Todo

        // clear the interface
        clearInterface();

        // load the next match task
        loadMatchTask();

    }
    else{
        alert("You have finished all tasks.");
    }


}

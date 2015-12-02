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
var classId = 0;
var shapeName = new Array();

// tabels sent to DB
var labelResult = new Array();
var matchResult = new Array();
var matchTask = 0;
var labelTask = 0;
var shapeId = new Array();
var pair_id = 0;


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

        },
        error: function(err){
            console.log(err);
        }
    });
}
var loadLabelTask = function(){
    // empty selectedPartsName and labelResult
    selectedPartsName = [];
    labelResult = [];
    // Select a shape to label
    $.ajax({
        url: 'sql_library/getLabeltask.php',
        data: "",
        dataType: 'json',
        success:function(labeltaskTable)
        {
            // only if there are unfinished label tasks
            var TotalLabelTask = 0;
            //var labelTask = 0;
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
                            var i = labelTask_loc;
                            do {
                                labelTask = Number(labeltaskTable[i][1]);
                                // next task is on/after labelTask_loc
                                if (labelTask > 0) {
                                    shapeId = [];
                                    shapeId.push(Number(labeltaskTable[i][0]));
                                    var loc = shapeId[0]-1;
                                    shapeName = [];
                                    shapeName = shapeTable[loc][1];
                                    classId = Number(shapeTable[loc][2]);
                                    labelTask_loc = i + 1;
                                    break;
                                }
                                i = i+1;
                                // next task is before labelTask_loc
                                if (i == labeltaskTable.length) {
                                    i = 0;
                                }
                            }
                            while(i<labeltaskTable.length)
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
    selectedPartsName = [];
    matchResult = [];
    AllFinePartLabel = [];
    addedParts = [];

    $.ajax({
        url: 'sql_library/getMatchtask.php',
        data: "",
        dataType: 'json',
        success:function(matchtaskTable)
        {
            // only if there are unfinished match tasks
            var TotalMatchTask = 0;
            //var matchTask = 0;
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
                var i = matchTask_loc;
                do {
                    matchTask = Number(matchtaskTable[i][1]);
                    // next task is on/after matchTask_loc
                    if (matchTask > 0) {
                        pair_id = matchtaskTable[i][0];
                        matchTask_loc = i + 1;
                        break;
                    }
                    i = i+1;
                    // next task is before matchTask_loc
                    if (i == matchtaskTable.length) {
                        i = 0;
                    }
                }
                while(i<matchtaskTable.length)

                $.ajax({
                        url: 'sql_library/getShape.php',
                        data: "",
                        dataType: 'json',
                        success:function(shapeTable)
                        {
                            $.ajax({
                                url: 'sql_library/getPair.php',
                                data: "",
                                dataType: 'json',
                                success:function(pairTable)
                                {
                                    shapeId = [];
                                    var loc = pair_id-1;
                                    shapeId.push(Number(pairTable[loc][1]));
                                    shapeId.push(Number(pairTable[loc][2]));
                                    shapeName = [];
                                    var loc1 = shapeId[0]-1;
                                    var loc2 = shapeId[1]-1;
                                    shapeName.push(shapeTable[loc1][1]);
                                    shapeName.push(shapeTable[loc2][1]);
                                    loadAllShapes(shapeName);
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

        },
        error: function(err){
            console.log(err);
        }
    });

}
var doNextTask = function(){

    if (nCompleted < nLabel){
        sendLabelResult();
        updateLabelTask();
        nCompleted = nCompleted +1;
    }
    else if (nCompleted < nLabel + nMatch){
        sendMatchResult();
        updateMatchTask();
        nCompleted = nCompleted +1;
    }
    else{
        alert("You have finished all tasks.");
    }


    if (nCompleted < nLabel){
        // clear the interface
        clearInterface();
        // load the next label task
        loadLabelTask();
    }
    else if (nCompleted < nLabel + nMatch){
        // clear the interface
        clearInterface();
        // load the next match task
        loadMatchTask();
    }
}

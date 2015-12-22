/**
 * Created by sla278 on 12/2/2015.
 */
/**
 * Created by sla278 on 11/25/2015.
 */
var sendLabelResult = function()
{
    showLoadingScreen();

    $.ajax({ url: 'sql_library/sendLabelResult.php',
        data: {
            labelResult: labelResult,
            shapeId: shapeId[0],
            username: username,
        },
        type: 'get',
        success: function(output) {
            //alert("Save!");
            nCompleted = nCompleted +1;
            // reduce the number of label tasks
            updateLabelTask();
        }
    });

}

var sendMatchResult = function()
{
    showLoadingScreen();

    $.ajax({ url: 'sql_library/sendMatchResult.php',
        data: {
            matchResult: matchResult,
            pair_id: pair_id,
            username: username,
        },
        type: 'get',
        success: function(output) {
            //alert("Save!");
            nCompleted = nCompleted +1;
            // reduce the number of match tasks
            updateMatchTask();
        }
    });
}

var updateMatchTask = function(){
    $.ajax({ url: 'sql_library/updateMatchTask.php',
        data: {
            pair_id: pair_id,
            number: matchTask-1,
            username: username,
        },
        type: 'get',
        success: function(output) {
            //alert("Changed!");
            hideLoadingScreen();
            if (nCompleted < nLabel + nMatch){
                // clear the interface
                clearInterface();
                // load the next match task
                loadMatchTask();
            }
            else{
                alert("You have finished all tasks. Thank you!");
                window.location.href = 'http://www.acm.org';
            }
        }
    });
}

var updateLabelTask = function(){
    $.ajax({ url: 'sql_library/updateLabelTask.php',
        data: {
            shape_id: shapeId[0],
            number: labelTask-1,
            username: username,
        },
        type: 'get',
        success: function(output) {
            hideLoadingScreen();
            //alert("Changed!");
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
    });
}
/**
 * Created by sla278 on 12/1/2015.
 */



var updateMatchTask = function(){
    $.ajax({ url: 'sql_library/updateMatchTask.php',
        data: {
            pair_id: pair_id,
            number: matchTask-1,
        },
        type: 'get',
        success: function(output) {
            //alert("Save!");
        }
    });
}

var updateLabelTask = function(){
    $.ajax({ url: 'sql_library/updateLabelTask.php',
        data: {
            shape_id: shapeId[0],
            number: labelTask-1,
        },
        type: 'get',
        success: function(output) {
            //alert("Save!");
        }
    });
}
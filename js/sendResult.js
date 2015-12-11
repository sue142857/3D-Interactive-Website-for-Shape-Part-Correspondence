/**
 * Created by sla278 on 12/2/2015.
 */
/**
 * Created by sla278 on 11/25/2015.
 */
var sendLabelResult = function()
{
    for (var i = 0; i < labelResult.length;i++){
        $.ajax({ url: 'sql_library/sendLabelResult.php',
            data: {
                partName: labelResult[i][0],
                labelId: labelResult[i][1],
                shapeId: shapeId[0],
                username: username,
            },
            type: 'get',
            success: function(output) {
                //alert("Save!");
            }
        });

    }
}

var sendMatchResult = function()
{
    for (var i = 0; i < matchResult.length;i++){
        $.ajax({ url: 'sql_library/sendMatchResult.php',
            data: {
                partName1: matchResult[i][0],
                partName2: matchResult[i][1],
                pair_id: pair_id,
                username: username,
            },
            type: 'get',
            success: function(output) {
                //alert("Save!");
            }
        });

    }
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
            //alert("Save!");
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
            //alert("Save!");
        }
    });
}
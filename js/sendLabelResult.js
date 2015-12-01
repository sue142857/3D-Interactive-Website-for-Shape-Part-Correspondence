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
            },
            type: 'get',
            success: function(output) {
                //alert("Save!");
            }
        });

    }
}

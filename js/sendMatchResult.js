/**
 * Created by sla278 on 11/30/2015.
 */
/**
 * Created by sla278 on 11/25/2015.
 */
var sendMatchResult = function()
{
    for (var i = 0; i < matchResult.length;i++){
        $.ajax({ url: 'sql_library/sendMatchResult.php',
            data: {
                partName1: matchResult[i][0],
                partName2: matchResult[i][1],
                pair_id: pair_id,
            },
            type: 'get',
            success: function(output) {
                //alert("Save!");
            }
        });

    }
}

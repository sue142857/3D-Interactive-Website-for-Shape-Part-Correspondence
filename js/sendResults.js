/**
 * Created by sla278 on 11/17/2015.
 */


var sendAllResults = function()
{
    // selectionObject
    $.ajax({ url: 'sql_library/sendResults.php',
        data: {
            shape1: shapesLoaded[0],
            shape2: shapesLoaded[1],
            part1: selectionObject[shapesLoaded[0]],
            part2: selectionObject[shapesLoaded[1]],
        },
        type: 'get',
        success: function(output) {
            alert("Sent!");
        }
    });
}

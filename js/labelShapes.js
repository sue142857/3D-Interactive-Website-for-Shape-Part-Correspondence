/**
 * Created by sla278 on 11/19/2015.
 */

var coarseLabelnames = new Array();
var loadCoarseLabels = function(shapeDirName){
    var shapeFilename = "data/" + shapeDirName + "/" + shapeDirName + ".xml";

    $.ajax({
        type: "GET" ,
        url: shapeFilename,
        dataType: "xml" ,
        success: function(xml) {
            //var xmlDoc = $.parseXML( xml );

            $(xml).find('node').each(function() {
                var meta = $(this).find('meta');
                var  label = $(meta[1]).find('value').text();
                coarseLabelnames.push(label);

            });
            coarseLabelnames = jQuery.unique(coarseLabelnames);


        },
        error: function(err){
            console.log(err);
        }
    });

}

var labelTheShapes = function(shapeDirName){

    loadCoarseLabels(shapeDirName);


}
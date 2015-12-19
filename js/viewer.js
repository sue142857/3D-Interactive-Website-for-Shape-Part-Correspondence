/**
 * Created by sla278 on 11/18/2015.
 */
var container, stats;
var camera, controls, scene, renderer;
var raycaster, mouse;

var windowWidth = 1500;
var windowHeight = 800;
var barWidth = 100;
var barHeight = 40;

var labelColors = ["#a9a9a9","#3333ff","#228b22","#663399","#ff4500","#15C7C7","#d2691e","#8a2be2","#7cfc00"];
var matchColors = ["#0000ff","#228b22","#663399","#7cfc00","#d2691e","#c71585","#ff4500","#8a2be2","#00bfff","#006400","#6a5acd",
    "#9acd32","#a0522d","#da70d6","#ff6347","#8b008b","#1e90ff","#00ff00","#7b68ee","#adff2f","#b8860b","#dda0dd","#ffa07a","#9370db",
    "#4169e1","#32cd32","#4b0082","#ffa500","#d2b48c","#f08080","#f4a460","#ba55d3","#000080","#00ff7f","#483d8b","#ffff00","#eee8aa",
    "#cd5c5c","#ffb6c1","#800080"];
var red = "#ff0000";
var AllFinePartLabel = new Array();
var addedParts = new Array();
var selectedPartsName = new Array();

var username = '';

// Loading 3D objects
var manager;
var loader;

// Initialize the 3D viewer
function init() {
    
    manager = new THREE.LoadingManager();
    loader = new THREE.OBJLoader(manager);

    camera = new THREE.PerspectiveCamera( 50, windowWidth / windowHeight, 0.1, 1000 );
    camera.position.z = 6;

    controls = new THREE.TrackballControls( camera );

    controls.rotateSpeed = 5.0;
    controls.zoomSpeed = 1.2;
    controls.panSpeed = 0.8;

    controls.noZoom = false;
    controls.noPan = false;

    controls.staticMoving = true;
    controls.dynamicDampingFactor = 0.3;

    controls.keys = [ 65, 83, 68 ];

    controls.addEventListener( 'change', render );

    // world
    scene = new THREE.Scene();

    // Debug
    //var axisHelper = new THREE.AxisHelper( 0.5 );
    //scene.add( axisHelper );

    // lights
    //var light = new THREE.DirectionalLight( 0xffffff );
    //light.position.set( -1, -1, 1 );
    //scene.add( light );

    //light = new THREE.DirectionalLight( 0x222222 );
    //light.position.set( 1, 1, -1 );
    //scene.add( light );

    var light = new THREE.DirectionalLight( 0xffffff );
    light.position.set( 1, 1, 1 );
    scene.add( light );

    light = new THREE.DirectionalLight( 0xeeeeee );
    light.position.set( -1, -1, -1 );
    scene.add( light );

    light = new THREE.DirectionalLight( 0xeeeeee );
    light.position.set( -1, -1, 0 );
    scene.add( light );

    light = new THREE.AmbientLight( 0x222222 );
    scene.add( light );

    // renderer
    renderer = new THREE.WebGLRenderer( { antialias: true } );
    renderer.setClearColor( new THREE.Color("rgb(220, 220, 220)") );
    renderer.setPixelRatio( window.devicePixelRatio );
    renderer.setSize( windowWidth, windowHeight );

    container = document.getElementById( 'container' );
    container.appendChild( renderer.domElement );

    // Fix size
    $("#container").css('max-width', windowWidth + "px");
    $("#container").css('max-height', windowHeight + "px");

    // Events:
    window.addEventListener( 'resize', onWindowResize, false );

    // Mouse event
    var DELAY = 200, clicks = 0, timer = null;

    $(function(){

        $("#container").on("click", function(event){

                clicks++;  //count clicks
            //single click is to select parts

                if(clicks === 1) {

                    timer = setTimeout(function() {

                        //console.log(clicks);
                        //alert("Single Click");  //perform single-click action
                        clicks = 0;             //after action performed, reset counter

                    }, DELAY);

                } else {  // doubel click is to match parts or delete matches on selected parts
                    //console.log(clicks);
                    clearTimeout(timer);    //prevent single-click action
                    clicks = 0;             //after action performed, reset counter
                    //alert("Double Click");  //perform double-click action

                    // Selecion
                    raycaster = new THREE.Raycaster();
                    mouse = new THREE.Vector2();
                    mouse.x = ( event.offsetX / windowWidth ) * 2 - 1;
                    mouse.y = - ( event.offsetY / windowHeight ) * 2 + 1;

                    // Setup the ray
                    raycaster.setFromCamera( mouse, camera );

                    // Intersections
                    var intersections = new Array();

                    // go over all parts of the shape
                    for(var i = 0; i < scene.children.length; i++)
                    {
                        var part = scene.children[i];

                        // Only consider the 'meshes' of the scene
                        if ( part instanceof THREE.Mesh )
                        {
                            // Test intersection
                            var intersects = raycaster.intersectObject( part );

                            if (intersects.length > 0) {
                                intersections.push({ distance : intersects[0].distance, idx : i });
                            }
                        }
                    }

                    // If there is an intersection
                    if(intersections.length > 0)
                    {
                        // Sort the intersecting parts by distance
                        var compareIntersection = function(a,b){
                            if(a.distance < b.distance)
                                return -1;
                            else if(a.distance > b.distance)
                                return 1;
                            return 0;
                        };
                        intersections.sort(compareIntersection);

                        // Select the closest part
                        {
                            // change color (debug)
                            var closePartIDX = intersections[0].idx;
                            var selectedPart = scene.children[closePartIDX];
                            selectedPart.material.color = new THREE.Color(red);

                            selectedPartsName.push([selectedPart.shapeName,selectedPart.partName]);
                        }
                    }

                    render();

                    // dbl on background and only if it is in match task
                    if(intersections.length == 0 && shapeName.length == 2){
                        // Only df there are selected parts, do ...
                        if (typeof selectedPartsName[0] !== 'undefined' && selectedPartsName[0] !== null){

                            var allMatched1 = new Array();  // matched parts of selected parts on shape1
                            var allMatched2 = new Array();  // matched parts of selected parts on shape2

                            // delete previous match result of selected parts
                            for (var i = 0; i<selectedPartsName.length;i++){
                                var selected = selectedPartsName[i];
                                var matched1 = new Array();  // on shape1
                                var matched2 = new Array();  // matched parts of selected part i on shape2
                                for (var j=0;j<matchResult.length;j++){
                                    if (selected[0] == shapeName[0] && selected[1]== matchResult[j][0]){
                                        matched2.push(matchResult[j][1]);  // find out matched2 from matchResult
                                        allMatched2.push(matchResult[j][1]);
                                    }
                                    if (selected[0] == shapeName[1] && selected[1]== matchResult[j][1]){
                                        matched1.push(matchResult[j][0]);
                                        allMatched1.push(matchResult[j][0]);
                                    }
                                }
                                j = 0;
                                while(j<matchResult.length){
                                    if (selected[0] == shapeName[0]){
                                        var name = matchResult[j][1];
                                        var index = matched2.indexOf(name);
                                        if (index !=-1){
                                            matched1.push(matchResult[j][0]); // find out matched1 based on matched2
                                            allMatched1.push(matchResult[j][0]);
                                            matchResult.splice(j,1);         // delete from matchResult
                                        }
                                    }
                                    if (selected[0] == shapeName[1]){
                                        var name = matchResult[j][0];
                                        var index = matched1.indexOf(name);
                                        if (index !=-1){
                                            matched2.push(matchResult[j][1]);
                                            allMatched2.push(matchResult[j][1]);
                                            matchResult.splice(j,1);
                                        }
                                    }
                                    if (index == -1 ) {j = j+1}
                                }
                            }

                            //add new match result
                            var dblclickMode = 0; //0: delete, 1: add
                            for (var i = 0; i<selectedPartsName.length;i++){
                                var part1 = selectedPartsName[i];
                                for (var j = i+1; j<selectedPartsName.length;j++){
                                    var part2 = selectedPartsName[j];
                                    if ((part1[0] == shapeName[0]) && (part2[0] == shapeName[1])){
                                        matchResult.push([part1[1],part2[1]]);
                                        dblclickMode = 1;
                                    }
                                    if (part1[0] == shapeName[1] && part2[0] == shapeName[0]){
                                        matchResult.push([part2[1],part1[1]]);
                                        dblclickMode = 1;
                                    }
                                }
                            }

                            //delete part colors and record used colors
                            var usedColor = new Array();
                            for (var i = 0; i < scene.children.length; i++) {
                                var part = scene.children[i];

                                // Only consider the 'meshes' of the scene
                                if (part instanceof THREE.Mesh) {
                                    var index1 = allMatched1.indexOf(part.partName);
                                    var index2 = allMatched2.indexOf(part.partName);
                                    var c_color = '#' + part.material.color.getHexString();
                                    if (c_color == red){
                                        part.material.color = new THREE.Color("#a9a9a9");  // "#a9a9a9" no color
                                    }
                                    else if ((part.shapeName == shapeName[0]) && index1 != -1){
                                        part.material.color = new THREE.Color("#a9a9a9");
                                    }
                                    else if ((part.shapeName == shapeName[1]) && index2 != -1){
                                        part.material.color = new THREE.Color("#a9a9a9");
                                    }
                                    else {
                                        var color = '#' + part.material.color.getHexString();
                                        usedColor.push(color);
                                    }
                                }
                            }
                            render();

                            //color new matches by a new color
                            if (dblclickMode == 1){
                                for (var i = 0;i<matchColors.length;i++){
                                    var index = usedColor.indexOf(matchColors[i]);
                                    if (index == -1){
                                        var newColor = matchColors[i];
                                        break;
                                    }
                                }
                                updatePartColor(newColor);

                            }

                            // empty global variable
                            selectedPartsName = [];

                        }
                    }

                }

            })
            .on("dblclick", function(event){
                event.preventDefault();  //cancel system double-click event
            });

    });
    //
    render();

    // Save username
    username = $("#username").val();
}

function onWindowResize() {
    camera.aspect = windowWidth / windowHeight;
    camera.updateProjectionMatrix();

    renderer.setSize( windowWidth, windowHeight );

    controls.handleResize();

    render();
}

function animate() {
    requestAnimationFrame( animate );
    controls.update();
}

function render() {
    renderer.render( scene, camera );
}

function addPart(shapeDirName,partName, meshFilename, partLabel, finePartLabel, t ) {

    loader.load( meshFilename, function ( object ) {
        var geometry = object.children[ 0 ].geometry;

        geometry.applyMatrix( new THREE.Matrix4().makeTranslation(t, 0, 0) );

        geometry.verticesNeedUpdate = true;
        geometry.elementsNeedUpdate = true;
        geometry.morphTargetsNeedUpdate = true;
        geometry.normalsNeedUpdate = true;
        geometry.colorsNeedUpdate = true;
        geometry.tangentsNeedUpdate = true;

        geometry.computeBoundingSphere();
        geometry.computeFaceNormals();
        geometry.computeVertexNormals();

        var material = new THREE.MeshPhongMaterial();
        var mesh = new THREE.Mesh( geometry, material );

        material.side = THREE.DoubleSide;

        // Add part properties
        mesh.shapeName = shapeDirName;
        mesh.partName = partName;
        mesh.partLabel = partLabel;
        mesh.finePartLabel = finePartLabel;

        // add initial labels for label tasks
        if (nCompleted < nLabel) {
            // search the map label id of current part
            var labelId = new Array();
            // no label id is 0
            labelId.push(0);

            for (var i = 0; i < labelTable.length; i++) {
                var class_id = Number(labelTable[i][2]);
                if (classId == class_id){
                    var id = Number(labelTable[i][0]);
                    labelId.push(id);
                }
            }
            for (var i = 0; i<labelmapTable.length;i++){
                var name = labelmapTable[i][1];
                var class_id = Number(labelmapTable[i][3]);
                if (classId == class_id && mesh.partLabel == name){
                    var map_label_id = Number(labelmapTable[i][2]);
                    var index = labelId.indexOf(map_label_id);
                    mesh.material.color = new THREE.Color(labelColors[index]);

                    //save the initial labels as label result
                    labelResult.push([mesh.partName,map_label_id]);
                }
            }

            // Add to 3D scene
            scene.add( mesh );
            render();
        }

        // add initial fine matches for match tasks
        if (nCompleted > nLabel-1){
            //save the initial matches as match result
            for (var i = 0;i<addedParts.length;i++){
                var mesh1 = addedParts[i];
                if ((mesh1.shapeName != mesh.shapeName) && (mesh1.finePartLabel == mesh.finePartLabel)){
                    if (mesh1.shapeName == shapeName[0]){
                           matchResult.push([mesh1.partName,mesh.partName]);
                    }
                    else{
                        matchResult.push([mesh.partName,mesh1.partName]);
                    }
                    // show initial matches
                    var index = AllFinePartLabel.indexOf(mesh.finePartLabel);
                    if (index == -1){
                        AllFinePartLabel.push(finePartLabel);
                        mesh1.material.color = new THREE.Color(matchColors[AllFinePartLabel.length-1]);
                        mesh.material.color = new THREE.Color(matchColors[AllFinePartLabel.length-1]);
                    }
                    else{
                        mesh1.material.color = new THREE.Color(matchColors[index]);
                        mesh.material.color = new THREE.Color(matchColors[index]);
                    }
                }
            }
            addedParts.push(mesh);
            // Add to 3D scene
            scene.add( mesh );
            render();
        }

        numLoadedParts++;
        if(numLoadedParts >= partsCount)
            hideLoadingScreen();
    });
}
function clearInterface() {
    //if (nCompleted < nLabel){
        // remove label bars
        $("#labelBar").remove();
        $("#hint").remove();
        $("#subhint").remove();
    //}

    // remove all parts in the scene
    // go over all parts in the scene
    var i = 0;
    do {
        var part = scene.children[i];

        // Only consider the 'meshes' of the scene
        if ( part instanceof THREE.Mesh )
        {
            // remove from 3D scene
            scene.remove(part);
            //console.log(part.partName);  //Debug
        }
        else
        {
            i = i + 1;
        }
    }
    while(i<scene.children.length);
}
function addLabelBar(labelId,labelName)
{
    // add label bars in the scene
    var str1 = "labelBar";
    var str2 = "<div id=" + str1 + ">" + "</div>";
    $("#container").append(str2);
    $("#labelBar").parent().css({position: 'relative'});
    $("#labelBar").css({top: windowHeight/5, left: 0, position:'absolute'});

    for (var i=0; i<labelId.length;i++) {
        // record labelId in "id"
        str1= "labelId_" + labelId[i];
        // show label name
        str2 = "<div id=" + str1 + "> " + labelName[i] + " </div>";
        $("#labelBar").append(str2);
        var str3 = "#" + str1;
        $(str3).css("background-color",labelColors[i]);
        $(str3).css("height",barHeight+"px");
        $(str3).css("width",barWidth+"px");
        $(str3).css("padding-top",barHeight/2+"px");
        $(str3).css("text-align","center");
        $(str3).css("font-size",barHeight/2+"px");
    }
}

function updatePartColor(newColor){
    for (var i = 0; i < scene.children.length; i++) {
        var part = scene.children[i];

        // Only consider the 'meshes' of the scene
        if (part instanceof THREE.Mesh) {
            for (var j = 0; j<selectedPartsName.length;j++){
                if ((part.shapeName == selectedPartsName[j][0]) && (part.partName == selectedPartsName[j][1])){
                    part.material.color = new THREE.Color(newColor);
                }
            }
        }
    }
    render();
}
function addHint(counter, total){
    var progressText = "<span class='progressText'>(" + counter + "/" + total + ")</span>";

    // add hint
    if (nCompleted < nLabel){
        var str1 = "hint";
        var str2 = "Please assign the coarse labels for this shape " + progressText;
        var str3 = "<div id=" + str1 + ">" + str2 + "</div>";
        var str4 = "First double click on parts of the shape, then click on a label.";
        var str5 = "<div id='subhint'>" + str4 + "</div>";
        $("#container").append(str3);
        $("#container").append(str5);
        $("#hint").parent().css({position: 'relative'});
    }
    else if (nCompleted > nLabel-1){
        var str1 = "hint";
        var str2 = "Please match fine parts for the shape pair " + progressText;
        var str3 = "<div id=" + str1 + ">" + str2 + "</div>";
        var str4 = "Double click on parts from two shapes, then double click background to match. Or select parts on only one shape, then double click to leave them unmatched.";
        var str5 = "<div id='subhint'>" + str4 + "</div>";
        $("#container").append(str3);
        $("#container").append(str5);
        $("#hint").parent().css({position: 'relative'});
    }
}
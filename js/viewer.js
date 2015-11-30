/**
 * Created by sla278 on 11/18/2015.
 */
var container, stats;
var camera, controls, scene, renderer;
var raycaster, mouse;

var windowWidth = 512;
var windowHeight = 512;

var labelColors = ["#A9A9A9","#00FFFF","#0000FF","#FF00FF","#7FFF00","#D2691E","#006400","#FF69B4","#DC143C"];
var matchColors = ["#00FFFF","#0000FF","#FF00FF","#7FFF00","#D2691E","#006400","#FF69B4","#DC143C"];
var selectedPartsName = new Array();

// Initialize the 3D viewer
function init() {

    camera = new THREE.PerspectiveCamera( 60, windowWidth / windowHeight, 0.1, 1000 );
    camera.position.z = 6;

    controls = new THREE.TrackballControls( camera );

    controls.rotateSpeed = 1.0;
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
    var axisHelper = new THREE.AxisHelper( 0.5 );
    scene.add( axisHelper );

    // lights

    var light = new THREE.DirectionalLight( 0xffffff );
    light.position.set( 1, 1, 1 );
    scene.add( light );

    light = new THREE.DirectionalLight( 0x222222 );
    light.position.set( -1, -1, -1 );
    scene.add( light );

    light = new THREE.AmbientLight( 0x222222 );
    scene.add( light );

    // renderer
    renderer = new THREE.WebGLRenderer( { antialias: true } );
    renderer.setClearColor( new THREE.Color("rgb(200, 200, 200)") );
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

                if(clicks === 1) {

                    timer = setTimeout(function() {

                        //console.log(clicks);
                        //alert("Single Click");  //perform single-click action
                        clicks = 0;             //after action performed, reset counter

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
                                selectedPart.material.color = new THREE.Color(0xFF0000); // red

                                //console.log( selectedPart.partName );
                                //console.log( selectedPart.partLabel );
                                //console.log( selectedPart.finePartLabel );


                                //Todo
                                // add red dots on selected parts
                                //var sphereGeometry = new THREE.SphereGeometry( 200, 50, 50 );
                                //var sphereMaterial = new THREE.MeshPhongMaterial( { color:0xff0000, transparent:true, opacity:1 } );
                                //sphere = new THREE.Mesh( sphereGeometry, sphereMaterial );
                                //sphere.position.set(0,30,0);
                                //scene.add(sphere);

                                selectedPartsName.push([selectedPart.shapeName,selectedPart.partName]);
                            }
                        }

                        render();

                    }, DELAY);

                } else {
                    //console.log(clicks);
                    clearTimeout(timer);    //prevent single-click action
                    alert("Double Click");  //perform double-click action
                    clicks = 0;             //after action performed, reset counter

                    // Only df there are selected parts, do ...
                    if (typeof selectedPartsName[0] !== 'undefined' && selectedPartsName[0] !== null){

                        // remove the results of selected parts from labelResult
                        for (var i = 0; i < selectedPartsName.length;i++){
                            for (var j = 0; j < labelResult.length;j++){
                                if (labelResult[j][0] == selectedPartsName[i][1] ){
                                    //console.log(j);
                                    //console.log(labelResult[j]);
                                    //console.log(labelResult[j+1]);
                                    labelResult.splice(j,1);
                                    //Debug
                                    //console.log(labelResult[j]);
                                }
                            }

                        }
                        // update selected parts' color
                        //updatePartColor(unlabelColor);
                        // empty selectedPartsName
                        selectedPartsName = [];
                    }

                }

            })
            .on("dblclick", function(event){
                event.preventDefault();  //cancel system double-click event
            });

    });
    //
    render();
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
    var manager = new THREE.LoadingManager();

    var loader = new THREE.OBJLoader( manager );
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

        // Add part properties
        mesh.shapeName = shapeDirName;
        mesh.partName = partName;
        mesh.partLabel = partLabel;
        mesh.finePartLabel = finePartLabel;

        // Add to 3D scene
        scene.add( mesh );
        render();
    });
}
function clearInterface() {
    // remove label bars
    $("#labelBar").remove();

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
    $("#labelBar").css({top: 0, left: 512, position:'absolute'});

    for (var i=0; i<labelId.length;i++) {
        // record labelId in "id"
        str1= "labelId_" + labelId[i];
        // show label name
        str2 = "<div id=" + str1 + "> " + labelName[i] + " </div>";
        $("#labelBar").append(str2);
        var str3 = "#" + str1;
        $(str3).css("background-color",labelColors[i]);
        $(str3).css("height","20px");
        $(str3).css("width","100px");
    }

}

function addInitialLabel(classId,labelId,labelmapTable) {
    // add initial labels on the parts of the shape

    // empty selectedPartsName and labelResult
    selectedPartsName = [];
    labelResult = [];
    // go over all parts of the shape
    for (var i = 0; i < scene.children.length; i++) {
        var part = scene.children[i];

        // Only consider the 'meshes' of the scene
        if (part instanceof THREE.Mesh) {
            // search for the mapping label id of its initial label
            for (var j = 0; j<labelmapTable.length;j++){
                var name = labelmapTable[j][1];
                var class_id = Number(labelmapTable[j][3]);
                if (classId == class_id && part.partLabel == name){
                    var map_label_id = Number(labelmapTable[j][2]);
                    var index = labelId.indexOf(map_label_id);
                    part.material.color = new THREE.Color(labelColors[index]);

                    //save the initial labels as label result
                    labelResult.push([part.partName,map_label_id]);
                }
            }
        }
    }
    //console.log(labelResult);
    render();
}

function updatePartColor(newColor){
    for (var i = 0; i < scene.children.length; i++) {
        var part = scene.children[i];

        // Only consider the 'meshes' of the scene
        if (part instanceof THREE.Mesh) {
            for (var j = 0; j<selectedPartsName.length;j++){
                if (part.partName == selectedPartsName[j][1]){
                    part.material.color = new THREE.Color(newColor);
                }
            }
        }
    }
    render();
}

function loadInitialMatch(shapeName) {
    // empty selectedPartsName and labelResult
    selectedPartsName = [];
    matchResult = [];

    var finePartLabel = new Array();
    var newColor = new Array();
    var k = 0;

    for (var i = 0; i < scene.children.length; i++) {
        var part1 = scene.children[i];
        // Only consider the 'meshes' of the scene
        if ((part1 instanceof THREE.Mesh) && (part1.shapeName == shapeName[0])) {
            var index = finePartLabel.indexOf(part1.finePartLabel);
            if ( index == -1) {
                finePartLabel.push([part1.finePartLabel]);
                newColor.push(matchColors[k]);k = k+1;
                index = finePartLabel.length -1;
            }

            for (var j = 0; j < scene.children.length; i++) {
                var part2 = scene.children[j];
                // Only consider the 'meshes' of the scene
                if ((part2 instanceof THREE.Mesh) && (part2.shapeName == shapeName[1])) {

                    if (part1.finePartLabel == part2.finePartLabel){
                        matchResult.push([part1.partName, part2.partName,newColor[index]]);
                        part1.material.color = new THREE.Color(newColor[index]);
                        part2.material.color = new THREE.Color(newColor[index]);
                    }

                }
            }
        }
    }
    render();

}
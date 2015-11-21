/**
 * Created by sla278 on 11/18/2015.
 */

var container, stats;
var camera, controls, scene, renderer;
var raycaster, mouse;

var windowWidth = 512;
var windowHeight = 512;

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

    // Selecion
    raycaster = new THREE.Raycaster();
    mouse = new THREE.Vector2();

    // Events:
    window.addEventListener( 'resize', onWindowResize, false );

    // Mouse event
    $("#container").click(function(event) {
        mouse.x = ( event.offsetX / windowWidth ) * 2 - 1;
        mouse.y = - ( event.offsetY / windowHeight ) * 2 + 1;
    });

    $("#container").click(function(event){
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

                console.log( selectedPart.partName );
                console.log( selectedPart.partLabel );
                console.log( selectedPart.finePartLabel );
            }
        }

        render();
    });

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

function addPart(partName, meshFilename, partLabel, finePartLabel, t ) {
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
        mesh.partName = partName;
        mesh.partLabel = partLabel;
        mesh.finePartLabel = finePartLabel;

        // Add to 3D scene
        scene.add( mesh );
        render();
    });
}


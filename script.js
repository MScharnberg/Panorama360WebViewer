import * as THREE from './node_modules/three/build/three.module.js';
import { CSS3DRenderer, CSS3DObject } from './node_modules/three/examples/jsm/renderers/CSS3DRenderer.js';
var camera, scene, renderer;
var target = new THREE.Vector3();
var lon = 90, lat = 0;
var phi = 0, theta = 0;
var touchX, touchY;
var animation = false;
var menu = true;
var button_animation = document.getElementById('btn-animation');
var button_menu = document.getElementById('btn-menu');

function init() {
    camera = new THREE.PerspectiveCamera( 75, window.innerWidth / window.innerHeight, 1, 1000 );
    scene = new THREE.Scene();
    var sides = [
        {
            url: imgRIGHT,
            position: [ - 512, 0, 0 ],
            rotation: [ 0, Math.PI / 2, 0 ]
        },
        {
            url: imgLEFT,
            position: [ 512, 0, 0 ],
            rotation: [ 0, - Math.PI / 2, 0 ]
        },
        {
            url: imgUP,
            position: [ 0, 512, 0 ],
            rotation: [ Math.PI / 2, 0, Math.PI ]
        },
        {
            url: imgDOWN,
            position: [ 0, - 512, 0 ],
            rotation: [ - Math.PI / 2, 0, Math.PI ]
        },
        {
            url: imgFRONT,
            position: [ 0, 0, 512 ],
            rotation: [ 0, Math.PI, 0 ]
        },
        {
            url: imgBACK,
            position: [ 0, 0, - 512 ],
            rotation: [ 0, 0, 0 ]
        }
    ];
    for ( var i = 0; i < sides.length; i ++ ) {
        var side = sides[ i ];
        var element = document.createElement( 'img' );
        element.width = 1026; // 2 pixels extra to close the gap.
        element.src = side.url;
        var object = new CSS3DObject( element );
        object.position.fromArray( side.position );
        object.rotation.fromArray( side.rotation );
        scene.add( object );
    }
    renderer = new CSS3DRenderer();
    renderer.setSize( window.innerWidth, window.innerHeight );
    document.body.appendChild( renderer.domElement );
    //
    document.addEventListener( 'mousedown', onDocumentMouseDown, false );
    document.addEventListener( 'wheel', onDocumentMouseWheel, false );
    document.addEventListener( 'touchstart', onDocumentTouchStart, false );
    document.addEventListener( 'touchmove', onDocumentTouchMove, false );
    window.addEventListener( 'resize', onWindowResize, false );
}
function onWindowResize() {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize( window.innerWidth, window.innerHeight );
}
function onDocumentMouseDown( event ) {
    event.preventDefault();
    document.addEventListener( 'mousemove', onDocumentMouseMove, false );
    document.addEventListener( 'mouseup', onDocumentMouseUp, false );
}
function onDocumentMouseMove( event ) {
    var movementX = event.movementX || event.mozMovementX || event.webkitMovementX || 0;
    var movementY = event.movementY || event.mozMovementY || event.webkitMovementY || 0;
    lon -= movementX * 0.1;
    lat += movementY * 0.1;
}
function onDocumentMouseUp() {
    document.removeEventListener( 'mousemove', onDocumentMouseMove );
    document.removeEventListener( 'mouseup', onDocumentMouseUp );
}
function onDocumentMouseWheel( event ) {
    var fov = camera.fov + event.deltaY * 0.05;
    camera.fov = THREE.Math.clamp( fov, 10, 75 );
    camera.updateProjectionMatrix();
}
function onDocumentTouchStart( event ) {
    event.preventDefault();
    var touch = event.touches[ 0 ];
    touchX = touch.screenX;
    touchY = touch.screenY;
}
function onDocumentTouchMove( event ) {
    event.preventDefault();
    var touch = event.touches[ 0 ];
    lon -= ( touch.screenX - touchX ) * 0.1;
    lat += ( touch.screenY - touchY ) * 0.1;
    touchX = touch.screenX;
    touchY = touch.screenY;
}
function animate() {
    requestAnimationFrame( animate );
    (animation === true) ? lon += 0.1 : lon += 0;
    //lon += 0.1;
    lat = Math.max( - 85, Math.min( 85, lat ) );
    phi = THREE.Math.degToRad( 90 - lat );
    theta = THREE.Math.degToRad( lon );
    target.x = Math.sin( phi ) * Math.cos( theta );
    target.y = Math.cos( phi );
    target.z = Math.sin( phi ) * Math.sin( theta );
    camera.lookAt( target );
    renderer.render( scene, camera );
}

var input = document.getElementById("fileInput");
input.addEventListener("change",updateImages);
var imgUP, imgDOWN, imgRIGHT, imgLEFT, imgFRONT, imgBACK;
function updateImages() {
    var viewBox = document.querySelector("[style]");
    if(viewBox)
        viewBox.parentNode.removeChild(viewBox);

    if(input.files.length<6){
        imgUP = 'example_skybox/up.jpg';
        imgDOWN = 'example_skybox/down.jpg';
        imgRIGHT = 'example_skybox/right.jpg';
        imgLEFT = 'example_skybox/left.jpg';
        imgFRONT = 'example_skybox/front.jpg';
        imgBACK = 'example_skybox/back.jpg';
    }
    else {
        imgUP = URL.createObjectURL(input.files[5]);
        imgDOWN = URL.createObjectURL(input.files[1]);
        imgRIGHT = URL.createObjectURL(input.files[4]);
        imgLEFT = URL.createObjectURL(input.files[3]);
        imgFRONT = URL.createObjectURL(input.files[2]);
        imgBACK = URL.createObjectURL(input.files[0]);
    }
    init();
}
updateImages();

//init();
animate();


button_animation.onclick = function animationStartStop() {
    (animation === true) ? animation = false : animation = true;
    (button_animation.innerHTML === 'Start Animation') ? button_animation.innerHTML = 'Stop Animation' : button_animation.innerHTML = 'Start Animation';
}

button_menu.onclick = function menuHideShow() {
    if(menu) {
        menu = false;
        document.getElementById('menu').style.left = '-360px';
        document.getElementById('menu').style.transition = 'left 1s';
    }
    else {
        menu = true;
        document.getElementById('menu').style.left = '0px';
    }
    (button_menu.innerHTML === 'Hide Menu') ? button_menu.innerHTML = 'Show Menu' : button_menu.innerHTML = 'Hide Menu';
}
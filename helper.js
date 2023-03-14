var DEV_MODE = false;    //switch to true for development mode for PIXI spline handle coordinates

const CANVAS = document.getElementById("renderCanvas");
const ENGINE = new BABYLON.Engine(CANVAS, true);
var MAIN_SCENE;
var MAIN_CAMERA;
var H; //environment helper
var LIGHT1;
var LIGHT2;
var PS;
var DOME;

var DEFAULT_CAMERA_POSITION = new BABYLON.Vector3(0, 1, -5);

function initSceneExtras(){
    //music source: https://freesound.org/people/szegvari/sounds/539815/
    var music = new BABYLON.Sound("backgroundMusic", "rs/background.mp3", MAIN_SCENE, null, {loop: true,autoplay: true});

    PS = new BABYLON.ParticleSystem("particles", 200);
    PS.particleTexture = new BABYLON.Texture("rs/star.png");
    PS.emitter = new BABYLON.Vector3(0, 0.5, 0);
    PS.minEmitBox = new BABYLON.Vector3(-10, -10, -10);
    PS.maxEmitBox = new BABYLON.Vector3(10, 10, 10);
    PS.emitRate = 50;
    PS.maxSize = .0005;
    PS.start();
}

function initPhysics(){
    var gravity = -4.8;
    var gravityVector = new BABYLON.Vector3(0, gravity, 0);
    var physicsPlugin = new BABYLON.CannonJSPlugin();
    MAIN_SCENE.enablePhysics(gravityVector);
    var physicsEngine = MAIN_SCENE.getPhysicsEngine();
    physicsEngine.setSubTimeStep(10);
}

function onDragStart(event) {
    this.data = event.data;
    this.alpha = 0.5;
    this.dragging = true;
}

function onDragEnd() {
    this.alpha = 1;
    this.dragging = false;
    this.data = null;
}

function onDragMove() {
    if (this.dragging) {
        const newPosition = this.data.getLocalPosition(this.parent);
        this.x = newPosition.x;
        this.y = newPosition.y;
    }
}


function getRandomFloat(min, max, decimals){
    var temp = (Math.random()*(max-min)+min).toFixed(decimals);
    return parseFloat(temp);
}
function getRandomPosNegNumber(min, max){
    var temp = Math.floor(Math.random()*2);
    switch(temp){
        case 0: return Math.floor(Math.random()*(max-min+1)+min); break;
        case 1: return (Math.floor(Math.random()*(max-min+1)+min)) * -1; break;
    }
}
function getDistance(v1, v2){
    return Math.sqrt(((v2.x-v1.x)*(v2.x-v1.x)) + ((v2.y-v1.y)*(v2.y-v1.y)) + ((v2.z-v1.z)*(v2.z-v1.z)));
}

function mainCameraLookAt(position, zOffset){
    MAIN_CAMERA.setTarget(position);
    MAIN_CAMERA.setPosition(new BABYLON.Vector3(position.x, position.y, position.z-zOffset));
    MAIN_CAMERA.detachControl();
}

function mainCameraReset(){
    MAIN_CAMERA.setTarget(BABYLON.Vector3.Zero());
    MAIN_CAMERA.setPosition(DEFAULT_CAMERA_POSITION);
    MAIN_CAMERA.attachControl(CANVAS, true);
}
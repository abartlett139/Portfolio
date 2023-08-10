ENGINE.inputElement = CANVAS;
MAIN_SCENE = new BABYLON.Scene(ENGINE);

initPhysics();

var MAIN_CAMERA = new BABYLON.ArcRotateCamera("Camera1", 0, 0, 1, new BABYLON.Vector3(0, 0.5, 0), MAIN_SCENE);
MAIN_CAMERA.position = DEFAULT_CAMERA_POSITION;
MAIN_CAMERA.attachControl(CANVAS, true);
MAIN_CAMERA.inputs.remove(MAIN_CAMERA.inputs.attached.mousewheel);
MAIN_CAMERA.panningDistanceLimit = 0.01;

LIGHT1 = new BABYLON.HemisphericLight("light1", new BABYLON.Vector3(1, 1, 0), MAIN_SCENE);
LIGHT1.intensity = .7;
LIGHT2 = new BABYLON.HemisphericLight("light1", new BABYLON.Vector3(-1, -1, 0), MAIN_SCENE);
LIGHT2.intensity = .3;

DOME = new BABYLON.PhotoDome(
    "background",
    "rs/photodome.jpg",
    {
        resolution: 72,
        size: 100
    },
    MAIN_SCENE
);
DOME.fovMultiplier = 0;
DOME.position.y = -10;

initSceneExtras();

ENGINE.runRenderLoop(function(){
    MAIN_SCENE.render();
});

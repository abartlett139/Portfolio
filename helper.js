const CANVAS = document.getElementById("renderCanvas");
const ENGINE = new BABYLON.Engine(CANVAS, true);
var MAIN_SCENE;
var MAIN_CAMERA;
var MAIN_GUI;

var LIGHT1;
var LIGHT2;
var PS;
var DOME;

var DEFAULT_CAMERA_POSITION = new BABYLON.Vector3(5, 0, 0);

function initSceneExtras(){
    PS = new BABYLON.ParticleSystem("particles", 200);
    PS.particleTexture = new BABYLON.Texture("rs/star.png");
    PS.emitter = new BABYLON.Vector3(0, 0.5, 0);
    PS.minEmitBox = new BABYLON.Vector3(-10, -10, -10);
    PS.maxEmitBox = new BABYLON.Vector3(10, 10, 10);
    PS.emitRate = 50;
    PS.maxSize = .0005;
    PS.start();

    MAIN_GUI = new GUI();
    var lSys = new LSys();
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

var bTree = {
    angle: '30',
    axiom: 'X',
    rules: 'X=F[-X][+X]',
    iterations: '4',
    length: '.5'
}

class GUI{
    constructor(){
        this.aT = BABYLON.GUI.AdvancedDynamicTexture.CreateFullscreenUI("GUI");
        this.initText();
        this.initInputs();
    }

    initText(){
        this.textStrings = ['Angle', 'Axiom', 'Rules', 'Iterations', 'Length'];
        this.textBlocks = [];
        for(var i = 0; i < this.textStrings.length; i++){
            this.textBlocks[i] = new BABYLON.GUI.TextBlock();
            this.textBlocks[i].text = this.textStrings[i];
            this.textBlocks[i].color = "white";
            this.textBlocks[i].fontSize = "12px";
            this.textBlocks[i].top = i*40 - 100;
            this.textBlocks[i].left = "-400px";
            this.aT.addControl(this.textBlocks[i]);
        }

        this.outputText = new BABYLON.GUI.InputTextArea();
        this.outputText.color = "white";
        this.outputText.fontSize = "12px"
        this.outputText.left = "400px";
        this.outputText.width = "100px";
        this.outputText.autoStretchHeight = true;
        this.outputText.top = 0;
        this.aT.addControl(this.outputText);
    }

    initInputs(){
        this.angleInput = new BABYLON.GUI.InputText();
        this.axiomInput = new BABYLON.GUI.InputText();
        this.rulesInput = new BABYLON.GUI.InputText();
        this.iterationsInput = new BABYLON.GUI.InputText();
        this.lengthInput = new BABYLON.GUI.InputText();
        this.angleInput.text = bTree.angle;
        this.axiomInput.text = bTree.axiom;
        this.rulesInput.text = bTree.rules;
        this.iterationsInput.text = bTree.iterations;
        this.lengthInput.text = bTree.length;
        this.angleInput.top = "-80px";
        this.axiomInput.top = "-40px";
        this.rulesInput.top = "0px";
        this.iterationsInput.top = "40px";
        this.lengthInput.top = "80px";
        this.angleInput.color = this.axiomInput.color = this.rulesInput.color = this.iterationsInput.color = this.lengthInput.color = "white";
        this.angleInput.fontSize = this.axiomInput.fontSize = this.rulesInput.fontSize = this.iterationsInput.fontSize = this.lengthInput.fontSize = "12px";
        this.angleInput.height = this.axiomInput.height = this.rulesInput.height = this.iterationsInput.height = this.lengthInput.height = "15px";
        this.angleInput.left = this.axiomInput.left = this.rulesInput.left = this.iterationsInput.left = this.lengthInput.left = "-400px";
        this.aT.addControl(this.angleInput);
        this.aT.addControl(this.axiomInput);
        this.aT.addControl(this.rulesInput);
        this.aT.addControl(this.iterationsInput);
        this.aT.addControl(this.lengthInput);
    }
}


class LSys{
    constructor(){
        this.stack = [];
        this.segments = [];
        this.initRules();
        this.initMaterial();
        this.initAngles();
        this.initMesh();
        this.initActions();

    }

    initMaterial(){
        this.mat = new BABYLON.StandardMaterial("goldMat", MAIN_SCENE);
        this.mat.diffuseTexture = new BABYLON.Texture("rs/goldTex.jpg", MAIN_SCENE);
    }

    initRules(){
        this.keys = [];
        this.rules = [];
        var tempRuleString = MAIN_GUI.rulesInput.text.split(" ");
        for(var i = 0; i < tempRuleString.length; i++){
            var tempRule = tempRuleString[i].split("=");
            this.keys.push(tempRule[0]);
            this.rules.push(tempRule[1]);
        }

        this.s = MAIN_GUI.axiomInput.text;

        for(var j = 0; j < MAIN_GUI.iterationsInput.text; j++){
            let next = "";
            for(var k = 0; k < this.s.length; k++){
                var c = this.s[k];
                for(var l = 0; l < this.keys.length; l++){
                    if(c === this.keys[l]){
                        next += this.rules[l];
                    }else{
                        next += c;
                    }
                }
            }
            this.s = next;
        }

        MAIN_GUI.outputText.text = this.s;
    }

    initAngles(){
        const X = new BABYLON.Vector3(1, 0, 0);
        const Y = new BABYLON.Vector3(0, 1, 0);
        const Z = new BABYLON.Vector3(0, 0, 1);

        let xPosRotation = new BABYLON.Quaternion();
        let xNegRotation = new BABYLON.Quaternion();
        let yPosRotation = new BABYLON.Quaternion();
        let yNegRotation = new BABYLON.Quaternion();
        let yReverseRotation = new BABYLON.Quaternion();
        let zPosRotation = new BABYLON.Quaternion();
        let zNegRotation = new BABYLON.Quaternion();

        this.xPosRotation = new BABYLON.Quaternion.RotationAxis( X, (Math.PI / 180) * MAIN_GUI.angleInput.text);
        this.xNegRotation = new BABYLON.Quaternion.RotationAxis( X, (Math.PI / 180) * -MAIN_GUI.angleInput.text);
        this.yPosRotation = new BABYLON.Quaternion.RotationAxis( Y, (Math.PI / 180) * MAIN_GUI.angleInput.text);
        this.yNegRotation = new BABYLON.Quaternion.RotationAxis( Y, (Math.PI / 180) * -MAIN_GUI.angleInput.text);
        this.yReverseRotation = new BABYLON.Quaternion.RotationAxis( Y, (Math.PI / 180) * 180 );
        this.zPosRotation = new BABYLON.Quaternion.RotationAxis( Z, (Math.PI / 180) * MAIN_GUI.angleInput.text);
        this.zNegRotation = new BABYLON.Quaternion.RotationAxis( Z, (Math.PI / 180) * -MAIN_GUI.angleInput.text);
    }

    initMesh(){
        this.currentSegment = new BABYLON.MeshBuilder.CreateCylinder("cylinder", {diameter: 0.075, height: MAIN_GUI.lengthInput.text});
        this.currentSegment.setPivotPoint(new BABYLON.Vector3(0, -MAIN_GUI.lengthInput.text/2, 0));
        this.currentSegment.rotationQuaternion = new BABYLON.Quaternion();
        this.currentSegment.isVisible = false;
        for(var i = 0; i < this.s.length; i++){
            var current = this.s.charAt(i);
            if(current == "F"){
                this.pushSegment();
            }else if(current == "X"){
                this.segments.push(this.currentSegment.clone());
            }else if(current == "+"){
                this.currentSegment.rotationQuaternion.multiplyInPlace(this.xPosRotation);
            }else if(current == "-"){
                this.currentSegment.rotationQuaternion.multiplyInPlace(this.xNegRotation);
            }else if(current == "&"){
                this.currentSegment.rotationQuaternion.multiplyInPlace(this.zPosRotation);
            }else if(current == "^"){
                this.currentSegment.rotationQuaternion.multiplyInPlace(this.zNegRotation);
            }else if(current == "<"){
                this.currentSegment.rotationQuaternion.multiplyInPlace(this.yNegRotation);
            }else if(current == ">"){
                this.currentSegment.rotationQuaternion.multiplyInPlace(this.yPosRotation);
            }else if(current == "|"){
                this.currentSegment.rotationQuaternion.multiplyInPlace(this.yReverseRotation);
            }else if(current == "["){
                this.stack.push(this.currentSegment.clone());
            }else if(current == "]"){
                this.currentSegment = this.stack.pop();
            }
        }
        this.mergeMeshes();
    }

    pushSegment(){
        this.segments.push(this.currentSegment.clone());
        var matrix = new BABYLON.Matrix();
        this.currentSegment.rotationQuaternion.toRotationMatrix(matrix);
        var yOffset = new BABYLON.Vector3(0, MAIN_GUI.lengthInput.text, 0);
        var rotOffset = BABYLON.Vector3.TransformCoordinates(yOffset, matrix);
        this.currentSegment.position.addInPlace(rotOffset);
    }

    mergeMeshes(){
        this.fullModel = BABYLON.Mesh.MergeMeshes(this.segments, true, true, null, false, true);
        this.fullModel.material = this.mat;
        delete(this.currentSegment);
        this.segments = [];
    }

    updateMesh(){
        this.initRules();
        this.initAngles();
        MAIN_SCENE.removeMesh(this.fullModel);
        this.initMesh();
    }

    initActions(){
        MAIN_GUI.angleInput.onTextChangedObservable.add((event)=>{
            this.updateMesh();
        });
        MAIN_GUI.axiomInput.onTextChangedObservable.add((event)=>{
            this.updateMesh();
        });
        MAIN_GUI.rulesInput.onTextChangedObservable.add((event)=>{
            this.updateMesh();
        });
        MAIN_GUI.iterationsInput.onTextChangedObservable.add((event)=>{
            this.updateMesh();
        });
        MAIN_GUI.lengthInput.onTextChangedObservable.add((event)=>{
            this.updateMesh();
        });
    }
}

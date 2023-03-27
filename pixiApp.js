//Create a Pixi Application
const app = new PIXI.Application({width: 512, height: 512, antialias: true, view: pixiCanvas, backgroundColor: 0x666666, resolution: 1});

//Add the canvas that Pixi automatically created for you to the HTML document
//document.body.appendChild(app.view);

//load an image and run the `setup` function when it's done
PIXI.Loader.shared
  .add("rs/herbert.png")
  .add("rs/herbertMad.png")
  .add("rs/warning.png")
  .load(setup);


function setup() {

    app.stage.interactive = true;
    const player = new PIXI.Sprite(PIXI.Loader.shared.resources["rs/herbert.png"].texture);
    const herbertMad = new PIXI.Sprite(PIXI.Loader.shared.resources["rs/herbertMad.png"].texture);
    const herbertWarning = new PIXI.Sprite(PIXI.Loader.shared.resources["rs/warning.png"].texture);
    
    player.x = app.renderer.width/2;
    player.y = app.renderer.height/2;
    player.anchor.x = 0.5;
    player.anchor.y = 0.5;
    player.interactive=true;

    herbertMad.x = app.renderer.width/2;
    herbertMad.y = app.renderer.height/2;
    herbertMad.anchor.x = 0.5;
    herbertMad.anchor.y = 0.5;
    herbertMad.interactive=true;
    herbertMad.visible=false;

    herbertWarning.x = app.renderer.width/2;
    herbertWarning.y = 10;
    herbertWarning.anchor.x = 0.5;

  
    app.stage.addChild(player);
    app.stage.addChild(herbertMad);
    app.stage.addChild(herbertWarning);
    
    gameState=play;

    player.mousedown=()=>{
      if(player.visible==true){
        player.visible=false;
        herbertMad.visible=true;
      }
    }

    herbertMad.mouseup=()=>{
      if(herbertMad.visible==true){
        herbertMad.visible=false;
        player.visible=true;
      }
    }

    animate();

    app.ticker.add((delta) => gameLoop(delta));
    

}

function gameLoop(delta){
   gameState(delta); 
}


function play(delta){
   
}

function animate(){
  requestAnimationFrame(animate);
}
var trex, trex_running, trex_collided;
var ground, invisibleGround, groundImage;
var PLAY = 1;
var END = 0;
var gamestate = PLAY;
var cloud, cloudsGroup, cloudImage;
var obstaclesGroup, obstacle1, obstacle2, obstacle3
var gameover,gameoverImage;
var restart,restartImage;
var jumpSound , checkPointSound, dieSound;
var score;
var back, backImg;

function preload(){
  trex_running = loadAnimation("trex1.png","trex3.png","trex4.png");
  trex_collided = loadAnimation("trex_collided.png");
  
  groundImage = loadImage("ground2.png");
  
  cloudImage = loadImage("cloud1.png");
  backImg = loadImage("Background.jpeg")
  obstacle1 = loadImage("obstacle1.png");
  obstacle2 = loadImage("obstacle2.png");
  obstacle3 = loadImage("obstacle3.png");
  gameoverImage = loadImage("gameOver.png");
  restartImage = loadImage("restart.png");
  jumpSound = loadSound("jump.mp3")
  dieSound = loadSound("die.mp3")
  checkPointSound = loadSound("checkpoint.mp3")
}

function setup() {
  createCanvas(windowWidth, windowHeight);
   obstaclesGroup = createGroup();
   cloudsGroup = createGroup();
  trex = createSprite(100,500,20,50);
  trex.addAnimation("running", trex_running);
  trex.addAnimation("collided" , trex_collided);
  trex.scale = 1.5;
  //trex.debug = true;
  trex.setCollider("circle",0.5,0,40);
  
  ground = createSprite(200,height-80,400,20);
  ground.addImage("ground",groundImage);
  ground.x = ground.width /2;
  ground.velocityX = -4;
  ground.scale= 3
  
  invisibleGround = createSprite(50,height-80,400,10);
  invisibleGround.visible = false;
  
  gameover = createSprite(width-700,100);
   gameover.addImage(gameoverImage);
   gameover.scale = 3;
  
  restart = createSprite(width-700,305);
   restart.addImage(restartImage);
   restart.scale = 2;
  gameover.visible = false;
  restart.visible = false;
  console.log("Hello" + 5);
  
  score = 0;
}

function draw() { 
  background(backImg);
  textSize(40);
  stroke("white")
  fill("white")
  text("HI score :"+ score, width-300,50);
 
  if (gamestate === PLAY){
     ground.velocityX = -(4 + 3*score/100);
    
    if(keyDown("space")&& trex.y >= 400) {
      trex.velocityY = -13;
      jumpSound.play();
      
    }
    trex.velocityY = trex.velocityY + 0.8
    if (ground.x < 0){
      ground.x = ground.width/2;
    }
    
  //spawn the clouds
    spawnClouds();
  
  //spawn obstacles on the ground
    spawnObstacles();
     score = score + Math.round(getFrameRate()/60);
     if(score % 100 === 0 && score > 0 ){
       checkPointSound.play();
     }
  if(obstaclesGroup.isTouching (trex)){
    gamestate = END;
    //trex.velocityY = -10;
    dieSound.play();
    
  }
  }
 else if (gamestate === END){
   ground.velocityX = 0;
   trex.velocityY = 0;
   trex.changeAnimation("collided",trex_collided)
   obstaclesGroup.setVelocityXEach(0); 
   obstaclesGroup.setLifetimeEach(-1);
   cloudsGroup.setVelocityXEach(0);
   cloudsGroup.setLifetimeEach(-1);
   gameover.visible = true;
   restart.visible = true;
   
   if(mousePressedOver(restart)){
     reset();
   }
  }
  
  trex.collide(invisibleGround);
  drawSprites();
}
function reset(){
  gamestate = PLAY;
  score = 0;
  trex.changeAnimation  ("running",trex_running);
  obstaclesGroup.destroyEach();
  cloudsGroup.destroyEach();
   gameover.visible = false;
   restart.visible = false;
}
function spawnObstacles(){
 if (frameCount % 200 === 0){
   var obstacle = createSprite(width-20,520,10,40);
   obstacle.velocityX = -(4 + 3*score/100);
   obstacle.scale =0.8
   
    // //generate random obstacles
    var rand = Math.round(random(1,3));
    switch(rand) {
      case 1: obstacle.addImage(obstacle1);
              break;
      case 2: obstacle.addImage(obstacle2);
              break;
      case 3: obstacle.addImage(obstacle3);
              break;
      default: break;
    }
   
    //assign scale and lifetime to the obstacle           
    obstacle.lifetime = 300;
   obstaclesGroup.add(obstacle)
 }
}




function spawnClouds() {
  //write code here to spawn the clouds
  if (frameCount % 100 === 0) {
    cloud = createSprite(width-20,100,40,10);
    cloud.y = Math.round(random(20,60));
    cloud.addImage(cloudImage);
    cloud.scale = 1;
    cloud.velocityX = -3;
    
     //assign lifetime to the variable
    cloud.lifetime = 200  ;
    
    //adjust the depth
    cloud.depth = trex.depth;
    trex.depth = trex.depth + 1;
    cloudsGroup.add(cloud);
    
  }
  
}
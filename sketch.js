var trex,trexrunning,trexcollided;
var ground, groundimage, invisibleground;
var obstacle, obstacle1, obstacle2, obstacle3, obstacle4, obstacle5, obstacle6;
var cloud, cloudimage;
var obstaclesGroup, cloudsGroup;
var score
var highscore
var gameState
var gameOver, gameOverimage, restart, restartimage;
var PLAY = 1;
var END = 0;
var gameState = PLAY;
var dieSound;
var checkPointSound
var jumpSound

function preload(){
  trexrunning=loadAnimation("trex1.png", "trex3.png", "trex4.png");
  groundimage=loadImage("ground2.png");
  
  obstacle1=loadImage("obstacle1.png");
  obstacle2=loadImage("obstacle2.png");
  obstacle3=loadImage("obstacle3.png");
  obstacle4=loadImage("obstacle4.png");
  obstacle5=loadImage("obstacle5.png");
  obstacle6=loadImage("obstacle6.png");
  
  trexcollided=loadImage("trex_collided.png");
  
  cloudimage=loadImage("cloud.png");
  
  gameOverimage=loadImage("gameOver.png");
  
  restartimage=loadImage("restart.png");
  
  dieSound=loadSound("die.mp3");
  
  checkPointSound=loadSound("checkPoint.mp3");
  
  jumpSound=loadSound("jump.mp3")
}

function setup() {
  createCanvas(600, 200);
  trex=createSprite(50, 150);
  trex.addAnimation("trex",trexrunning);
  trex.addAnimation("collided",trexcollided);
  trex.scale=0.5;
  
  ground=createSprite(300, 180);
  ground.addImage(groundimage);
  ground.velocityX=-4;
  
  invisibleGround=createSprite(300, 190, 600, 20);
  invisibleGround.visible=false;
  
  score=0;
  
  obstaclesGroup=createGroup();
  cloudsGroup=createGroup();
  
  gameOver = createSprite(300,100);
  restart = createSprite(300,140);
  gameOver.addImage(gameOverimage);
  gameOver.scale = 0.5;
  restart.addImage(restartimage);
  restart.scale = 0.5;

  gameOver.visible = false;
  restart.visible = false;
  
}

function draw() {
  background(255);
  
  text("SCORE "+score, 500, 30); 
  
  if(gameState===PLAY){
    score=score+Math.round (getFrameRate()/60);
    
    if (score>0 && score%100 === 0){
      checkPointSound.play();
    }
    ground.velocityX=-(4+score/100);
    
    if(ground.x<0){
      ground.x=ground.width/2;
    }

    if(keyDown("space")&& trex.y>=156){
      trex.velocityY=-10;
      jumpSound.play();
    }

    trex.velocityY=trex.velocityY+0.6

    console.log(trex.y);

    spawnClouds();
    spawnObstacles();
    
  if(obstaclesGroup.isTouching(trex)){
      gameState = END
    dieSound.play();
    }
  }
  
  else if(gameState === END) {
    gameOver.visible = true;
    restart.visible = true;
    
    //set velcity of each game object to 0
    ground.velocityX = 0;
    trex.velocityY = 0;
    obstaclesGroup.setVelocityXEach(0);
    cloudsGroup.setVelocityXEach(0);
    
    //change the trex animation
    trex.changeAnimation("collided",trexcollided);
    
    //set lifetime of the game objects so that they are never destroyed
    obstaclesGroup.setLifetimeEach(-1);
    cloudsGroup.setLifetimeEach(-1);
  
  if(mousePressedOver(restart)) {
    reset();
  }
  }
  
  trex.collide(invisibleGround);
  
  
  drawSprites();
}

function spawnClouds(){
  
  if(frameCount%100===0){
    cloud=createSprite(605, 100);
    cloud.addImage(cloudimage);
    cloud.velocityX=-4;
    cloud.scale=0.6;
    trex.depth=cloud.depth+1;
    cloud.y=random(50, 100);
    cloud.lifetime=160;
    cloudsGroup.add(cloud);
  }
}

function spawnObstacles(){
  
  if(frameCount%120===0){
    obstacle=createSprite(605, 165);
    var rand=Math.round(random(1,6))
    switch(rand){
      case 1:obstacle.addImage(obstacle1);
       break;
      case 2:obstacle.addImage(obstacle2);
       break;
      case 3:obstacle.addImage(obstacle3);
       break;
      case 4:obstacle.addImage(obstacle4);
       break;
      case 5:obstacle.addImage(obstacle5);
       break;
      case 6:obstacle.addImage(obstacle6);
       break;
       
           }
    obstacle.velocityX=-(4+score/100);
    obstacle.scale=0.5;
    obstacle.lifetime=160;
    obstaclesGroup.add(obstacle);
  }
}

function reset(){
  gameState = PLAY;
  
  gameOver.visible = false;
  restart.visible = false;
  
  obstaclesGroup.destroyEach();
  cloudsGroup.destroyEach();
  
  trex.changeAnimation("trex", trexrunning);
  
  score = 0;
  
}
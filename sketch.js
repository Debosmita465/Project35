//Create variables here
var database, dog, foodS, foodStock, position;
var dogImg, happyDogImg;

var feedButton, addButton;
var fedTime, lastFed;
var foodObject;

function preload()
{
  //load images here
  dogImg = loadImage("Dog.png");
  happyDogImg = loadImage("happydog.png");
}

function setup() {
  database = firebase.database();
  createCanvas(1000, 500);
  rectMode(CENTER);
  
  dog = createSprite(550,350,20,20);
  dog.addImage(dogImg);
  dog.scale = 0.3;

  foodObject = new Food();

  foodStock = database.ref('Food');
  foodStock.on("value", readStock);

  feedButton = createButton("Feed the dog");
  feedButton.position(700,95);
  feedButton.mousePressed(FeedDog);

  addButton = createButton("Add Food");
  addButton.position(800,95);
addButton.mousePressed(AddFood);
}


function draw() {  
  background(46,139,87);
foodObject.display();
  drawSprites();

  fedTime = database.ref('fedTime');
  fedTime.on("value",function(data){
    lastFed = data.val();
  });

  fill(255,255,254);
 textSize(15);
 if(lastFed>=12){
   text("Last Feed :"+ lastFed%12 + "PM", 350,30);
 }
 else if(lastFed==0){
   text("Last Feed : 12AM", 350,30);
 }
 else{
   text("Last Feed :"+ lastFed + "AM",350,30);
 }

 drawSprites();
}

function readStock(data){
  foodS = data.val();
  foodObject.updateFoodStock(foodS);
}

function FeedDog(){
  dog.addImage(happyDogImg);
  foodObject.updateFoodStock(foodObject.getFoodStock()-1);
  database.ref('/').update({
    Food:foodObject.getFoodStock(),
    fedTime:hour()
  })
}

function AddFood(){
  foodS++;
  database.ref('/').update({
    Food:foodS
  })
}
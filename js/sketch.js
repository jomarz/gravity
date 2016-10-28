var G = 0.00001;
var speedMinAuto = 3;
var speedRangeAuto = 7.5;
var massMinAuto = 10;
var massRangeAuto = 100;
var distMinAuto = 10;
var distRangeAuto = 300;
var numMassesAuto = 500;
var masses = [];
var newMass = {};

var distance;
var force;
var i;
var j;
var k;
var initTimeSpan = 5;
var timeSpan = initTimeSpan;
var magnif = 1;

var playing = true;
var showTrayectories = false;
var walls = false;
var drag = false;
var createMass = false;

var massesCanvas; //  this will be a graphics buffer to draw the masses
var trayecCanvas; //  this will be a graphics buffer to draw the trayectories of the masses
var velCanvas;  //  this will be a graphics buffer to draw the velocity vector of new masses

var canvasWidth = 800;
var canvasHeight = 600;
var controlsHeight = 50;
var bgColor;
var bgRed = 200;
var bgGreen = 200;
var bgBlue = 200;

var screenCenterX = canvasWidth/2;
var screenCenterY = (canvasHeight-controlsHeight)/2;

function setup() {
  var myCanvas = createCanvas(canvasWidth,canvasHeight); //This also sets variables width and height equal to canvasWidth and canvasHeight
  myCanvas.parent("canvasContainer");
  massesCanvas = createGraphics(canvasWidth, canvasHeight);
  trayecCanvas = createGraphics(canvasWidth, canvasHeight);
  velCanvas = createGraphics(canvasWidth, canvasHeight);
  ellipseMode(CENTER);
  bgColor = color(200,200,200);
  background(bgColor);
}

function draw() {
  if (playing == true) {
    noFill();
    stroke(1);
    rect(0,0, width-1, height-controlsHeight-1);
    /*if(mouseIsPressed) {
      if (mouseX>0 && mouseX<width && mouseY>0 && mouseY<height-controlsHeight) { //If click is done inside the Space, change the direction
        var xDist = mouseX - ball1X;
        var yDist = mouseY - ball1Y;
        vel1X = xDist / Math.sqrt(xDist*xDist + yDist*yDist);
        vel1Y = yDist / Math.sqrt(xDist*xDist + yDist*yDist);
      }
    }*/
    //force = getForce(ball1X, ball1Y, ball2X, ball2Y, ball1Mass, ball2Mass);
    for (j=0; j<masses.length; j++) { 
      //Reset accelerations for all masses and put 
      masses[j].xAccel = 0;
      masses[j].yAccel = 0;
      //Draw a point in the trayectories buffer in the position of every mass
      trayecCanvas.stroke('yellow');
      trayecCanvas.strokeWeight(1);
      trayecCanvas.point(masses[j].xPos*magnif+screenCenterX, masses[j].yPos*magnif+screenCenterY);
    }
    for (i=0; i<masses.length; i++) { //Calculate the net acceleration of each mass
      for (k=i+1; k<masses.length; k++) {
        distance = dist(masses[i].xPos, masses[i].yPos, masses[k].xPos, masses[k].yPos);
        
        if(distance<(masses[i].radius+masses[k].radius)) { 
          //If two masses touch...
          //This is treated as an inelastic collision and calculated through conservation of momentum
          masses[i].xVel = (masses[i].mass*masses[i].xVel + masses[k].mass*masses[k].xVel)/(masses[i].mass + masses[k].mass)
          masses[i].yVel = (masses[i].mass*masses[i].yVel + masses[k].mass*masses[k].yVel)/(masses[i].mass + masses[k].mass)
          masses[i].mass = masses[i].mass + masses[k].mass;
          masses[i].radius = Math.log10(masses[i].mass);
          masses.splice(k, 1);
        }
        else {
          force = G*masses[i].mass*masses[k].mass/(distance*distance);
          masses[i].xAccel += ((masses[k].xPos-masses[i].xPos)/distance)*force/masses[i].mass;
          masses[i].yAccel += ((masses[k].yPos-masses[i].yPos)/distance)*force/masses[i].mass;
          masses[k].xAccel += -((masses[k].xPos-masses[i].xPos)/distance)*force/masses[k].mass;
          masses[k].yAccel += -((masses[k].yPos-masses[i].yPos)/distance)*force/masses[k].mass;
        }
      }
    }
    /*var xCenterMass = 0;
    var yCenterMass = 0;
    var totalMass = 0;
    var xTempCenter;
    var yTempCenter;
    for (j=0; j<masses.length; j++) {
      xCenterMass += masses[j].xPos * masses[j].mass;
      yCenterMass += masses[j].yPos * masses[j].mass;
      totalMass += masses[j].mass;
    }
    xCenterMass = xCenterMass / totalMass;
    yCenterMass = yCenterMass / totalMass;
    for (j=0; j<masses.length) {
      xTempCenter = xCenterMass-masses[j].xPos+masses[j].mass/totalMass;
      yTempCenter = yCenterMass-masses[j].yPos+masses[j].mass/totalMass;
      distance = dist(xTempCenter, yTempCenter, masses[j].xPos, masses[j].yPos);
      force = G*(totalMass-masses[j].mass)*masses[j].mass/(distance*distace);
    }*/
    for (j=0; j<masses.length; j++) { // Get the new position and velocity of each mass
      masses[j].xVel += masses[j].xAccel*timeSpan;
      masses[j].yVel += masses[j].yAccel*timeSpan;
      masses[j].xPos += masses[j].xVel*timeSpan;
      masses[j].yPos += masses[j].yVel*timeSpan;
    }
    //console.log(masses.length);
    if (walls == true) {  //Handle collisions the the borders of the canvas in case you want that
      for(j=0; j<masses.length; j++) {
        if (masses[j].xPos<masses[j].radius/2 || masses[j].xPos>(canvasWidth-masses[j].radius)) { //If the ball has collided with the left or right borders
          masses[j].xVel = -masses[j].xVel;
        }
        if (masses[j].yPos<masses[j].radius || masses[j].yPos>(canvasHeight-controlsHeight-masses[j].radius)) { //If the ball has collided with the left or right borders
          masses[j].yVel = -masses[j].yVel;
        }
      }
    }
    
    clear();
    background(bgColor);
    if (showTrayectories == true) {
      image(trayecCanvas);
    }
    fill('DimGray');
    stroke('DimGray');
    for(j=0; j<masses.length; j++) {
      ellipse(masses[j].xPos*magnif+screenCenterX, masses[j].yPos*magnif+screenCenterY, ceil(masses[j].radius*magnif*2), ceil(masses[j].radius*magnif*2));
    }
    image(velCanvas);
    fill('CadetBlue');
    noStroke();
    rect(0, height-controlsHeight, width, controlsHeight);
  }
}

function mouseClicked () {
  if (mouseX > 0 && mouseX < width && mouseY > height-controlsHeight && mouseY < height) {//If click is done in the controls
    if (playing == true) {
      playing = false;
    } else if (playing == false) {
      playing = true;
    }
  }
}

function mouseWheel(event) {
  if (event.delta<0) {
    magnif = magnif*1.5;
  } else {
    magnif = magnif/1.5;
  }
  trayecCanvas = createGraphics(canvasWidth, canvasHeight);
  background(bgRed, bgGreen, bgBlue);
  return false;
}

function mousePressed() {
  if (mouseX > 0 && mouseX < width && mouseY > 0 && mouseY < height-controlsHeight) {
    if (keyIsDown(CONTROL)) {
      drag = true;
    }
    else {
      createMass = true;
      newMass = {};
      newMass = {
        mass: parseInt($("#mass").val()),
        radius: Math.log10(parseInt($("#mass").val())),
        xPos: mouseX,
        yPos: mouseY,
        xVel: 0,
        yVel: 0,
        xAccel: 0,
        yAccel: 0
      };
    }
  }
}

function mouseDragged() { 
  if (drag == true && keyIsDown(CONTROL)) {//How to handle dragging the view according to mouse drag
    screenCenterX += mouseX-pmouseX;
    screenCenterY += mouseY-pmouseY;
    background(bgRed, bgGreen, bgBlue);
  }
  else if (createMass == true) { //Show a line indicating the speed of the new mass to add
    velCanvas = createGraphics(canvasWidth, canvasHeight);
    velCanvas.strokeWeight(1);
    velCanvas.stroke('blue');
    velCanvas.line(newMass.xPos, newMass.yPos, mouseX, mouseY);
  }
  return false;
}

function mouseReleased() {
  if (drag == true) {
    trayecCanvas = createGraphics(canvasWidth, canvasHeight);
    drag = false;
  }
  else if (createMass == true) {
    velCanvas = createGraphics(canvasWidth, canvasHeight);
    newMass.xVel = (mouseX - newMass.xPos)/100;
    newMass.yVel = (mouseY - newMass.yPos)/100;
    newMass.xPos = (newMass.xPos-screenCenterX)/magnif;
    newMass.yPos = (newMass.yPos-screenCenterY)/magnif;
    masses.push(newMass);
    createMass = false;
  }
}

function starCloud() {
  masses = [];
  newMass = {};
  newMass = {
    mass: 1000000,
    radius: 6,
    xPos: 0,
    yPos: 0,
    xVel: 0,
    yVel: 0,
    xAccel: 0,
    yAccel: 0
  };
  masses.push(newMass);
  for (j=0; j<numMassesAuto; j++) { //Generate all the random masses around the star
    var mass = massRangeAuto*Math.random() + massMinAuto;
    var anglePos = 2*Math.PI*Math.random();
    var distFromStar = distRangeAuto*Math.random() + distMinAuto;
    var angleVel = 2*Math.PI*Math.random();
    var speed = speedRangeAuto*Math.random() + speedMinAuto;
    newMass = {
      mass: mass,
      radius: Math.log10(mass),
      xPos: 0+distFromStar*Math.cos(anglePos),
      yPos: 0+distFromStar*Math.sin(anglePos),
      xVel: speed*Math.cos(angleVel)/mass,
      yVel: speed*Math.sin(angleVel)/mass,
      xAccel: 0,
      yAccel: 0
    };
    masses.push(newMass);
  }
}

$(document).ready(function(){
  $("#trayecBtn").click(function(){ //Turn On/Off displaying trayectories
    if($(this).val() == "false") {
      showTrayectories = true;
      $(this).val("true");
    }
    else {
      showTrayectories = false;
      $(this).val("false");
    }
  });
  
  $("#clearAllBtn").click(function(){
    masses = [];
    trayecCanvas = createGraphics(canvasWidth, canvasHeight);
  });
  
  $("#clearTrayecBtn").click(function(){
    trayecCanvas = createGraphics(canvasWidth, canvasHeight);
  });
  
  $("#starCloudBtn").click(function(){
    trayecCanvas = createGraphics(canvasWidth, canvasHeight);
    starCloud();
  });
  
  $("#timeSpan").val("1");
  $("#timeSpan").change(function(){
    timeSpan = initTimeSpan*parseInt($(this).val());
  });
  
});
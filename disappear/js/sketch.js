var img = [];
var bigImage;
var numImages = 9;
var imgAlpha = 255; //Image transparency. 0 to 255. 0 is totally transparent.
var currImage = 0;  //Current image index in the faces array
var action = 'fading';   //Current action being done. 'fading' for fading the image in the center or 'moving' for moving image away
var textStrength = 200;
var newxPos = 0;    // x position to place the next image in the collage
var message = 'En el tiempo que has vivido desde la última Feria del Libro, los rostros de aquellos que no volvieron podrían pasar uno tras otro, como aquí, sin repetirse ni una sola vez.';

function preload() {
    bigImage = loadImage('img/despair2.jpg');
    for (var i=1; i<=numImages; i++)    {
        try {
            img[i-1] = loadImage('img/face'+i+'.jpg');
        }
        catch(err) {    // Try the .png format
            img[i-1] = loadImage('img/face'+i+'.png');
        }
    }
}

function setup()    {
    createCanvas(windowWidth, windowHeight);
    imageMode(CENTER);
    textFont('Times New Roman');
    console.log(windowWidth+", "+windowHeight);
    for (var i=0; i<img.length; i++)    {
        img[i].resize(0, 170);
    }
}

function draw() {
    background('#7B7D92');
    tint(255, 100);
    image(bigImage, windowWidth/2, windowHeight/2);
    noTint();
    for (var i=0; i<currImage; i++) {
        image(img[i], i*30+10, 10, 30, 30);
    }
    if (action == 'fading') {
        tint(255, Math.floor(imgAlpha));
        image(img[currImage], windowWidth/2, windowHeight/3);
        imgAlpha -= 2;
        if(imgAlpha < 25)   {
            //action = 'moving';
            imgAlpha = 255;
            if(currImage == img.length-1)  {
                currImage = 0;
            }
            else    {
                currImage += 1;
            }
        }
    }
    else if (action == 'moving')    {
        
    }
    stroke(textStrength);
    textSize(32);
    text('Desaparecidos por la violencia en Colombia', windowHeight/6, windowHeight/2+50);
    stroke(textStrength/2);
    textSize(22);
    text(message, windowHeight/6, windowHeight/2+50+60, 800, 200);
    if(textStrength>50) {textStrength --;}
}

function windowResized() {
	resizeCanvas(windowWidth, windowHeight);
}
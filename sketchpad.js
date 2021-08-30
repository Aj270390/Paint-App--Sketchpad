var ctx;
var clearCanvas;	
var bgColor;
var canvas;
var canvasImage;	
var circleCount, squareCount, rectangleCount, lineCount, ellipseCount;
var numberOfSides, polygonMaxSides = 6;
var traingleCount, diamondCount, pentagonCount, hexagonCount;
var circles, squares, rectangles, lines, ellipses, traingles, diamonds, pentagons, hexagons;
var color;
var draggingDraw;
var draggingMove;
var dragX;
var dragY;
var dragIndexDelete;
var dragIndexMove;
var dragStartLocation;
var mouseX;
var mouseY;
var radius, radiusX, radiusY, startAngle = 0, endAngle =6;
var targetX;
var targetY;
var tempX;
var tempY;
var dx;
var dy;
var width;
var height;
var length;
var currentShape = 'scribble';
var currentColor = "#000000";
var undo = [];
var redo = [];

window.addEventListener('load', init, false);

function contextMenu(e){
  e.preventDefault()
  let menu = document.createElement("div")
  menu.id = "ctxmenu"
  menu.style = `top:${e.pageY-10}px;left:${e.pageX-40}px`
  menu.onmouseleave = () => ctxmenu.outerHTML = ''
  menu.innerHTML = '<p onclick = "deleteShapes(event)">delete </p><p onclick = "copyShape(event)">Copy</p><p onclick = "pasteShape(event)">Paste</p><p onclick = "moveshape(event)">Move</p>';
  document.body.appendChild(menu)
}
function init() 
{
    circleCount = 0;
    squareCount = 0;
    rectangleCount = 0;	
    lineCount = 0;
    ellipseCount = 0;
    traingleCount = 0;
    diamondCount = 0;
    pentagonCount = 0;
    hexagonCount = 0;
    draggingDraw = false;
    bgColor = "#000000";
    circles = [];
    squares = [];
    rectangles = [];
    lines = [];
    ellipses = [];
    traingles = [];
    diamonds = [];
    pentagons = [];
    hexagons = [];
    canvas = document.getElementById("myCanvas");
    clearCanvas = document.getElementById("clear");
    ctx = canvas.getContext('2d');
    ctx.lineWidth = 4;
    ctx.lineCap = 'round';
    ctx.strokeStyle = bgColor;
    
    //event listeners to draw circles
    canvas.addEventListener('mousedown', dragStart, false);
    canvas.addEventListener('mousemove', drag, false);
    canvas.addEventListener('mouseup', dragStop, false);
    clearCanvas.addEventListener('click',clear);
    
    //event listener to delete circle, square
    //canvas.addEventListener('dblclick', deleteShapes,false);
    canvas.addEventListener("contextmenu", contextMenu, false);
}	

///////////////////////draw shapes------------------------- 
//***************************************************************

 function drawCircle(position) {
    revertStrike();
    tempX=dragStartLocation.x;
    tempY=dragStartLocation.y;
    radius = Math.sqrt(Math.pow((tempX - position.x), 2) + Math.pow((tempY - position.y), 2));
    ctx.beginPath();
    ctx.arc(tempX, tempY, radius, 0, 2 * Math.PI, false);
    ctx.closePath();
    ctx.fillStyle = currentColor;
    ctx.fill();
}

function drawSquare(position) {
    revertStrike();
    tempX=dragStartLocation.x;
    tempY=dragStartLocation.y;
    width = Math.abs(tempX - position.x);
    height = Math.abs(tempY - position.y);
    length = width > height ? width: height;
    ctx.beginPath();
    ctx.rect(tempX, tempY,length,length);
    ctx.closePath();
    ctx.fillStyle = currentColor;
    ctx.fill();
}

function drawRectangle(position) {
    revertStrike();
    tempX = dragStartLocation.x;
    tempY = dragStartLocation.y;
    width = Math.abs(tempX - position.x);
    height = Math.abs(tempY - position.y);
    ctx.beginPath();
    ctx.rect(tempX, tempY, width, height);
    ctx.closePath();
    ctx.fillStyle = currentColor;
    ctx.fill();
}

function drawLine(position) {
    revertStrike();
    tempX = dragStartLocation.x;
    tempY = dragStartLocation.y;
    width = Math.abs(tempX - position.x);
    height = Math.abs(tempY - position.y);
    ctx.beginPath();
    ctx.moveTo(tempX, tempY);
    ctx.lineTo(tempX, tempY);
    ctx.closePath();
    ctx.fillStyle = currentColor;
    ctx.fill();
}

function drawEllipse(position) {
    revertStrike();
    tempX = dragStartLocation.x;
    tempY = dragStartLocation.y;
    radiusX = Math.sqrt(Math.pow((tempX - position.x), 2));
    radiusY= Math.sqrt(Math.pow((tempY - position.y), 2));
    ctx.beginPath();
    ctx.ellipse(tempX, tempY, radiusX, radiusY, Math.PI *2, startAngle, endAngle, false);
    ctx.closePath();
    ctx.fillStyle = currentColor;
    ctx.fill();
}

function drawPolygon(position) {
    revertStrike();
    tempX = dragStartLocation.x;
    tempY = dragStartLocation.y;
    width = Math.abs(tempX - position.x);
    height = Math.abs(tempY - position.y);
    ctx.beginPath();
    ctx.moveTo (tempX +  width * Math.cos(0), tempY +  height *  Math.sin(0));          
    for (var i = 1; i <= numberOfSides; i++) {
    ctx.lineTo (tempX + width * Math.cos(i * 2 * Math.PI / numberOfSides), tempY + height * Math.sin(i * 2 * Math.PI / numberOfSides));
    }
    ctx.closePath();
    ctx.stroke();
    ctx.fillStyle = currentColor;
    ctx.fill();
}

function caseCDrawShape(shapeType, position){
    switch(shapeType)
    {
        case 'circle': drawCircle(position)
                        break;
        case 'square': drawSquare(position);
                        break;
        case 'rectangle': drawRectangle(position)
                        break;    
        case 'line': drawLine(position);
                        break;      
        case 'ellipse': drawEllipse(position);
                        break;     
        case 'polygon': drawPolygon(position);
                        break;
    }
}

function setShapeType(shapeType, noOfSides){
    currentShape = shapeType;
    numberOfSides = noOfSides;
}

function caseCsetShapePolygonCounts(){
    switch(numberOfSides)
    {
        case 3: traingleCount = traingleCount + 1;
                    tempTriangle = {x:tempX, y:tempY, wid:width, hei:height, color:color};
                    traingles.push(tempTriangle);
                    break;
        case 4: diamondCount = diamondCount + 1;
                    tempDiamond = {x:tempX, y:tempY, wid:width, hei:height, color:color};
                    diamonds.push(tempDiamond);
                    break;
        case 5: pentagonCount = pentagonCount + 1;
                    tempPentagon = {x:tempX, y:tempY, wid:width, hei:height, color:color};
                    pentagons.push(tempPentagon);
                    break;
        case 6: hexagonCount = hexagonCount + 1;
                    tempHexagon = {x:tempX, y:tempY, wid:width, hei:height, color:color};
                    hexagons.push(tempHexagon);
                    break;
    }
}

function setShapeCounts(){
    switch(currentShape)
    {
        case 'circle': circleCount=circleCount+1;
	                    tempCircle = {x:tempX, y:tempY, rad:radius, color:color};
	                    circles.push(tempCircle);
                        break;
        case 'square': squareCount = squareCount+1;
                        tempSquare = {x:tempX, y:tempY, len:length, color:color};
	                    squares.push(tempSquare);
                        break;
        case 'rectangle': rectangleCount = rectangleCount+1;
                        tempRectangle = {x:tempX, y:tempY, wid:width, hei:height, color:color};
	                    rectangles.push(tempRectangle);
                        break;
        case 'line': lineCount = lineCount+1;
                        tempLine = {x:tempX, y:tempY, color:color};
	                    lines.push(tempLine);
                        break;
        case 'ellipse': ellipseCount = ellipseCount+1;
                        tempEllipse = {x:tempX, y:tempY, radX:radiusX, radY:radiusY, color:color};
	                    ellipses.push(tempEllipse);
                        break;
        case 'polygon': caseCsetShapePolygonCounts();
                        break;
    }
}

function dragStart(event) {
    draggingDraw = true;
    dragStartLocation = getCanvasCoordinates(event);
    ctx.beginPath();
    ctx.moveTo(dragStartLocation.x,dragStartLocation.y);
	color = ctx.strokeStyle;
    getImage();
}

function drag(event) {
    var position;
    if (draggingDraw === true) {
        putImage();
        position = getCanvasCoordinates(event);
        if(currentShape =='scribble' || currentShape =='line'){
            ctx.lineTo(position.x,position.y);
        }
        ctx.stroke();	
        ctx.lineJoin = ctx.lineCap = 'round';
        caseCDrawShape(currentShape, position);
    }
}

function dragStop(event) {
    draggingDraw = false;
    var position = getCanvasCoordinates(event);
    caseCDrawShape(currentShape, position);
	setShapeCounts(currentShape);
}
	
function getCanvasCoordinates(event) {
    var x = event.clientX - canvas.getBoundingClientRect().left;
    var y = event.clientY - canvas.getBoundingClientRect().top;
    return {x: x, y: y};
}

function getImage() {
    canvasImage = ctx.getImageData(0, 0, canvas.width, canvas.height);
}

function putImage() {
    ctx.putImageData(canvasImage, 0, 0);
}
///////////////////////draw shapes------------------------- 



////////////////////// listener events  ////////////////////////////////
function togglebtn(e){
if(e.target.classList.contains('draw'))
    { 	
        canvas.removeEventListener("mousedown", mouseDown, false);
        e.target.classList.add('move')	
		e.target.classList.remove('active')
		e.target.classList.remove('draw')
        canvas.addEventListener('mousedown', dragStart, false);
        canvas.addEventListener('mousemove', drag, false);
        canvas.addEventListener('mouseup', dragStop, false);
        canvas.style.cursor="crosshair";	
        var divs = document.querySelectorAll('.buttonSize');
			for (var i = 0; i < divs.length; i++) {
				divs[i].classList.remove('disabled');
			}		
    }
else if(e.target.classList.contains('move'))
    {   
        if(currentShape =='polygon'){
            var shapeVal = getShapeType();
            alert(shapeVal.toUpperCase() + ": Types will be moved.... To Change it, Press the desired Shape Button");
        }
        else{
            alert(currentShape.toUpperCase() + ": Types will be moved.... To Change it, Press the desired Shape Button");
        } 
        canvas.removeEventListener("mousedown", dragStart, false);
        canvas.removeEventListener("mousemove", drag, false);
        canvas.removeEventListener("mouseup", dragStop, false);
         e.target.classList.add('draw')	
		  e.target.classList.add('active')	
		  e.target.classList.remove('move')
		  var divs = document.querySelectorAll('.buttonSize');
			for (var i = 0; i < divs.length; i++) {
				divs[i].classList.add('disabled');
			}
        canvas.addEventListener('mousedown', mouseDown, false);
        canvas.style.cursor="move";	
    }
}

///////////////// To Move the Shapes **************************************************
//**************************************************************************************

function drawCircles() {
    var i;
    var x;
    var y;
    var rad;
    var color;

    ctx.fillStyle = '#FFFFFF';
    for (i=0; i < circleCount; i++) {
        rad = circles[i].rad;
        x = circles[i].x;
        y = circles[i].y;
        color=circles[i].color;
        ctx.beginPath();
        ctx.arc(x, y, rad, 0, 2*Math.PI, false);
        ctx.closePath();
        ctx.fillStyle = color;
        ctx.fill();
    }		
}	

function drawSquares() {
    var i;
    var x;
    var y;
    var length;
    var color;

    ctx.fillStyle = '#FFFFFF';
    for (i=0; i < squareCount; i++) {
        length = squares[i].len;
        x = squares[i].x;
        y = squares[i].y;
        color=squares[i].color;
        ctx.beginPath();
        ctx.rect(x, y, length, length);
        ctx.closePath();
        ctx.fillStyle = color;
        ctx.fill();
    }		
}	

function drawRectangles() {
    var i;
    var x;
    var y;
    var recWidth;
    var recHeight;
    var color;

    ctx.fillStyle = '#FFFFFF';
    for (i=0; i < rectangleCount; i++) {
        recWidth = rectangles[i].wid;
        recHeight = rectangles[i].hei;
        x = rectangles[i].x;
        y = rectangles[i].y;
        color=rectangles[i].color;
        ctx.beginPath();
        ctx.rect(x, y, recWidth, recHeight);
        ctx.closePath();
        ctx.fillStyle = color;
        ctx.fill();
    }		
}	

function drawLines() {
    var i;
    var x;
    var y;
    var color;
    ctx.fillStyle = '#FFFFFF';
    for (i=0; i < lineCount; i++) {
        x = lines[i].x;
        y = lines[i].y;
        color=lines[i].color;
        ctx.beginPath();
        ctx.moveTo(x, y);
        ctx.lineTo(x, y);
        ctx.closePath();
        ctx.fillStyle = color;
        ctx.fill();
    }		
}	

function drawEllipses() {
    var i;
    var x;
    var y;
    var ellipseRadiusX;
    var ellipseRadiusY;
    var color;
    ctx.fillStyle = '#FFFFFF';
    for (i=0; i < ellipseCount; i++) {
        ellipseRadiusX = ellipses[i].radX;
        ellipseRadiusY = ellipses[i].radY;
        x = ellipses[i].x;
        y = ellipses[i].y;
        color = ellipses[i].color;
        ctx.beginPath();
        ctx.ellipse(x, y, ellipseRadiusX, ellipseRadiusY, Math.PI *2, startAngle, endAngle, false);
        ctx.closePath();
        ctx.fillStyle = color;
        ctx.fill();
    }		
}	

function drawTriangle(totalsides){
    var polygonwidth;
    var polygonHeight;
    var x;
    var y;
    var color;
    for (var j=0; j < traingleCount; j++) {
        polygonwidth = traingles[j].wid;
        polygonHeight = traingles[j].hei;
        x = traingles[j].x;
        y = traingles[j].y;
        color = traingles[j].color;
        ctx.beginPath();
        ctx.moveTo (x +  polygonwidth * Math.cos(0), y +  polygonHeight *  Math.sin(0));          
            for (var i = 1; i <= totalsides; i++) {
            ctx.lineTo (x + polygonwidth * Math.cos(i * 2 * Math.PI / totalsides), y + polygonHeight * Math.sin(i * 2 * Math.PI / totalsides));
            }
        ctx.closePath();
        ctx.fillStyle = color;
        ctx.fill();
    }
}

function drawDiamond(totalsides){
    var polygonwidth;
    var polygonHeight;
    var x;
    var y;
    var color;
    for (var j=0; j < diamondCount; j++) {
        polygonwidth = diamonds[j].wid;
        polygonHeight = diamonds[j].hei;
        x = diamonds[j].x;
        y = diamonds[j].y;
        color = diamonds[j].color;
        ctx.beginPath();
        ctx.moveTo (x +  polygonwidth * Math.cos(0), y +  polygonHeight *  Math.sin(0));          
            for (var i = 1; i <= totalsides; i++) {
            ctx.lineTo (x + polygonwidth * Math.cos(i * 2 * Math.PI / totalsides), y + polygonHeight * Math.sin(i * 2 * Math.PI / totalsides));
            }
        ctx.closePath();
        ctx.fillStyle = color;
        ctx.fill();
    }
}

function drawPentagon(totalsides){
    var polygonwidth;
    var polygonHeight;
    var x;
    var y;
    var color;
    for (var j=0; j < pentagonCount; j++) {
        polygonwidth = pentagons[j].wid;
        polygonHeight = pentagons[j].hei;
        x = pentagons[j].x;
        y = pentagons[j].y;
        color = pentagons[j].color;
        ctx.beginPath();
        ctx.moveTo (x +  polygonwidth * Math.cos(0), y +  polygonHeight *  Math.sin(0));          
            for (var i = 1; i <= totalsides; i++) {
            ctx.lineTo (x + polygonwidth * Math.cos(i * 2 * Math.PI / totalsides), y + polygonHeight * Math.sin(i * 2 * Math.PI / totalsides));
            }
        ctx.closePath();
        ctx.fillStyle = color;
        ctx.fill();
    }
}

function drawHexagon(totalsides){
    var polygonwidth;
    var polygonHeight;
    var x;
    var y;
    var color;
    for (var j=0; j < hexagonCount; j++) {
        polygonwidth = hexagons[j].wid;
        polygonHeight = hexagons[j].hei;
        x = hexagons[j].x;
        y = hexagons[j].y;
        color = hexagons[j].color;
        ctx.beginPath();
        ctx.moveTo (x +  polygonwidth * Math.cos(0), y +  polygonHeight *  Math.sin(0));          
            for (var i = 1; i <= totalsides; i++) {
            ctx.lineTo (x + polygonwidth * Math.cos(i * 2 * Math.PI / totalsides), y + polygonHeight * Math.sin(i * 2 * Math.PI / totalsides));
            }
        ctx.closePath();
        ctx.fillStyle = color;
        ctx.fill();
    }
}

function caseCDrawPolygonShape(totalsides){
    switch(totalsides)
    {
        case 3: drawTriangle(totalsides);
                break;
        case 4: drawDiamond(totalsides);
                break;
        case 5: drawPentagon(totalsides);
                break;
        case 6: drawHexagon(totalsides);
                break;
    }
}

function drawPolygons() {
    var totalSides;
    ctx.fillStyle = '#FFFFFF';
    for(totalSides=3; totalSides <= polygonMaxSides; totalSides++){
        caseCDrawPolygonShape(totalSides);
    }		
}	

//************To check whether the circle was clicked
function isCircleClicked(shape,mx,my) {		
var dx;
var dy;
dx = mx - shape.x;
dy = my - shape.y;
return (dx*dx + dy*dy < shape.rad*shape.rad);
}
//************To check whether the square was clicked
function isSquareClicked(shape,mx,my) {		
var dx;
var dy;
dx = mx - shape.x;
dy = my - shape.y;
return (dx*dx + dy*dy < shape.len*shape.len);
}
//************To check whether the rectangle OR Polygon was clicked
function isRectPolygonClicked(shape,mx,my) {		
var dx;
var dy;
dx = mx - shape.x;
dy = my - shape.y;
return (dx*dx + dy*dy < shape.wid*shape.hei);
}
//************To check whether the line was clicked
function isLineClicked(shape,mx,my) {		
var dx;
var dy;
dx = mx - shape.x;
dy = my - shape.y;
return (dx*dx + dy*dy < shape.x*shape.y);
}
//************To check whether the ellipse was clicked
function isEllipseClicked(shape,mx,my) {		
var dx;
var dy;
dx = mx - shape.x;
dy = my - shape.y;
return (dx*dx + dy*dy < shape.radX*shape.radY);
}

function getCircleClickedShape(mouseX, mouseY){
    var i;
    var highestIndex = -1;	
    for (i=0; i < circleCount; i++) {
        if	(isCircleClicked(circles[i], mouseX, mouseY)) {
            draggingMove = true;
            if (i > highestIndex) {
                dragX = mouseX - circles[i].x;
                dragY = mouseY - circles[i].y;
                highestIndex = i;
                dragIndexMove = i;
            }				
        }
    }
    if (draggingMove) {
            window.addEventListener("mousemove", mouseMove, false);
            //Remove the circle and then push it to the top of the array
            circles.push(circles.splice(dragIndexMove,1)[0]);
    }
}

function getSquareClickedShape(mouseX, mouseY){
    var i;
    var highestIndex = -1;	
    for (i=0; i < squareCount; i++) {
        if	(isSquareClicked(squares[i], mouseX, mouseY)) {
            draggingMove = true;
            if (i > highestIndex) {
                dragX = mouseX - squares[i].x;
                dragY = mouseY - squares[i].y;
                highestIndex = i;
                dragIndexMove = i;
            }				
        }
    }
    if (draggingMove) {
        window.addEventListener("mousemove", mouseMove, false);
        //Remove the square and then push it to the top of the array
        squares.push(squares.splice(dragIndexMove,1)[0]);
    }
}

function getRectangleClickedShape(mouseX, mouseY){
    var i;
    var highestIndex = -1;	
    for (i=0; i < rectangleCount; i++) {
        if	(isRectPolygonClicked(rectangles[i], mouseX, mouseY)) {
            draggingMove = true;
            if (i > highestIndex) {
                dragX = mouseX - rectangles[i].x;
                dragY = mouseY - rectangles[i].y;
                highestIndex = i;
                dragIndexMove = i;
            }				
        }
    }
    if (draggingMove) {
        window.addEventListener("mousemove", mouseMove, false);
        //Remove the Rectangle and then push it to the top of the array
        rectangles.push(rectangles.splice(dragIndexMove,1)[0]);
    }
}

function getLineClickedShape(mouseX, mouseY){
    var i;
    var highestIndex = -1;	
    for (i=0; i < lineCount; i++) {
        if	(isLineClicked(lines[i], mouseX, mouseY)) {
            draggingMove = true;
            if (i > highestIndex) {
                dragX = mouseX - lines[i].x;
                dragY = mouseY - lines[i].y;
                highestIndex = i;
                dragIndexMove = i;
            }				
        }
    }
    if (draggingMove) {
        window.addEventListener("mousemove", mouseMove, false);
        //Remove the line and then push it to the top of the array
        lines.push(lines.splice(dragIndexMove,1)[0]);
    }
}

function getEllipseClickedShape(mouseX, mouseY){
    var i;
    var highestIndex = -1;	
    for (i=0; i < ellipseCount; i++) {
        if	(isEllipseClicked(ellipses[i], mouseX, mouseY)) {
            draggingMove = true;
            if (i > highestIndex) {
                dragX = mouseX - ellipses[i].x;
                dragY = mouseY - ellipses[i].y;
                highestIndex = i;
                dragIndexMove = i;
            }				
        }
    }
    if (draggingMove) {
        window.addEventListener("mousemove", mouseMove, false);
        //Remove the eclipse and then push it to the top of the array
        ellipses.push(ellipses.splice(dragIndexMove,1)[0]);
    }
}

function getTriangleClickedShape(){
    var i;
    var highestIndex = -1;
    for (i=0; i < traingleCount; i++) {
        if	(isRectPolygonClicked(traingles[i], mouseX, mouseY)) {
            draggingMove = true;
            if (i > highestIndex) {
                dragX = mouseX - traingles[i].x;
                dragY = mouseY - traingles[i].y;
                highestIndex = i;
                dragIndexMove = i;
            }				
        }
    }
    if (draggingMove) {
        window.addEventListener("mousemove", mouseMove, false);
        //Remove the triangle and then push it to the top of the array
        traingles.push(traingles.splice(dragIndexMove,1)[0]);
    }
}

function getDiamondClickedShape(){
    var i;
    var highestIndex = -1;
    for (i=0; i < diamondCount; i++) {
        if	(isRectPolygonClicked(diamonds[i], mouseX, mouseY)) {
            draggingMove = true;
            if (i > highestIndex) {
                dragX = mouseX - diamonds[i].x;
                dragY = mouseY - diamonds[i].y;
                highestIndex = i;
                dragIndexMove = i;
            }				
        }
    }
    if (draggingMove) {
        window.addEventListener("mousemove", mouseMove, false);
        //Remove the diamond and then push it to the top of the array
        diamonds.push(diamonds.splice(dragIndexMove,1)[0]);
    }
}

function getPentagonClickedShape(){
    var i;
    var highestIndex = -1;
    for (i=0; i < pentagonCount; i++) {
        if	(isRectPolygonClicked(pentagons[i], mouseX, mouseY)) {
            draggingMove = true;
            if (i > highestIndex) {
                dragX = mouseX - pentagons[i].x;
                dragY = mouseY - pentagons[i].y;
                highestIndex = i;
                dragIndexMove = i;
            }				
        }
    }
    if (draggingMove) {
        window.addEventListener("mousemove", mouseMove, false);
        //Remove the pentagon and then push it to the top of the array
        pentagons.push(pentagons.splice(dragIndexMove,1)[0]);
    }
}

function getHexagonnClickedShape(){
    var i;
    var highestIndex = -1;
    for (i=0; i < hexagonCount; i++) {
        if	(isRectPolygonClicked(hexagons[i], mouseX, mouseY)) {
            draggingMove = true;
            if (i > highestIndex) {
                dragX = mouseX - hexagons[i].x;
                dragY = mouseY - hexagons[i].y;
                highestIndex = i;
                dragIndexMove = i;
            }				
        }
    }
    if (draggingMove) {
        window.addEventListener("mousemove", mouseMove, false);
        //Remove the hexagon and then push it to the top of the array
        hexagons.push(hexagons.splice(dragIndexMove,1)[0]);
    }
}

function caseCgetPolygonClickedShape(mouseX, mouseY){
 	
    switch(numberOfSides)
    {
        case 3: getTriangleClickedShape();
                break;
        case 4: getDiamondClickedShape();
                break;
        case 5: getPentagonClickedShape();
                break;
        case 6: getHexagonnClickedShape();
                break;
    }
}

function caseCGetCurentClickedShape(mouseX, mouseY){
    var i;
    var highestIndex = -1;		
    switch(currentShape)
    {
        case 'circle': getCircleClickedShape(mouseX, mouseY);
                        break;
        case 'square': getSquareClickedShape(mouseX, mouseY);
                        break;
        case 'rectangle': getRectangleClickedShape(mouseX, mouseY);
                        break;
        case 'line': getLineClickedShape(mouseX, mouseY);
                        break;
        case 'ellipse': getEllipseClickedShape(mouseX, mouseY);
                        break;
        case 'polygon': caseCgetPolygonClickedShape(mouseX, mouseY);
                        break;
    }
}

/////////////////Manually Move the Shapes **************************************************
//**************************************************************************************
function caseCGetShapePolygon(){
    switch(numberOfSides)
    {
        case 3:  return {x:traingles[traingleCount-1].wid, y:traingles[traingleCount-1].hei};
                    break;
        case 4: return {x:diamonds[diamondCount-1].wid, y:diamonds[diamondCount-1].hei};
                    break;
        case 5: return {x:pentagons[pentagonCount-1].wid, y:pentagons[pentagonCount-1].hei};
                    break;
        case 6: return {x:hexagons[hexagonCount-1].wid, y:hexagons[hexagonCount-1].hei};
                    break;
    }
}

function caseCSetShapeMouseMove(){
    switch(currentShape)
    {
        case 'circle': return {x:circles[circleCount-1].rad, y: 0};
                        break;
        case 'square': return {x: squares[squareCount-1].len, y: 0};
                        break;
        case 'rectangle': return {x:rectangles[rectangleCount-1].wid, y:rectangles[rectangleCount-1].hei};
                        break;
        case 'line': return {x:lines[lineCount-1].x, y:lines[lineCount-1].y};
                        break;
        case 'ellipse': return {x:ellipses[ellipseCount-1].radX, y:ellipses[ellipseCount-1].radY};
                        break;
        case 'polygon': return caseCGetShapePolygon();
                        break;
    }
    
}

function caseCSetMouseDrawPolygon(posX, posY){
    switch(numberOfSides)
    {
        case 3:  traingles[traingleCount-1].x = posX;
                    traingles[traingleCount-1].y = posY;
                    break;
        case 4: diamonds[diamondCount-1].x = posX;
                    diamonds[diamondCount-1].y = posY;
                    break;
        case 5:  pentagons[pentagonCount-1].x = posX;
                    pentagons[pentagonCount-1].y = posY;
                    break;
        case 6: hexagons[hexagonCount-1].x = posX;
                    hexagons[hexagonCount-1].y = posY;
                    break;
    }
}

function getShapeType(){
    switch(numberOfSides)
    {
        case 3: return 'triangle'
                break;
        case 4: return 'diamond'
                break;
        case 5: return 'pentagon'
                break;
        case 6: return 'hexagon'
                break;
    }
}
function copyShape(event){
if(currentShape =='polygon'){
 var shapeVal = getShapeType();
 alert(shapeVal.toUpperCase() + ": Types will be copied.... To Change it, Press the desired Shape Button");
}
else{
    alert(currentShape.toUpperCase() + ": Types will be copied.... To Change it, Press the desired Shape Button");
}
var bRect = canvas.getBoundingClientRect();
mouseX = (event.clientX - bRect.left)*(canvas.width/bRect.width);
mouseY = (event.clientY - bRect.top)*(canvas.height/bRect.height);
caseCGetCurentClickedShape(mouseX, mouseY);
}

function pasteShape(event){
if(currentShape =='polygon'){
    var shapeVal = getShapeType();
    alert(shapeVal.toUpperCase() + ": Types will be pasted.... To Change it, Press the desired Shape Button");
}
else{
    alert(currentShape.toUpperCase() + ": Types will be pasted.... To Change it, Press the desired Shape Button");
}   
var position = getCanvasCoordinates(event);
caseCDrawShape(currentShape, position);
setShapeCounts(currentShape);
}

function moveshape(e){
    var moveId = document.getElementById("btnMve");
    moveId.click();
}

function caseCSetMouseOrDrawShape(posX, posY){
    switch(currentShape)
    {
        case 'circle': circles[circleCount-1].x = posX;
                        circles[circleCount-1].y = posY;
                        break;
        case 'square': squares[squareCount-1].x = posX;
                        squares[squareCount-1].y = posY;
                        break;
        case 'rectangle': rectangles[rectangleCount-1].x = posX;
                        rectangles[rectangleCount-1].y = posY;
                        break;
        case 'line': lines[lineCount-1].x = posX;
                        lines[lineCount-1].y = posY;
                        break;
        case 'ellipse': ellipses[ellipseCount-1].x = posX;
                         ellipses[ellipseCount-1].y = posY;
                         break;
        case 'polygon': caseCSetMouseDrawPolygon(posX, posY);
                         break;
    }
}

function mouseDown(event) 
{
var bRect = canvas.getBoundingClientRect();
mouseX = (event.clientX - bRect.left)*(canvas.width/bRect.width);
mouseY = (event.clientY - bRect.top)*(canvas.height/bRect.height);

//To find that which shape has been clicked
caseCGetCurentClickedShape(mouseX, mouseY);

canvas.removeEventListener("mousedown", mouseDown, false);
window.addEventListener("mouseup", mouseUp, false);

if (event.preventDefault) {
        event.preventDefault();
    } 
else if (event.returnValue) {
        event.returnValue = false;
    } 
return false;
}

function mouseUp(event) {
canvas.addEventListener("mousedown", mouseDown, false);
window.removeEventListener("mouseup", mouseUp, false);
if (draggingMove) {
    draggingMove = false;
    window.removeEventListener("mousemove", mouseMove, false);
  }
}

function mouseMove(event) {

var posX;
var posY;
var shapeRad = caseCSetShapeMouseMove();
var minX = shapeRad;
var maxX = canvas.width - shapeRad.x;
var minY = shapeRad;
var maxY = canvas.height - shapeRad.y;

var bRect = canvas.getBoundingClientRect();
mouseX = (event.clientX - bRect.left)*(canvas.width/bRect.width);
mouseY = (event.clientY - bRect.top)*(canvas.height/bRect.height);

posX = mouseX - dragX;
posX = (posX < minX) ? minX : ((posX > maxX) ? maxX : posX);
posY = mouseY - dragY;
posY = (posY < minY) ? minY : ((posY > maxY) ? maxY : posY);

caseCSetMouseOrDrawShape(posX, posY);
ctx.fillStyle = '#FFFFFF';
ctx.fillRect(0,0,canvas.width,canvas.height);
drawCircles();
drawSquares();
drawRectangles();
drawLines();
drawEllipses();
drawPolygons();
}

/////////////////Delete the Shapes **************************************************
//**************************************************************************************

function deleteCircleClicked(mouseX, mouseY){
    var i;
    dragIndexDelete=-1;
    for (i=0; i < circleCount; i++) {
        if	(isCircleClicked(circles[i], mouseX, mouseY)) {
            dragIndexDelete = i;		
        }
    }
    if ( dragIndexDelete> -1 ){
        var data = circles.splice(dragIndexDelete,1)[0];
        undo.push(data);
        redo.push(data);
        circleCount = circleCount-1;
    }
}

function deleteSquareClicked(mouseX, mouseY){
    var i;
    dragIndexDelete=-1;
    for (i=0; i < squareCount; i++) {
        if	(isSquareClicked(squares[i], mouseX, mouseY)) {
            dragIndexDelete = i;		
        }
    }
    if (dragIndexDelete> -1 ){
        squares.splice(dragIndexDelete,1)[0];
        squareCount = squareCount-1;
    }
}

function deleteRectangleClicked(mouseX, mouseY){
    var i;
    dragIndexDelete=-1;
    for (i=0; i < rectangleCount; i++) {
        if	(isRectPolygonClicked(rectangles[i], mouseX, mouseY)) {
            dragIndexDelete = i;		
        }
    }
    if (dragIndexDelete> -1 ){
        rectangles.splice(dragIndexDelete,1)[0];
        rectangleCount = rectangleCount-1;
    }
}

function deleteLineClicked(mouseX, mouseY){
    var i;
    dragIndexDelete=-1;
    for (i=0; i < lineCount; i++) {
        if	(isLineClicked(lines[i], mouseX, mouseY)) {
            dragIndexDelete = i;		
        }
    }
    if (dragIndexDelete> -1 ){
        lines.splice(dragIndexDelete,1)[0];
        lineCount = lineCount-1;
    }
}

function deleteEllipseClicked(mouseX, mouseY){
    var i;
    dragIndexDelete=-1;
    for (i=0; i < ellipseCount; i++) {
        if	(isEllipseClicked(ellipses[i], mouseX, mouseY)) {
            dragIndexDelete = i;		
        }
    }
    if (dragIndexDelete> -1 ){
        ellipses.splice(dragIndexDelete,1)[0];
        ellipseCount = ellipseCount-1;
    }
}

function deleteTraingleClicked(mouseX, mouseY){
    var i;
    dragIndexDelete=-1;
    for (i=0; i < traingleCount; i++) {
        if	(isRectPolygonClicked(traingles[i], mouseX, mouseY)) {
            dragIndexDelete = i;		
        }
    }
    if (dragIndexDelete> -1 ){
        traingles.splice(dragIndexDelete,1)[0];
        traingleCount = traingleCount-1;
    }
}

function deleteDiamondClicked(mouseX, mouseY){
    var i;
    dragIndexDelete=-1;
    for (i=0; i < diamondCount; i++) {
        if	(isRectPolygonClicked(diamonds[i], mouseX, mouseY)) {
            dragIndexDelete = i;		
        }
    }
    if (dragIndexDelete> -1 ){
        diamonds.splice(dragIndexDelete,1)[0];
        diamondCount = diamondCount-1;
    }
}

function deletePentagonClicked(mouseX, mouseY){
    var i;
    dragIndexDelete=-1;
    for (i=0; i < pentagonCount; i++) {
        if	(isRectPolygonClicked(pentagons[i], mouseX, mouseY)) {
            dragIndexDelete = i;		
        }
    }
    if (dragIndexDelete> -1 ){
        pentagons.splice(dragIndexDelete,1)[0];
        pentagonCount = pentagonCount-1;
    }
}

function deleteHexagonClicked(mouseX, mouseY){
    var i;
    dragIndexDelete=-1;
    for (i=0; i < hexagonCount; i++) {
        if	(isRectPolygonClicked(hexagons[i], mouseX, mouseY)) {
            dragIndexDelete = i;		
        }
    }
    if (dragIndexDelete> -1 ){
        hexagons.splice(dragIndexDelete,1)[0];
        hexagonCount = hexagonCount-1;
    }
}

function caseCDeletePolygonClicked(mouseX, mouseY){
    switch(numberOfSides)
    {
        case 3: deleteTraingleClicked(mouseX, mouseY);
                    break;
        case 4: deleteDiamondClicked(mouseX, mouseY);
                    break;
        case 5: deletePentagonClicked(mouseX, mouseY);
                    break;
        case 6: deleteHexagonClicked(mouseX, mouseY);
                    break;
    }
}

function caseCSelectDeleteShape(mouseX, mouseY){
    switch(currentShape)
    {
        case 'circle': deleteCircleClicked(mouseX, mouseY);
                        break;
        case 'square': deleteSquareClicked(mouseX, mouseY);
                        break;
        case 'rectangle': deleteRectangleClicked(mouseX, mouseY);
                        break;
        case 'line': deleteLineClicked(mouseX, mouseY);
                        break;
        case 'ellipse': deleteEllipseClicked(mouseX, mouseY);
                        break;
        case 'polygon': caseCDeletePolygonClicked(mouseX, mouseY);
                        break;
    }
}

function deleteShapes(event) 
{
if(currentShape =='polygon'){
    var shapeVal = getShapeType();
    alert(shapeVal.toUpperCase() + ": Types will be deleted.... To Change it, Press the desired Shape Button");
}
else{
    alert(currentShape.toUpperCase() + ": Types will be deleted.... To Change it, Press the desired Shape Button");
}
var i;
var bRect = canvas.getBoundingClientRect();
dragIndexDelete=-1;

mouseX = (event.clientX - bRect.left)*(canvas.width/bRect.width);
mouseY = (event.clientY - bRect.top)*(canvas.height/bRect.height);
//To find that which shape has been clicked
caseCSelectDeleteShape(mouseX, mouseY);
if (event.preventDefault) {
    event.preventDefault();
} 
else if (event.returnValue) {
    event.returnValue = false;
} 
ctx.fillStyle = '#FFFFFF';
ctx.fillRect(0,0,canvas.width,canvas.height);
drawCircles();
drawSquares();
drawRectangles();
drawLines();
drawEllipses();
drawPolygons();
return false;
}

// Clears the canvas
function clear(){
        circleCount=0;
		circles = [];
        squareCount=0;
		squares = [];
        rectangleCount=0;
		rectangles = [];
        lineCount = 0;
        lines = [];
        ellipseCount = 0;
        ellipses =[];
        traingleCount = 0;
        traingles =[];
        diamondCount = 0;
        diamonds =[];
        pentagonCount = 0;
        pentagons =[];
        hexagonCount =0;
        hexagons =[];
		ctx.fillStyle = bgColor;
        ctx.clearRect(0, 0, ctx.canvas.width, ctx.canvas.height); 
        ctx.lineJoin = "round";
        ctx.lineWidth = 5;
}
		
function setColor(el){
        el.style.borderColor = "#fff";
        el.style.borderStyle = "dashed";
        color = window.getComputedStyle(el).backgroundColor;
        ctx.beginPath();
        ctx.strokeStyle = color;
        currentColor= ctx.strokeStyle;
}    

function setSize(el){
    ctx.lineWidth = el;
    ctx.lineCap = 'round';
    ctx.globalAlpha = '1.0';
    ctx.shadowBlur='0';
    ctx.strokeStyle = currentColor;
    currentShape = "scribble";
}  

function eraser(){
    ctx.strokeStyle = '#FFFFFF';
    ctx.lineWidth = '22';
    ctx.shadowBlur='0';
    ctx.globalAlpha = '1.0'
    currentShape = "scribble";
}

function revertStrike(){
    ctx.lineWidth = 4;
    ctx.lineCap = 'round';
    ctx.globalAlpha = '1.0';
    ctx.shadowBlur='0';
    ctx.strokeStyle = currentColor;
}

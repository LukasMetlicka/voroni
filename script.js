var canvas = document.getElementById("voronoi");
var ctx = canvas.getContext("2d");
canvas.width = 1000;
canvas.height = 1000;

var voronoi = new Voronoi();
var image = new Image();

var bbox = {xl: 0, xr: canvas.width, yt: 0, yb: canvas.height};
var sites = [];
var diagram = voronoi.compute(sites, bbox);

var posX;
var posY;
var downX;
var downY;

$(document).ready(function($) {

	// 			LISTENERS 

	// Correctly gets mouse position
	canvas.addEventListener("mousemove", function(evt){
		var rect = canvas.getBoundingClientRect();
		posX = (evt.pageX - rect.left) * (canvas.width / $("#voronoi").width()) ;
		posY = (evt.pageY - rect.top) * (canvas.height / $("#voronoi").height());
	});

	$("#voronoi").mousedown(function(event) {
		downX = posX;
		downY = posY;
		
		for(i = 0; i < sites.length; i++){
			if(Math.hypot((sites[i].x - posX), (sites[i].y - posY)) < 100){
				var j = i;
				var shouldRun = true;
				
					$("#voronoi").mousemove(function(event) {
						if(shouldRun){
							var msg = "";
							if(posX > sites[j].x){
								sites[j].x += (posX - sites[j].x);
								msg += '(+,';
							} else if(posX < sites[j].x) {
								sites[j].x -= (sites[j].x - posX);
								msg += '(-,';
							}
							
							if(posY > sites[j].y){
								sites[j].y += (posY - sites[j].y);
								msg += "+)";
							} else if (posY < sites[j].y) {
								sites[j].y -= (sites[j].y - posY);
								msg += '-)';
							}
							
							reloadCanvas();

							console.log(msg)

							$("#voronoi").mouseup(function(event) {
								shouldRun = false;
							})
						}	
					});
				
				
				
			}
		}
			
		});
	
	$("#voronoi").mouseup(function(event) {
		if( posX == downX && posY == downY ){
			addVertex(posX, posY);
			reloadCanvas();
		}
	});

	// 			BUTTONS

	// Clear Button
	$("#clear").click(function(event) {
		sites = [];
		reloadCanvas();
	});


	// Insert Point Button
	$("#insertPoint_button").click(function(event) {
		if (!isNaN($("#insertPoint_x").val()) && !isNaN($("#insertPoint_y").val())){
			addVertex($("#insertPoint_x").val(), $("#insertPoint_y").val());
			reloadCanvas();

			$("#insertPoint_x").val("");
			$("#insertPoint_y").val("");
		} else {
			alert("that isn't a number!");
			$("#insertPoint_x").val("");
			$("#insertPoint_y").val("");
		}
	});
	// Insert Point Keypress
	$(document).keypress(function(event) {
		if (event.keyCode == 13){
			if (!isNaN($("#insertPoint_x").val()) && !isNaN($("#insertPoint_y").val())){
			addVertex($("#insertPoint_x").val(), $("#insertPoint_y").val());
			reloadCanvas();
			$("#insertPoint_x").val("");
			$("#insertPoint_y").val("");
		} else {
			alert("that isn't a number!");
			$("#insertPoint_x").val("");
			$("#insertPoint_y").val("");
		}
		}
	});
	// File upload button
	$('#file').change( function(event) {
    	image.src = URL.createObjectURL(event.target.files[0]);
    	image.onload = function(){
    		canvas.width = image.width;
    		canvas.height = image.height;
    		bbox = {xl: 0, xr: canvas.width, yt: 0, yb: canvas.height}
			ctx = canvas.getContext("2d");
    		
    		sites = [];

    		reloadCanvas();
    	}
	});
});

//redraws the canvas
function reloadCanvas(){
	ctx.clearRect(0, 0, canvas.width, canvas.height);
	ctx.drawImage(image, 0, 0);
	diagram = voronoi.compute(sites, bbox);
	for (i = 0; i < diagram.edges.length; i++){
		var va = diagram.edges[i].va;
		var vb = diagram.edges[i].vb;
		drawLine(va.x, va.y, vb.x, vb.y);
	}
	for(i = 0; i < sites.length; i++){
		paintDot(sites[i].x, sites[i].y, "#000000");
	}
}

// adds a vertex to the array
function addVertex(a, b){
	var obj = {x: a, y: b}
	sites.push(obj);
}

// Makes point 
function paintPoint(x, y, c){
	ctx.fillStyle = c;
	ctx.fillRect(x, y, 1, 1);
}
//places a point on canvas
function paintDot(x, y){
	ctx.beginPath();
    ctx.arc(x, y, (canvas.width / 250), 0, 2 * Math.PI, false);
    ctx.fillStyle = '#000000';
    ctx.fill();
}
// draws a line on canvas
function drawLine(xa, ya, xb, yb){
	ctx.lineWidth = canvas.width / 500;
	ctx.beginPath();
	ctx.moveTo(xa, ya);
	ctx.lineTo(xb, yb);
	ctx.stroke();
}

// Changes rgb to Hex color id
function rgbToHex(r, g, b) {
    return "#" + componentToHex(r) + componentToHex(g) + componentToHex(b);
}
//returns a random hex code color
function generateRandomColor() {
	var r = Math.floor(Math.random()* 255 - 0 + 1);
	var g = Math.floor(Math.random()* 255 - 0 + 1);
	var b = Math.floor(Math.random()* 255 - 0 + 1);
	return rgbToHex(r, g,b);
	
}
// Makes Random Vertex
function randomVert(i){
	if (i < 1){
		return Math.floor(Math.random() * canvas.width - 0 + 1);
	} else {
		return Math.floor(Math.random() * canvas.height - 0 + 1);
	}
}


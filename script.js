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
var didDrag = false;

$(document).ready(function($) {

	/* 		LISTENERS 		*/
	/*$("#voronoi").mousemove(function(event) {
		posX = event.pageX - $(this).offset().left;
		posY = event.pageY - $(this).offset().top;
		console.log(posX + "," + posY);
	});*/

	$("#voronoi").mousedown(function(event) {
		
		for(i = 0; i < sites.length; i++){
			var xMin = sites[i].x - 10;
			var xMax = sites[i].x + 10;
			var yMin = sites[i].y - 10;
			var yMax = sites[i].y + 10;
			if(posX > xMin && posX < xMax && posY > yMin && posY < yMax){
				console.log(posX + " " + sites[i].x + "\t" + posY + " " + sites[i].y);
				if(posX - sites[i].x >= 0){
					sites[i].x += posX;
				} else {
					sites[i].x -= posX;
				}
				if(posY - sites[i].y >= 0){
					sites[i].y += posY;
				} else {
					sites[i].y -= posY;
				}
				didDrag = true;
				} else {
				didDrag = false;
			}
		}
			
		});
	

	canvas.addEventListener("mousemove", function(evt){
		var rect = canvas.getBoundingClientRect();
		posX = (evt.pageX - rect.left) * (canvas.width / $("#voronoi").width()) ;
		posY = (evt.pageY - rect.top) * (canvas.height / $("#voronoi").height());
		console.log(posX + "," + posY);
	});

	$("#voronoi").mouseup(function(event) {
		if( !didDrag ){
			addVertex(posX, posY);
			console.log(posX + " " + sites[sites.length - 1].x + "\t" + posY + " " + sites[sites.length - 1].y)
			reloadCanvas();
		}
	});
});
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
    ctx.arc(x, y, 5, 0, 2 * Math.PI, false);
    ctx.fillStyle = '#000000';
    ctx.fill();
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
// draws a line on canvas
function drawLine(xa, ya, xb, yb){
	ctx.beginPath();
	ctx.moveTo(xa, ya);
	ctx.lineTo(xb, yb);
	ctx.stroke();
}

var canvas = document.getElementById("voronoi");
	var ctx = canvas.getContext("2d");
	canvas.width = 500;
	canvas.height = 500;
	var vX = [];
	var vY = [];
	var color = [];
	var log = ""
	var wireNum = 0;

$(document).ready(function($) {

	
	
	var voronoi = new Voronoi();
	var bbox = {xl: 0, xr: 500, yt: 0, yb: 500};
	var sites = [];
	//test sites
	for( i = 0; i < 20; i++){
		sites.push({x: randomVert(-1), y: randomVert(1)});
	}
	var diagram = voronoi.compute(sites, bbox);
		for(i = 0; i < sites.length; i++){
		paintDot(sites[i].x, sites[i].y, "#000000");
	}
	for (i = 0; i < diagram.edges.length; i++){
		var va = diagram.edges[i].va;
		var vb = diagram.edges[i].vb;
		drawLine(va.x, va.y, vb.x, vb.y);
	}
	
	/* 		LISTENERS 		*/

	$("#voronoi").click(function(event) {
		vX.push(event.pageX - $(this).offset().left);
		vY.push(event.pageY - $(this).offset().top);
		color.push(generateRandomColor());
		reloadCanvas(wireNum);
	});

	$("#insertPoint_button").click(function(event) {
		if (!isNaN($("#insertPoint_x").val()) && !isNaN($("#insertPoint_y").val())){
			vX.push($("#insertPoint_x").val());
			vY.push($("#insertPoint_y").val());
			color.push(generateRandomColor());
			reloadCanvas(wireNum);
			$("#insertPoint_x").val("");
			$("#insertPoint_y").val("");
		} else {
			alert("that isn't a number!");
			$("#insertPoint_x").val("");
			$("#insertPoint_y").val("");
		}
	});

	$(document).keypress(function(event) {
		if (event.keyCode == 13){
			if (!isNaN($("#insertPoint_x").val()) && !isNaN($("#insertPoint_y").val())){
			vX.push($("#insertPoint_x").val());
			vY.push($("#insertPoint_y").val());
			color.push(generateRandomColor());
			reloadCanvas(wireNum);
			$("#insertPoint_x").val("");
			$("#insertPoint_y").val("");
		} else {
			alert("that isn't a number!");
			$("#insertPoint_x").val("");
			$("#insertPoint_y").val("");
		}
		}
	});

	$('#file').change( function(event) {
    	var image = new Image();
    	image.src = URL.createObjectURL(event.target.files[0]);
    	image.onload = function(){
    		ctx.drawImage(image, 0, 0);
    	}
	});

});

function generatevoronoi(x, y, c){
	var closest = {
		x: NaN,
		y: NaN,
		distance: Math.hypot(canvas.width, canvas.height),
		color: NaN
	}
	for(i = 0; i < canvas.height; i++){
		for(j = 0; j < canvas.width; j++){
			for (k = 0; k < x.length; k++){
				var a = Math.hypot(x[k] - j, y[k] - i);
				if ( a < closest.distance ){
					closest.x = x[k];
					closest.y = y[k];
					closest.distance = a;
					closest.color = c[k];
				}
				
			}
			paintPoint(j, i, closest.color);
			var closest = {
				x: NaN,
				y: NaN,
				distance: Math.hypot(canvas.width, canvas.height),
				color: NaN
			}
		}
	}
}

function generateWireframe(x, y, c){
	var closest = {
		x: NaN,
		y: NaN,
		distance: Math.hypot(canvas.width, canvas.height),
		color: NaN
	}
	for (i = 0; i < canvas.height; i++){
		for (j = 0; j < canvas.width; j++){
			for (k = 0; k < x.length; k++){
				var a = Math.hypot(x[k] - j, y[k] - i);
				if (a == closest.distance){
					paintPoint(j, i, "#FFFFFF");
				} else if (a < closest.distance){
					closest.x = x[k];
					closest.y = y[k];
					closest.distance = a;
					closest.color = c[k];
				}
			}
			var closest = {
				x: NaN,
				y: NaN,
				distance: Math.hypot(canvas.width, canvas.height),
				color: NaN
			}
		}
	}
}

function reloadCanvas(a){
	ctx.clearRect(0, 0, canvas.width, canvas.height);
	if (a < 1){
		generatevoronoi(vX, vY, color);
		generateVerticies(vX, vY);
	} else {
		generateWireframe(vX, vY, "#FFFFFF");
		generateVerticies(vX, vY);
	}
	
}

function generateVerticies( x, y ){
	for (i = 0; i < x.length; i++){
		paintDot(x[i], y[i], "#000000")
	}
}

/* POINT PAINTERS */
function paintPoint(x, y, c){
	ctx.fillStyle = c;
	ctx.fillRect(x, y, 1, 1);
}

function paintDot(x, y){
	ctx.beginPath();
    ctx.arc(x, y, 5, 0, 2 * Math.PI, false);
    ctx.fillStyle = '#000000';
    ctx.fill();
}

/* COLOR FUNCTIONS */
function componentToHex(c) {
    var hex = c.toString(16);
    return hex.length == 1 ? "0" + hex : hex;
}

function rgbToHex(r, g, b) {
    return "#" + componentToHex(r) + componentToHex(g) + componentToHex(b);
}

function generateRandomColor() {
	var r = Math.floor(Math.random()* 255 - 0 + 1);
	var g = Math.floor(Math.random()* 255 - 0 + 1);
	var b = Math.floor(Math.random()* 255 - 0 + 1);
	return rgbToHex(r, g,b);
	
}
/* NUMBER GENERATOR 
if i < 1: will generate X value
if i > 1: will generate Y value
*/
function randomVert(i){
	if (i < 1){
		return Math.floor(Math.random() * canvas.width - 0 + 1);
	} else {
		return Math.floor(Math.random() * canvas.height - 0 + 1);
	}
}

function makeRandomPoints(num){
	for (i = 0; i < num; i++){
		vX.push(randomVert(0));
		vY.push(randomVert(1));
		color.push(generateRandomColor());
	}
}

function drawLine(xa, ya, xb, yb){
	ctx.beginPath();
	ctx.moveTo(xa, ya);
	ctx.lineTo(xb, yb);
	ctx.stroke();
}

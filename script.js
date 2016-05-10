var canvas = document.getElementById("voroni");
var ctx = canvas.getContext("2d");
canvas.width = 500;
canvas.height = 500;
/*var img = new Image();
img.src = 'https://mdn.mozillademos.org/files/5397/rhino.jpg';
img.onload = function() {
	ctx.drawImage(img, 50, 50);
}*/

var vX = [];
var vY = [];
var color = [];
var log = ""
var wireNum = 0;

$(document).ready(function($) {
	
	$("#voroni").click(function(event) {
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

	/*$("#file").change(function(event) {
		var val = URL.createObjectURL(event.target.files[0]);

    	switch(val.substring(val.lastIndexOf('.') + 1).toLowerCase()){
        	case 'gif': case 'jpg': case 'png':
        		var image = new Image();
        		image.src = val;
        		image.onload = function (){
        			ctx.drawImage(image, 100, 100);
        		}
            	
            	break;
        default:
            $(this).val('');
            alert("this file doesn't work! try another");
            break;
    }
	});*/
	$('#file').change( function(event) {
    	var image = new Image();
    	image.src = URL.createObjectURL(event.target.files[0]);
    	image.onload = function(){
    		ctx.drawImage(image, 0, 0);
    	}
	});

});

var generateVoroni = function(x, y, c){
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
		generateVoroni(vX, vY, color);
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


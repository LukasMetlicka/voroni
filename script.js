var canvas = document.getElementById("voroni");
var ctx = canvas.getContext("2d");
canvas.width = 500;
canvas.height = 500;
ctx.imageSmoothingEnabled = false;
/*var img = new Image();
img.src = 'https://mdn.mozillademos.org/files/5397/rhino.jpg';
img.onload = function() {
	ctx.drawImage(img, 50, 50);
}*/

var vX = [];
var vY = [];
var color = [];


$(document).ready(function($) {
	
	
	$("#voroni").click(function(event) {
		$("#think").show('fast', function() {
			
		});
		vX.push(event.pageX);
		vY.push(event.pageY);
		color.push(generateRandomColor());
		generateVoroni(vX, vY, color);
		$("#think").hide('fast', function() {
			
		});

	});
	/*for (i = 0; i < 100; i++){
		vX.push(randomVert(0));
	}
	for (i = 0; i < vX.length; i++){
		vY.push(randomVert(1));
	}
	for (i = 0; i < vX.length; i++){
		color.push(generateRandomColor());
	}
	generateVoroni(vX, vY, color);*/
});

var generateVoroni = function(x, y, c){
	var nearest = [canvas.width,canvas.height];
	var color = "#FF0FFF";
	for(i = 0; i < canvas.height; i++){
		for(j = 0; j < canvas.width; j++){
			for (k = 0; k < x.length; k++){
				if ( Math.hypot(j - x[k], i - y[k]) < Math.hypot(j - nearest[0], i - nearest[1]) ){
					nearest = [x[k],y[k]];
					color = c[k];
				}
			}
			paintPoint(j, i, color);
			nearest = [canvas.width,canvas.height];
		}
	}
}

function paintPoint(x, y, c){
	ctx.fillStyle = c;
	ctx.fillRect(x, y, 10, 10);
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


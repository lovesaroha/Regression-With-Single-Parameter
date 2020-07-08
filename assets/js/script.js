"use-strict";
/*  Love Saroha
    lovesaroha1994@gmail.com (email address)
    https://www.lovesaroha.com (website)
    https://github.com/lovesaroha  (github)
*/

// Choose theme at random.
const colors = ["#D64163", "#fa625f", "#4874E2"];
const colorsDark = ["#c13b59", "#e15856", "#4168cb"];
const selColor = Math.floor(Math.random() * colors.length);
document.documentElement.style.setProperty('--primary', colors[selColor]);
document.documentElement.style.setProperty('--primary-dark', colorsDark[selColor]);

// Get canvas info from DOM.
var canvas = document.getElementById('myCanvas');
var ctx = canvas.getContext('2d');

// Default values set.
var allData = [];
var polDegree = 1;
var parameters = [];
var learningRate = 0.1;
var regParam = 0;
var regType = 1;

// Update dom data according to default values.
document.getElementById("degree_select_id").value = 1;
document.getElementById("regularizationType_param_id").value = 1;
document.getElementById("regularization_param_id").value = 0;
document.getElementById("learning_select_id").value = 0.1;

// Add data on graph.
function addData(e) {
    allData.push({ x: map(e.offsetX, 0, canvas.width, 0, 1), y: map(e.offsetY, 0, canvas.height, 0, 1) });
}

// Equation for h(x).
function hypothesis(x) {
    let inputs = [1];
    for (let p = 0; p <= polDegree; p++) {
        if (parameters[p] == undefined) {
            parameters.push((Math.random() * 2) - 1);
        }
    }
    for (let inp = 0; inp < polDegree; inp++) {
        inputs.push(Math.pow(x, inp + 1));
    }
    let output = 0;
    for (let i = 0; i < inputs.length; i++) {
        output += inputs[i] * parameters[i];
    }
    return output;
}

// Show prediction function show prediction on graph.
function showPrediction() {
    let old = -1;
    for (let i = 20; i < canvas.width; i = i + 20) {
        let y = hypothesis(map(i, 0, canvas.width, 0, 1));
        ctx.beginPath();
        ctx.fillStyle = colors[selColor];
        ctx.arc(i, map(y, 0, 1, 0, canvas.height), 5, 0, 2 * Math.PI);
        ctx.fill();
        if (old != -1) {
            ctx.beginPath();
            ctx.lineWidth = 2;
            ctx.strokeStyle = "#888";
            ctx.moveTo(i - 20, map(old, 0, 1, 0, canvas.height));
            ctx.lineTo(i, map(y, 0, 1, 0, canvas.height));
            ctx.stroke();
        }
        old = y;
    }
}

// Train using gradient descent.
function train() {
    let total = 0;
    for (let i = 0; i < allData.length; i++) {
        let predict = hypothesis(allData[i].x);
        let error = predict - allData[i].y;
        total += (error * error);
        for (let p = 0; p < parameters.length; p++) {
            if (regType == 2 && p > 0) {
                parameters[p] = (parameters[p] * (1 - learningRate * (regParam / allData.length))) - (learningRate * error * Math.pow(allData[i].x, p));
            } else if (regType == 1 && p > 0) {
                parameters[p] = parameters[p] - (learningRate * error * Math.pow(allData[i].x, p)) - learningRate * (regParam / allData.length);
            } else {
                parameters[p] = parameters[p] - (learningRate * error); // For w0
            }
        }
    }
    let tp = 0;
    for (let k = 0; k < parameters.length; k++) {
        tp += regParam * parameters[k];
    }
    document.getElementById("error_id").innerHTML = (total + tp / 2 * allData.length).toFixed(4);
}

// Show data on graph.
function showData() {
    for (let i = 0; i < allData.length; i++) {
        ctx.beginPath();
        ctx.fillStyle = "#888";
        ctx.arc(map(allData[i].x, 0, 1, 0, canvas.width), map(allData[i].y, 0, 1, 0, canvas.height), 5, 0, 2 * Math.PI);
        ctx.fill();
    }
}

// Event mouse click.
canvas.addEventListener("mousedown", addData);

// Map function map values between given range.
function map(n, start1, stop1, start2, stop2, withinBounds) {
    var newval = (n - start1) / (stop1 - start1) * (stop2 - start2) + start2;
    if (!withinBounds) {
        return newval;
    }
    if (start2 < stop2) {
        return constrain(newval, start2, stop2);
    } else {
        return constrain(newval, stop2, start2);
    }
}

// Constrain.
function constrain(n, low, high) {
    return Math.max(Math.min(n, high), low);
}

// Draw axis fuction shows axis on graph.
function drawAxis() {
    ctx.beginPath();
    ctx.lineWidth = 2;
    ctx.strokeStyle = "#888";
    ctx.moveTo(20, 20);
    ctx.lineTo(20, canvas.height - 20);
    ctx.stroke();
    ctx.beginPath();
    ctx.moveTo(20, 20);
    ctx.lineTo(0, 40);
    ctx.stroke();
    ctx.beginPath();
    ctx.moveTo(20, 20);
    ctx.lineTo(40, 40);
    ctx.stroke();
    ctx.beginPath();
    ctx.moveTo(20, canvas.height - 20);
    ctx.lineTo(canvas.width - 20, canvas.height - 20);
    ctx.stroke();
    ctx.beginPath();
    ctx.moveTo(canvas.width - 20, canvas.height - 20);
    ctx.lineTo(canvas.width - 40, canvas.height - 40);
    ctx.stroke();
    ctx.beginPath();
    ctx.moveTo(canvas.width - 20, canvas.height - 20);
    ctx.lineTo(canvas.width - 40, canvas.height + 20);
    ctx.stroke();
    for (let i = 40; i < canvas.width; i = i + 20) {
        ctx.beginPath();
        ctx.lineWidth = 2;
        ctx.strokeStyle = "#eee";
        ctx.moveTo(i, 20);
        ctx.lineTo(i, canvas.height - 20);
        ctx.stroke();
    }
    for (let j = 40; j < canvas.height; j = j + 20) {
        ctx.beginPath();
        ctx.lineWidth = 2;
        ctx.strokeStyle = "#eee";
        ctx.moveTo(20, j);
        ctx.lineTo(canvas.width - 20, j);
        ctx.stroke();
    }
}

// Draw function.
draw();

function draw() {
    ctx.globalCompositeOperation = 'destination-over';
    ctx.clearRect(0, 0, canvas.width, canvas.height); // clear canvas

    if (typeof polDegree == "number" && allData.length > 1) {
        train(); // Train with given data
        showPrediction(); // Show prediction
    }
    showData();
    drawAxis();
    window.requestAnimationFrame(draw);
}
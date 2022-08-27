let actualValueColor = 'rgba(255,255,255,1)';
let noisyValueColor = 'rgba(255,255,255,0.5)';
let pt1Color = 'rgba(255,0,0,1)';
let pt2Color = 'rgba(0,255,0,1)';
let pt3Color = 'rgba(72,163,203,1)';


let canvas;
let ctx;
let updateInterval = 16;
let width;
let height;
let jCanvas;
let fps = 0;
let lastFrameUpdate = 0;
let sliderValuePixels = 0;
let lastSliderValue = 0;
let previousSiderValue = 0;

let deltaT = updateInterval / 1000.0;

let drawActualValue = true;
let drawNoisyValue = true;
let drawPt1Value = true;
let drawPt2Value = true;
let drawPt3Value = true;

let initialCutoff = 0.5;

let pt1 = new Pt1(initialCutoff, deltaT);
let pt1PreviousValue = 0;
let pt1LastValue = 0;

let pt2 = new Pt2(initialCutoff, deltaT);
let pt2PreviousValue = 0;
let pt2LastValue = 0;

let pt3 = new Pt3(initialCutoff, deltaT);
let pt3PreviousValue = 0;
let pt3LastValue = 0;

let previousNoisyValue = 0;
let lastNoisyValue = 0;
let currentNoisyValue = 0;

let frameCount = 0;

let sineNoiseAmplitude = 0;
let sineNoiseFrequency = 0;
let randomNoiseAmplitude = 0;


$(document).ready(function() {

    //$("#actualValueStyleLegendCheckbox").checkboxradio();

    canvas = document.getElementById("mainCanvas");
    ctx = document.getElementById("mainCanvas").getContext("2d");
    jCanvas = $("#mainCanvas");

    setupLegend();

    width = canvas.width;
    height = canvas.height;

    $(window).resize(function() {
        ctx.canvas.width  = jCanvas.width();
        ctx.canvas.height = jCanvas.height();
        width = canvas.width;
        height = canvas.height;
        ctx.translate(0, height / 2);
    });

    $("#actualValueSlider").slider({
        range: "min",
        value: 5,
        min: 0,
        max: 100,
        step: 0.1,
        orientation: "vertical",
        //animate: "fast",
        slide: function( event, ui ) {
            sliderValuePixels = ui.value;
        }
    });

    $("#cutoffSlider").slider({
        range: "min",
        value: initialCutoff,
        min: 0,
        max: 10,
        step: 0.1,
        //animate: "fast",
        slide: function( event, ui ) {
            onCutoffSliderChange(ui.value);
        }
    });

    $("#sineNoiseAmplitudeSlider").slider({
        range: "min",
        value: 0,
        min: 0,
        max: 100,
        step: 0.1,
        //animate: "fast",
        slide: function( event, ui ) {
            sineNoiseAmplitude = ui.value;
        }
    });

    $("#sineNoiseFrequencySlider").slider({
        range: "min",
        value: 0,
        min: 0,
        max: 1.5,
        step: 0.01,
        //animate: "fast",
        slide: function( event, ui ) {
            sineNoiseFrequency = ui.value;
        }
    });

    $("#randomNoiseAmplitudeSlider").slider({
        range: "min",
        value: 0,
        min: 0,
        max: 100,
        step: 0.1,
        //animate: "fast",
        slide: function( event, ui ) {
            randomNoiseAmplitude = ui.value;
        }
    });

    onCutoffSliderChange(initialCutoff);

    $("#actualValueSlider").slider('value',50);
    sliderValuePixels = 50;
    lastSliderValue = getSliderValue();
    previousSiderValue = getSliderValue();

    $(window).resize();

    lastFrameUpdate = performance.now();
    setTimeout(Update, updateInterval);
});


function setupLegend() {
    $("#actualValueStyleLegend").css("border-color",actualValueColor);
    $("#noisyValueStyleLegend").css("border-color",noisyValueColor);
    $("#pt1ValueStyleLegend").css("border-color",pt1Color);
    $("#pt2ValueStyleLegend").css("border-color",pt2Color);
    $("#pt3ValueStyleLegend").css("border-color",pt3Color);

    $('#actualValueStyleLegendCheckbox').change(function() { drawActualValue = this.checked; });
    $('#noisyValueStyleLegendCheckbox').change(function() { drawNoisyValue = this.checked; });
    $('#pt1ValueStyleLegendCheckbox').change(function() { drawPt1Value = this.checked; });
    $('#pt2ValueStyleLegendCheckbox').change(function() { drawPt2Value = this.checked; });
    $('#pt3ValueStyleLegendCheckbox').change(function() { drawPt3Value = this.checked; });
}

function onCutoffSliderChange(newValue) {
    pt1.RecalculateK(newValue);
    pt2.RecalculateK(newValue);
    pt3.RecalculateK(newValue);
    $("#cutoffValue").text(newValue);
}

function getSliderValue() {
    return -(sliderValuePixels * height / 100.0 - height / 2.0);
}


function AddNoise(value) {
    return value + sineNoiseAmplitude * Math.sin(frameCount*sineNoiseFrequency) + (Math.random() - 0.5) * randomNoiseAmplitude * 2;
}

function Update() {
    frameCount ++;
    let executionsStart = performance.now();
    let now = performance.now();
    let dt = now - lastFrameUpdate;
    lastFrameUpdate = now;
    let currentFps = 1000.0 / dt;
    fps = 0.03 * currentFps + 0.97 * fps;

    let currentSliderValue = getSliderValue();
    currentNoisyValue = AddNoise(currentSliderValue);

    let pt1CurrentValue = pt1.Apply(currentNoisyValue);
    let pt2CurrentValue = pt2.Apply(currentNoisyValue);
    let pt3CurrentValue = pt3.Apply(currentNoisyValue);
    //console.log(currentSliderValue);

    ctx.clearRect(0, -height/2, 2, height);

    if (drawNoisyValue) {
        ctx.strokeStyle = noisyValueColor;

        ctx.beginPath();
        ctx.lineWidth = 2;
        ctx.moveTo(4, previousNoisyValue);
        ctx.lineTo(2, lastNoisyValue);
        ctx.lineTo(0, currentNoisyValue);
        ctx.stroke();
    }


    if (drawActualValue) {
        ctx.strokeStyle = actualValueColor;

        ctx.beginPath();
        ctx.lineWidth = 2;
        ctx.moveTo(4, previousSiderValue);
        ctx.lineTo(2, lastSliderValue);
        ctx.lineTo(0, currentSliderValue);
        ctx.stroke();
    }

    if (drawPt1Value) {
        ctx.strokeStyle = pt1Color;

        ctx.beginPath();
        ctx.lineWidth = 2;
        ctx.moveTo(4, pt1PreviousValue);
        ctx.lineTo(2, pt1LastValue);
        ctx.lineTo(0, pt1CurrentValue);
        ctx.stroke();
    }

    if (drawPt2Value) {
        ctx.strokeStyle = pt2Color;

        ctx.beginPath();
        ctx.lineWidth = 2;
        ctx.moveTo(4, pt2PreviousValue);
        ctx.lineTo(2, pt2LastValue);
        ctx.lineTo(0, pt2CurrentValue);
        ctx.stroke();
    }

    if (drawPt3Value) {
        ctx.strokeStyle = pt3Color;

        ctx.beginPath();
        ctx.lineWidth = 2;
        ctx.moveTo(4, pt3PreviousValue);
        ctx.lineTo(2, pt3LastValue);
        ctx.lineTo(0, pt3CurrentValue);
        ctx.stroke();
    }

    const myImageData = ctx.getImageData(0, 0, width, height);
    ctx.putImageData(myImageData, 2, 0);

    pt3PreviousValue = pt3LastValue;
    pt3LastValue = pt3CurrentValue;

    pt2PreviousValue = pt2LastValue;
    pt2LastValue = pt2CurrentValue;

    pt1PreviousValue = pt1LastValue;
    pt1LastValue = pt1CurrentValue;

    previousSiderValue = lastSliderValue;
    lastSliderValue = currentSliderValue;

    previousNoisyValue = lastNoisyValue;
    lastNoisyValue = currentNoisyValue;

    let executionsEnd = performance.now();
    setTimeout(Update, updateInterval - (executionsEnd - executionsStart));
}
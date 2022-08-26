
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


$(document).ready(function() {

    canvas = document.getElementById("mainCanvas");
    ctx = document.getElementById("mainCanvas").getContext("2d");
    jCanvas = $("#mainCanvas");

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
        value: 10,
        min: 0,
        max: 100,
        step: 0.1,
        orientation: "vertical",
        //animate: "fast",
        slide: function( event, ui ) {
            sliderValuePixels = ui.value;
        //  value = ui.value;
        //  $(inputId).val(value);
        //  $(inputId).change();
        }
    });

    $(window).resize();

    lastFrameUpdate = performance.now();
    setTimeout(Update, updateInterval);
});

function getSliderValue() {
    return -(sliderValuePixels * height / 100.0 - height / 2.0);
}

function Update() {
    let executionsStart = performance.now();
    let now = performance.now();
    let dt = now - lastFrameUpdate;
    lastFrameUpdate = now;
    let currentFps = 1000.0 / dt;
    fps = 0.03 * currentFps + 0.97 * fps;
    //console.log(fps + " " + currentFps);

    let currentSliderValue = getSliderValue();
    console.log(currentSliderValue);

    ctx.clearRect(0, -height/2, 2, height);

    ctx.beginPath();
    ctx.moveTo(2, lastSliderValue);
    ctx.lineTo(0, currentSliderValue);
    //ctx.arc(0, 0, 100, 0, Math.PI * 2, true); // Outer circle
    ctx.stroke();

    const myImageData = ctx.getImageData(0, 0, width, height);
    ctx.putImageData(myImageData, 2, 0);

    lastSliderValue = currentSliderValue;
    let executionsEnd = performance.now();
    setTimeout(Update, updateInterval - (executionsEnd - executionsStart));
}
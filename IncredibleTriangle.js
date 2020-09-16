/**
 * This JavaScript program renders an orthographic view of a exciting triangle.
 * The real purpose is to illustrate the basics of rendering.
 *
 * The updated version of this program is Alice Gelhaus Lab 2, rendering an 'Under the Sea' image.
 * There are many functions in this image, notably the function to create waves, the sun (and it's reflections),
 * seaweed, and fish.  Additionally, there is a shark and crab in this image as well.
 * Alice Gelhaus
 * 9/16/2020
 *
 * David John
 * August 2020
 */

"use strict";

// global variables  (CPU memory)
var canvas;
var gl;
var pBuffer;  // position buffer
var cBuffer;  // color buffer

var pointsArray = [];
var colorsArray = [];
var index=0;

// color palette -- just simplifies some things  (RGBA)
var colorPalette = [

    vec4( 0.0, 0.0, 0.0, 1.0 ),  // black
    vec4( 1.0, 0.0, 0.0, 1.0 ),  // red
    vec4(1.0, 99.0/255, 71.0/255, 1.0), // tomato
    vec4( 1.0, 1.0, 0.0, 1.0 ),  // yellow
    vec4( 0.0, 1.0, 0.0, 1.0 ),  // green
    //vec4( 0.0, 0.0, 1.0, 1.0 ),  // blue
    //vec4( 1.0, 0.0, 1.0, 1.0 ),  // magenta
    //vec4(1,239.0/255,213.0/255,1.0), // papaya whip
    //vec4( 0.0, 1.0, 1.0, 1.0)   // cyan
];

// *****************************

// callback function that starts once html5 window is loaded
window.onload = function init() {

    // SETUP WEBGL ENVIRONMENT
    // associate canvas with "gl-canvas" and setup
    canvas = document.getElementById( "gl-canvas" );
    gl = WebGLUtils.setupWebGL( canvas );
    if ( !gl ) { alert( "WebGL isn't available" ); }

    alert("WebGL available");


    // set up orthgraphic view using the entire canvas, and
    // set the default color of the view as "mustard"
    gl.viewport( 0, 0, canvas.width, canvas.height );
    gl.clearColor( 0, 0.8, 0.9, 1.0 );

    alert("canvas configured");


    //  CONFIGURE GPU SHADERS
    //  Compile and load vertex and fragment shaders
    //
    var program = initShaders( gl, "vertex-shader", "fragment-shader" );
    gl.useProgram( program );

    alert("shaders compiled and loaded onto GPU");


    // Background
    mytriangle(vec2(0,512), vec2(0,312), vec2(512,312), // SEAFLOOR
        vec4(212.0/255, 179.0/255, 126.0/255, 1.0));
    mytriangle(vec2(0,312), vec2(512,312), vec2(512,512), // SEAFLOOR
        vec4(212.0/255, 179.0/255, 126.0/255, 1.0));
    mytriangle(vec2(256,312), vec2(0,512), vec2(512,512), // SEAFLOOR
        vec4(212.0/255, 179.0/255, 126.0/255, 1.0));

    // Wave function
    function wave(base, color)
    {
        mytriangle(base, vec2(base[0]+30,base[1]+10), vec2(base[0]+60,base[1]),
            color);
    }
    // WAVES
    wave(vec2(100, 150), vec4(49.0/255, 99.0/255, 1.0, 1.0));
    wave(vec2(40, 150), vec4(49.0/255, 99.0/255, 1.0, 1.0));
    wave(vec2(-20, 150), vec4(49.0/255, 99.0/255, 1.0, 1.0));
    wave(vec2(95, 155), vec4(177.0/255, 224.0/255, 232.0/255, 1.0));
    wave(vec2(35, 155), vec4(177.0/255, 224.0/255, 232.0/255, 1.0));
    wave(vec2(-35, 155), vec4(177.0/255, 224.0/255, 232.0/255, 1.0));
    wave(vec2(460, 50), vec4(49.0/255, 99.0/255, 1.0, 1.0)); //Waves near sun, right side
    wave(vec2(400, 50), vec4(49.0/255, 99.0/255, 1.0, 1.0));
    wave(vec2(340, 50), vec4(49.0/255, 99.0/255, 1.0, 1.0));
    wave(vec2(455, 55), vec4(177.0/255, 224.0/255, 232.0/255, 1.0));
    wave(vec2(395, 55), vec4(177.0/255, 224.0/255, 232.0/255, 1.0));
    wave(vec2(335, 55), vec4(177.0/255, 224.0/255, 232.0/255, 1.0));
    wave(vec2(220, 18), vec4(49.0/255, 99.0/255, 1.0, 1.0)); //Waves on top right
    wave(vec2(160, 18), vec4(49.0/255, 99.0/255, 1.0, 1.0));
    wave(vec2(100, 18), vec4(49.0/255, 99.0/255, 1.0, 1.0));
    wave(vec2(215, 23), vec4(177.0/255, 224.0/255, 232.0/255, 1.0));
    wave(vec2(155, 23), vec4(177.0/255, 224.0/255, 232.0/255, 1.0));
    wave(vec2(95, 23), vec4(177.0/255, 224.0/255, 232.0/255, 1.0));

    // Sun function
    function sun(base, radius, color, numTri)
    {
        var j;

        for(j = 0; j < numTri; j++){

            mytriangle(base, vec2(base[0]+radius*Math.cos(j*2.0*Math.PI/numTri), base[1]+radius*Math.sin(j*2.0*Math.PI/numTri)),
                            vec2(base[0]+radius*Math.cos((j+1)*2.0*Math.PI/numTri), base[1]+radius*Math.sin((j+1)*2.0*Math.PI/numTri)),
                            color);
        }
    }
    //Sun and reflections underwater
    sun(vec2(410, 20), 15.0, vec4(1.0, 147.0/255, 232.0/255, 1.0), 40)
    sun(vec2(405, 20), 15.0, vec4(1.0, 179.0/255, 45.0/255, 1.0), 40)
    sun(vec2(400, 20), 15.0, vec4(247.0/255, 229.0/255, 44.0/255, 1.0), 40)


    function seaweed(base, numTri){
        var j; //Change J, set radius and color, add multiple seaweeds so it looks continuous

        for(j = 0; j < numTri; j++)
        {
            mytriangle(base, vec2(base[0]+10.0*Math.cos(j*2.0*Math.PI/numTri), base[1]+10.0*Math.sin(j*2.0*Math.PI/numTri)),
                vec2(base[0]+10.0*Math.cos((j+1)*2.0*Math.PI/numTri), base[1]+10.0*Math.sin((j+1)*2.0*Math.PI/numTri)),
                vec4(36.0/255,97.0/255,8.0/255,1.0));
        }
    }
    //Seaweed
    seaweed(vec2(25,430), 40); //Stalk 1, left
    seaweed(vec2(26,410), 40);
    seaweed(vec2(27,390), 40);
    seaweed(vec2(29,370), 40);
    seaweed(vec2(28,350), 40);
    seaweed(vec2(25,330), 40);
    seaweed(vec2(53,400), 40); //Stalk 2, second to the left
    seaweed(vec2(51,420), 40);
    seaweed(vec2(50,440), 40);
    seaweed(vec2(52,460), 40);
    seaweed(vec2(55,480), 40);
    seaweed(vec2(50,500), 40);
    seaweed(vec2(94,405), 40); //Stalk 3, third to the left
    seaweed(vec2(99,420), 40);
    seaweed(vec2(97,435), 40);
    seaweed(vec2(95,450), 40);
    seaweed(vec2(425,430), 40); //Stalks on right side
    seaweed(vec2(426,410), 40);
    seaweed(vec2(427,390), 40);
    seaweed(vec2(429,370), 40);
    seaweed(vec2(428,350), 40);
    seaweed(vec2(425,330), 40);
    seaweed(vec2(453,400), 40); //Stalk 5
    seaweed(vec2(451,420), 40);
    seaweed(vec2(450,440), 40);
    seaweed(vec2(452,460), 40);
    seaweed(vec2(455,480), 40);
    seaweed(vec2(450,500), 40);
    seaweed(vec2(394,405), 40); //Stalk 6
    seaweed(vec2(399,420), 40);
    seaweed(vec2(397,435), 40);
    seaweed(vec2(395,450), 40);


    //SHARK
    mytriangle(vec2(310,210), vec2(400,210), vec2(335,130), // DORSAL FIN
        vec4(153.0/255, 156.0/255, 166.0/255, 1.0));
    mytriangle(vec2(350,210), vec2(400,210), vec2(335,250), // BELOW FIN FRONT
        vec4(153.0/255, 156.0/255, 166.0/255, 1.0));
    mytriangle(vec2(285,210), vec2(315,210), vec2(290,240), // BELOW FIN BACK
        vec4(153.0/255, 156.0/255, 166.0/255, 1.0));
    mytriangle(vec2(200,200), vec2(400,150), vec2(400,250), // SHARK BODY
        vec4(153.0/255, 156.0/255, 166.0/255, 1.0));
    mytriangle(vec2(400,150), vec2(400,250), vec2(475,200), // SHARK BODY
        vec4(153.0/255, 156.0/255, 166.0/255, 1.0));
    mytriangle(vec2(430,185), vec2(430,195), vec2(440,190), // SHARK EYE
        vec4(1.0, 1.0, 1.0, 1.0));
    mytriangle(vec2(205,200), vec2(190,160), vec2(190,240), // TAIL FIN
        vec4(153.0/255, 156.0/255, 166.0/255, 1.0));
    mytriangle(vec2(405,200), vec2(405,180), vec2(400,220), // GILL FRONT
        vec4(125.0/255, 127.0/255, 132.0/255, 1.0));
    mytriangle(vec2(395,200), vec2(395,180), vec2(390,220), // GILL MIDDLE
        vec4(125.0/255, 127.0/255, 132.0/255, 1.0));
    mytriangle(vec2(385,200), vec2(385,180), vec2(380,220), // GILL BACK
        vec4(125.0/255, 127.0/255, 132.0/255, 1.0));

    // FISH
    function fish(base)
    {
        mytriangle(base, vec2(base[0]+10,base[1]-10), vec2(base[0]+20,base[1]),
            vec4(1.0, 141.0/255, 47.0/255, 1.0));  //BODY
        mytriangle(base, vec2(base[0]+10,base[1]+10), vec2(base[0]+20,base[1]),
            vec4(1.0, 141.0/255, 47.0/255, 1.0));  //BODY
        mytriangle(vec2(base[0]+20,base[1]), vec2(base[0]+25,base[1]-5), vec2(base[0]+25,base[1]+5),
            vec4(1.0, 141.0/255, 47.0/255, 1.0));  //TAIL FIN
        mytriangle(vec2(base[0]+4,base[1]-2), vec2(base[0]+8,base[1]-2), vec2(base[0]+6,base[1]-4),
            vec4(0.0, 0.0, 0.0, 1.0)); //EYE
    }
    //SCHOOL OF FISH
    fish(vec2(100, 230)); //Lower left
    fish(vec2(85, 240));
    fish(vec2(65, 250));
    fish(vec2(60, 235));
    fish(vec2(80, 225));
    fish(vec2(50, 220));
    fish(vec2(45, 252));
    fish(vec2(95, 260));
    fish(vec2(20, 255));
    fish(vec2(63, 280));
    fish(vec2(200, 100)); //Upper Right
    fish(vec2(270, 140));
    fish(vec2(195, 70));
    fish(vec2(240, 135));
    fish(vec2(248, 89));
    fish(vec2(280, 66));
    fish(vec2(295, 50));
    fish(vec2(180, 45));
    fish(vec2(170, 62));
    fish(vec2(178, 80));
    fish(vec2(153, 70));
    fish(vec2(147, 88));
    fish(vec2(90, 102));
    fish(vec2(104, 70));
    fish(vec2(60, 88));

    //CRAB
    mytriangle(vec2(206,420), vec2(256,400), vec2(306,420),//Body
        vec4(214.0/255, 58.0/255, 12.0/255, 1.0));
    mytriangle(vec2(206,420), vec2(256,440), vec2(306,420),
        vec4(178.0/255, 56.0/255, 20.0/255, 1.0));
    mytriangle(vec2(225,420), vec2(225,450), vec2(235,420),//Legs
        vec4(178.0/255, 56.0/255, 20.0/255, 1.0));
    mytriangle(vec2(285,420), vec2(285,450), vec2(275,420),
        vec4(178.0/255, 56.0/255, 20.0/255, 1.0));
    mytriangle(vec2(225,420), vec2(225,400), vec2(230,420), //Arms
        vec4(214.0/255, 58.0/255, 12.0/255, 1.0));
    mytriangle(vec2(285,420), vec2(285,400), vec2(280,420),
        vec4(214.0/255, 58.0/255, 12.0/255, 1.0));
    mytriangle(vec2(215,405), vec2(222,395), vec2(230,405), //Pinchers
        vec4(214.0/255, 58.0/255, 12.0/255, 1.0));
    mytriangle(vec2(280,405), vec2(288,395), vec2(295,405),
        vec4(214.0/255, 58.0/255, 12.0/255, 1.0));
    sun(vec2(245, 414), 2.0,vec4(0.0,0.0,0.0,1.0),35);
    sun(vec2(268, 414), 2.0,vec4(0.0,0.0,0.0,1.0),35);


    alert("synthetic image made");


    // CREATE CPU BUFFERS CORRESPONDING TO SHADER ATTRIBUTES,
    // TRANSFER SYNTHETIC IMAGE TO GPU
    //
    // Vertices have two attributes, position and color, which will
    // require two buffers
    //
    // set up pBuffer as a buffer where each entry is 8 bytes
    // (2X4 bytes, or 2 thirtytwo bit floats)
    pBuffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, pBuffer);
    gl.bufferData(gl.ARRAY_BUFFER, flatten(pointsArray), gl.STATIC_DRAW);

    // associate JavaScript vPosition with vertex shader attribute "vPosition"
    // as a two dimensional vector where each component is a float
    var vPosition = gl.getAttribLocation(program, "vPosition");
    gl.vertexAttribPointer(vPosition, 2, gl.FLOAT, false, 0, 0);
    gl.enableVertexAttribArray(vPosition);

    alert("pBuffer and vPosition set up");

    //
    // set up cBuffer as a buffer where each entry is 16 bytes
    // (4x4 bytes, of 4 thirtytwo bit colors)
    cBuffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, cBuffer);
    gl.bufferData(gl.ARRAY_BUFFER, flatten(colorsArray), gl.STATIC_DRAW);

    // associate JavaScript vColor with vertex shader attribute "vColor"
    // as a four dimensional vector (RGBA)
    var vColor = gl.getAttribLocation( program, "vColor");
    gl.vertexAttribPointer(vColor, 4, gl.FLOAT, false, 0, 0);
    gl.enableVertexAttribArray(vColor);

    alert("cBuffer and vColor set up");

    // INITIATE RENDERING OF SYNTHETIC IMAGE
    // render away
    render();
}

// ****************************

// RENDER THE IMAGE
// recursive function to render the synthetic image
function render() {

    // clear the working buffer
    gl.clear( gl.COLOR_BUFFER_BIT );


    // render the 3 points and colors as triangles
    gl.drawArrays( gl.TRIANGLES, 0, pointsArray.length);

    // recursively call render() in the context of the browser
    window.requestAnimFrame(render);
}

// *************************

// CONVERT FROM BROWSER COORDINATES TO WEBGL COORDINATES
// Of course this could be put into the vertex shader.
function coordscale(coord) {
    // alert("in coordscale coord= "+coord);

    return vec2(2.0 * coord[0] / canvas.width - 1, 2.0 * (canvas.height - coord[1]) / canvas.height - 1);

}

// ************************

// CREATE (SINGLE) COLORED TRIANGLE
// put a triangle into the points and colors arrays
function mytriangle(aa, bb, cc, cccc)
{

    // focus on points to render
    pointsArray.push(coordscale(aa));
    pointsArray.push(coordscale(bb));
    pointsArray.push(coordscale(cc));

    // focus on colors for each vertex (same in this case)
    colorsArray.push(cccc);
    colorsArray.push(cccc);
    colorsArray.push(cccc);

    return;

}
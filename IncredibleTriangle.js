/**
 * This JavaScript program renders an orthographic view of a exciting triangle.
 * The real purpose is to illustrate the basics of rendering.
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
    vec4( 0.0, 0.0, 1.0, 1.0 ),  // blue
    vec4( 1.0, 0.0, 1.0, 1.0 ),  // magenta
    vec4(1,239.0/255,213.0/255,1.0), // papaya whip
    vec4( 0.0, 1.0, 1.0, 1.0)   // cyan
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
    gl.clearColor( 0.9, 0.8, 0.3, 1.0 );

    alert("canvas configured");


    //  CONFIGURE GPU SHADERS
    //  Compile and load vertex and fragment shaders
    //
    var program = initShaders( gl, "vertex-shader", "fragment-shader" );
    gl.useProgram( program );

    alert("shaders compiled and loaded onto GPU");

    // CREATE SYNTHETIC IMAGE
    mytriangle(vec2(276,256), vec2(193,180), vec2(108,256),
        colorPalette[Math.floor(Math.random()*colorPalette.length)]);

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
    gl.drawArrays( gl.TRIANGLES, 0,3);

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
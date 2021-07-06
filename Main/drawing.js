//relevant paths to resources
var program;
var gl;
var baseDir;
var shaderDir;


//camera variables
var cx = 0;
var cy = 13.5;
var cz = - 9.5;
var elev = - 30;
var ang = 180;


// meshes
var ballMesh;
var cubeMesh;
// todo add other meshes


//score variables
var score = 0;
var currentScore = 0;
var done = false;

//global variables
// todo add here global variables if needed


//this functions converts a string representing a color in hexadecimal in the form "#xxxxxx"
//to a vector of 3 component: R, G, B. 
function fromHexToRGBVec(hex) {
    col = hex.substring(1,7);
      R = parseInt(col.substring(0,2) ,16) / 255;
      G = parseInt(col.substring(2,4) ,16) / 255;
      B = parseInt(col.substring(4,6) ,16) / 255;
    return [R,G,B]
}

function main()
{
    // clear the canvas
    gl.clearColor(0.85, 0.85, 0.85, 1.0);
    gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);
    gl.enable(gl.DEPTH_TEST); 

    // define material color 
    var materialColor = [1.0, 1.0, 1.0]; // this will be multipled by the texture color

    // define ambient light color and material
    var ambientLight = [0.15, 0.9, 0.8];
    var ambientMat = [0.4, 0.2, 0.6];

    //define specular component of color
    var specularColor = [1.0, 1.0, 1.0];
    var specShine = 10.0;

    // get attributes and normal location
    var positionAttributeLocation = gl.getAttribLocation(program, "inPosition");
    var normalAttributeLocation = gl.getAttribLocation(program, "inNormal");
    var uvAttributeLocation = gl.getAttribLocation(program, "in_uv");
    var textLocation = gl.getUniformLocation(program, "in_texture");
    var matrixLocation = gl.getUniformLocation(program, "matrix");
    var ambientLightColorHandle = gl.getUniformLocation(program, "ambientLightCol");
    var ambientMaterialHandle = gl.getUniformLocation(program, "ambientMat");
    var materialDiffColorHandle = gl.getUniformLocation(program, 'mDiffColor');
    var specularColorHandle = gl.getUniformLocation(program, "specularColor");
    var shineSpecularHandle = gl.getUniformLocation(program, "specShine");
    var emissionColorHandle = gl.getUniformLocation(program, "emit");    
    var lightDirectionHandleA = gl.getUniformLocation(program, 'lightDirectionA');
    var lightColorHandleA = gl.getUniformLocation(program, 'lightColorA');
    var lightDirectionHandleB = gl.getUniformLocation(program, 'lightDirectionB');
    var lightColorHandleB = gl.getUniformLocation(program, 'lightColorB');

    var normalMatrixPositionHandle = gl.getUniformLocation(program, 'nMatrix');
    var worldViewMatrixPositionHandle = gl.getUniformLocation(program, 'worldViewMatrix');

    var pointLightPositionHandle = gl.getUniformLocation(program, 'pLPos');
    var pointLightColorHandle = gl.getUniformLocation(program, 'pLCol');

    // perspective matrix
    var perspectiveMatrix = utils.MakePerspective(90, gl.canvas.width / gl.canvas.height, 0.1, 100.0);
  
    // view matrix
    var viewMatrix = utils.MakeView(cx, cy, cz, elev, ang);

    // vertex array objects
    var vaos = new Array(allMeshes.length);

    // todo manage textures

    function addMeshToScene(i) {
        let mesh = allMeshes[i];
        let vao = gl.createVertexArray();
        vaos[i] = vao;
        gl.bindVertexArray(vao);
    
        var positionBuffer = gl.createBuffer();
        gl.bindBuffer(gl.ARRAY_BUFFER, positionBuffer);
        gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(mesh.vertices), gl.STATIC_DRAW);
        gl.enableVertexAttribArray(positionAttributeLocation);
        gl.vertexAttribPointer(positionAttributeLocation, 3, gl.FLOAT, false, 0, 0);
    
        var uvBuffer = gl.createBuffer();
        gl.bindBuffer(gl.ARRAY_BUFFER, uvBuffer);
        gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(mesh.textures), gl.STATIC_DRAW);
        gl.enableVertexAttribArray(uvAttributeLocation);
        gl.vertexAttribPointer(uvAttributeLocation, 2, gl.FLOAT, false, 0, 0);
    
        var normalBuffer = gl.createBuffer();
        gl.bindBuffer(gl.ARRAY_BUFFER, normalBuffer);
        gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(mesh.vertexNormals), gl.STATIC_DRAW);
        gl.enableVertexAttribArray(normalAttributeLocation);
        gl.vertexAttribPointer(normalAttributeLocation, 3, gl.FLOAT, false, 0, 0);
    
        var indexBuffer = gl.createBuffer();
        gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, indexBuffer);
        gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, new Uint16Array(mesh.indices), gl.STATIC_DRAW);
    }

    for (let i in allMeshes)
    addMeshToScene(i);


    drawScene();
}


function drawScene() // todo SE NON VA UN CAZZO, QUESTA ERA DENTRO MAIN
{
    // todo tomorrow        
    window.requestAnimationFrame(drawScene);
}


async function init() {
  
    // maybe add music

    setupCanvas();
    loadShaders();
    await loadMeshes();
    main();
  
    // prepare canvas and body styles
    function setupCanvas() {
      var canvas = document.getElementById("canvas");
      gl = canvas.getContext("webgl2");
  
      if (!gl) {
        document.write("GL context not opened");
        return;
      }
      utils.resizeCanvasToDisplaySize(canvas);
      gl.viewport(0, 0, gl.canvas.width, gl.canvas.height);
    }
  
    //load shaders
    async function loadShaders() {
      // initialize resource paths
      var path = window.location.pathname;
      var page = path.split("/").pop();
      baseDir = window.location.href.replace(page, '');
      shaderDir = baseDir + "Shaders/";
      modelsDir = baseDir + "Models/";
  
      // load vertex and fragment shaders from file
      await utils.loadFiles([shaderDir + 'vs.glsl', shaderDir + 'fs.glsl'], function (shaderText) {
        var vertexShader = utils.createShader(gl, gl.VERTEX_SHADER, shaderText[0]);
        var fragmentShader = utils.createShader(gl, gl.FRAGMENT_SHADER, shaderText[1]);
        program = utils.createProgram(gl, vertexShader, fragmentShader);
  
      });
      gl.useProgram(program);
    }
  
    // load meshes from obj files
    async function loadMeshes() {
      ballMesh = await utils.loadMesh(modelsDir + "Ball.obj");
      cubeMesh = await utils.loadMesh(modelsDir + "Cube.obj");
  
      allMeshes = [
        ballMesh, 
        cubeMesh // todo add other objects
        ];
    }
  } 


window.onload = init;
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
var paddleMesh;
var wallMeshR;
var wallMeshL;
var wallMeshU;
var brickMesh0;
var brickMesh1;
var brickMesh2;
var brickMesh3;
var brickMesh4;

// todo add other meshes


//score variables
var score = 0;
var currentScore = 0;
var done = false;

//global variables
// todo add here global variables if needed

function main()
{
    // clear the canvas
    gl.clearColor(0.00, 0.00, 0.00, 1.0);
    gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);
    gl.enable(gl.DEPTH_TEST); 

    // define material color 
    var materialDiffColor = [1.0, 1.0, 1.0, 1.0]; // this will be multipled by the texture color

    // define ambient light color and material
    var ambientLight = [0.15, 0.9, 0.8, 1.0];
    var ambientMat = [0.4, 0.2, 0.6, 1.0];

    //define specular component of color
    var specularColor = [1.0, 1.0, 1.0, 1.0];
    var specShine = 10.0;

    // get attributes and normal location
    var positionAttributeLocation = gl.getAttribLocation(program, "inPosition");
    var normalAttributeLocation = gl.getAttribLocation(program, "inNormal");
    var uvAttributeLocation = gl.getAttribLocation(program, "in_uv");
    // texture
    var textureLocation = gl.getUniformLocation(program, "in_texture");
    // matrix
    var matrixLocation = gl.getUniformLocation(program, "matrix");
    // ambient light
    var ambientLightColorHandle = gl.getUniformLocation(program, "ambientLightCol");
    var ambientMaterialHandle = gl.getUniformLocation(program, "ambientMat");
    // material diffuse color
    var materialDiffColorHandle = gl.getUniformLocation(program, 'mDiffColor');
    // blinn color and brightness
    var specularColorHandle = gl.getUniformLocation(program, "specularColor");
    var shineSpecularHandle = gl.getUniformLocation(program, "specShine");
    // directional light
    var lightDirectionHandle = gl.getUniformLocation(program, 'lightDirection');
    var lightColorHandle = gl.getUniformLocation(program, 'lightColor');
    // corrected matrices
    var normalMatrixPositionHandle = gl.getUniformLocation(program, 'nMatrix');
    var worldViewMatrixPositionHandle = gl.getUniformLocation(program, 'worldViewMatrix');


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
    {
      addMeshToScene(i);
    }

    function drawScene()
    {
        // update game state, animations
        Controller.updateGameState();

        // clear the canvas
        gl.clearColor(0.00, 0.00, 0.00, 1.0);
        gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);

        // update world matrices for moving objects 
        currentMatricesList[0] = getBallMatrix(ball.position.x, ball.position.y);
        currentMatricesList[1] = getPaddleMatrix(paddle.position.x);
        // walls not touched
        for (let i = 5; i < currentMatricesList.length; i++) 
        {
            currentMatricesList[i] = getBrickMatrix(i, brickList[i].disabled);
        }

        // directional light 
        



        // todo tomorrow        
        window.requestAnimationFrame(drawScene);
    }

    drawScene();
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
        ballMesh = await utils.loadMesh(modelsDir + "ball.obj");
        paddleMesh = await utils.loadMesh(modelsDir + "paddle.obj");
        wallMeshR = await utils.loadMesh(modelsDir + "wall.obj");
        wallMeshL = await utils.loadMesh(modelsDir + "wall.obj");
        wallMeshU = await utils.loadMesh(modelsDir + "wall.obj");
        brickMesh0 = await utils.loadMesh(modelsDir + "brick.obj");
        brickMesh1 = await utils.loadMesh(modelsDir + "brick.obj");
        brickMesh2 = await utils.loadMesh(modelsDir + "brick.obj");
        brickMesh3 = await utils.loadMesh(modelsDir + "brick.obj");
        brickMesh4 = await utils.loadMesh(modelsDir + "brick.obj");

        allMeshes = [
            ballMesh,
            paddleMesh,
            wallMeshR, 
            wallMeshL,
            wallMeshU, 
            brickMesh0,
            brickMesh1,
            brickMesh2,
            brickMesh3,
            brickMesh4
            // add more bricks
        ];
    }
  } 

window.onload = init;
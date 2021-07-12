//relevant paths to resources
let program;
let gl;
let baseDir;
let shaderDir;
let modelsDir;

//camera variables
let cx = 0;
let cy = 20;
let cz = 0;
let elev = -90;
let ang = 0;

// meshes
let ballMesh;
let paddleMesh;
let wallMeshR;
let wallMeshL;
let wallMeshU;
let brickMesh0;
let brickMesh1;
let brickMesh2;
let brickMesh3;
let brickMesh4;
// meshes list
let meshes;

// todo add other meshes


//score variables
let score = 0;
let currentScore = 0;
let done = false;

// texture variable
let texture;

//global variables
// todo add here global variables if needed

function main()
{
    // clear the canvas
    gl.clearColor(0.00, 0.00, 0.00, 1.0);
    gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);
    gl.enable(gl.DEPTH_TEST);


    // directional light 
    var directionalLightDirection = [0.0, -10.0, 0.0];
    var directionalLightColor = [1.0, 1.0, 1.0];
    // define ambient light and color
    var ambientLight = [0.15, 0.9, 0.8];
    var ambientColor = [0.4, 0.2, 0.6];
    // define material color 
    var materialDiffuseColor = [1.0, 1.0, 1.0]; // this will be multipled by the texture color
    //define specular component of color
    var specularColor = [1.0, 1.0, 1.0];
    var specularShine = 1.0;
    // get texture, send in buffer
    texture = gl.createTexture();
    gl.bindTexture(gl.TEXTURE_2D, texture);
    var image = new Image();
    image.src = baseDir + "Textures/textures.png";
    image.onload = function () {
        gl.bindTexture(gl.TEXTURE_2D, texture);
        gl.pixelStorei(gl.UNPACK_FLIP_Y_WEBGL, true);
        gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, image);
        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR);
        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR);
        gl.generateMipmap(gl.TEXTURE_2D);
    };


    // vertex shader
    // get attributes and normal location
    var positionAttributeLocation = gl.getAttribLocation(program, "inPosition");
    var normalAttributeLocation = gl.getAttribLocation(program, "inNormal");
    var uvAttributeLocation = gl.getAttribLocation(program, "in_uv");
    // corrected matrices
    var WVPMatrixHandle = gl.getUniformLocation(program, "WVPMatrix");
    var WVMatrixHandle = gl.getUniformLocation(program, 'WVMatrix');
    var NMatrixHandle = gl.getUniformLocation(program, 'NMatrix');

    // fragment shader
    // directional light
    var directionalLightDirectionHandle = gl.getUniformLocation(program, 'lightDirection');
    var directionalLightColorHandle = gl.getUniformLocation(program, 'lightColor');
    // ambient light
    var ambientLightHandle = gl.getUniformLocation(program, "ambientLight");
    var ambientColorlHandle = gl.getUniformLocation(program, "ambientColor");
    // material diffuse color
    var materialDiffuseColorHandle = gl.getUniformLocation(program, 'diffuseColor');
    // blinn color and brightness
    var specularColorHandle = gl.getUniformLocation(program, "specularColor");
    var specularShineHandle = gl.getUniformLocation(program, "specularShine");
    // texture
    var textureHandle = gl.getUniformLocation(program, "in_texture");


    // perspective matrix
    //var PMatrix = utils.MakePerspective(10, gl.canvas.width / gl.canvas.height, 0.1, 100.0);

    var PMatrix = [1 / 50, 0.0, 0.0, 0.0,
        0.0, 16 / (9 * 50), 0.0, 0.0,
        0.0, 0.0, -2 / (101 - 1), -(101 + 1) / (101 - 1),
        0.0, 0.0, 0.0, 1.0];


    // view matrix
    var VMatrix = utils.MakeView(cx, cy, cz, elev, ang);

    // vertex array objects
    var vaos = new Array(meshes.length);
    // draw objects
    for (let i = 0; i < meshes.length; i++)
    {
        let mesh = meshes[i];
        let vao = gl.createVertexArray();
        vaos[i] = vao;
        gl.bindVertexArray(vao);

        arrayBuffer(mesh.vertices, 3, positionAttributeLocation);
        arrayBuffer(mesh.textures, 2, uvAttributeLocation);
        arrayBuffer(mesh.vertexNormals, 3, normalAttributeLocation);

        indexBuffer(mesh.indices);
    }

    function arrayBuffer(elements, size, attributeLocation)
    {
        const buffer = gl.createBuffer();
        gl.bindBuffer(gl.ARRAY_BUFFER, buffer);
        gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(elements), gl.STATIC_DRAW);
        gl.enableVertexAttribArray(attributeLocation);
        gl.vertexAttribPointer(attributeLocation, size, gl.FLOAT, false, 0, 0);
    }

    function indexBuffer(elements)
    {
        const buffer = gl.createBuffer();
        gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, buffer);
        gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, new Uint16Array(elements), gl.STATIC_DRAW);
    }

    function drawScene()
    {
        // update game state, animations
        updateGameState();

        // clear the canvas
        gl.clearColor(0.00, 0.00, 0.00, 1.0);
        gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);


        // update world matrices for moving objects
        updateObjectsMatrices();


        // transform light direction into camera space
        var directionalLightDirectionTransformed = utils.multiplyMatrix3Vector3(utils.sub3x3from4x4(VMatrix), directionalLightDirection);

        // passing uniforms to fragment shader
        gl.uniform3fv(directionalLightDirectionHandle, directionalLightDirectionTransformed);
        gl.uniform3fv(directionalLightColorHandle, directionalLightColor);
        gl.uniform3fv(ambientLightHandle, ambientLight);
        gl.uniform3fv(ambientColorlHandle, ambientColor);
        gl.uniform3fv(specularColorHandle, specularColor);
        gl.uniform1f(specularShineHandle, specularShine);
        gl.uniform3fv(materialDiffuseColorHandle, materialDiffuseColor);  
        
        // pass each object with its matrix
        for (let i = 0; i < meshes.length; i++) {
            let WVMatrix = utils.multiplyMatrices(VMatrix, currentMatricesList[i]);
            let WVPMatrix = utils.multiplyMatrices(PMatrix, WVMatrix);
            let NMatrix = utils.invertMatrix(utils.transposeMatrix(WVMatrix));

            gl.uniformMatrix4fv(WVPMatrixHandle, gl.FALSE, utils.transposeMatrix(WVPMatrix));
            gl.uniformMatrix4fv(WVMatrixHandle, gl.FALSE, utils.transposeMatrix(WVMatrix));
            gl.uniformMatrix4fv(NMatrixHandle, gl.FALSE, utils.transposeMatrix(NMatrix));

            gl.activeTexture(gl.TEXTURE0);
            gl.bindTexture(gl.TEXTURE_2D, texture);
            gl.uniform1i(textureHandle, 0);

            gl.bindVertexArray(vaos[i]);
            gl.drawElements(gl.TRIANGLES, meshes[i].indices.length, gl.UNSIGNED_SHORT, 0);
        }

        window.requestAnimationFrame(drawScene);
    }
    drawScene();
}

async function init() {
  
    // maybe add music

    setupCanvas();
    await loadShaders();
    await loadMeshes();

    initializeObjects(); // set up objects in the logical model
    initializeObjectsMatrices(); // set up all the matrices from the previous initialized objects

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
        paddleMesh = await utils.loadMesh(modelsDir + "Paddle.obj");
        console.log(paddleMesh.vertices)
        wallMeshR = await utils.loadMesh(modelsDir + "Wall.obj");
        console.log(wallMeshR.vertices);
        wallMeshL = await utils.loadMesh(modelsDir + "Wall.obj");
        wallMeshU = await utils.loadMesh(modelsDir + "Wall.obj");
        brickMesh0 = await utils.loadMesh(modelsDir + "Brick.obj");
        brickMesh1 = await utils.loadMesh(modelsDir + "Brick.obj");
        brickMesh2 = await utils.loadMesh(modelsDir + "Brick.obj");
        brickMesh3 = await utils.loadMesh(modelsDir + "Brick.obj");
        brickMesh4 = await utils.loadMesh(modelsDir + "Brick.obj");

        meshes = [
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
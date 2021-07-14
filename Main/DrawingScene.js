function main(){
    // clear the canvas
    gl.clearColor(1.00, 1.00, 1.00, 1.0);
    gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);
    gl.enable(gl.DEPTH_TEST);

    // get texture, send in buffer
    texture = gl.createTexture();
    gl.bindTexture(gl.TEXTURE_2D, texture);

    image.src = baseDir + "Textures/col_textures.png";
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
    positionAttributeLocation = gl.getAttribLocation(program, "inPosition");
    normalAttributeLocation = gl.getAttribLocation(program, "inNormal");
    uvAttributeLocation = gl.getAttribLocation(program, "in_uv");
    // corrected matrices
    WVPMatrixHandle = gl.getUniformLocation(program, "WVPMatrix");
    WVMatrixHandle = gl.getUniformLocation(program, 'WVMatrix');
    NMatrixHandle = gl.getUniformLocation(program, 'NMatrix');

    // fragment shader
    // directional light
    directionalLightDirectionHandle = gl.getUniformLocation(program, 'lightDirection');
    directionalLightColorHandle = gl.getUniformLocation(program, 'lightColor');
    // ambient light
    ambientLightColorHandle = gl.getUniformLocation(program, "ambientLight");
    ambientColorHandle = gl.getUniformLocation(program, "ambientColor");
    // material diffuse color
    materialDiffuseColorHandle = gl.getUniformLocation(program, 'diffuseColor');
    // Blinn color and brightness
    specularColorHandle = gl.getUniformLocation(program, "specularColor");
    specularShineHandle = gl.getUniformLocation(program, "specularShine");
    // texture
    textureHandle = gl.getUniformLocation(program, "in_texture");

    // perspective matrix
    PMatrix = utils.MakeProjection(gl.canvas.width/45, gl.canvas.width / gl.canvas.height, 1, 100);
    //PMatrix = utils.MakePerspective(45, gl.canvas.width / gl.canvas.height, 1, 100);

    // view matrix
    VMatrix = utils.MakeView(cx, cy, cz, elev, ang);

    // vertex array objects
    vaos = new Array(meshes.length);
    // draw objects
    for (let i = 0; i < meshes.length; i++)
    {
        let mesh = meshes[i];
        let vao = gl.createVertexArray();
        vaos[i] = vao;
        gl.bindVertexArray(vao);

        arrayBuffer(mesh.vertices, 3, positionAttributeLocation);
        arrayBuffer(mesh.textures, 2, uvAttributeLocation);

        console.log(mesh.textures);
        arrayBuffer(mesh.vertexNormals, 3, normalAttributeLocation);

        indexBuffer(mesh.indices);
    }

    drawScene();
}

function arrayBuffer(elements, size, attributeLocation){
    let buffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, buffer);
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(elements), gl.STATIC_DRAW);
    gl.enableVertexAttribArray(attributeLocation);
    gl.vertexAttribPointer(attributeLocation, size, gl.FLOAT, false, 0, 0);
}

function indexBuffer(elements){
    let buffer = gl.createBuffer();
    gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, buffer);
    gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, new Uint16Array(elements), gl.STATIC_DRAW);
}

function drawScene(){
    // clear the canvas
    //gl.clearColor(0.20, 0.20, 0.70, 1.0); // sets wallpaper color
    gl.clearColor(0.0, 0.0, 0.0, 1); // sets wallpaper color
    gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);

    // update game state, animations
    updateGameState();

    // update world matrices for moving objects
    updateMatrices();

    // get directional light directions
    dirLightAlpha = utils.degToRad(document.getElementById("dirLightAlpha").value);
    dirLightBeta = utils.degToRad(document.getElementById("dirLightBeta").value);
    directionalLightDirection = [Math.cos(Math.PI - dirLightAlpha) * Math.cos(dirLightBeta),
        Math.sin(Math.PI - dirLightAlpha),
        Math.cos(Math.PI - dirLightAlpha) * Math.sin(dirLightBeta)
    ];

    // transform light direction into camera space
    let directionalLightDirectionTransformed = utils.multiplyMatrix3Vector3(utils.sub3x3from4x4(VMatrix), directionalLightDirection);

    // passing uniforms to fragment shader
    gl.uniform3fv(directionalLightDirectionHandle, directionalLightDirectionTransformed);
    gl.uniform3fv(directionalLightColorHandle, directionalLightColor);
    gl.uniform3fv(ambientLightColorHandle, ambientLightColor);
    gl.uniform3fv(ambientColorHandle, ambientColor);
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

async function init() {
  
    // maybe add music

    setupCanvas();
    await loadShaders();
    await loadMeshes();

    textHandle = document.getElementById("text");
    resetGame();

    main();
}

// prepare canvas and body styles
function setupCanvas(){
    let canvas = document.getElementById("canvas");
    gl = canvas.getContext("webgl2");

    if (!gl) {
        document.write("GL context not opened");
        return;
    }
    utils.resizeCanvasToDisplaySize(canvas);
    gl.viewport(0, 0, gl.canvas.width, gl.canvas.height);
}

//load shaders
async function loadShaders(){
    // initialize resource paths
    let path = window.location.pathname;
    let page = path.split("/").pop();
    baseDir = window.location.href.replace(page, '');
    shaderDir = baseDir + "Shaders/";
    modelsDir = baseDir + "Models/";

    // load vertex and fragment shaders from file
    await utils.loadFiles([shaderDir + 'vs.glsl', shaderDir + 'fs.glsl'], function (shaderText) {
        let vertexShader = utils.createShader(gl, gl.VERTEX_SHADER, shaderText[0]);
        let fragmentShader = utils.createShader(gl, gl.FRAGMENT_SHADER, shaderText[1]);
        program = utils.createProgram(gl, vertexShader, fragmentShader);

    });
    gl.useProgram(program);
}

// load meshes from obj files
async function loadMeshes(){
    ballMesh = await utils.loadMesh(modelsDir + "Ball.obj");
    paddleMesh = await utils.loadMesh(modelsDir + "Paddle.obj");
    wallMeshR = await utils.loadMesh(modelsDir + "Wall.obj");
    wallMeshL = await utils.loadMesh(modelsDir + "Wall.obj");
    wallMeshU = await utils.loadMesh(modelsDir + "Wall.obj");

    brickGMesh0 =  await utils.loadMesh(modelsDir + "BrickG.obj");
    brickGMesh1 =  await utils.loadMesh(modelsDir + "BrickG.obj");
    brickGMesh2 =  await utils.loadMesh(modelsDir + "BrickG.obj");
    brickGMesh3 =  await utils.loadMesh(modelsDir + "BrickG.obj");
    brickGMesh4 =  await utils.loadMesh(modelsDir + "BrickG.obj");
    brickGMesh5 =  await utils.loadMesh(modelsDir + "BrickG.obj");
    brickGMesh6 =  await utils.loadMesh(modelsDir + "BrickG.obj");
    brickGMesh7 =  await utils.loadMesh(modelsDir + "BrickG.obj");
    brickGMesh8 =  await utils.loadMesh(modelsDir + "BrickG.obj");
    brickGMesh9 =  await utils.loadMesh(modelsDir + "BrickG.obj");
    brickGMesh10 = await utils.loadMesh(modelsDir + "BrickG.obj");
    brickGMesh11 = await utils.loadMesh(modelsDir + "BrickG.obj");
    brickGMesh12 = await utils.loadMesh(modelsDir + "BrickG.obj");

    brickPMesh0 =  await utils.loadMesh(modelsDir + "BrickP.obj");
    brickPMesh1 =  await utils.loadMesh(modelsDir + "BrickP.obj");
    brickPMesh2 =  await utils.loadMesh(modelsDir + "BrickP.obj");
    brickPMesh3 =  await utils.loadMesh(modelsDir + "BrickP.obj");
    brickPMesh4 =  await utils.loadMesh(modelsDir + "BrickP.obj");
    brickPMesh5 =  await utils.loadMesh(modelsDir + "BrickP.obj");
    brickPMesh6 =  await utils.loadMesh(modelsDir + "BrickP.obj");
    brickPMesh7 =  await utils.loadMesh(modelsDir + "BrickP.obj");
    brickPMesh8 =  await utils.loadMesh(modelsDir + "BrickP.obj");
    brickPMesh9 =  await utils.loadMesh(modelsDir + "BrickP.obj");
    brickPMesh10 = await utils.loadMesh(modelsDir + "BrickP.obj");
    brickPMesh11 = await utils.loadMesh(modelsDir + "BrickP.obj");
    brickPMesh12 = await utils.loadMesh(modelsDir + "BrickP.obj");

    brickYMesh0 =  await utils.loadMesh(modelsDir + "BrickY.obj");
    brickYMesh1 =  await utils.loadMesh(modelsDir + "BrickY.obj");
    brickYMesh2 =  await utils.loadMesh(modelsDir + "BrickY.obj");
    brickYMesh3 =  await utils.loadMesh(modelsDir + "BrickY.obj");
    brickYMesh4 =  await utils.loadMesh(modelsDir + "BrickY.obj");
    brickYMesh5 =  await utils.loadMesh(modelsDir + "BrickY.obj");
    brickYMesh6 =  await utils.loadMesh(modelsDir + "BrickY.obj");
    brickYMesh7 =  await utils.loadMesh(modelsDir + "BrickY.obj");
    brickYMesh8 =  await utils.loadMesh(modelsDir + "BrickY.obj");
    brickYMesh9 =  await utils.loadMesh(modelsDir + "BrickY.obj");
    brickYMesh10 = await utils.loadMesh(modelsDir + "BrickY.obj");
    brickYMesh11 = await utils.loadMesh(modelsDir + "BrickY.obj");
    brickYMesh12 = await utils.loadMesh(modelsDir + "BrickY.obj");

    brickRMesh0 =  await utils.loadMesh(modelsDir + "BrickR.obj");
    brickRMesh1 =  await utils.loadMesh(modelsDir + "BrickR.obj");
    brickRMesh2 =  await utils.loadMesh(modelsDir + "BrickR.obj");
    brickRMesh3 =  await utils.loadMesh(modelsDir + "BrickR.obj");
    brickRMesh4 =  await utils.loadMesh(modelsDir + "BrickR.obj");
    brickRMesh5 =  await utils.loadMesh(modelsDir + "BrickR.obj");
    brickRMesh6 =  await utils.loadMesh(modelsDir + "BrickR.obj");
    brickRMesh7 =  await utils.loadMesh(modelsDir + "BrickR.obj");
    brickRMesh8 =  await utils.loadMesh(modelsDir + "BrickR.obj");
    brickRMesh9 =  await utils.loadMesh(modelsDir + "BrickR.obj");
    brickRMesh10 = await utils.loadMesh(modelsDir + "BrickR.obj");
    brickRMesh11 = await utils.loadMesh(modelsDir + "BrickR.obj");
    brickRMesh12 = await utils.loadMesh(modelsDir + "BrickR.obj");

    brickNMesh0 =  await utils.loadMesh(modelsDir + "BrickN.obj");
    brickNMesh1 =  await utils.loadMesh(modelsDir + "BrickN.obj");
    brickNMesh2 =  await utils.loadMesh(modelsDir + "BrickN.obj");
    brickNMesh3 =  await utils.loadMesh(modelsDir + "BrickN.obj");
    brickNMesh4 =  await utils.loadMesh(modelsDir + "BrickN.obj");
    brickNMesh5 =  await utils.loadMesh(modelsDir + "BrickN.obj");
    brickNMesh6 =  await utils.loadMesh(modelsDir + "BrickN.obj");
    brickNMesh7 =  await utils.loadMesh(modelsDir + "BrickN.obj");
    brickNMesh8 =  await utils.loadMesh(modelsDir + "BrickN.obj");
    brickNMesh9 =  await utils.loadMesh(modelsDir + "BrickN.obj");
    brickNMesh10 = await utils.loadMesh(modelsDir + "BrickN.obj");
    brickNMesh11 = await utils.loadMesh(modelsDir + "BrickN.obj");
    brickNMesh12 = await utils.loadMesh(modelsDir + "BrickN.obj");


    meshes = [
        ballMesh,
        paddleMesh,
        wallMeshR,
        wallMeshL,
        wallMeshU,

        brickGMesh0,
        brickGMesh1,
        brickGMesh2,
        brickGMesh3,
        brickGMesh4,
        brickGMesh5,
        brickGMesh6,
        brickGMesh7,
        brickGMesh8,
        brickGMesh9,
        brickGMesh10,
        brickGMesh11,
        brickGMesh12,

        brickPMesh0,
        brickPMesh1,
        brickPMesh2,
        brickPMesh3,
        brickPMesh4,
        brickPMesh5,
        brickPMesh6,
        brickPMesh7,
        brickPMesh8,
        brickPMesh9,
        brickPMesh10,
        brickPMesh11,
        brickPMesh12,

        brickYMesh0,
        brickYMesh1,
        brickYMesh2,
        brickYMesh3,
        brickYMesh4,
        brickYMesh5,
        brickYMesh6,
        brickYMesh7,
        brickYMesh8,
        brickYMesh9,
        brickYMesh10,
        brickYMesh11,
        brickYMesh12,

        brickRMesh0,
        brickRMesh1,
        brickRMesh2,
        brickRMesh3,
        brickRMesh4,
        brickRMesh5,
        brickRMesh6,
        brickRMesh7,
        brickRMesh8,
        brickRMesh9,
        brickRMesh10,
        brickRMesh11,
        brickRMesh12,

        brickNMesh0,
        brickNMesh1,
        brickNMesh2,
        brickNMesh3,
        brickNMesh4,
        brickNMesh5,
        brickNMesh6,
        brickNMesh7,
        brickNMesh8,
        brickNMesh9,
        brickNMesh10,
        brickNMesh11,
        brickNMesh12

        // add more bricks
    ];
}

window.onload = init;

function updateScreenText(){
    if(!hasGameEnded)
    {
        textHandle.innerHTML =
            '        Record  : ' + recordScore + '<br>\n' +
            '        Score   : ' + currentScore + '<br>\n' +
            '        Lives   : ' + currentLives + '<br>\n' +
            '        Press enter to restart';
    }
    else
    {
        textHandle.innerHTML =
            '        Record  : ' + recordScore + '<br>\n' +
            '        Score   : ' + currentScore + '<br>\n' +
            '        Lives   : ' + currentLives + '<br>\n' +
            '        Game ended, press enter to restart';
    }
}
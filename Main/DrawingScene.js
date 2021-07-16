window.onload = init;

async function init() {

    // maybe add music

    setupCanvas();
    await loadShaders();
    await loadMeshes();

    textHandle = document.getElementById("text");

    resetGame();

    main();
}

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
        arrayBuffer(mesh.vertexNormals, 3, normalAttributeLocation);

        indexBuffer(mesh.indices);
    }

    drawScene();
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
    directionalLightDirection = [Math.sin(dirLightAlpha) * Math.cos(dirLightBeta),
            Math.cos(dirLightAlpha),
            Math.sin(dirLightAlpha) * Math.sin(dirLightBeta)];

    // view matrix
    //console.log(elev + " " + ang);
    cz = lookRadius * Math.cos(utils.degToRad(-ang)) * Math.cos(utils.degToRad(-elev));
    cx = lookRadius * Math.sin(utils.degToRad(-ang)) * Math.cos(utils.degToRad(-elev));
    cy = lookRadius * Math.sin(utils.degToRad(-elev));
    console.log(cx +" "+ cy +" " +cz);
    VMatrix = utils.MakeView(cx, cy, cz, elev, ang);

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

    // add mouse controls for 3D movement
    canvas.addEventListener("mousedown", doMouseDown, false);
    canvas.addEventListener("mouseup", doMouseUp, false);
    canvas.addEventListener("mousemove", doMouseMove, false);
    canvas.addEventListener("mousewheel", doMouseWheel, false);
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
    meshes = [];

    ballMesh = await utils.loadMesh(modelsDir + "Ball.obj");
    paddleMesh = await utils.loadMesh(modelsDir + "Paddle.obj");
    wallMeshR = await utils.loadMesh(modelsDir + "Wall.obj");
    wallMeshL = await utils.loadMesh(modelsDir + "Wall.obj");
    wallMeshU = await utils.loadMesh(modelsDir + "Wall.obj");

    meshes.push(ballMesh, paddleMesh, wallMeshR, wallMeshL, wallMeshU);

    // load tons of bricks
    for(let i = 0; i < 13; i++)
        meshes.push(await utils.loadMesh(modelsDir + "BrickG.obj"))
    for(let i = 0; i < 13; i++)
        meshes.push(await utils.loadMesh(modelsDir + "BrickP.obj"))
    for(let i = 0; i < 13; i++)
        meshes.push(await utils.loadMesh(modelsDir + "BrickY.obj"))
    for(let i = 0; i < 13; i++)
        meshes.push(await utils.loadMesh(modelsDir + "BrickR.obj"))
    for(let i = 0; i < 13; i++)
        meshes.push(await utils.loadMesh(modelsDir + "BrickN.obj"))
}

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


function doMouseDown(event) {
    lastMouseX = event.pageX;
    lastMouseY = event.pageY;
    mouseState = true;
}
function doMouseUp() {
    lastMouseX = -100;
    lastMouseY = -100;
    mouseState = false;
}
function doMouseMove(event) {
    if(mouseState && ThreeDOn) {
        let dx = event.pageX - lastMouseX;
        let dy = lastMouseY - event.pageY;
        lastMouseX = event.pageX;
        lastMouseY = event.pageY;

        if((dx !== 0) || (dy !== 0)) {
            ang = ang + 0.5 * dx;
            elev = elev + 0.5 * dy;
        }
    }
}
function doMouseWheel(event) {
    if(ThreeDOn)
    {
        let nLookRadius = lookRadius + event.wheelDelta/250.0;
        if((nLookRadius > 10.0) && (nLookRadius < 75.0)) {
            lookRadius = nLookRadius;
        }
    }
}
//relevant paths to resources
let program;
let gl;
let baseDir;
let shaderDir;
let modelsDir;
let canvas

//camera variables
let cx = CX;
let cy = CY;
let cz = CZ;
let elev = ELEV;
let ang = ANG;
let lookRadius = LOOK_RADIUS;

let ThreeDOn = false;

let mouseState = false;
let lastMouseX = -100, lastMouseY = -100;


// meshes
let ballMesh;
let paddleMesh;
let wallMeshR;
let wallMeshL;
let wallMeshU;

// meshes list
let meshes = null;

// reference to text in html file
let textScoreHandle = null;
let gameOverTextHandle = null;
let gameOverDiv = null;

// texture variable
let texture;
let image = new Image();

// directional light
let dirLightAlpha;
let dirLightBeta;
let directionalLightDirection;// = [0.0, 1.0, 0.0];
let directionalLightColor = [1.0, 1.0, 1.0];
// define ambient light and color
let ambientLightColor = [1.0, 1.0, 1.0];
let ambientColor = [0.5, 0.5, 0.5];
// define material color
let materialDiffuseColor = [1.0, 1.0, 1.0]; // this will be multiplied by the texture color
//define specular component of color
let specularColor = [1.0, 1.0, 1.0];
let specularShine = 1.0;

// vertex shader
// get attributes and normal location
let positionAttributeLocation;
let normalAttributeLocation;
let uvAttributeLocation;
// corrected matrices
let WVPMatrixHandle;
let WVMatrixHandle;
let NMatrixHandle;

// fragment shader
// directional light
let directionalLightDirectionHandle;
let directionalLightColorHandle;
// ambient light
let ambientLightColorHandle;
let ambientColorHandle;
// material diffuse color
let materialDiffuseColorHandle;
// Blinn color and brightness
let specularColorHandle;
let specularShineHandle;
// texture
let textureHandle;
// perspective matrix
let PMatrix;
// view matrix
let VMatrix;
// vertex array objects
let vaos;

let dirLightAlphaHandle;
let dirLightBetaHandle;

let ballSpeedHandle;
let paddleSpeedHandle;



//relevant paths to resources
let program;
let gl;
let baseDir;
let shaderDir;
let modelsDir;

//camera variables
let cx = 0;
let cy = 50;
let cz = 3;
let elev = -90;
let ang = 0;

// meshes
let ballMesh;
let paddleMesh;
let wallMeshR;
let wallMeshL;
let wallMeshU;

let brickGMesh0;
let brickGMesh1;
let brickGMesh2;
let brickGMesh3;
let brickGMesh4;
let brickGMesh5;
let brickGMesh6;
let brickGMesh7;
let brickGMesh8;
let brickGMesh9;
let brickGMesh10;
let brickGMesh11;
let brickGMesh12;
let brickPMesh0;
let brickPMesh1;
let brickPMesh2;
let brickPMesh3;
let brickPMesh4;
let brickPMesh5;
let brickPMesh6;
let brickPMesh7;
let brickPMesh8;
let brickPMesh9;
let brickPMesh10;
let brickPMesh11;
let brickPMesh12;
let brickYMesh0;
let brickYMesh1;
let brickYMesh2;
let brickYMesh3;
let brickYMesh4;
let brickYMesh5;
let brickYMesh6;
let brickYMesh7;
let brickYMesh8;
let brickYMesh9;
let brickYMesh10;
let brickYMesh11;
let brickYMesh12;
let brickRMesh0;
let brickRMesh1;
let brickRMesh2;
let brickRMesh3;
let brickRMesh4;
let brickRMesh5;
let brickRMesh6;
let brickRMesh7;
let brickRMesh8;
let brickRMesh9;
let brickRMesh10;
let brickRMesh11;
let brickRMesh12;
let brickNMesh0;
let brickNMesh1;
let brickNMesh2;
let brickNMesh3;
let brickNMesh4;
let brickNMesh5;
let brickNMesh6;
let brickNMesh7;
let brickNMesh8;
let brickNMesh9;
let brickNMesh10;
let brickNMesh11;
let brickNMesh12;

// meshes list
let meshes;

// reference to text in html file
let textHandle = null;

// texture variable
let texture;

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

let image = new Image();

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

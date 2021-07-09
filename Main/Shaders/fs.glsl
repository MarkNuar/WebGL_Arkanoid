#version 300 es

precision mediump float;

in vec2 fsUV;
in vec3 fsNormal;
in vec4 fs_pos;

uniform vec3 specularColor;
uniform float specularShine;
uniform vec3 diffuseColor;

//texture
uniform sampler2D in_texture;

//directional light 
uniform vec3 lightDirection; 
uniform vec3 lightColor;

//ambient
uniform vec3 ambientLight;
uniform vec3 ambientColor;

out vec4 out_Color;


void main() {
    //normalize fsNormal, it might not be in the normalized form coming from the vs
    vec3 nNormal = normalize(fsNormal);

    //light directions
    vec3 nLightDirection = normalize(lightDirection);

    //computing Lambert diffuse component
    vec3 lambertDiffuseColor = diffuseColor * clamp(dot(nLightDirection, nNormal), 0.0, 1.0) * lightColor;

    //computing ambient color
    vec3 ambient = ambientLight * ambientColor;

    //computing Blinn specular color
    vec3 eyeDirection = vec3(normalize(-fs_pos));
    vec3 blinnSpecularColor = specularColor * pow(clamp(dot(nNormal,normalize(nLightDirection + eyeDirection)),0.0,1.0),specularShine) * lightColor;

    //computing BRDF color
    vec4 color = vec4(clamp(lambertDiffuseColor + blinnSpecularColor + ambient, 0.0, 1.0).rgb,1.0);

    //compose final color with texture
    out_Color = color * texture(in_texture, fsUV);
}
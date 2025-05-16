<template>
    <canvas ref="canvas" class="shader-canvas"></canvas>
</template>

<script setup>
import { onMounted, onBeforeUnmount, ref } from 'vue';

const canvas = ref(null);
let gl, program, animationFrameId;

function compileShader(gl, type, source) {
    const shader = gl.createShader(type);
    gl.shaderSource(shader, source);
    gl.compileShader(shader);
    if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
        console.error('Shader compile failed:', gl.getShaderInfoLog(shader));
        gl.deleteShader(shader);
        return null;
    }
    return shader;
}

function createProgram(gl, vertexSource, fragmentSource) {
    const vertexShader = compileShader(gl, gl.VERTEX_SHADER, vertexSource);
    const fragmentShader = compileShader(gl, gl.FRAGMENT_SHADER, fragmentSource);
    if (!vertexShader || !fragmentShader) return null;

    const program = gl.createProgram();
    gl.attachShader(program, vertexShader);
    gl.attachShader(program, fragmentShader);
    gl.linkProgram(program);

    if (!gl.getProgramParameter(program, gl.LINK_STATUS)) {
        console.error('Program link failed:', gl.getProgramInfoLog(program));
        return null;
    }
    return program;
}

const vertexShaderSource = `
  attribute vec4 a_position;
  void main() {
    gl_Position = a_position;
  }
`;

const fragmentShaderSource = `
precision mediump float;

uniform vec2 iResolution;
uniform float iTime;

float rand(vec2 co) {
    return fract(sin(dot(co.xy, vec2(12.9898, 78.233))) * 43758.5453);
}

mat2 rotate(float a) {
    float c = cos(a);
    float s = sin(a);
    return mat2(c, -s, s, c);
}

void main() {
    vec2 uv = gl_FragCoord.xy / iResolution.xy;

    float lineDensity = 500.0;

    float angle = 0.9;

    float flip = step(0.5, rand(floor(uv * lineDensity)));
    float altAngle = 1.57;

    float mixedAngle = mix(angle, altAngle, flip);
    vec2 rotatedUV = rotate(mixedAngle) * uv;

    float jitterStrength = 0.15;
    float jitter = rand(floor(rotatedUV.yy * lineDensity)) * jitterStrength;
    jitter += 0.01 * sin(iTime + uv.x * 50.0);

    float linePos = fract(rotatedUV.y * lineDensity + jitter);

    float line = smoothstep(0.48, 0.52, linePos);

    float lineNoise = rand(floor(rotatedUV.yy * lineDensity));
    float flicker = 0.2 * sin(iTime * 0.5 + lineNoise * 10.0);
    float alpha = mix(0.4, 1.0, lineNoise + flicker);

    vec3 base = vec3(1.0);
    vec3 ink = vec3(0.94);
    vec3 color = mix(base, ink, line * alpha);

    gl_FragColor = vec4(color, alpha);
}
`;

function resizeCanvasToDisplaySize(canvas) {
    const width = canvas.clientWidth * devicePixelRatio;
    const height = canvas.clientHeight * devicePixelRatio;
    if (canvas.width !== width || canvas.height !== height) {
        canvas.width = width;
        canvas.height = height;
        return true;
    }
    return false;
}

function initWebGL(canvas) {
    gl = canvas.getContext('webgl', {alpha : true});
    if (!gl) {
        console.error('WebGL not supported');
        return false;
    }
    program = createProgram(gl, vertexShaderSource, fragmentShaderSource);
    if (!program) return false;

    gl.useProgram(program);

    // Setup fullscreen quad
    const positionLoc = gl.getAttribLocation(program, 'a_position');
    const positionBuffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, positionBuffer);
    const positions = new Float32Array([
        -1, -1,
        1, -1,
        -1, 1,
        -1, 1,
        1, -1,
        1, 1,
    ]);
    gl.bufferData(gl.ARRAY_BUFFER, positions, gl.STATIC_DRAW);
    gl.enableVertexAttribArray(positionLoc);
    gl.vertexAttribPointer(positionLoc, 2, gl.FLOAT, false, 0, 0);

    return true;
}

onMounted(() => {
    if (!canvas.value) return;

    if (!initWebGL(canvas.value)) return;

    const iResolutionLoc = gl.getUniformLocation(program, 'iResolution');
    const iTimeLoc = gl.getUniformLocation(program, 'iTime');

    function render(time = 0) {
        time *= 0.001; // convert to seconds

        if (resizeCanvasToDisplaySize(canvas.value)) {
            gl.viewport(0, 0, canvas.value.width, canvas.value.height);
        }

        gl.uniform2f(iResolutionLoc, canvas.value.width, canvas.value.height);
        gl.uniform1f(iTimeLoc, time);

        gl.drawArrays(gl.TRIANGLES, 0, 6);

        animationFrameId = requestAnimationFrame(render);
    }

    animationFrameId = requestAnimationFrame(render);
});

onBeforeUnmount(() => {
    if (animationFrameId) cancelAnimationFrame(animationFrameId);
});
</script>

<style scoped>
.shader-canvas {
    display: block;
    width: 100vw;
    height: 100vh;
    position: absolute;
    top: 0;
    left: 0;
    /* z-index: -1; */
    background: transparent;
}
</style>
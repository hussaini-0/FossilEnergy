"use client";
/**
 * OilFlow: a slow, glossy liquid surface for design E's backgrounds.
 *
 * A single full-screen fragment shader (three.js) renders domain-warped noise as a
 * height field, then lights it like a viscous liquid: soft diffuse shading, a tight
 * specular highlight, and a red-to-amber sheen in the creases. The pointer adds a
 * gentle bulge. It renders at reduced resolution (the image is smooth, so upscaling
 * is invisible), pauses when off-screen or the tab is hidden, and holds a still
 * frame for reduced-motion users.
 */
import { useEffect, useRef } from "react";
import * as THREE from "three";

const vertex = /* glsl */ `
  varying vec2 vUv;
  void main() { vUv = uv; gl_Position = vec4(position.xy, 0.0, 1.0); }
`;

const fragment = /* glsl */ `
  precision highp float;
  varying vec2 vUv;
  uniform float uTime;
  uniform vec2 uRes;
  uniform vec2 uMouse;
  uniform float uMouseOn;

  float hash(vec2 p) { return fract(sin(dot(p, vec2(127.1, 311.7))) * 43758.5453); }
  float noise(vec2 p) {
    vec2 i = floor(p), f = fract(p);
    vec2 u = f * f * (3.0 - 2.0 * f);
    return mix(mix(hash(i), hash(i + vec2(1, 0)), u.x), mix(hash(i + vec2(0, 1)), hash(i + vec2(1, 1)), u.x), u.y);
  }
  float fbm(vec2 p) {
    float v = 0.0, a = 0.5;
    mat2 r = mat2(0.8, -0.6, 0.6, 0.8);
    for (int i = 0; i < 3; i++) { v += a * noise(p); p = r * p * 2.02; a *= 0.5; }
    return v;
  }
  // Domain warping: fbm fed by fbm, slowly drifting, reads as flowing oil.
  float field(vec2 p) {
    float t = uTime * 0.045;
    vec2 q = vec2(fbm(p + vec2(0.0, t)), fbm(p + vec2(5.2, 1.3) - t));
    vec2 r = vec2(fbm(p + 2.2 * q + vec2(1.7, 9.2) + 1.6 * t), fbm(p + 2.2 * q + vec2(8.3, 2.8) - 1.2 * t));
    return fbm(p + 2.0 * r);
  }

  void main() {
    vec2 uv = vUv;
    vec2 p = (uv - 0.5) * vec2(uRes.x / uRes.y, 1.0) * 1.25;

    // Pointer: a soft bulge in the surface.
    vec2 m = (uMouse - 0.5) * vec2(uRes.x / uRes.y, 1.0) * 1.25;
    float d = length(p - m);
    p += (p - m) * 0.22 * exp(-d * d * 6.0) * uMouseOn;

    float e = 0.02;
    float h = field(p);
    float hx = field(p + vec2(e, 0.0));
    float hy = field(p + vec2(0.0, e));
    vec3 n = normalize(vec3((h - hx) * 1.6, (h - hy) * 1.6, 0.05));

    vec3 light = normalize(vec3(0.55, 0.65, 0.9));
    float diff = clamp(dot(n, light), 0.0, 1.0);
    vec3 view = vec3(0.0, 0.0, 1.0);
    float spec = pow(clamp(dot(reflect(-light, n), view), 0.0, 1.0), 22.0);
    float rim = pow(1.0 - clamp(n.z, 0.0, 1.0), 2.0);

    vec3 base = vec3(0.07, 0.065, 0.075);
    vec3 crease = vec3(0.62, 0.06, 0.08);     // deep brand red
    vec3 sheen = vec3(1.0, 0.42, 0.16);       // amber
    vec3 col = base + crease * smoothstep(0.3, 0.8, h) * (0.3 + 0.7 * diff);
    col += sheen * rim * 0.42;
    col += vec3(1.0, 0.88, 0.8) * spec * 0.6;

    // Vignette keeps text areas calm.
    float v = smoothstep(1.25, 0.25, length((uv - vec2(0.62, 0.55)) * vec2(1.25, 1.0)));
    col *= 0.7 + 0.3 * v;
    gl_FragColor = vec4(col, 1.0);
  }
`;

export default function OilFlow({ className = "gp-wave" }: { className?: string }) {
  const host = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = host.current;
    if (!el) return;
    let renderer: THREE.WebGLRenderer;
    try {
      renderer = new THREE.WebGLRenderer({ antialias: false, alpha: false, powerPreference: "high-performance" });
    } catch {
      return; // no WebGL: the CSS background colour shows instead
    }
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const scale = Math.min(window.devicePixelRatio || 1, 1.5) * 0.55;
    renderer.setPixelRatio(scale);
    el.appendChild(renderer.domElement);
    Object.assign(renderer.domElement.style, { width: "100%", height: "100%", display: "block" });

    const scene = new THREE.Scene();
    const camera = new THREE.OrthographicCamera(-1, 1, 1, -1, 0, 1);
    const uniforms = {
      uTime: { value: 8 },
      uRes: { value: new THREE.Vector2(1, 1) },
      uMouse: { value: new THREE.Vector2(0.7, 0.5) },
      uMouseOn: { value: 0 },
    };
    const mesh = new THREE.Mesh(
      new THREE.PlaneGeometry(2, 2),
      new THREE.ShaderMaterial({ vertexShader: vertex, fragmentShader: fragment, uniforms }),
    );
    scene.add(mesh);

    const resize = () => {
      const w = el.clientWidth || 1;
      const h = el.clientHeight || 1;
      renderer.setSize(w, h, false);
      uniforms.uRes.value.set(w, h);
    };
    resize();
    const ro = new ResizeObserver(resize);
    ro.observe(el);

    const target = new THREE.Vector2(0.7, 0.5);
    let mouseOn = 0;
    const onMove = (e: PointerEvent) => {
      const r = el.getBoundingClientRect();
      target.set((e.clientX - r.left) / r.width, 1 - (e.clientY - r.top) / r.height);
      mouseOn = 1;
    };
    const onLeave = () => (mouseOn = 0);
    window.addEventListener("pointermove", onMove, { passive: true });
    document.addEventListener("pointerleave", onLeave);

    let visible = true;
    const io = new IntersectionObserver(([entry]) => (visible = entry.isIntersecting));
    io.observe(el);

    let raf = 0;
    let last = performance.now();
    const loop = (now: number) => {
      raf = requestAnimationFrame(loop);
      const dt = Math.min((now - last) / 1000, 0.05);
      last = now;
      if (!visible || document.hidden) return;
      uniforms.uTime.value += dt;
      uniforms.uMouse.value.lerp(target, 0.06);
      uniforms.uMouseOn.value += (mouseOn - uniforms.uMouseOn.value) * 0.05;
      renderer.render(scene, camera);
    };
    if (reduce) renderer.render(scene, camera);
    else raf = requestAnimationFrame(loop);

    return () => {
      cancelAnimationFrame(raf);
      ro.disconnect();
      io.disconnect();
      window.removeEventListener("pointermove", onMove);
      document.removeEventListener("pointerleave", onLeave);
      mesh.geometry.dispose();
      (mesh.material as THREE.Material).dispose();
      renderer.dispose();
      renderer.domElement.remove();
    };
  }, []);

  return <div ref={host} className={`${className} ig-oil`} aria-hidden="true" />;
}

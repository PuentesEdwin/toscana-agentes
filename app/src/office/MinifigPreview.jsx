import React, { useEffect, useRef } from 'react'
import * as THREE from 'three'
import { RoomEnvironment } from 'three/addons/environments/RoomEnvironment.js'
import { createMinifig } from './minifig.js'

// Vista previa 3D del personaje que gira despacio; se rehace cuando cambia la apariencia
export default function MinifigPreview({ look, size = 220 }) {
  const ref = useRef(null)
  const state = useRef(null)

  useEffect(() => {
    const el = ref.current
    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true })
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))
    renderer.setSize(size, size)
    renderer.toneMapping = THREE.ACESFilmicToneMapping
    renderer.outputColorSpace = THREE.SRGBColorSpace
    el.appendChild(renderer.domElement)
    const scene = new THREE.Scene()
    const pmrem = new THREE.PMREMGenerator(renderer)
    scene.environment = pmrem.fromScene(new RoomEnvironment(), 0.04).texture
    scene.environmentIntensity = 0.6
    scene.add(new THREE.HemisphereLight('#ffffff', '#c7c2e8', 0.7))
    const sun = new THREE.DirectionalLight('#ffffff', 2.2)
    sun.position.set(2, 3, 2.5)
    scene.add(sun)
    const camera = new THREE.PerspectiveCamera(30, 1, 0.1, 20)
    camera.position.set(0.9, 0.95, 2.1)
    camera.lookAt(0, 0.5, 0)
    const base = new THREE.Mesh(new THREE.CylinderGeometry(0.42, 0.45, 0.04, 40), new THREE.MeshStandardMaterial({ color: '#ece9f8', roughness: 0.6 }))
    base.position.y = -0.02
    scene.add(base)
    const pivot = new THREE.Group()
    scene.add(pivot)
    let raf
    const loop = () => {
      pivot.rotation.y += 0.008
      renderer.render(scene, camera)
      raf = requestAnimationFrame(loop)
    }
    loop()
    state.current = { pivot, renderer, scene, pmrem }
    return () => {
      cancelAnimationFrame(raf)
      scene.traverse(o => { o.geometry?.dispose?.(); [].concat(o.material || []).forEach(m => { m.map?.dispose?.(); m.dispose?.() }) })
      pmrem.dispose()
      renderer.dispose()
      el.removeChild(renderer.domElement)
      state.current = null
    }
  }, [size])

  useEffect(() => {
    const s = state.current
    if (!s) return
    s.pivot.children.slice().forEach(c => {
      s.pivot.remove(c)
      c.traverse(o => { o.geometry?.dispose?.(); [].concat(o.material || []).forEach(m => { m.map?.dispose?.(); m.dispose?.() }) })
    })
    const fig = createMinifig(look)
    s.pivot.add(fig)
  }, [JSON.stringify(look)])

  return <div ref={ref} className="minifig-preview" style={{ width: size, height: size }} />
}

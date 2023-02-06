import * as THREE from 'three';
import {
    GLTFLoader
} from 'GLTFLoaders';
import {
    RGBELoader
} from 'RGBELoader';
import {
    TextureLoader
} from 'three';

import * as dat from 'dat.gui';

/* -------------------------------------------------------------------------- */
/*                                Instance GUI                                */
/* -------------------------------------------------------------------------- */
// Decommenter toute la section pour ré-utiliser GUI.
// -

const gui = new dat.GUI();

//Creation du colorPicker GUI
class ColorGUIHelper {
    constructor(object, prop) {
        this.object = object;
        this.prop = prop;
    }
    get value() {
        return `#${this.object[this.prop].getHexString()}`;
    }
    set value(hexString) {
        this.object[this.prop].set(hexString);
    }
}

/* -------------------------------------------------------------------------- */
/*                                Create SCENE                                */
/* -------------------------------------------------------------------------- */
const scene = new THREE.Scene();

/* -------------------------------------------------------------------------- */
/*                                   CAMERA                                   */
/* -------------------------------------------------------------------------- */
const camera = new THREE.PerspectiveCamera(105, window.innerWidth / window.innerHeight, 0.1, 1000);
camera.position.x = -0.2;
camera.position.y = -.9;
camera.position.z = 1.6;

/* -------------------------------------------------------------------------- */
/*                                  RENDERER                                  */
/* -------------------------------------------------------------------------- */
const renderer = new THREE.WebGLRenderer({
    alpha: true
});
renderer.setClearColor(0x000000, 0);
renderer.setSize(window.innerWidth, window.innerHeight);
document.body.appendChild(renderer.domElement);

/* -------------------------------------------------------------------------- */
/*                              Reflet // EnvMap                              */
/* -------------------------------------------------------------------------- */
// Uniquement des fichiers .HDR
// -
const hdrEquirect = new RGBELoader()
    .setPath('3d/')
    .load('empty_warehouse_01_2k.hdr', function () {
        hdrEquirect.mapping = THREE.EquirectangularReflectionMapping;
        animate();
    });

/* -------------------------------------------------------------------------- */
/*                                   Texture                                  */
/* -------------------------------------------------------------------------- */
const texture = new THREE.TextureLoader().load('3d/normal_map.jpg');
texture.wrapS = THREE.RepeatWrapping;
texture.wrapT = THREE.RepeatWrapping;
let repeater = 1;
texture.repeat.set(repeater, repeater)

// Variable pour le normal Scale aprés.
let scale_rep = 4;
/* -------------------------------------------------------------------------- */
/*                                    MODEL                                   */
/* -------------------------------------------------------------------------- */
const loader = new GLTFLoader();
loader.load('3d/ruby.gltf', function (gltf) {
        var Material = new THREE.MeshPhysicalMaterial({
            color: 0xd6a515,
            roughness: 0.6,
            metalness: 0.4,
            transmission: .8,
            ior: .9,
            reflectivity: .2,
            thickness: 0,
            clearcoat: 1,
            clearcoatRoughness: .65,

            emissive: 0xfff,
            emissiveIntensity: .05,

            envMap: hdrEquirect,
            envMapIntensity: .4,

            normalMap: texture,
            clearcoatNormalMap: texture,
            normalScale: new THREE.Vector2(scale_rep, scale_rep),
            clearcoatNormalScale: new THREE.Vector2(scale_rep, scale_rep),

            specularIntensity: 1,
            specularColor: 0xfff,
        })

        let model = gltf.scene;

        // GUI pour le MODEL.
        //PATTERN : 
        //gui.add(Material, 'nomDeLaPropriété',min, max, pas)
        // -
        // gui.addColor(new ColorGUIHelper(Material, 'color'), 'value').name('color');


        model.rotation.x = 0.2;
        model.rotation.y = 2.3;
        model.position.y = -1.2
        // Ca je sais pas faut que je creuse.
        model.traverse((child, i) => {
            if (child.isMesh) {
                child.material = Material;
                child.material.side = THREE.DoubleSide;
                if (child.material.map) {
                    child.material.map = texture;
                    child.material.map.needsUpdate = true;
                }
            }
        })

        scene.add(model);
        return model;
    },

    // Console Log quand ca a fini de charger avec succes
    function (xhr) {
        console.log((xhr.loaded / xhr.total * 100) + '% loaded');
    },

    // Console log quand ca plante.
    function (error) {
        console.log('An error happened');
    })


/* -------------------------------------------------------------------------- */
/*                                   LIGHTS                                   */
/* -------------------------------------------------------------------------- */
const point_light = new THREE.PointLight(0xff8ff7, 4.4);
point_light.position.set(-4.8, 0.04, -1.26);
scene.add(point_light);

const point_light_2 = new THREE.PointLight(0xffe426, 2);
point_light_2.position.set(4, -2.6, 0.6);
scene.add(point_light_2)
/* -------------------------------------------------------------------------- */
/*                                 BACKGROUND                                 */
/* -------------------------------------------------------------------------- */

const background_loader = new THREE.TextureLoader();





/* -------------------------------------------------------------------------- */
/*                                     GUI                                    */
/* -------------------------------------------------------------------------- */

// gui.add(camera.position, 'x', -10, 10).step(0.1).name('pos x')
// gui.add(camera.position, 'y', -10, 10).step(0.1).name('pos y')

// gui.addColor(new ColorGUIHelper(point_light, 'color'), 'value').name('color');
// gui.add(point_light.position, 'x').min(-6).max(6).step(0.01);
// gui.add(point_light.position, 'y').min(-3).max(3).step(0.01);
// gui.add(point_light.position, 'z').min(-3).max(3).step(0.01);
// gui.add(point_light, 'intensity').min(0).max(10).step(0.2)
// const pointLightHelper = new THREE.PointLightHelper(point_light, 1)
// scene.add(pointLightHelper)

/* -------------------------------------------------------------------------- */
/*                                  ANIMATE                                   */
/* -------------------------------------------------------------------------- */
function animate() {
    requestAnimationFrame(animate);
    scene.rotation.y += 0.002;
    camera.rotation.x -= 0.0005;
    renderer.render(scene, camera);
};

animate();
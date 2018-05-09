import {Group, Vector3, CanvasTexture, DoubleSide, Mesh, PlaneGeometry, MeshBasicMaterial, TextureLoader} from 'three';
import Util from '../core/util';
import Assets from './assets.vr';

/**
 * @file UI Viewer, 拆分器
 * @TODO: move webvr.polyfill's html ui to here
 */

export default class Divider {
    vpano: any;
    backBtn: any;
    enterBtn: any;
    loader = new TextureLoader();

    constructor(vpano) {
        this.vpano = vpano;

        vpano.subscribe('scene-load', () => {
            this.createPanel();
            this.createBtn();
            this.initCalc();
        });
        vpano.subscribe('render-process', this.update, this);
    }

    initCalc() {
        const width = Math.max(window.innerWidth, window.innerHeight) / 2;
        const height = Math.min(window.innerWidth, window.innerHeight);

    }

    createBtn() {
        const vpano = this.vpano;
        const root = vpano.getRoot();

        const backBtn: any = this.backBtn = Util.createElement('<div class="vr-back"></div>');
        backBtn.onclick = () => {
            root.removeChild(backBtn);
            enterBtn.style.display = 'block';
            vpano.exit();
        };

        const enterBtn: any = this.backBtn = Util.createElement('<div class="vr-enter">ENTER VR</div>')
        enterBtn.onclick = () => {
            enterBtn.style.display = 'none';
            vpano.enter().then(() => root.appendChild(backBtn));
        }

        root.appendChild(enterBtn);
    }

    createPanel() {
        const vpano = this.vpano;
        const camera = vpano.getCamera();
        const group = new Group();

        const panelMesh = new Mesh(new PlaneGeometry(775, 236), new MeshBasicMaterial({
            color: '#000',
            transparent: true,
            opacity: 0.8,
            side: DoubleSide
        }));
        panelMesh.name = 'vr-panel';
        panelMesh.renderOrder = 1;

        const arrowMesh1 = new Mesh(new PlaneGeometry(32, 64), new MeshBasicMaterial({
            map: this.loader.load(Assets.arrow1),
            transparent: true,
            depthTest: false,
            side: DoubleSide
        }));
        arrowMesh1.renderOrder = 2;

        const arrowMesh2 = new Mesh(new PlaneGeometry(32, 64), new MeshBasicMaterial({
            map: this.loader.load(Assets.arrow2),
            transparent: true,
            depthTest: false,
            side: DoubleSide
        }));
        arrowMesh2.renderOrder = 2;

        const setMesh = new Mesh(new PlaneGeometry(64, 64), new MeshBasicMaterial({
            map: this.loader.load(Assets.setImg),
            transparent: true,
            depthTest: false,
            side: DoubleSide
        }));
        setMesh.renderOrder = 2;

        const obj = this.buildCanvasText('1 / 5');
        const canvas = obj.canvas;
        const spriteMesh = new Mesh(new PlaneGeometry(canvas.width, canvas.height), 
            new MeshBasicMaterial({
                map: new CanvasTexture(canvas), 
                side: DoubleSide,
                transparent: true
            }));
        spriteMesh.rotation.y = Math.PI;
        spriteMesh.renderOrder = 3;

        panelMesh.position.set(0, -300, 1000);
        arrowMesh1.position.set(230, -300, 1000);
        arrowMesh2.position.set(-80, -300, 1000);
        setMesh.position.set(-250, -300, 1000);
        spriteMesh.position.set(70, -300, 1000);
        group.add(panelMesh);
        group.add(arrowMesh1);
        group.add(arrowMesh2);
        group.add(setMesh);
        group.add(spriteMesh);
        vpano.addSceneObject(group);
    }

    update() {
        
    }

    dispose() {
        const vpano = this.vpano;
        const root = vpano.getRoot();

        root.removeChild(this.backBtn);
        root.removeChild(this.enterBtn);
        vpano.unSubscribe('render-process', this.update, this);
    }

    buildCanvasText(text) {
        const fontface = 'Arial';
        const fontsize = 42;

        const canvas = document.createElement('canvas');
        canvas.width = 256;
        canvas.height = 128;

        const context = canvas.getContext('2d');
        context.font = `Bold ${fontsize}px ${fontface}`;
        const metrics = context.measureText(text);

        context.lineWidth = 4;
        context.textAlign = 'center';
        context.fillStyle = '#fff';
        context.fillText(text, canvas.width / 2, canvas.height / 2 + 10);

        return {canvas, metrics};
    };
}
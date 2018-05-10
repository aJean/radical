import {Group, Vector3, Raycaster, CanvasTexture, DoubleSide, Mesh, PlaneGeometry, MeshBasicMaterial, 
    TextureLoader, CircleGeometry, Geometry, Line, LineBasicMaterial} from 'three';
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
    group: any;
    point: any;
    loader = new TextureLoader();
    ray = new Raycaster();
    hoverMap = {};

    constructor(vpano) {
        this.vpano = vpano;

        vpano.subscribe('scene-load', () => {
            this.createPanel();
            this.createBtn();
        });
        vpano.subscribe('render-process', this.update, this);
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
        const group = this.group = new Group();

        vpano.addSceneObject(group);
        
        const panelMesh = this.createMesh({
            name: 'vr-panel', width: 775, height: 236,
            color: '#000', opacity: 0.8, order: 1,
            x: 0, y: -300, z: 1000,
            parent: group
        });
        // left arrow
        const arrowMesh1 = this.createMesh({
            name: 'vr-panel-prev', width: 32, height: 64,
            img: Assets.arrow1, order: 3,
            x: 230, y: -300, z: 1000,
            parent: group
        });

        const arrowText1 = this.createTextMesh({
            text: '上一页', size: 36, color: '#c9c9c9',
            x: 0, y: -80, z: 0, hide: true,
            parent: arrowMesh1
        });

        const arrowHover1 = this.createHoverMesh({
            hide: true,
            parent: arrowMesh1
        });
        // right arrow
        const arrowMesh2 = this.createMesh({
            name: 'vr-panel-next', width: 32, height: 64,
            img: Assets.arrow2, order: 3,
            x: -80, y: -300, z: 1000,
            parent: group
        });

        const arrowText2 = this.createTextMesh({
            text: '下一页', size: 36, color: '#c9c9c9',
            x: 0, y: -80, z: 0, hide: true,
            parent: arrowMesh2
        });
        const arrowHover2 = this.createHoverMesh({
            hide: true,
            parent: arrowMesh2
        });
        // config
        const setMesh = this.createMesh({
            name: 'vr-panel-setting', width: 64, height: 64,
            img: Assets.setImg, order: 3,
            x: -250, y: -300, z: 1000,
            parent: group
        });
        // page num
        const spriteMesh = this.createTextMesh({
            text: '1 / 5', size: 42, color: '#fff',
            x: 70, y: -300, z: 1000,
            parent: group
        });
        // setting panel
        const setPanel = this.createMesh({
            name: 'vr-setpanel', width: 775, height: 400,
            color: '#000', opacity: 0.8, order: 3,
            x: 0, y: 60, z: 1000,
            parent: group
        });

        const geo = new Geometry();
        geo.vertices.push(new Vector3(387.5, -100, -2), new Vector3(-387.5, -100, -2));
        const setLine = new Line(geo, new LineBasicMaterial({
            color: '#fff',
            linewidth: 1.5
        }));
        setLine.renderOrder = 3;
        setPanel.add(setLine);

        this.createTextMesh({
            text: '完成', size: 32, color: '#c9c9c9',
            x: 0, y: -150, z: 0, parent: setPanel
        });

        // viewpoint
        const pointMesh = this.point = new Mesh(new CircleGeometry(5, 32), new MeshBasicMaterial({
            color: '#fff', depthTest: false, side: DoubleSide, transparent: true
        }));
        pointMesh.renderOrder = 10;
        vpano.addSceneObject(pointMesh);
    }

    update() {
        const camera = this.vpano.getCamera();
        const point = this.point;
        const ray = this.ray;
        const pos = Util.calcScreenToWorld({x: 0, y: 0}, camera);

        point.position.copy(pos);
        point.rotation.copy(camera.rotation);

        ray.setFromCamera({x: 0, y: 0}, camera);
        const intersects = ray.intersectObjects(this.group.children);

        if (intersects.length) {
            this.detect(intersects.pop().object.name);
        }
    }

    detect(signal) {
        const obj = this.group.children.find(mesh => mesh.name == signal);

        if (obj) {
            switch(signal) {
                case 'vr-panel-prev':
                    this.paging(0, obj);
                    break;
                case 'vr-panel-next':
                    this.paging(1, obj);
                    break;
                case 'vr-panel-setting':
                    break;
                default:
                    this.nothing();
            }
        }
    }

    paging(factor, obj) {
        const hoverMap = this.hoverMap;
        const id = obj.id;
        
        hoverMap[id + 'text'].visible = true;
        hoverMap[id + 'hover'].visible = true;

        if (factor) {
            
        }
    }

    /**
     * 常规 hide
     */
    nothing() {
        const hoverMap = this.hoverMap;
        
        for (let key in hoverMap) {
            hoverMap[key].visible = false;
        }
    }

    dispose() {
        const vpano = this.vpano;
        const root = vpano.getRoot();

        root.removeChild(this.backBtn);
        root.removeChild(this.enterBtn);
        vpano.unSubscribe('render-process', this.update, this);
    }

    createMesh(params) {
        const mesh = new Mesh(new PlaneGeometry(params.width, params.height), new MeshBasicMaterial({
            map: params.img && this.loader.load(params.img),
            color: params.color || '#fff',
            transparent: true,
            opacity: params.opacity || 1,
            depthTest: false,
            side: DoubleSide
        }));
        mesh.renderOrder = params.order;
        mesh.position.set(params.x, params.y, params.z);

        if (params.name) {
            mesh.name = params.name;
        }

        if (params.parent) {
            params.parent.add(mesh);
        }

        return mesh;
    }

    buildCanvasText(text, size?, color?) {
        const fontface = 'Arial';
        const fontsize = size || 42;

        const canvas = document.createElement('canvas');
        canvas.width = 256;
        canvas.height = 128;

        const context = canvas.getContext('2d');
        context.font = `Bold ${fontsize}px ${fontface}`;
        const metrics = context.measureText(text);

        context.lineWidth = 4;
        context.textAlign = 'center';
        context.fillStyle = color || '#fff';
        context.fillText(text, canvas.width / 2, canvas.height / 2 + 10);

        return {canvas, metrics};
    }

    createTextMesh(params?) {
        const parent = params.parent;
        const obj = this.buildCanvasText(params.text, params.size, params.color);
        const canvas = obj.canvas;
        const mesh = new Mesh(new PlaneGeometry(canvas.width, canvas.height), 
            new MeshBasicMaterial({
                map: new CanvasTexture(canvas), 
                depthTest: false,
                transparent: true,
                side: DoubleSide
            }));

        mesh.position.set(params.x, params.y, params.z);
        mesh.rotation.y = Math.PI;
        mesh.renderOrder = 5;

        if (params.hide) {
            mesh.visible = false;
            parent && (this.hoverMap[parent.id + 'text'] = mesh);
        }

        if (parent) {
            parent.add(mesh);
        }

        return mesh;
    }

    createHoverMesh(params?) {
        const parent = params.parent;
        const mesh = new Mesh(new PlaneGeometry(90, 90),
            new MeshBasicMaterial({
                map: this.loader.load(Assets.hover),
                depthTest: false,
                transparent: true,
                side: DoubleSide
            }));

        mesh.renderOrder = 2;

        if (params.hide) {
            mesh.visible = false;
        }

        if (parent) {
            parent.add(mesh);
            this.hoverMap[parent.id + 'hover'] = mesh;
        }

        return mesh;
    }
}
import {Group, Vector3, Raycaster, CanvasTexture, DoubleSide, Mesh, PlaneGeometry, MeshBasicMaterial, 
    TextureLoader, CircleGeometry, Geometry, Line, LineBasicMaterial} from 'three';
import Text from '../pano/plastic/text.plastic';
import Point from '../pano/plastic/point.plastic';
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
            this.initPanel();
            this.initSetPanel();
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

    initPanel() {
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
            text: '上一页', fontsize: 36, color: '#c9c9c9',
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
            text: '下一页', fontSize: 36, color: '#c9c9c9',
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
            text: '1 / 5', fontSize: 42,
            x: 70, y: -300, z: 1000,
            parent: group
        });
        // viewpoint
        const point = new Point({
            anim: true,
            animImg: Assets.anim,
            parent: vpano.getScene()
        }, vpano);
        point.fade();

        this.point = point.plastic;
    }

    initSetPanel() {
        const vpano = this.vpano;
        const camera = vpano.getCamera();
        const group = this.group;

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
            text: '完成', fontSize: 32,
            x: 0, y: -155, z: 0, parent: setPanel
        });

        this.createTextMesh({
            text: '每30s自动切换',
            width: 290, height: 64,
            x: 150, y: 100, z: 0,
            parent: setPanel
        });

        const noauto = this.createTextMesh({
            text: '不自动切换',
            width: 256, height: 64,
            x: -180, y: 100, z: 0,
            parent: setPanel
        });

        const noautoHover = this.createMesh({
            parent: noauto,
            img: Assets.hover,
            width: 300,
            height: 100,
            order: 6,
            x: 0,
            y: 5,
            z: 0
        });

        const close = this.createTextMesh({
            text: '切换设置',
            width: 256, height: 64,
            x: 0, y: -30, z: 0,
            parent: setPanel
        });

        const closeHover = this.createMesh({
            parent: close,
            img: Assets.hover,
            width: 256,
            height: 100,
            order: 6,
            x: 0,
            y: 5,
            z: 0
        });
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

    createTextMesh(params) {
        const mesh = new Text(params).plastic;
        const parent = params.parent;

        if (parent && params.hide) {
            this.hoverMap[parent.id + 'text'] = mesh;
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
            this.hoverMap[parent.id + 'hover'] = mesh;
        }

        if (parent) {
            parent.add(mesh);
        }

        return mesh;
    }
}
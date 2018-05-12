import {Group, Vector3, Raycaster, CanvasTexture, DoubleSide, Mesh, PlaneGeometry, MeshBasicMaterial, 
    TextureLoader, CircleGeometry, Geometry, Line, LineBasicMaterial} from 'three';
import Text from '../pano/plastic/text.plastic';
import Button from '../pano/plastic/button.plastic';
import Icon from '../pano/plastic/icon.plastic';
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
    active: any;
    timeid = 0;
    loader = new TextureLoader();
    ray = new Raycaster();

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
        
        const panel = this.createMesh({
            name: 'vr-panel', width: 775, height: 236,
            color: '#000', opacity: 0.8, order: 1,
            x: 0, y: -300, z: 1000,
            parent: group
        });
        // left arrow
        const prevBtn = new Icon({
            parent: group, name: 'vr-panel-prev', width: 32, height: 64,
            text: '上一页', color: '#c9c9c9', icon: Assets.arrow1,
            x: 230, y: -300, z: 1000
        });

        // right arrow
        const nextBtn = new Icon({
            parent: group, name: 'vr-panel-next', width: 32, height: 64,
            text: '下一页', color: '#c9c9c9', icon: Assets.arrow2,
            x: -80, y: -300, z: 1000
        });

        // open set btn
        const setBtn = this.createMesh({
            name: 'vr-panel-setting', width: 64, height: 64,
            img: Assets.setImg, order: 3,
            x: -250, y: -300, z: 1000,
            parent: group
        });
        // page num
        const pageNum = this.createTextMesh({
            text: '1 / 5', fontSize: 42,
            x: 70, y: -300, z: 1000,
            parent: group
        });
        // viewpoint
        const point = this.point = new Point({
            parent: vpano.getScene(), name: 'vr-panel-viewport',
            anim: true, animImg: Assets.anim
        }, vpano);
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

        const close = new Text({
            parent: setPanel, name: 'vr-setpanel-close', text: '完成',
            color: '#c9c9c9', x: 0, y: -155, z: 1
        });

        const auto = new Button({
            parent: setPanel, name: 'vr-setpanel-auto', text: '每30s自动切换', color: '#c9c9c9',
            width: 380, height: 100, x: 150, y: 100, z: 1
        });

        const noauto = new Button({
            parent: setPanel, name: 'vr-setpanel-noauto', text: '不自动切换', color: '#c9c9c9',
            width: 300, height: 100, x: -190, y: 100, z: 2
        });

        const changeBtn = new Button({
            parent: setPanel, name: 'vr-setpanel-change', text: '切换设置',
            color: '#c9c9c9', x: 0, y: -20, z: 0
        });
    }

    update() {
        const camera = this.vpano.getCamera();
        const point3d = this.point.plastic;
        const ray = this.ray;
        const pos = Util.calcScreenToWorld({x: 0, y: 0}, camera);

        point3d.position.copy(pos);
        point3d.rotation.copy(camera.rotation);

        ray.setFromCamera({x: 0, y: 0}, camera);
        const intersects = ray.intersectObjects(this.group.children, true);

        if (intersects.length) {
            this.detect(intersects.pop().object.name);
        }
    }

    detect(signal) {
        const obj = this.group.getObjectByName(signal);
console.log(signal)
        if (obj) {
            switch(signal) {
                case 'vr-panel-prev':
                    this.paging(0, obj);
                    break;
                case 'vr-panel-next':
                    this.paging(1, obj);
                    break;
                case 'vr-setpanel-btn':
                    this.changeSet(obj);
                    break;
                case 'vr-setpanel-close':
                    this.closeSetHandle();
                    break;
                case 'vr-panel-setting':
                    this.openSetHandle();
                    break;
                default:
                    this.nothing();
            }
        }
    }

    paging(factor, obj) {
        const id = obj.id;

        if (obj.wrapper) {
            obj.wrapper.showHover();
        }
        // 翻页
        if (factor) {
            
        }
    }

    changeSet(obj) {
        if (!this.timeid) {
            this.timeid = setTimeout(() => {
                this.point.fade();
            }, 1000);
        }
    }

    openSetHandle() {
        const setpanel = this.group.getObjectByName('vr-setpanel');

        if (!this.timeid) {
            this.timeid = setTimeout(() => {
                this.point.fade((() => setpanel.visible = true));
            }, 1000);
        }
    }

    closeSetHandle() {
        const setpanel = this.group.getObjectByName('vr-setpanel');

        if (!this.timeid) {
            this.timeid = setTimeout(() => {
                this.point.fade((() => setpanel.visible = false));
            }, 1000);
        }
    }

    /**
     * 常规 hide
     */
    nothing() {
        clearTimeout(this.timeid);
        this.timeid = 0;        
        
        const prevMesh = this.group.getObjectByName('vr-panel-prev');
        const nextMesh = this.group.getObjectByName('vr-panel-next');

        if (prevMesh) {
            prevMesh.wrapper.hideHover();
        }

        if (nextMesh) {
            nextMesh.wrapper.hideHover();
        }
    }

    lock() {
        this.active = false;
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
        return new Text(params).plastic;
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
        }

        return mesh;
    }
}
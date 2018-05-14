import {Group, Vector3, Raycaster, CanvasTexture, DoubleSide, Mesh, PlaneGeometry, MeshBasicMaterial, 
    TextureLoader, CircleGeometry, Geometry, Line, LineBasicMaterial} from 'three';
import Text from '../pano/plastic/text.plastic';
import Button from '../pano/plastic/button.plastic';
import Icon from '../pano/plastic/icon.plastic';
import Point from '../pano/plastic/point.plastic';
import Util from '../core/util';
import Assets from './assets.vr';

/**
 * @file webvr 用户控制器
 * @TODO: move webvr.polyfill.js html ui to here
 */

export default class Divider {
    vpano: any;
    backBtn: any;
    enterBtn: any;
    group: any;
    point: any;
    timeid = 0;
    regularid = 0;
    index = 1;
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
        const total = `1 / ${vpano.overlays.getScenes().length}`;

        vpano.addSceneObject(group);
        
        const panel = this.createMesh({
            parent: group, name: 'vr-panel', width: 775, height: 236,
            color: '#000', opacity: 0.8, order: 1, x: 0, y: -300, z: 1000,
        });
        // left arrow
        const prevBtn = new Icon({
            parent: group, name: 'vr-panel-prev', width: 32, height: 64,
            text: '上一页', color: '#c9c9c9', icon: Assets.arrow1, x: 230, y: -300, z: 1000
        });

        // right arrow
        const nextBtn = new Icon({
            parent: group, name: 'vr-panel-next', width: 32, height: 64,
            text: '下一页', color: '#c9c9c9', icon: Assets.arrow2, x: -80, y: -300, z: 1000
        });

        // open set btn
        const setBtn = new Icon({
            parent: group, name: 'vr-panel-setting', width: 64, height: 64,
            icon: Assets.setImg, bwidth: 100, bheight: 100, x: -250, y: -300, z: 1000
        });
        // page num
        const pageNum = new Text({
            parent: group, name: 'vr-panel-pagenum', text: total, x: 70, y: -300, z: 1000,
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
            parent: group, name: 'vr-setpanel', hide: true, width: 775, height: 400,
            color: '#000', opacity: 0.8, order: 3, x: 0, y: 60, z: 1000
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
            active: false, width: 380, height: 100, x: 150, y: 100, z: 1
        });

        const noauto = new Button({
            parent: setPanel, name: 'vr-setpanel-noauto', text: '不自动切换', color: '#c9c9c9',
            width: 300, height: 100, x: -190, y: 100, z: 1
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

        intersects.length ? this.detect(intersects.pop().object.name) : this.stopOperate();
    }

    /**
     * 交互检测
     * @param {string} signal 交互信号
     */
    detect(signal) {
        const obj = this.group.getObjectByName(signal);

        switch(signal) {
            case 'vr-panel-prev':
                this.pagingHandle(-1, obj);
                break;
            case 'vr-panel-next':
                this.pagingHandle(1, obj);
                break;
            case 'vr-setpanel-change':
                break;
            case 'vr-setpanel-close':
                this.closeSetHandle();
                break;
            case 'vr-panel-setting':
                this.openSetHandle(obj);
                break;
            case 'vr-setpanel-auto':
                this.autoHandle(obj);
                break;
            case 'vr-setpanel-noauto':
                this.noautoHandle(obj);
                break;
            default:
                this.stopOperate();
                this.stopHover();
        }
    }

    /** 
     * 翻页
     */
    pagingHandle(num, obj) {
        const vpano = this.vpano;
        const pagenum = this.group.getObjectByName('vr-panel-pagenum').wrapper;

        obj.wrapper && obj.wrapper.showHover();
        
        if (!this.timeid) {
            const data = this.calcPageData(num);
            
            this.startOperate(() => {
                pagenum.change(`${data.index} / ${data.limit}`);
                vpano.enterNext(data.scene);
                this.index = data.index;
            });
        }
    }

    /**
     * 计算翻页数据
     */
    calcPageData(num) {
        const scenes = this.vpano.overlays.getScenes();
        const limit = scenes.length;        
        let index = this.index + num;
            
        if (index <= 0) {
            index = limit;
        } else if (index > limit) {
            index = 1;
        }

        return {index, limit, scene: scenes[index - 1]};
    }

    /** 
     * 自动切换
     */
    autoHandle(obj) {
        const auto = this.group.getObjectByName('vr-setpanel-auto').wrapper;
        const noauto = this.group.getObjectByName('vr-setpanel-noauto').wrapper;

        if (auto.getActive() || this.timeid) {
            return;
        }

        this.startOperate(() => {
            auto.setActive(true);
            noauto.setActive(false);
        });
    }

    /** 
     * 不自动切换
     */
    noautoHandle(obj) {
        const auto = this.group.getObjectByName('vr-setpanel-auto').wrapper;
        const noauto = this.group.getObjectByName('vr-setpanel-noauto').wrapper;

        if (noauto.getActive() || this.timeid) {
            return;
        }

        this.startOperate(() => {
            auto.setActive(false);
            noauto.setActive(true);
        });
    }

    /** 
     * 打开控制面板
     */
    openSetHandle(obj) {
        const setpanel = this.group.getObjectByName('vr-setpanel');
        obj.wrapper && obj.wrapper.showHover();

        if (!setpanel.visible && !this.timeid) {
            this.startOperate(() => setpanel.visible = true);
        }
    }

     /** 
      * 关闭控制面板
      */
    closeSetHandle() {
        const setpanel = this.group.getObjectByName('vr-setpanel');
        const auto = this.group.getObjectByName('vr-setpanel-auto').wrapper;

        if (!this.timeid) {
            this.startOperate(() => {
                auto.getActive() ? this.regularChange() : clearTimeout(this.regularid);
                setpanel.visible = false;
            });
        }
    }

    /**
     * 启动一个操作
     */
    startOperate(complete) {
        this.timeid = setTimeout(() => this.point.fade((() => {
            complete();
            this.timeid = 0;
        })), 1500);
    }

    /**
     * 终止操作
     */
    stopOperate() {
        clearTimeout(this.timeid);
        this.timeid = 0;
        this.point.fadeStop();
    }

    /** 
     * 隐藏 hover
     */
    stopHover() {
        const prevMesh = this.group.getObjectByName('vr-panel-prev');
        const nextMesh = this.group.getObjectByName('vr-panel-next');
        const setMesh = this.group.getObjectByName('vr-panel-setting');

        prevMesh && prevMesh.wrapper.hideHover();
        nextMesh && nextMesh.wrapper.hideHover();
        setMesh && setMesh.wrapper.hideHover();
    }

    /**
     * 每 30s 切换一次场景
     */
    regularChange() {
        this.regularid = setTimeout(() => {
            const pagenum = this.group.getObjectByName('vr-panel-pagenum').wrapper;
            const data = this.calcPageData(1);
            
            pagenum.change(`${data.index} / ${data.limit}`);
            this.vpano.enterNext(data.scene);
            this.index = data.index;
            this.regularChange();
        }, 30000);
    }

    dispose() {
        const vpano = this.vpano;
        const root = vpano.getRoot();

        root.removeChild(this.backBtn);
        root.removeChild(this.enterBtn);
        vpano.unSubscribe('render-process', this.update, this);
    }

    createMesh(params) {
        const opts: any = {
            color: params.color || '#fff',
            transparent: true,
            opacity: params.opacity || 1,
            depthTest: false,
            side: DoubleSide
        };

        if (params.img) {
            opts.map = this.loader.load(params.img);
        }

        const mesh = new Mesh(new PlaneGeometry(params.width, params.height),
            new MeshBasicMaterial(opts));
        mesh.renderOrder = params.order;
        mesh.position.set(params.x, params.y, params.z);

        if (params.name) {
            mesh.name = params.name;
        }

        if (params.parent) {
            params.parent.add(mesh);
        }

        if (params.hide) {
            mesh.visible = false;
        }

        return mesh;
    }
}
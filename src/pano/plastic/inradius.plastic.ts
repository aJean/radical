import { BackSide, MultiplyBlending, MeshBasicMaterial, MeshPhongMaterial, SphereGeometry, Mesh, CubeRefractionMapping, TextureLoader, ShaderMaterial, Color, AdditiveBlending, UniformsUtils } from 'three';
import Plastic from '../../interface/plastic.interface';
import Text from '../plastic/text.plastic';
import PShader from '../../shader/plastic.shader';
import FShader from '../../shader/fresnel.shader';
import BShader from '../../shader/blur.shader';
import Util from '../../core/util';

/**
 * @file 内切球, 作为穿越球使用时要提升 renderOrder = 10
 */

const defaultOpts = {
    side: BackSide,
    radius: 2000,
    color: '#fff',
    emissive: '#000',
    widthSegments: 30,
    heightSegments: 30,
    opacity: 1,
    cloudimg: '../assets/cloud.png',
    shadow: false
};
export default class Inradius extends Plastic {
    wrap: any;
    text: any;

    constructor(opts, pano?) {
        super();

        this.pano = pano;
        this.opts = Util.assign({}, defaultOpts, opts);
        this.create();

        if (opts.rotate) {
            this.subscribe(this.Topic.RENDER.PROCESS, () => this.update());
        }
    }

    /**
     * 创建球体及特效
     */
    create() {
        const opts = this.opts;
        const params: any = opts.shadow ? {
                color: opts.color,
                emissive: opts.emissive,
                specular: 'grey',
                side: opts.side,
                refractionRatio: 0,
                reflectivity: 1,
                transparent: true,
                opacity: opts.opacity,
                depthTest: false            
            } : {
                color: opts.color,                
                side: opts.side,
                refractionRatio: 0,
                reflectivity: 1,
                transparent: true,
                opacity: opts.opacity,
                depthTest: false
            };

        if (opts.envMap) {
            this.setRefraction(opts.envMap);
            params.envMap = opts.envMap;
        }

        const material = opts.shadow ? new MeshPhongMaterial(params) : new MeshBasicMaterial(params);
        const sphere: any = this.plastic = new Mesh(new SphereGeometry(opts.radius, opts.widthSegments, 
            opts.heightSegments), material);

        switch (opts.type) {
            case 'mask':
                this.createMask(sphere);
                break;
            case 'cloud':
                this.createCloud(sphere);
                break;
            case 'glow':
                this.createGlow(sphere);
                break;
            case 'atom':
                this.createAtomsphere(sphere);
                break;
            case 'fresnel':
                this.createFresnel(sphere);
                break;
        }

        if (opts.text) {
            this.createText(opts.text);
        }

        if (opts.position) {
            this.setPosition(opts.position.x, opts.position.y, opts.position.z);
        }

        if (opts.hide) {
            this.hide();
        }

        const target = this.getPlastic();
        target.name = opts.name;
        target.instance = this;
        // target.castShadow = opts.shadow;
    }

    /**
     * 遮罩
     */
    createMask(sphere) {
        const mask = this.wrap = new Mesh(
            sphere.geometry.clone(),
            new MeshBasicMaterial({
                color: '#000',
                transparent: true,
                opacity: 0.5,
                depthTest: false
            })
        );

        sphere.renderOrder = 9;
        mask.renderOrder = 10;
        mask.add(sphere);
    }

    /**
     * 云层
     */
    createCloud(sphere) {
        const cloud = this.wrap = new Mesh(
            sphere.geometry.clone(),
            new MeshBasicMaterial({
                map: new TextureLoader().load(this.opts.cloudimg),
                transparent: true,
                depthTest: false
            })
        );

        sphere.renderOrder = 9;
        cloud.renderOrder = 10;
        cloud.add(sphere);
    }

    /**
     * 辉光
     */
    createGlow(sphere) {
        const uniforms = UniformsUtils.clone(PShader.glow.uniforms);
        uniforms.glowColor.value = new Color('grey');
        uniforms.viewVector.value = this.opts.position;

        const material = new ShaderMaterial({
            uniforms: uniforms,
            vertexShader: PShader.glow.vertex,
            fragmentShader: PShader.glow.fragment,
            blending: AdditiveBlending,
            transparent: true
        });

        const glow = this.wrap = new Mesh(sphere.geometry.clone(), material);

        sphere.renderOrder = 9;
        glow.renderOrder = 10;
        glow.add(sphere);
    }

    /**
     * 大气层
     */
    createAtomsphere(sphere) {
        const uniforms = UniformsUtils.clone(PShader.atmosphere.uniforms);
        uniforms.glowColor.value = new Color(0xffff00);

        const material = new ShaderMaterial({
            uniforms: uniforms,
            vertexShader: PShader.atmosphere.vertex,
            fragmentShader: PShader.atmosphere.fragment,
            blending: AdditiveBlending,
            transparent: true
        });

        const atom = this.wrap = new Mesh(sphere.geometry.clone(), material);

        sphere.renderOrder = 9;
        atom.renderOrder = 10;
        atom.add(sphere);
    }

    /**
     * 菲涅尔反射
     */
    createFresnel(sphere) {
        const opts = this.opts;
        const uniforms = UniformsUtils.clone(FShader.uniforms);
        uniforms.tCube.value = this.pano.skyBox.getMap();

        const material = new ShaderMaterial({
            uniforms: uniforms,
            vertexShader: FShader.vertex,
            fragmentShader: FShader.fragment,
            blending: MultiplyBlending,
            transparent: true
        });

        const fresnel: any = this.wrap = new Mesh(
            new SphereGeometry(opts.radius + 15, opts.widthSegments, opts.heightSegments),
            material
        );

        const uniforms1 = UniformsUtils.clone(PShader.glow.uniforms);
        uniforms1.glowColor.value = new Color('#fff');
        uniforms1.viewVector.value = this.opts.position;

        const material1 = new ShaderMaterial({
            uniforms: uniforms1,
            vertexShader: PShader.glow.vertex,
            fragmentShader: PShader.glow.fragment,
            blending: MultiplyBlending,
            transparent: true,
            depthTest: false
        });

        const glow = new Mesh(
            new SphereGeometry(opts.radius + 2, opts.widthSegments, opts.heightSegments),
            material1
        );

        sphere.renderOrder = 10;
        glow.renderOrder = 11
        fresnel.renderOrder = 9;
        glow.add(sphere);
        fresnel.add(glow);
    }

    /**
     * 球内文字
     */
    createText(str) {
        const text = this.text = new Text({fontsize: 40, width: 256, height: 256, weight: 600, 
            shadow: true, text: str, inverse: true, order: 20});
        text.addTo(this.getPlastic());
    }

    /**
     * 隐藏文字
     */
    hideText() {
        this.text && this.text.hide();
    }

    /**
     * 获取外部数据
     */
    getData() {
        return this.opts.data;
    }

    /**
     * 设置外部数据
     */
    setData(data) {
        this.opts.data = data;
    }

    /**
     * 获取环境贴图
     */
    getMap() {
        return this.plastic.material.envMap;
    }

    /**
     * 设置环境贴图
     * @param {Object} texture cube 材质
     */
    setMap(texture) {
        const material = this.plastic.material;
        const tempMap = this.plastic.material.envMap;

        this.setRefraction(texture);
        material.needsUpdate = true;
        material.envMap = texture;
        tempMap && tempMap.dispose();
    }

    /**
     * 设置透明度
     */
    setOpacity(opacity) {
        if (this.wrap) {
            this.wrap.material.opacity = opacity;
        }
        
        this.plastic.material.opacity = opacity;
    }

    /**
     * 设置材质映射
     */
    setRefraction(texture) {
        texture.mapping = CubeRefractionMapping;
        texture.needsUpdate = true;
    }

    /**
     * 获取主控 mesh
     */
    getPlastic() {
        return this.wrap || this.plastic;
    }

    /**
     * 球体自转效果, 避让入场动画
     */
    update() {
        const target = this.getPlastic();

        if (!this.pano.frozen && target.visible) {
            target.rotation.x += 0.01;
            target.rotation.y += 0.01;
            target.rotation.z += 0.01;
        }
    }

    dispose() {
        const wrap = this.wrap;
        if (wrap) {
            wrap.geometry.dispose();
            wrap.material.map && wrap.material.map.dispose();
            wrap.material.dispose();
            delete wrap.instance;
        }

        super.dispose();
    }
}

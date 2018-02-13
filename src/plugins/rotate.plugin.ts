import Panoram from '../panoram';

/**
 * @file 漫游插件
 */

export default class Rotate {
    data: any;
    panoram: Panoram;

    constructor(panoram: Panoram, data) {
        this.data = data;
        this.panoram = panoram;


        panoram.subscribe('scene-init', this.create, this);
    }

}
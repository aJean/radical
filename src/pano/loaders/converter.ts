/**
 * @file data coordinate transform
 */

export default abstract class Converter {
    static krpanoTransform(location) {
        location.lng = -location.x;
        location.lat = -location.y;
    }

    static XRTransform(location) {
        location.lng = location.lng - 180;
        location.lat = location.lat - 90;
    }
}
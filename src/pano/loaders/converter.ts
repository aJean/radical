/**
 * data coordinate transform
 */

export default abstract class Converter {
    static krpanoTransform(location) {
        location.lng = -location.x;
        location.lat = -location.y;
    }
}
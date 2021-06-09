export default class Angle {
  static toDegrees (angleInRadians) {
    return angleInRadians / Math.PI * 180;
  }

  static toRadians (angleInDegrees) {
    return angleInDegrees * Math.PI / 180;
  }
}

/**
 * @param {Vector2 | Vector3} v1
 * @param {Vector2 | Vector3} v2
 * @param {number} epsilon
 */
export default function compareVectors (v1, v2, epsilon = Number.EPSILON) {
  return ((Math.abs(v1.x - v2.x) < epsilon)
    && (Math.abs(v1.y - v2.y) < epsilon))
    && (v1.z === undefined || Math.abs(v1.z - v2.z) < epsilon);
}


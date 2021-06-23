// Task polega na opisaniu plansz jako obiekt js'owy - json.
// Trzeba spojrzeć jak wygląda plansza i opisać każdy z jej wierzchołków jako zestaw koordynatów {x, y}.
//
// https://www.geogebra.org/calculator

const surfaces = ([
  {
    'id': 1,
    'name': 'Loop',
    'isOpen': false,
    'coords': [
      { x: 0, y: 5.1258 }, { x: -0.9807, y: 4.9307 },
      { x: -1.8122, y: 4.3751 }, { x: -2.3678, y: 3.5437 },
      { x: -2.5629, y: 2.5629 }, { x: -2.3678, y: 1.5821 },
      { x: -1.8122, y: 0.7506 }, { x: -0.9807, y: 0.1950 },
      { x: 0, y: 0 }, { x: 0.9807, y: 0.1950 },
      { x: 1.8122, y: 0.7506 }, { x: 2.3678, y: 1.5821 },
      { x: 2.5629, y: 2.5629 }, { x: 2.3678, y: 3.5437 },
      { x: 1.8122, y: 4.3751 }, { x: 0.9807, y: 4.9307 }
    ]
  },
  {
    'id': 2,
    "name": "Box",
    "isOpen": false,
    "coords": [
      {x: 0, y: 4}, {x: -1, y: 4},
      {x: -2, y: 4}, {x: -2, y: 3},
      {x: -2, y: 2}, {x: -2, y: 1},
      {x: -2, y: 0}, {x: -1, y: 0},
      {x: 0, y: 0}, {x: 1, y: 0},
      {x: 2, y: 0}, {x: 2, y: 1},
      {x: 2, y: 2}, {x: 2, y: 3},
      {x: 2, y: 4}, {x: 1, y: 4},]
  },
  {
    'id': 3,
    "name": "Cross",
    "isOpen": false,
    "coords": [
      {x: 0, y: 4}, {x: -1, y: 4},
      {x: -1, y: 3}, {x: -2, y: 3},
      {x: -2, y: 2}, {x: -2, y: 1},
      {x: -1, y: 1}, {x: -1, y: 0},
      {x: 0, y: 0}, {x: 1, y: 0},
      {x: 1, y: 1}, {x: 2, y: 1},
      {x: 2, y: 2}, {x: 2, y: 3},
      {x: 1, y: 3}, {x: 1, y: 4},]
  },
  {
    'id': 4,
    "name": "Peanut",
    "isOpen": false,
    "coords": [
      {x: -0.9063, y: 2.4226}, {x: -1.8911, y: 2.2489},
      {x: -2.4646, y: 1.5701}, {x: -2.4646, y: 0.5701},
      {x: -1.8911, y: -0.2489}, {x: -0.9063, y: -0.4226},
      {x: 0, y: 0}, {x: 1, y: 0},
      {x: 1.9063, y: -0.4226}, {x: 2.8911, y: -0.2489},
      {x: 3.4646, y: 0.5701}, {x: 3.4646, y: 1.5701},
      {x: 2.8911, y: 2.2489}, {x: 1.9063, y: 2.4226},
      {x: 1, y: 2}, {x: 0, y: 2}
    ]
  },
  {
    'id': 5,
    "name": "Medal",
    "isOpen": false,
    "coords": [
      {x: -0.3442, y: 3.8689}, {x: -1.0513, y: 3.1618},
      {x: -2.0173, y: 2.9030}, {x: -2.0173, y: 1.9030},
      {x: -1.0506, y: 1.6464}, {x: -0.3420, y: 0.9396},
      {x: 0, y: 0}, {x: 1, y: 0},
      {x: 1.3420, y: 0.9396}, {x: 2.0506, y: 1.6464},
      {x: 3.0173, y: 1.9030}, {x: 3.0173, y: 2.9030},
      {x: 2.0513, y: 3.1618}, {x: 1.3442, y: 3.8689},
      {x: 1.0022, y: 4.8086}, {x: 0.0022, y: 4.8086},
    ]
  },
  {
    'id': 6,
    "name": "Triangle",
    "isOpen": false,
    "coords": [
      {x: 0, y: 5}, {x: -0.5967, y: 4.0054},
      {x: -1.1977, y: 3.0037}, {x: -1.7974, y: 2.0041},
      {x: -2.3962, y: 1.0063}, {x: -3, y: 0},
      {x: -2, y: 0}, {x: -1, y: 0},
      {x: 0, y: 0}, {x: 1, y: 0},
      {x: 2, y: 0}, {x: 3, y: 0},
      {x: 2.3962, y: 1.0063}, {x: 1.7974, y: 2.0041},
      {x: 1.1977, y: 3.0037}, {x: 0.5967, y: 4.0054}
      ]
  },
  {
    'id': 8,
    "name": "The V",
    "isOpen": true,
    "coords": [
      {x: -2.9599, y: 6.3475}, {x: -2.5372, y: 5.4411},
      {x: -2.1143, y: 4.5342}, {x: -1.6913, y: 3.6271},
      {x: -1.2683, y: 2.7199}, {x: -0.8455, y: 1.8133},
      {x: -0.4226, y: 0.9063}, {x: 0, y: 0},
      {x: 1, y: 0}, {x: 1.4226, y: 0.9063},
      {x: 1.8455, y: 1.8133}, {x: 2.2683, y: 2.7199},
      {x: 2.6913, y: 3.6271}, {x: 3.1143, y: 4.5342},
      {x: 3.5372, y: 5.4411}, {x: 3.9599, y: 6.3475},
    ]
  },
  {
    'id': 9,
    "name": "Staircase",
    "isOpen": true,
    "coords": [
      {x: -3, y: 4}, {x: -3, y: 3},
      {x: -2, y: 3}, {x: -2, y: 2},
      {x: -1, y: 2}, {x: -1, y: 1},
      {x: 0, y: 1}, {x: 0, y: 0},
      {x: 1, y: 0}, {x: 1, y: 1},
      {x: 2, y: 1}, {x: 2, y: 2},
      {x: 3, y: 2}, {x: 3, y: 3},
      {x: 4, y: 3}, {x: 4, y: 4}
    ]
  },
  {
    'id': 10,
    "name": "Bowl",
    "isOpen": true,
    "coords": [
      {x: -3.4317, y: 5.8348},
      {x: -3.4317, y: 4.8348}, {x: -3.4142, y: 3.8350},
      {x: -3.3793, y: 2.8356}, {x: -3.2057, y: 1.8508},
      {x: -2.7057, y: 0.9848}, {x: -1.9396, y: 0.3420},
      {x: 0, y: 0}, {x: 1, y: 0},
      {x: 1.9396, y: 0.3420}, {x: 2.7057, y: 0.9848},
      {x: 3.2057, y: 1.8508}, {x: 3.3793, y: 2.8356},
      {x: 3.4142, y: 3.8350}, {x: 3.4317, y: 4.8348},
      {x: 3.4317, y: 5.8348},
    ]
  },
  {
    'id': 11,
    "name": "Plane",
    "isOpen": true,
    "coords": [
      {x: -7, y: 0}, {x: -6, y: 0},
      {x: -5, y: 0}, {x: -4, y: 0},
      {x: -3, y: 0}, {x: -2, y: 0},
      {x: -1, y: 0}, {x: 0, y: 0},
      {x: 1, y: 0}, {x: 2, y: 0},
      {x: 3, y: 0}, {x: 4, y: 0},
      {x: 5, y: 0}, {x: 6, y: 0},
      {x: 7, y: 0}, {x: 8, y: 0}
    ]
  },
  {
    'id': 12,
    "name": "ILY",
    "isOpen": true,
    "coords": [
      {x: -0.1421, y: 3.1885}, {x: -0.7849, y: 3.9546},
      {x: -1.7508, y: 3.6958}, {x: -2.0928, y: 2.7561},
      {x: -2.0928, y: 1.7561}, {x: -1.7508, y: 0.81},
      {x: -0.9848, y: 0.1736}, {x: 0, y: 0},
      {x: 0.9848, y: 0.1736}, {x: 1.7508, y: 0.81},
      {x: 2.0928, y: 1.7561}, {x: 2.0928, y: 2.7561},
      {x: 1.7508, y: 3.6958}, {x: 0.7849, y: 3.9546},
      {x: 0.1421, y: 3.1885}, {x: 0.0029, y: 2.1982}
    ]
  },

  {
    'id': 14,
    "name": "Wave",
    "isOpen": true,
    "coords": [
      {x: -5.4792, y: 1.8039},
      {x: -4.9056, y: 0.9848}, {x: -4.7320, y: 0},
      {x: -4.2320, y: -0.8660}, {x: -3.3660, y: -1.3660},
      {x: -2.3660, y: -1.3660}, {x: -1.5, y: -0.8660},
      {x: 0, y: 0}, {x: 1, y: 0},
      {x: 1.5, y: -0.8660}, {x: 2.3660, y: -1.3660},
      {x: 3.3660, y: -1.3660}, {x: 4.2320, y: -0.8660},
      {x: 4.7320, y: 0}, {x: 4.9056, y: 0.9848},
      {x: 5.4792, y: 1.8039}
    ]
  },
  {
    'id': 15,
    "name": "Mountains",
    "isOpen": true,
    "coords": [
      {x: -2.1405, y: 3.2564},
      {x: -2.6405, y: 4.1224}, {x: -2.1405, y: 3.2564},
      {x: -1.7985, y: 2.3167}, {x: -1.5396, y: 1.3508},
      {x: -1.3660, y: 0.3660}, {x: -0.8660, y: -0.5},
      {x: 0, y: 0}, {x: 0.9848, y: -0.1736},
      {x: 1.4696, y: 0.6660}, {x: 1.6432, y: 1.6508},
      {x: 2.1432, y: 2.5168}, {x: 3.1280, y: 2.3432},
      {x: 3.4700, y: 3.2829}, {x: 3.8121, y: 4.2226},
      {x: 4.1541, y: 5.1623}
    ]
  },
]);

export default surfaces;

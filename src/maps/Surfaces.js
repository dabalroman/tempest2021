// Task polega na opisaniu plansz jako obiekt js'owy - json.
// Trzeba spojrzeć jak wygląda plansza i opisać każdy z jej wierzchołków jako zestaw koordynatów {x, y}.
//
// https://www.geogebra.org/calculator


const surfaces = ([
    {
        "name": "Loop",
        "isOpen": false,
        "coords": [
            {x: 0, y: 0}, {x: 0.9807, y: 0.1950}, {x: 1.8122, y: 0.7506},
            {x: 2.3678, y: 1.5821}, {x: 2.5629, y: 2.5629}, {x: 2.3678, y: 3.5437},
            {x: 1.8122, y: 4.3751}, {x: 0.9807, y: 4.9307}, {x: 0, y: 5.1258},
            {x: -0.9807, y: 4.9307}, {x: -1.8122, y: 4.3751}, {x: -2.3678, y: 3.5437},
            {x: -2.5629, y: 2.5629}, {x: -2.3678, y: 1.5821}, {x: -1.8122, y: 0.7506}, {x: -0.9807, y: 0.1950}]
    },

]);
export default surfaces;

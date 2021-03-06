const enemies = ([
  {
    name: 'flipper',
    color: 0xcc0033,
    coords: [
      [
        {x: 0.0735, y: 0.7184}, {x: 0.2424, y: 0.5},
        {x: 0.0735, y: 0.2584}, {x: 0.4735, y: 0.5},
        {x: 0.8735, y: 0.2584}, {x: 0.7046, y: 0.5},
        {x: 0.8735, y: 0.7184}, {x: 0.4735, y: 0.5},
        {x: 0.0735, y: 0.7184},
      ],
    ]
  },
  {
    name: 'fuseball',
    color:
      [
        0x1408f7,
        0xd5f008,
        0xf20808,
        0xffffff,
        0xde18ce,
      ],
    coords: [
      [
        {x: 0.5, y: 0.5}, {x: 0.2008, y: 0.555},
        {x: 0.1262, y: 0.4646},
      ],
      [
        {x: 0.5, y: 0.5}, {x: 0.3854, y: 0.3428},
        {x: 0.2538, y: 0.2839}, {x: 0.3, y: 0.2},
        {x: 0.2479, y: 0.1484},
      ],
      [
        {x: 0.5, y: 0.5}, {x: 0.6349, y: 0.6061},
        {x: 0.7214, y: 0.5727}, {x: 0.8451, y: 0.6159},
        {x: 0.8372, y: 0.7278}, {x: 0.9296, y: 0.7416},
      ],
      [
        {x: 0.5, y: 0.5}, {x: 0.5033, y: 0.6611},
        {x: 0.4326, y: 0.7239}, {x: 0.5308, y: 0.7828},
        {x: 0.4679, y: 0.8575}, {x: 0.5446, y: 0.9596},
      ],
      [
        {x: 0.5, y: 0.5}, {x: 0.6, y: 0.4},
        {x: 0.6978, y: 0.4253}, {x: 0.6978, y: 0.3428},
        {x: 0.8117, y: 0.3546}, {x: 0.8097, y: 0.2643},
        {x: 0.9276, y: 0.2760},
      ],
    ]
  },
  {
    name: 'flipperTanker',
    color: 0xff00cc,
    coords: [
      [
        { x: 0.5, y: 0.1 }, { x: 0.5, y: 0.4 },
        { x: 0.1, y: 0.5 }, { x: 0.5, y: 0.1 },
      ],
      [
        { x: 0.5, y: 0.1 }, { x: 0.6, y: 0.5 },
        { x: 0.9, y: 0.5 }, { x: 0.5, y: 0.1 },
      ],
      [
        {x: 0.9, y: 0.5}, {x: 0.5, y: 0.9},
        {x: 0.5, y: 0.6}, {x: 0.9, y: 0.5},
      ],
      [
        {x: 0.5, y: 0.9}, {x: 0.1, y: 0.5},
        {x: 0.4, y: 0.5}, {x: 0.5, y: 0.9},
      ],
      [
        {x: 0.5, y: 0.6}, {x: 0.6, y: 0.5},
        {x: 0.5, y: 0.4}, {x: 0.4, y: 0.5},
        {x: 0.5, y: 0.6},
      ],
    ]
  },
  {
    name: 'fuseballTanker',
    color: [
      0xff00cc,
      0xff00cc,
      0xff00cc,
      0xff00cc,
      0xff00cc,
      0x00ff00,
      0x000099,
      0xeeff41,
      0xffffff,
    ],
    coords: [
      [
        {x: 0.5, y: 0.1}, {x: 0.5, y: 0.4},
        {x: 0.1, y: 0.5}, {x: 0.5, y: 0.1},
      ],
      [
        {x: 0.5, y: 0.1}, {x: 0.6, y: 0.5},
        {x: 0.9, y: 0.5}, {x: 0.5, y: 0.1},
      ],
      [
        {x: 0.9, y: 0.5}, {x: 0.5, y: 0.9},
        {x: 0.5, y: 0.6}, {x: 0.9, y: 0.5},
      ],
      [
        {x: 0.5, y: 0.9}, {x: 0.1, y: 0.5},
        {x: 0.4, y: 0.5}, {x: 0.5, y: 0.9},
      ],
      [
        {x: 0.5, y: 0.6}, {x: 0.6, y: 0.5},
        {x: 0.5, y: 0.4}, {x: 0.4, y: 0.5},
        {x: 0.5, y: 0.6},
      ],
      [
        {x: 0.5, y: 0.5}, {x: 0.6, y: 0.5},
      ],
      [
        {x: 0.5, y: 0.5}, {x: 0.5, y: 0.6},
      ],
      [
        {x: 0.5, y: 0.5}, {x: 0.4, y: 0.5},
      ],
      [
        {x: 0.5, y: 0.5}, {x: 0.5, y: 0.4},
      ],
    ]
  },

  {
    name: 'pulsarTanker',
    color: [
      0xff00cc,
      0xff00cc,
      0xff00cc,
      0xff00cc,
      0xff00cc,
      0x00ffff,
    ],
    coords: [
      [
        {x: 0.5, y: 0.1}, {x: 0.5, y: 0.4},
        {x: 0.1, y: 0.5}, {x: 0.5, y: 0.1},
      ],
      [
        {x: 0.5, y: 0.1}, {x: 0.6, y: 0.5},
        {x: 0.9, y: 0.5}, {x: 0.5, y: 0.1},
      ],
      [
        {x: 0.9, y: 0.5}, {x: 0.5, y: 0.9},
        {x: 0.5, y: 0.6}, {x: 0.9, y: 0.5},
      ],
      [
        {x: 0.5, y: 0.9}, {x: 0.1, y: 0.5},
        {x: 0.4, y: 0.5}, {x: 0.5, y: 0.9},
      ],
      [
        {x: 0.5, y: 0.6}, {x: 0.6, y: 0.5},
        {x: 0.5, y: 0.4}, {x: 0.4, y: 0.5},
        {x: 0.5, y: 0.6},
      ],
      [
        {x: 0.4281, y: 0.4718}, {x: 0.4607, y: 0.5607},
        {x: 0.5, y: 0.4}, {x: 0.5392, y: 0.5607},
        {x: 0.5779, y: 0.4718},
      ],
    ]
  },
  {
    name: 'pulsar',
    color: 0x00ffff,
    coords: [
      [
        { x: 0, y: 0.5 }, { x: 0.2, y: 0.2 },
        { x: 0.3615, y: 0.7383 }, { x: 0.5, y: 0.2 },
        { x: 0.6335, y: 0.7501 }, { x: 0.8, y: 0.2 },
        { x: 1, y: 0.5 },
      ]
    ]
  },
  {
    name: 'spiker',
    color: 0x00ff33,
    coords: [
      [
        {x: 0.4452, y: 0.5008}, {x: 0.4923, y: 0.4597},
        {x: 0.4499, y: 0.4231}, {x: 0.3965, y: 0.4293},
        {x: 0.3403, y: 0.4947}, {x: 0.3737, y: 0.5737},
        {x: 0.4391, y: 0.6041}, {x: 0.5424, y: 0.5676},
        {x: 0.6002, y: 0.4947}, {x: 0.5759, y: 0.4232},
        {x: 0.5212, y: 0.3777}, {x: 0.4345, y: 0.3701},
        {x: 0.3388, y: 0.3913}, {x: 0.2704, y: 0.5023},
        {x: 0.3099, y: 0.6071}, {x: 0.4011, y: 0.6664},
        {x: 0.5120, y: 0.6740}, {x: 0.6048, y: 0.6254},
        {x: 0.6625, y: 0.5570}, {x: 0.6853, y: 0.4719},
        {x: 0.6838, y: 0.3928}, {x: 0.6154, y: 0.3199},
        {x: 0.5151, y: 0.2682}, {x: 0.3585, y: 0.2713},
      ]
    ]
  }
]);

export default enemies;

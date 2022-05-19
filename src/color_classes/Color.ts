/* eslint no-plusplus: ["error", { "allowForLoopAfterthoughts": true }] */
type Rgb = {
  r: number;
  g: number;
  b: number;
};

type Hsl = {
  h: number;
  s: number;
  l: number;
};

type Hsv = {
  h: number;
  s: number;
  v: number;
};

function isNearlyEqual(a: number, b: number, tolerance = 1e-6) {
  return Math.abs(a - b) < tolerance;
}

function rgbValueToHexStr(t: number) {
  return t.toString(16).padStart(2, '0');
}

function rgbaValuesToHexStr(rgbColor: Rgb, alpha = 0) {
  const {r, g, b} = rgbColor;
  return alpha === 0
    ? `#${rgbValueToHexStr(r)}${rgbValueToHexStr(g)}${rgbValueToHexStr(b)}`
    : `#${rgbValueToHexStr(g)}${rgbValueToHexStr(g)}${rgbValueToHexStr(b)}
    ${rgbValueToHexStr(alpha)}`;
}

function RgbToHslAndHsv(rgbColor: Rgb): [Hsl, Hsv] {
  const redNormalized = rgbColor.r / 255;
  const greenNormalized = rgbColor.g / 255;
  const blueNormalized = rgbColor.b / 255;
  const maxColorValNormalized = Math.max(
    redNormalized,
    greenNormalized,
    blueNormalized
  );
  const minColorValNormalized = Math.min(
    redNormalized,
    greenNormalized,
    blueNormalized
  );
  const maxAndMinColorValDiff = maxColorValNormalized - minColorValNormalized;
  const maxAndMinColorValAverage =
    (maxColorValNormalized + minColorValNormalized) / 2;

  let hueDegreeNormalized: number;
  if (isNearlyEqual(maxAndMinColorValDiff, 0)) {
    hueDegreeNormalized = 0;
  } else if (isNearlyEqual(maxColorValNormalized, redNormalized)) {
    hueDegreeNormalized =
      60 * (0 + (greenNormalized - blueNormalized) / maxAndMinColorValDiff);
  } else if (isNearlyEqual(maxColorValNormalized, greenNormalized)) {
    hueDegreeNormalized =
      60 * (2 + (blueNormalized - redNormalized) / maxAndMinColorValDiff);
  } else {
    hueDegreeNormalized =
      60 * (4 + (redNormalized - greenNormalized) / maxAndMinColorValDiff);
  }
  hueDegreeNormalized %= 360;
  if (hueDegreeNormalized < 0) hueDegreeNormalized += 360;

  return [
    {
      h: hueDegreeNormalized,
      s:
        maxAndMinColorValAverage === 0 || maxAndMinColorValAverage === 1
          ? 0
          : (maxColorValNormalized - maxAndMinColorValAverage) /
            Math.min(maxAndMinColorValAverage, 1 - maxAndMinColorValAverage),
      l: maxAndMinColorValAverage,
    },
    {
      h: hueDegreeNormalized,
      s:
        maxColorValNormalized === 0
          ? 0
          : maxAndMinColorValDiff / maxColorValNormalized,
      v: maxColorValNormalized,
    },
  ];
}

function hsvToRgb(hsvColor: Hsv): Rgb {
  const chroma = hsvColor.v * hsvColor.s;
  const hueDivided = hsvColor.h / 60;
  const intermediateVal = chroma * (1 - Math.abs((hueDivided % 2) - 1));
  let rgbValues: number[];
  if (hueDivided >= 0 && hueDivided <= 1) {
    rgbValues = [chroma, intermediateVal, 0];
  } else if (hueDivided <= 2) {
    rgbValues = [intermediateVal, chroma, 0];
  } else if (hueDivided <= 3) {
    rgbValues = [0, chroma, intermediateVal];
  } else if (hueDivided <= 4) {
    rgbValues = [0, intermediateVal, chroma];
  } else if (hueDivided <= 5) {
    rgbValues = [intermediateVal, 0, chroma];
  } else if (hueDivided <= 6) {
    rgbValues = [chroma, 0, intermediateVal];
  } else {
    rgbValues = [0, 0, 0];
  }

  const a = hsvColor.v - chroma;

  return {
    r: Math.round(255 * (rgbValues[0] + a)),
    g: Math.round(255 * (rgbValues[1] + a)),
    b: Math.round(255 * (rgbValues[2] + a)),
  };
}

function hsvToHsl(hsvColor: Hsv): Hsl {
  const lightness = hsvColor.v * (1 - hsvColor.s / 2);
  return {
    h: hsvColor.h,
    s:
      lightness === 0 || lightness === 1
        ? 0
        : (hsvColor.v - lightness) / Math.min(lightness, 1 - lightness),
    l: lightness,
  };
}

function hslToHsv(hslColor: Hsl): Hsv {
  const valueOfHsv =
    hslColor.l + hslColor.s * Math.min(hslColor.l, 1 - hslColor.l);
  return {
    h: hslColor.h,
    s: valueOfHsv === 0 ? 0 : 2 * (1 - hslColor.l / valueOfHsv),
    v: valueOfHsv,
  };
}

function calcRgbValueForLuminanceCalc(t: number) {
  return t <= 0.03928 ? t / 12.92 : ((t + 0.055) / 1.055) ** 2.4;
}

function calculateLuminance(rgbColor: Rgb) {
  return (
    0.2126 * calcRgbValueForLuminanceCalc(rgbColor.r / 255) +
    0.7152 * calcRgbValueForLuminanceCalc(rgbColor.g / 255) +
    0.0722 * calcRgbValueForLuminanceCalc(rgbColor.b / 255)
  );
}

function calculateContrastRatio(color1: Color, color2: Color) {
  const r = calculateLuminance(color1.rgb);
  const e = calculateLuminance(color2.rgb);
  return (Math.max(r, e) + 0.05) / (Math.min(r, e) + 0.05);
}

function roundNumberTo(
  valueToRound: number,
  decimalPlaceCount: number
): number {
  const multiplier = 10 ** decimalPlaceCount;
  return Math.round(multiplier * valueToRound) / multiplier;
}

type ColorType = {
  rgb: Rgb;
  hsl: Hsl;
  hsv: Hsv;
  alpha: number;
};

class Color {
  readonly rgb: Rgb;

  readonly hsl: Hsl;

  readonly hsv: Hsv;

  readonly alpha: number; // max: 255

  static readonly BLACK: Color = Color.fromRGB({r: 0, g: 0, b: 0});

  static readonly WHITE: Color = Color.fromRGB({r: 255, g: 255, b: 255});

  constructor(rgb: Rgb, hsl: Hsl, hsv: Hsv, e = 1) {
    this.rgb = rgb;
    this.hsl = hsl;
    this.hsv = hsv;
    this.alpha = e;
  }

  static fromRGB(t: {r: number; g: number; b: number}, n = 1): Color {
    const [r, o] = RgbToHslAndHsv(t);
    return new Color(t, r, o, n);
  }

  static fromHSL(t: {h: number; s: number; l: number}, r = 1): Color {
    const e = hslToHsv(t);
    const o = hsvToRgb(e);
    return new Color(o, t, e, r);
  }

  static fromHSV(t: {h: number; s: number; v: number}, r = 1): Color {
    const e = hsvToHsl(t);
    const o = hsvToRgb(t);
    return new Color(o, e, t, r);
  }

  toCSS(): string {
    return rgbaValuesToHexStr(this.rgb);
  }

  stringify(): string {
    return JSON.stringify(this);
  }

  toString(): string {
    return ''
      .concat(this.rgb.r.toString(), ',')
      .concat(this.rgb.g.toString(), ',')
      .concat(this.rgb.b.toString(), ',')
      .concat(this.alpha.toString());
  }

  static parse(jsonColorObjStr: string): Color {
    const {rgb, hsl, hsv, alpha} = JSON.parse(jsonColorObjStr) as ColorType;
    return new Color(rgb, hsl, hsv, alpha);
  }

  static F(t: Color, n: Color, r: number): Color {
    if (n !== Color.BLACK && n !== Color.WHITE)
      throw new Error(
        'Only supports contrast calculation between black and white.'
      );
    let e = calculateContrastRatio(t, n);
    if (e >= r) return t;

    let o = t.hsv.v;
    let i = n === Color.WHITE ? -0.02 : 0.02;
    let u = Number.MAX_VALUE;
    let a = null;

    for (let s = 0; s < 100 && u > 0.07 && o >= 0 && o <= 1; s++) {
      o += i;
      a = Color.fromHSV({h: t.hsv.h, s: t.hsv.s, v: o});
      e = calculateContrastRatio(a, Color.WHITE);
      const contrastDiff = roundNumberTo(Math.abs(e - r), 1);
      if (contrastDiff > u) i *= -0.5;
      u = contrastDiff;
    }
    return a === null ? t : a;
  }
}

export default Color;
export {Rgb, Hsl, Hsv};

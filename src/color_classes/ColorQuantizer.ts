/* eslint-disable no-bitwise */
import Color from './Color';
import ColorBox from './ColorBox';
import ColorPopulation from './ColorPopulation';
import PriorityQueue from '../data_structures/PriorityQueue';

type MinTargetMax = {
  min: number;
  target: number;
  max: number;
};

type ColorWeightAmount = {
  saturation: number;
  luminance: number;
  population: number;
};

type LightnessSaturationWeights = {
  lightness: MinTargetMax;
  saturation: MinTargetMax;
  weights: ColorWeightAmount;
};

type ColorTypePreference = {
  [indexName: string]: LightnessSaturationWeights;
};

function extractCompressedRgbValue(t: number) {
  const redExtracted = ((t >>> 10) & 31) << 3;
  const greenExtracted = ((t >>> 5) & 31) << 3;
  const blueExtracted = ((t >>> 0) & 31) << 3;
  return Color.fromRGB({r: redExtracted, g: greenExtracted, b: blueExtracted});
}

function extractMaxEvaluatedValue<T>(array: T[], n: (param: T) => number): T {
  return array.reduce(
    (prev, cur) => (prev !== null && n(prev) > n(cur) ? prev : cur),
    null
  );
}
function normalizeHue(hue: number): number {
  const hueRoundedTo360 = hue % 360;
  return hueRoundedTo360 < 0 ? 360 + hue : hue;
}

function calculateHuePositionNormalized(
  hueValues: number[],
  averageHueValue: number
) {
  const minHueValueNegated =
    -1 * Math.abs(Math.min(Number.MAX_VALUE, ...hueValues));

  let lowerBoundOfHueRelative = 0;
  let higherBoundOfHueRelative = 360;
  // eslint-disable-next-line no-restricted-syntax
  for (const hue of hueValues) {
    const subtractedHue = normalizeHue(hue + minHueValueNegated);
    if (subtractedHue < 180 && subtractedHue > lowerBoundOfHueRelative)
      lowerBoundOfHueRelative = subtractedHue;
    if (subtractedHue >= 180 && subtractedHue < higherBoundOfHueRelative)
      higherBoundOfHueRelative = subtractedHue;
  }
  lowerBoundOfHueRelative = normalizeHue(
    lowerBoundOfHueRelative - minHueValueNegated
  );
  higherBoundOfHueRelative = normalizeHue(
    higherBoundOfHueRelative - minHueValueNegated
  );

  const lowerBoundOfHueAbsolute = Math.min(
    lowerBoundOfHueRelative,
    higherBoundOfHueRelative
  );
  const higherBoundOfHueAbsolute = Math.max(
    lowerBoundOfHueRelative,
    higherBoundOfHueRelative
  );

  if (
    averageHueValue >= lowerBoundOfHueAbsolute &&
    averageHueValue <= higherBoundOfHueAbsolute
  ) {
    return (
      (normalizeHue(averageHueValue) - lowerBoundOfHueAbsolute) /
      (higherBoundOfHueAbsolute - lowerBoundOfHueAbsolute)
    );
  }

  const higherBoundDiff = 360 - higherBoundOfHueAbsolute;
  return (
    normalizeHue(averageHueValue + higherBoundDiff) /
    normalizeHue(lowerBoundOfHueAbsolute + higherBoundDiff)
  );
}
function calculateAverageHue(hueValues: number[]) {
  let cosSum = 0;
  let sinSum = 0;
  /* eslint-disable no-restricted-syntax */
  for (const hue of hueValues) {
    cosSum += Math.cos((hue / 180) * Math.PI);
    sinSum += Math.sin((hue / 180) * Math.PI);
  }
  /* eslint-enable no-restricted-syntax */
  const cosAverage = cosSum / hueValues.length;
  const sinAverage = sinSum / hueValues.length;
  const angleDegree =
    ((180 * Math.atan2(sinAverage, cosAverage)) / Math.PI) % 360;
  return angleDegree >= 0 ? angleDegree : 360 - Math.abs(angleDegree);
}

function filterToIndistinctHues(
  colorPopulations: ColorPopulation[],
  n: number
): ColorPopulation[] {
  const hueValues = colorPopulations.map(
    (colorPopulation) => colorPopulation.color.hsv.h
  );
  const hueAverage = calculateAverageHue(hueValues);
  const o = calculateHuePositionNormalized(hueValues, hueAverage);
  return o > 0.4 || o < 0.6
    ? colorPopulations.filter((colorPopulation) => {
        if (colorPopulation.population / n > 0.02) return true;

        const hue = colorPopulation.color.hsv.h;
        const i = 45;

        return (
          Math.min(
            Math.abs(hueAverage - hue),
            360 - Math.abs(hueAverage - hue)
          ) < i
        );
      })
    : colorPopulations;
}

function calculateCenterDist(
  value: number,
  lowerBound: number,
  higherBound: number
) {
  const rangeHalf = (higherBound - lowerBound) / 2;
  const valMinusLowerBound = value - lowerBound;
  const distNoNormalized =
    (rangeHalf - Math.abs(rangeHalf - valMinusLowerBound)) / rangeHalf;
  return Math.max(0, Math.min(distNoNormalized, 1));
}

function E(
  colorPopulation: ColorPopulation,
  pixelCountOfImage: number,
  lowerBoundOfHue: number,
  higherBoundOfHue: number,
  noYellowMinus = false,
  noSaturationCheck = false
) {
  const {
    population,
    color: {hsv},
  } = colorPopulation;

  // return population / pixelCountOfImage + hsv.s * hsv.v;
  const n = calculateCenterDist(hsv.h, lowerBoundOfHue, higherBoundOfHue);
  const minusYellowVal = noYellowMinus ? 1 : -1 * Math.abs(n);
  const saturationValue = noSaturationCheck ? 0 : hsv.s * hsv.v;
  return (
    (population * 1.125) / pixelCountOfImage + saturationValue + minusYellowVal
  );
}
const T: MinTargetMax = {min: 0.3, target: 0.5, max: 0.7} as const;
const R: MinTargetMax = {min: 0, target: 0.26, max: 0.45} as const;
const I: MinTargetMax = {min: 0.55, target: 0.74, max: 1} as const;
const O: MinTargetMax = {min: 0.35, target: 1, max: 1} as const;
const M: MinTargetMax = {min: 0, target: 0.3, max: 0.4} as const;
const L: ColorWeightAmount = {
  saturation: 0.24,
  luminance: 0.52,
  population: 0.24,
} as const;
const P: ColorTypePreference = {
  vibrantLight: {lightness: I, saturation: O, weights: L},
  vibrant: {lightness: T, saturation: O, weights: L},
  vibrantDark: {lightness: R, saturation: O, weights: L},
  mutedLight: {lightness: I, saturation: M, weights: L},
  muted: {lightness: T, saturation: M, weights: L},
  mutedDark: {lightness: R, saturation: M, weights: L},
} as const;

function filterColorBySaturationAndLightness(
  colorPopulation: ColorPopulation,
  saturationAndLightnessLimit: LightnessSaturationWeights
) {
  const {
    color: {hsl},
  } = colorPopulation;
  return (
    hsl.s >= saturationAndLightnessLimit.saturation.min &&
    hsl.s <= saturationAndLightnessLimit.saturation.max &&
    hsl.l >= saturationAndLightnessLimit.lightness.min &&
    hsl.l <= saturationAndLightnessLimit.lightness.max
  );
}
function N(t: ColorPopulation, n: LightnessSaturationWeights, r: number) {
  const {
    color: {hsl: e},
  } = t;
  let o = 0;
  let i = 0;
  let u = 0;
  if (n.weights.saturation > 0)
    o = n.weights.saturation * (1 - Math.abs(e.s - n.saturation.target));
  if (n.weights.luminance > 0)
    i = n.weights.luminance * (1 - Math.abs(e.l - n.lightness.target));
  if (n.weights.population > 0) u = n.weights.population * (t.population / r);
  return o + i + u;
}

type ColorQuantizerResult = {
  swatches: ColorPopulation[];
  totalPixels: number;
  totalColors: number;
  totalSaturationFromHSV: number;
};

export type GeneratedSwatchType = {
  dominantSwatch: ColorPopulation;
  visRefSwatch: ColorPopulation;
  visRefDarkSwatch: ColorPopulation;
  visRefLightSwatch: ColorPopulation;
  LyricDarkSwatch?: ColorPopulation;
  visRefIsFallback: boolean;
  targetSwatches: {[indexName: string]: ColorPopulation};
};

class ColorQuantizer {
  #options: {maxColors: number; filter: (color: Color) => boolean};

  #queue: PriorityQueue<ColorBox>;

  #swatches: ColorPopulation[];

  constructor(options: {maxColors: number; filter: (color: Color) => boolean}) {
    this.#options = options;
    this.#queue = new PriorityQueue<ColorBox>(
      (a, b) => b.getVolume() - a.getVolume()
    );
    this.#swatches = [];
  }

  static fromPixels(
    colorPixelGenerator: Generator<number, void, unknown>,
    config: {maxColors: number; filter: (color: Color) => boolean}
  ): ColorQuantizerResult {
    return new ColorQuantizer(config).quantize(colorPixelGenerator);
  }

  static compressRgbValue(rgbaPixel: number): number {
    return (
      ((((rgbaPixel >>> 0) & 255) >> 3) << 10) |
      ((((rgbaPixel >>> 8) & 255) >> 3) << 5) |
      (((rgbaPixel >>> 16) & 255) >> 3)
    );
  }

  quantize(
    colorPixelGenerator: Generator<number, void, unknown>
  ): ColorQuantizerResult {
    const n = new Array(32768).fill(0);
    let pixelCount = 0;
    let colorCountResult = 0;
    let sumSaturation = 0;
    /* eslint-disable no-restricted-syntax */
    for (const pixel of colorPixelGenerator) {
      pixelCount += 1;
      // eslint-disable-next-line no-plusplus
      n[ColorQuantizer.compressRgbValue(pixel)]++;
    }
    /* eslint-enable no-restricted-syntax */
    // eslint-disable-next-line no-plusplus
    for (let u = 0; u < n.length; u++) {
      const colorOccurrenceCount = n[u];
      // eslint-disable-next-line no-continue
      if (colorOccurrenceCount === 0) continue;

      const rgbValueExtracted = extractCompressedRgbValue(u);
      if (
        this.#options.filter == null ||
        this.#options.filter(rgbValueExtracted)
      ) {
        colorCountResult += 1;
        sumSaturation += rgbValueExtracted.hsv.s;
        this.#swatches.push(
          ColorPopulation.fromColor(rgbValueExtracted, colorOccurrenceCount)
        );
      }
    }
    if (this.#swatches.length > this.#options.maxColors) {
      this.#swatches = this.quantizePixels(this.#options.maxColors);
    }
    return {
      swatches: this.#swatches,
      totalPixels: pixelCount,
      totalColors: colorCountResult,
      totalSaturationFromHSV: sumSaturation,
    };
  }

  quantizePixels(maxColorCount: number): ColorPopulation[] {
    this.#queue.push(new ColorBox(this.#swatches));
    this.splitBoxes(maxColorCount);
    const n = Array.from(this.#queue.popAll()).map((x) => x.getAverageColor());
    const filterFunc = this.#options.filter;
    return filterFunc !== undefined ? n.filter((x) => filterFunc(x.color)) : n;
  }

  splitBoxes(maxColorCount: number): void {
    for (; this.#queue.size() < maxColorCount; ) {
      const poppedElem = this.#queue.pop();
      if (poppedElem === null || !poppedElem.canSplit()) return;
      this.#queue.push(poppedElem.split());
      this.#queue.push(poppedElem);
    }
  }

  static generateBaseSwatch(
    colorPopulationArray: ColorPopulation[],
    pixelCount: number,
    totalColorCount: number,
    sumSaturation: number
  ): ColorPopulation | null {
    const occupancyRate = sumSaturation / totalColorCount;
    if (occupancyRate < 0.1) return null;
    const filteredColorPopulations = colorPopulationArray.filter(
      (colorPopulation) => colorPopulation.population / pixelCount >= 0.004
      // 0.01 for 'The Essential Kenny Loggins'
    );
    if (filteredColorPopulations.length === 0) return null;
    const filteredColorPopulations2 = filteredColorPopulations.filter(
      (colorPopulation) => {
        if (occupancyRate < 0.2) return true;
        const {
          color: {hsv},
        } = colorPopulation;
        if (
          ((hsv.v > 0.85 || hsv.v < 0.15) && hsv.s < 0.2) ||
          hsv.v < 0.15 ||
          hsv.s < 0.2 ||
          (hsv.s < 0.2 && hsv.v < 0.4)
        ) {
          return colorPopulation.population / pixelCount >= 0.05;
        }
        return (hsv.v + hsv.s) / 2 >= 0.3;
      }
    );
    if (filteredColorPopulations2.length === 0) {
      return extractMaxEvaluatedValue(
        filteredColorPopulations,
        (colorPopulation) => E(colorPopulation, pixelCount, 30, 80, true, true)
      );
    }
    const filteredArr = filterToIndistinctHues(
      filteredColorPopulations2,
      pixelCount
    );
    const somePred = filteredArr
      .map((colorPopulation) => colorPopulation.color.hsv.h)
      .every((hue) => hue >= 30 && hue <= 80);
    const noSaturatedCols = filteredArr
      .map((colorPopulation) => colorPopulation.color.hsl.s)
      .every((saturation) => saturation < 0.125);
    return extractMaxEvaluatedValue(filteredArr, (colorPopulation) =>
      E(colorPopulation, pixelCount, 30, 80, somePred, noSaturatedCols)
    );
  }

  static H(
    colorSwatches: ColorPopulation[],
    pixelCount: number,
    totalColorCount: number,
    sumSaturation: number,
    colorTypePreference = P
  ): GeneratedSwatchType {
    const registeredColors = new Set();
    const dominantColor = extractMaxEvaluatedValue(
      colorSwatches,
      (x) => x.population
    );
    const colorPopulationsObj: {[indexName: string]: ColorPopulation} = {};
    /* eslint-disable no-restricted-syntax */
    for (const [colorName, saturationLightnessWeightInfo] of Object.entries(
      colorTypePreference
    )) {
      const maxEvaledValue = extractMaxEvaluatedValue(
        colorSwatches.filter(
          (colorPopulation) =>
            !registeredColors.has(colorPopulation.color.toString()) &&
            filterColorBySaturationAndLightness(
              colorPopulation,
              saturationLightnessWeightInfo
            )
        ),
        (colorPopulation) =>
          N(
            colorPopulation,
            saturationLightnessWeightInfo,
            dominantColor != null ? dominantColor.population : 1
          )
      );
      if (maxEvaledValue !== null) {
        colorPopulationsObj[colorName] = maxEvaledValue;
        registeredColors.add(maxEvaledValue.color.toString());
      }
    }
    /* eslint-enable no-restricted-syntax */
    const refBaseSwatch = ColorQuantizer.generateBaseSwatch(
      Object.values(colorPopulationsObj),
      pixelCount,
      totalColorCount,
      sumSaturation
    );

    const refDarkSwatch = refBaseSwatch
      ? ColorPopulation.fromColor(
          Color.F(refBaseSwatch.color, Color.WHITE, 4.5),
          1
        )
      : null;
    const refLightSwatch = refBaseSwatch
      ? ColorPopulation.fromColor(
          Color.F(refBaseSwatch.color, Color.BLACK, 4.5),
          1
        )
      : null;

    return {
      dominantSwatch: dominantColor,
      visRefSwatch:
        refBaseSwatch ?? ColorPopulation.fromRGB({r: 83, g: 83, b: 83}, 1),
      visRefDarkSwatch:
        refDarkSwatch ?? ColorPopulation.fromRGB({r: 83, g: 83, b: 83}, 1),
      visRefLightSwatch:
        refLightSwatch ?? ColorPopulation.fromRGB({r: 127, g: 127, b: 127}, 1),
      visRefIsFallback: refBaseSwatch === null,
      targetSwatches: colorPopulationsObj,
    };
  }
}

export default ColorQuantizer;

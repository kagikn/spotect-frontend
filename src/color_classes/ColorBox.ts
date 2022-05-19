/* eslint-disable no-plusplus */
import {Rgb} from './Color';
import ColorPopulation from './ColorPopulation';
import SpanRange from './SpanRange';

function p(t: number, n: number) {
  // eslint-disable-next-line no-bitwise
  return Math.round((t >>> 3) / n) << 3;
}

class ColorBox {
  #swatches: ColorPopulation[];

  #population: number;

  #spanR: SpanRange;

  #spanG: SpanRange;

  #spanB: SpanRange;

  constructor(swatches: ColorPopulation[]) {
    this.#swatches = swatches;
    this.#population = 0;
    this.#spanR = new SpanRange(0, 0);
    this.#spanG = new SpanRange(0, 0);
    this.#spanB = new SpanRange(0, 0);

    this.fitBox();
  }

  getVolume(): number {
    return this.#spanR.size() * this.#spanG.size() * this.#spanB.size();
  }

  getColorCount(): number {
    return this.#swatches.length;
  }

  getAverageColor(): ColorPopulation {
    let t = 0;
    let n = 0;
    let r = 0;
    let e = 0;
    // eslint-disable-next-line no-restricted-syntax
    for (const {color: a, population: c} of this.#swatches) {
      e += c;
      t += c * a.rgb.r;
      n += c * a.rgb.g;
      r += c * a.rgb.b;
    }

    const o = p(t, e);
    const i = p(n, e);
    const u = p(r, e);
    return ColorPopulation.fromRGB(
      {
        r: o,
        g: i,
        b: u,
      },
      e
    );
  }

  canSplit(): boolean {
    return this.getColorCount() > 1;
  }

  split(): ColorBox {
    if (!this.canSplit())
      throw new Error('Cannot split a box with only 1 color');
    const t = this.findSplitPoint();
    const n = new ColorBox(this.#swatches.slice(t + 1, this.#swatches.length));
    this.#swatches.splice(t + 1);
    this.fitBox();
    return n;
  }

  fitBox(): void {
    this.#population = 0;
    for (let t = 0; t < this.#swatches.length; t++) {
      const {color: n, population: r} = this.#swatches[t];
      this.#population += r;
      if (t === 0) {
        this.#spanR.clampTo(n.rgb.r);
        this.#spanG.clampTo(n.rgb.g);
        this.#spanB.clampTo(n.rgb.b);
      } else {
        this.#spanR.extendTo(n.rgb.r);
        this.#spanG.extendTo(n.rgb.g);
        this.#spanB.extendTo(n.rgb.b);
      }
    }
  }

  findSplitPoint(): number {
    const colorDimensionComparator = this.getLongestDimensionComparator();
    this.#swatches.sort((n, r) =>
      colorDimensionComparator(n.color.rgb, r.color.rgb)
    );
    const n = Math.floor(this.#population / 2);
    for (let r = 0, e = 0; r < this.#swatches.length; r++) {
      e += this.#swatches[r].population;
      if (e >= n) return Math.min(this.#swatches.length - 1, r);
    }
    return 0;
  }

  getLongestDimensionComparator(): (color1: Rgb, color2: Rgb) => number {
    const spanRSize = this.#spanR.size();
    const spanGSize = this.#spanG.size();
    const spanBSize = this.#spanB.size();

    if (spanRSize >= spanGSize && spanRSize >= spanBSize) {
      return ColorBox.g;
    }
    if (spanGSize >= spanRSize && spanGSize >= spanBSize) {
      return ColorBox.v;
    }
    return ColorBox.y;
  }

  private static l = 31;

  private static g(color1: Rgb, color2: Rgb): number {
    const {l} = ColorBox;

    return (
      color1.r * l * l +
      color1.g * l +
      color1.r -
      (color2.r * l * l + color2.g * l + color2.b)
    );
  }

  private static v(color1: Rgb, color2: Rgb): number {
    const {l} = ColorBox;

    return (
      color1.g * l * l +
      color1.r * l +
      color1.b -
      (color2.g * l * l + color2.r * l + color2.b)
    );
  }

  private static y(color1: Rgb, color2: Rgb): number {
    const {l} = ColorBox;

    return (
      color1.b * l * l +
      color1.g * l +
      color1.r -
      (color2.b * l * l + color2.g * l + color2.r)
    );
  }
}

export default ColorBox;

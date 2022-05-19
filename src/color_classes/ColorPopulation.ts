import Color from './Color';

class ColorPopulation {
  readonly color: Color;

  readonly population: number;

  constructor(color: Color, population: number) {
    this.color = color;
    this.population = population;
  }

  static fromColor(color: Color, population: number): ColorPopulation {
    return new ColorPopulation(color, population);
  }

  static fromRGB(
    rgbObj: {r: number; g: number; b: number},
    population: number
  ): ColorPopulation {
    return new ColorPopulation(Color.fromRGB(rgbObj), population);
  }
}

export default ColorPopulation;

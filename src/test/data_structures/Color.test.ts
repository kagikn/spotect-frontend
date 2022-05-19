import Color from '../../color_classes/Color';

describe('static constructor functions', () => {
  describe('fromRGB()', () => {
    test('creates a Color instance that has the same RGB object instance', () => {
      const plainColorObj1 = {r: 0, g: 0, b: 0};
      const colorClassObj1 = Color.fromRGB(plainColorObj1);
      expect(colorClassObj1.rgb === plainColorObj1).toEqual(true);
    });
    test('the hue value will be 0 if all the 3 values of rgb is the same', () => {
      const plainColorObj1 = {r: 0, g: 0, b: 0};
      const colorClassObj1 = Color.fromRGB(plainColorObj1);
      const {hsl: hsl1, hsv: hsv1} = colorClassObj1;
      expect(hsl1.h).toEqual(0);
      expect(hsv1.h).toEqual(0);

      const plainColorObj2 = {r: 255, g: 255, b: 255};
      const colorClassObj2 = Color.fromRGB(plainColorObj2);
      const {hsl: hsl2, hsv: hsv2} = colorClassObj2;
      expect(hsl2.h).toEqual(0);
      expect(hsv2.h).toEqual(0);
    });
    test('the saturation value of hsl will be 0 if all the 3 values of rgb is set to 255', () => {
      const plainColorObj1 = {r: 255, g: 255, b: 255};
      const colorClassObj1 = Color.fromRGB(plainColorObj1);
      const {hsl} = colorClassObj1;
      expect(hsl.s).toEqual(0);
    });
  });
});

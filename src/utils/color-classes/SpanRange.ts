class SpanRange {
  min: number;

  max: number;

  constructor(min: number, max: number) {
    this.min = min;
    this.max = max;
  }

  size(): number {
    return this.max - this.min + 1;
  }

  clampTo(num: number): void {
    this.min = num;
    this.max = num;
  }

  extendTo(num: number): void {
    this.min = Math.min(this.min, num);
    this.max = Math.max(this.max, num);
  }
}

export default SpanRange;

class PriorityQueue<T> {
  /* eslint-disable no-bitwise */
  #comparator: (left: T, right: T) => number;

  #data: T[];

  constructor(comparator: (left: T, right: T) => number, n: T[] = []) {
    this.#comparator = comparator;
    this.#data = n;
  }

  swap(t: number, n: number): void {
    [this.#data[t], this.#data[n]] = [this.#data[n], this.#data[t]];
  }

  compare(t: number, n: number): number {
    return this.#comparator(this.#data[t], this.#data[n]);
  }

  bubbleUp(t: number): void {
    let curIndex = t;
    for (; curIndex > 0; ) {
      const n = (curIndex - 1) >>> 1;
      if (this.compare(curIndex, n) >= 0) break;
      this.swap(curIndex, n);
      curIndex = n;
    }
  }

  bubbleDown(t: number): void {
    const n = this.#data.length;
    let curIndex = t;
    /* eslint-disable no-constant-condition */
    while (true) {
      const r = 1 + (curIndex << 1);
      const e = r + 1;
      let o = curIndex;
      if (r < n && this.compare(r, o) <= 0) {
        o = r;
      }
      if (e < n && this.compare(e, o) < 0) {
        o = e;
      }
      if (o === curIndex) break;

      this.swap(o, curIndex);
      curIndex = o;
    }
    /* eslint-enable no-constant-condition */
  }

  size(): number {
    return this.#data.length;
  }

  push(t: T): void {
    this.#data.push(t);
    this.bubbleUp(this.#data.length - 1);
  }

  pop(): T {
    if (this.#data.length === 0) return null;

    this.swap(0, this.#data.length - 1);
    const t = this.#data.pop();
    this.bubbleDown(0);
    return t;
  }

  *popAll(): Generator<T, void, unknown> {
    for (; this.#data.length > 0; ) yield this.pop();
  }

  clone(): PriorityQueue<T> {
    return new PriorityQueue(this.#comparator, [...this.#data]);
  }
  /* eslint-enable no-bitwise */
}

export default PriorityQueue;

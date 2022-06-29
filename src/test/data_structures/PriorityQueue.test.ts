import {vi, describe, expect, test} from 'vitest';
import PriorityQueue from '../../data_structures/PriorityQueue';

describe('push and pop tests', () => {
  test('PriorityQueue returns the same instance after calling push() and then calling pop() if no elements are stored before', () => {
    const queue = new PriorityQueue<Record<string, unknown>>(
      (a, b) => Object.keys(b).length - Object.keys(a).length
    );
    const objInstanceToPush = {str: 0};
    queue.push(objInstanceToPush);
    const poppedObjInstance = queue.pop();

    expect(poppedObjInstance === objInstanceToPush).toEqual(true);
    expect(poppedObjInstance === {str: 0}).not.toEqual(true);
    expect(poppedObjInstance).toEqual({str: 0});
  });

  test('pop() returns the highest-priority element', () => {
    const maxPriorityQueue = new PriorityQueue<number>((a, b) => b - a);
    const minPriorityQueue = new PriorityQueue<number>((a, b) => a - b);

    const valuesToPush = [
      0,
      -100,
      1,
      500,
      Number.MAX_SAFE_INTEGER,
      Number.MIN_SAFE_INTEGER,
      10,
      5,
    ];

    // eslint-disable-next-line no-restricted-syntax
    for (const value of valuesToPush) {
      maxPriorityQueue.push(value);
      minPriorityQueue.push(value);
    }

    expect(maxPriorityQueue.pop()).toBe(Number.MAX_SAFE_INTEGER);
    expect(minPriorityQueue.pop()).toBe(Number.MIN_SAFE_INTEGER);
  });

  test('popAll() returns highest-priority to lowest-priority element', () => {
    const maxPriorityQueue1 = new PriorityQueue<number>((a, b) => b - a);
    const maxPriorityQueue2 = new PriorityQueue<number>((a, b) => b - a);

    const valuesToPush = [
      0,
      -100,
      1,
      500,
      Number.MAX_SAFE_INTEGER,
      Number.MIN_SAFE_INTEGER,
      10,
      5,
    ];

    // eslint-disable-next-line no-restricted-syntax
    for (const value of valuesToPush) {
      maxPriorityQueue1.push(value);
    }

    const valuesToPushSorted = [...valuesToPush].sort((a, b) => b - a);

    // eslint-disable-next-line no-restricted-syntax
    for (const value of valuesToPushSorted) {
      maxPriorityQueue2.push(value);
    }

    expect(Array.from(maxPriorityQueue1.popAll())).toEqual(valuesToPushSorted);
    expect(Array.from(maxPriorityQueue2.popAll())).toEqual(valuesToPushSorted);
  });
});

describe('size tests', () => {
  test('newly created PriorityQueue has no elements', () => {
    expect(new PriorityQueue<unknown>(() => 0).size()).toBe(0);
  });
  test('the number elements of PriorityQueue is the same as push() calls if pop() or popAll() are not called', () => {
    const queue = new PriorityQueue<number>((a, b) => b - a);
    queue.push(1);
    queue.push(4);
    queue.push(2);
    queue.push(3);
    queue.push(5);

    expect(queue.size()).toBe(5);
  });

  test('pop() returns null if the PriorityQueue has no elements', () => {
    expect(new PriorityQueue<unknown>(() => 0).pop()).toBe(null);
  });

  test('popall() yields nothing if the PriorityQueue has no elements', () => {
    expect(new PriorityQueue<unknown>(() => 0).popAll().next().done).toEqual(
      true
    );
  });
});

describe('clone test', () => {
  test('clone() creates an PriorityQueue instance that holds the same elements and evaluates in the same way as the original PriorityQueue', () => {
    const valuesToPush = [5, 1, 3, 7, 2, 9, 4, 6, 8, 10];
    const valuesToPushSorted = [...valuesToPush].sort((a, b) => b - a);

    const originalQueue = new PriorityQueue<number>((a, b) => b - a);
    // eslint-disable-next-line no-restricted-syntax
    for (const value of valuesToPush) {
      originalQueue.push(value);
    }
    const clonedQueue = originalQueue.clone();

    expect(Array.from(originalQueue.popAll())).toEqual(valuesToPushSorted);
    expect(Array.from(clonedQueue.popAll())).toEqual(valuesToPushSorted);

    // eslint-disable-next-line no-restricted-syntax
    for (const value of valuesToPush) {
      clonedQueue.push(value);
    }

    expect(Array.from(clonedQueue.popAll())).toEqual(valuesToPushSorted);
  });
});

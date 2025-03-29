import React, { ComponentType, MemoExoticComponent } from 'react';
import fastDeepEqual from 'fast-deep-equal';

export type DeepReadonly<T> = {
  readonly [P in keyof T]: DeepReadonly<T[P]>;
}

export function assertUnreachable(value: never) {
  throw new Error('Unreachable code has been reached');
}

/**
 * Returns a new array with the given element inserted between all elements
 */
export function join<T>(arr: T[], value: T): T[] {
  const newArr: T[] = [];
  for (let i = 0; i < arr.length; i++) {
    newArr.push(arr[i]);
    if (i !== arr.length - 1) {
      newArr.push(value);
    }
  }
  return newArr;
}

/**
 * Returns a new array with the given element inserted between all elements
 */
export function hashMemo<T extends ComponentType<any>>(component: T): MemoExoticComponent<T> {
  return React.memo(component, (prev, next) => objectEquals(prev, next));
}

export function objectEquals(a: any, b: any) {
  return fastDeepEqual(a, b);
}

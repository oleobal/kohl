import { expect, test } from "vitest";
import {
  bilinearInterpolate,
  interpolateFourPoints,
  interpolateTwoPoints,
  linearInterpolate,
} from "./util";

test("linearInterpolation", () => {
  expect(linearInterpolate(0, 0, 1, 1, 0)).toEqual(0);
  expect(linearInterpolate(0, 0, 1, 1, 0.5)).toEqual(0.5);
  expect(linearInterpolate(0, 0, 1, 1, 0.25)).toEqual(0.25);
  expect(linearInterpolate(0, 0, 1, 1, 1)).toEqual(1);

  // order of given points does not matter
  expect(linearInterpolate(1, 1, 0, 0, 0)).toEqual(0);
  expect(linearInterpolate(1, 1, 0, 0, 0.5)).toEqual(0.5);
  expect(linearInterpolate(1, 1, 0, 0, 0.25)).toEqual(0.25);
  expect(linearInterpolate(1, 1, 0, 0, 1)).toEqual(1);

  // reverse slope
  expect(linearInterpolate(0, 1, 1, 0, 0)).toEqual(1);
  expect(linearInterpolate(0, 1, 1, 0, 0.5)).toEqual(0.5);
  expect(linearInterpolate(0, 1, 1, 0, 0.25)).toEqual(0.75);
  expect(linearInterpolate(0, 1, 1, 0, 1)).toEqual(0);
});

test("bilinearInterpolation", () => {
  expect(bilinearInterpolate(1, 1, 2, 2, 0, 0.5, 1, 2, 1, 1)).toEqual(0);
  expect(bilinearInterpolate(1, 1, 2, 2, 0, 0.5, 1, 2, 1, 2)).toEqual(0.5);
  expect(bilinearInterpolate(1, 1, 2, 2, 0, 0.5, 1, 2, 2, 1)).toEqual(1);
  expect(bilinearInterpolate(1, 1, 2, 2, 0, 0.5, 1, 2, 2, 2)).toEqual(2);
  expect(bilinearInterpolate(1, 1, 2, 2, 0, 0.5, 1, 2, 1.5, 1.5)).toEqual(
    0.875,
  );
  expect(bilinearInterpolate(1, 1, 2, 2, 0, 0.5, 1, 2, 1, 1.25)).toEqual(0.125);
  expect(bilinearInterpolate(1, 1, 2, 2, 0, 0.5, 1, 2, 2, 1.25)).toEqual(1.25);

  // "later" points can be given before "earlier" points
  expect(bilinearInterpolate(2, 2, 1, 1, 2, 1, 0.5, 0, 1, 1)).toEqual(0);
  expect(bilinearInterpolate(2, 2, 1, 1, 2, 1, 0.5, 0, 1, 2)).toEqual(0.5);
  expect(bilinearInterpolate(2, 2, 1, 1, 2, 1, 0.5, 0, 2, 1)).toEqual(1);
  expect(bilinearInterpolate(2, 2, 1, 1, 2, 1, 0.5, 0, 2, 2)).toEqual(2);
  expect(bilinearInterpolate(2, 2, 1, 1, 2, 1, 0.5, 0, 1.5, 1.5)).toEqual(
    0.875,
  );
  expect(bilinearInterpolate(2, 2, 1, 1, 2, 1, 0.5, 0, 1, 1.25)).toEqual(0.125);
  expect(bilinearInterpolate(2, 2, 1, 1, 2, 1, 0.5, 0, 2, 1.25)).toEqual(1.25);
});

test("twoPoints", () => {
  expect(
    interpolateTwoPoints(
      [
        { foo: 1, bar: 1 },
        { foo: 2, bar: 2 },
      ],
      "foo",
      1,
      "bar",
    ),
  ).toEqual(1);
  expect(
    interpolateTwoPoints(
      [
        { foo: 2, bar: 2 },
        { foo: 1, bar: 1 },
      ],
      "foo",
      2,
      "bar",
    ),
  ).toEqual(2);
  expect(
    interpolateTwoPoints(
      [
        { foo: 2, bar: 2 },
        { foo: 1, bar: 1 },
      ],
      "foo",
      1.1,
      "bar",
    ),
  ).toEqual(1.1);
});

test("fourPoints", () => {
  expect(
    interpolateFourPoints(
      [
        { x: 1, y: 1, q: 0 },
        { x: 1, y: 2, q: 0.5 },
        { x: 2, y: 1, q: 1 },
        { x: 2, y: 2, q: 2 },
      ],
      "x",
      1,
      "y",
      1,
      "q",
    ),
  ).toEqual(0);
  expect(
    interpolateFourPoints(
      [
        { x: 1, y: 1, q: 0 },
        { x: 1, y: 2, q: 0.5 },
        { x: 2, y: 1, q: 1 },
        { x: 2, y: 2, q: 2 },
      ],
      "x",
      1,
      "y",
      2,
      "q",
    ),
  ).toEqual(0.5);
  expect(
    interpolateFourPoints(
      [
        { x: 1, y: 1, q: 0 },
        { x: 1, y: 2, q: 0.5 },
        { x: 2, y: 1, q: 1 },
        { x: 2, y: 2, q: 2 },
      ],
      "x",
      2,
      "y",
      1,
      "q",
    ),
  ).toEqual(1);
  expect(
    interpolateFourPoints(
      [
        { x: 1, y: 1, q: 0 },
        { x: 1, y: 2, q: 0.5 },
        { x: 2, y: 1, q: 1 },
        { x: 2, y: 2, q: 2 },
      ],
      "x",
      2,
      "y",
      2,
      "q",
    ),
  ).toEqual(2);
});

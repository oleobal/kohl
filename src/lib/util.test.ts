import { expect, test } from "vitest";
import {
  bilinearInterpolate,
  CollectionDirection,
  findNearestPoints,
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

test("nearestPoints", () => {
  const table = [
    { x: 1, y: 10, q: 100 },
    { x: 2, y: 20, q: 200 },
    { x: 3, y: 30, q: 300 },
    { x: 4, y: 40, q: 400 },
    { x: 5, y: 50, q: 500 },
    { x: 6, y: 60, q: 600 },
    { x: 7, y: 70, q: 700 },
    { x: 8, y: 80, q: 800 },
    { x: 9, y: 90, q: 900 },
  ];
  let points = findNearestPoints(table, "x", 7.8, 3, CollectionDirection.ASC);
  expect(points.length).toEqual(3);
  expect(points[0].d).toBeCloseTo(0.2);
  expect(points[1].d).toBeCloseTo(0.8);
  expect(points[2].d).toBeCloseTo(1.2);
  expect(points[0].p.x).toEqual(8);
  expect(points[1].p.y).toEqual(70);
  expect(points[2].p.q).toEqual(900);

  // out-of-bounds behavior
  points = findNearestPoints(table, "q", 901, 3, CollectionDirection.ASC);
  expect(points[0].d).toBeCloseTo(1);
  expect(points[1].d).toBeCloseTo(101);
  expect(points[2].d).toBeCloseTo(201);
});

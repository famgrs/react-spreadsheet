import * as EntireRows from "./entire-rows";
import * as Selection from "./selection";

const ROW = Selection.createEntireRows(2, 2);

describe("EntireRows.checkIfNeighborRows()", () => {
  const neighbor1 = Selection.createEntireRows(1, 1);
  const neighbor2 = Selection.createEntireRows(3, 3);
  const notNeighbor1 = Selection.createEntireRows(0, 0);
  const notNeighbor2 = Selection.createEntireRows(4, 4);
  const notNeighbor3 = Selection.createEntireRows(0, 5);

  const cases = [
    ["neighbor rows above", [ROW, neighbor1], true],
    ["neighbor rows below", [ROW, neighbor2], true],
    ["NOT neighbor rows above", [ROW, notNeighbor1], false],
    ["NOT neighbor rows below", [ROW, notNeighbor2], false],
    ["NOT neighbor full table", [ROW, notNeighbor3], false],
  ] as const;
  test.each(cases)("%s", (name, values, expected) => {
    expect(EntireRows.checkIfNeighborRows(...values)).toBe(expected);
  });
});

describe("EntireRows.checkIfOverlappingRows()", () => {
  const overlapping1 = Selection.createEntireRows(1, 2);
  const overlapping2 = Selection.createEntireRows(2, 3);
  const overlapping3 = Selection.createEntireRows(0, 5);
  const notOverlapping1 = Selection.createEntireRows(0, 0);
  const notOverlapping2 = Selection.createEntireRows(4, 4);

  const cases = [
    ["overlapping rows above", [ROW, overlapping1], true],
    ["overlapping rows below", [ROW, overlapping2], true],
    ["overlapping rows full table", [ROW, overlapping3], true],
    ["NOT overlapping rows above", [ROW, notOverlapping1], false],
    ["NOT overlapping rows below", [ROW, notOverlapping2], false],
  ] as const;
  test.each(cases)("%s", (name, values, expected) => {
    expect(EntireRows.checkIfOverlappingRows(...values)).toBe(expected);
  });
});

describe("EntireRows.canMergeRows()", () => {
  const overlapping1 = Selection.createEntireRows(1, 2);
  const overlapping2 = Selection.createEntireRows(2, 3);
  const overlapping3 = Selection.createEntireRows(0, 5);
  const notOverlapping1 = Selection.createEntireRows(0, 0);
  const notOverlapping2 = Selection.createEntireRows(4, 4);

  const cases = [
    ["overlapping rows above", [ROW, overlapping1], true],
    ["overlapping rows below", [ROW, overlapping2], true],
    ["overlapping rows full table", [ROW, overlapping3], true],
    ["NOT overlapping rows above", [ROW, notOverlapping1], false],
    ["NOT overlapping rows below", [ROW, notOverlapping2], false],
  ] as const;
  test.each(cases)("%s", (name, values, expected) => {
    expect(EntireRows.canMergeRows(...values)).toBe(expected);
  });
});

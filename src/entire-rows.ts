import * as Selection from "./selection";

export function checkIfNeighborRows(
  selection1: Selection.EntireRows,
  selection2: Selection.EntireRows
): boolean {
  return (
    selection1.end + 1 === selection2.start ||
    selection2.end + 1 === selection1.start
  );
}

export function checkIfOverlappingRows(
  selection1: Selection.EntireRows,
  selection2: Selection.EntireRows
): boolean {
  return (
    (selection1.start <= selection2.start &&
      selection1.end >= selection2.start) ||
    (selection2.start <= selection1.start && selection2.end >= selection1.start)
  );
}

export function canMergeRows(
  selection1: Selection.EntireRows,
  selection2: Selection.EntireRows
): boolean {
  return (
    checkIfNeighborRows(selection1, selection2) ||
    checkIfOverlappingRows(selection1, selection2)
  );
}

export function mergeEntireRows(
  selection1: Selection.EntireRows,
  selection2: Selection.EntireRows
): Selection.EntireRows {
  const minRow = Math.min(selection1.start, selection2.start);
  const maxRow = Math.max(selection1.end, selection2.end);
  return Selection.createEntireRows(minRow, maxRow);
}

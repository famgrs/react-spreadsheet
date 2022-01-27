import * as Point from "./point";
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
  oldRow: Selection.EntireRows,
  newRow: Selection.EntireRows,
  active: Point.Point | null
): Selection.EntireRows {
  let minRow;
  let maxRow;

  if (!active) {
    minRow = Math.min(oldRow.start, newRow.start);
    maxRow = Math.max(oldRow.end, newRow.end);
  } else {
    minRow = Math.min(newRow.start, newRow.end, active.row);
    maxRow = Math.max(newRow.start, newRow.end, active.row);
  }

  return Selection.createEntireRows(minRow, maxRow);
}

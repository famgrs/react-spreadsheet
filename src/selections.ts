import * as Point from "./point";
import * as PointRange from "./point-range";
import * as Matrix from "./matrix";
import * as Selection from "./selection";

export type Selections = Selection.Selection[];

/** Return whether the given point is within given selections */
export function hasPoint(
  selections: Selections,
  data: Matrix.Matrix<unknown>,
  point: Point.Point
): boolean {
  return Boolean(
    selections.find((selection) => Selection.hasPoint(selection, data, point))
  );
}

/** Return whether the given row is entirely selected in given selections */
export function hasEntireRow(selections: Selections, row: number): boolean {
  return Boolean(
    selections.find((selection) => Selection.hasEntireRow(selection, row))
  );
}

/** Return whether the given column is entirely selected in given selections */
export function hasEntireColumn(
  selections: Selections,
  column: number
): boolean {
  return Boolean(
    selections.find((selection) => Selection.hasEntireColumn(selection, column))
  );
}

/** Get the number of points selected */
export function size(
  selections: Selections,
  data: Matrix.Matrix<unknown>
): number {
  return selections.reduce(
    (sum, selection) => sum + Selection.size(selection, data),
    0
  );
}

/** Returns whether given selection is entire table */
export function isEntireTable(selections: Selections): boolean {
  const [selection] = selections;

  if (selection === undefined) {
    return false;
  }

  return Selection.isEntireTable(selection);
}

/** Normalize given selections to given data matrix */
export function normalize(
  selections: Selections,
  data: Matrix.Matrix<unknown>
): Selections {
  if (selections?.length) {
    return selections.map((selection) => Selection.normalize(selection, data));
  }
  return selections;
}

/** Modify given edge of given selections according to given active point and data matrix */
export function modifyEdge(
  selections: Selections,
  active: Point.Point | null,
  data: Matrix.Matrix<unknown>,
  edge: Selection.Direction
): Selections {
  return selections.map((selection) =>
    Selection.modifyEdge(selection, active, data, edge)
  );
}

/** Get selected points */
export function getPoints(
  selections: Selections,
  data: Matrix.Matrix<unknown>
): Point.Point[] {
  if (!selections?.length) {
    return [];
  }

  const allPoints = selections.reduce((points: Point.Point[], selection) => {
    if (selection === null) {
      return points;
    }
    const selectionPoints = Selection.getPoints(selection, data);
    return [...points, ...selectionPoints];
  }, []);

  return allPoints;
}

/** Get concrete range in given data of given selection */
export function toRange(
  selections: Selections,
  data: Matrix.Matrix<unknown>
): (PointRange.PointRange | null)[] {
  return selections.map((selection) => Selection.toRange(selection, data));
}

/** Get given selections from given data */
export function getSelectionsFromMatrix<T>(
  selections: Selections,
  data: Matrix.Matrix<T>
): Matrix.Matrix<T> {
  const size = Matrix.getSize(data);
  const newMatrix = Matrix.createEmpty<T>(size.rows, size.columns);

  for (let i = 0; i < selections.length; i++) {
    const selection = selections[i];

    for (const point of Selection.getPoints(selection, data)) {
      newMatrix[point.row][point.column] = data[point.row][point.column];
    }
  }

  return newMatrix;
}

export function equals(
  selections1: Selections,
  selections2: Selections
): boolean {
  if (selections1?.length !== selections2?.length) {
    return false;
  }

  for (const s1 of selections1) {
    let found = false;
    for (const s2 of selections2) {
      if (PointRange.is(s1) && PointRange.is(s2)) {
        found =
          s1.start.row === s2.start.row &&
          s1.end.row === s2.end.row &&
          s1.start.column === s2.start.column &&
          s1.end.column === s2.end.column;
      }
      if (Selection.isEntireRows(s1) && Selection.isEntireRows(s2)) {
        found = s1.start === s2.start && s1.end === s2.end;
      }
      if (Selection.isEntireColumns(s1) && Selection.isEntireColumns(s2)) {
        found = s1.start === s2.start && s1.end === s2.end;
      }
      if (Selection.isEntireTable(s1) && Selection.isEntireTable(s2)) {
        found = true;
      }
    }

    if (!found) {
      return false;
    }
  }

  return true;
}

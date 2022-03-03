import * as React from "react";
import classnames from "classnames";
import * as Matrix from "./matrix";
import * as Actions from "./actions";
import * as Types from "./types";
import * as Point from "./point";
import useSelector from "./use-selector";
import useDispatch from "./use-dispatch";
import { getCellDimensions } from "./util";

const PADDING = 5;

type Props = {
  DataEditor: Types.DataEditorComponent;
  getBindingsForCell: Types.GetBindingsForCell<Types.CellBaseValidator>;
};

const ActiveCell: React.FC<Props> = (props) => {
  const rootRef = React.useRef<HTMLDivElement>(null);
  const { getBindingsForCell } = props;

  const dispatch = useDispatch();
  const setCellData = React.useCallback(
    (active: Point.Point, data: Types.CellBaseValidator) =>
      dispatch(Actions.setCellData(active, data, getBindingsForCell)),
    [dispatch, getBindingsForCell]
  );
  const edit = React.useCallback(() => dispatch(Actions.edit()), [dispatch]);
  const commit = React.useCallback(
    (changes: Types.CommitChanges<Types.CellBaseValidator>) =>
      dispatch(Actions.commit(changes)),
    [dispatch]
  );
  const view = React.useCallback(() => {
    dispatch(Actions.view());
  }, [dispatch]);
  const active = useSelector((state) => state.active);
  const mode = useSelector((state) => state.mode);
  const cell: Types.CellBaseValidator | undefined = useSelector((state) =>
    state.active ? Matrix.get(state.active, state.data) : undefined
  );
  const dimensions = useSelector((state) =>
    active
      ? getCellDimensions(active, state.rowDimensions, state.columnDimensions)
      : undefined
  );
  const hidden = React.useMemo(
    () => !active || !dimensions,
    [active, dimensions]
  );
  const isEmpty = React.useMemo((): boolean => {
    if (cell?.required) {
      return [null, undefined, ""].includes(cell?.value);
    }
    return false;
  }, [cell]);
  const isInvalid = React.useMemo((): boolean => {
    if (cell?.validator) {
      return !cell.validator(cell?.value);
    }
    if (cell?.required) {
      return isEmpty;
    }
    return false;
  }, [cell, isEmpty]);

  const initialCellRef = React.useRef<Types.CellBaseValidator | undefined>(
    undefined
  );
  const prevActiveRef = React.useRef<Point.Point | null>(null);
  const prevCellRef = React.useRef<Types.CellBaseValidator | undefined>(
    undefined
  );

  const handleChange = React.useCallback(
    (cell: Types.CellBaseValidator) => {
      if (!active) {
        return;
      }
      setCellData(active, cell);
    },
    [setCellData, active]
  );

  React.useEffect(() => {
    const root = rootRef.current;
    if (!hidden && root) {
      root.focus();
    }
  }, [rootRef, hidden]);

  React.useEffect(() => {
    const prevActive = prevActiveRef.current;
    const prevCell = prevCellRef.current;
    prevActiveRef.current = active;
    prevCellRef.current = cell;

    if (!prevActive || !prevCell) {
      return;
    }

    // Commit
    const coordsChanged =
      active?.row !== prevActive.row || active?.column !== prevActive.column;
    const exitedEditMode = mode !== "edit";

    if (coordsChanged || exitedEditMode) {
      const initialCell = initialCellRef.current;
      if (prevCell !== initialCell) {
        commit([
          {
            prevCell: initialCell || null,
            nextCell: prevCell,
          },
        ]);
      } else if (!coordsChanged && cell !== prevCell) {
        commit([
          {
            prevCell,
            nextCell: cell || null,
          },
        ]);
      }
      initialCellRef.current = cell;
    }
  });

  React.useEffect(() => {
    const prevActive = prevActiveRef.current;
    const prevCell = prevCellRef.current;

    if (!prevActive || !prevCell) {
      return;
    }

    // Commit
    const coordsChanged =
      active?.row !== prevActive.row || active?.column !== prevActive.column;
    const exitedEditMode = mode !== "edit";

    console.log("use effect active", active, coordsChanged, mode);
    if (!active && (coordsChanged || exitedEditMode)) {
      console.log("SET CELL DATA not active", cell?.parser?.(cell.value));
      cell?.parser && setCellData(prevActive, cell.parser(cell.value));
    }
  }, [prevActiveRef, prevCellRef, active, cell, setCellData, mode]);

  const DataEditor = (cell && cell.DataEditor) || props.DataEditor;
  const readOnly = cell && cell.readOnly;

  return hidden ? null : (
    <div
      ref={rootRef}
      className={classnames("Spreadsheet__active-cell-wrapper", {})}
      style={
        active && isInvalid
          ? {
              top: (dimensions?.top || 0) - PADDING,
              left: (dimensions?.left || 0) - PADDING,
              width: (dimensions?.width || 0) + PADDING * 2,
              borderWidth: PADDING,
            }
          : {
              ...dimensions,
              borderWidth: 0,
            }
      }
      tabIndex={-1}
    >
      <div
        className={classnames(
          "Spreadsheet__active-cell",
          `Spreadsheet__active-cell--${mode}`,
          {
            "Spreadsheet__active-cell--invalid": isInvalid,
          }
        )}
        style={
          active
            ? {
                height: dimensions?.height || 0,
                width: dimensions?.width || 0,
              }
            : undefined
        }
        onClick={mode === "view" && !readOnly ? edit : undefined}
        tabIndex={0}
      >
        {mode === "edit" && active && (
          <DataEditor
            row={active.row}
            column={active.column}
            cell={cell}
            // @ts-ignore
            onChange={handleChange}
            exitEditMode={view}
          />
        )}
      </div>

      {active && (isInvalid || isEmpty) && (
        <div className="Spreadsheet__active-cell-error">
          {isEmpty && isInvalid && cell?.required ? (
            <div className="Spreadsheet__active-cell-error-item">
              Campo obrigatório
            </div>
          ) : (
            isInvalid &&
            cell?.errorMessage && (
              <div className="Spreadsheet__active-cell-error-item">
                {cell.errorMessage}
              </div>
            )
          )}
        </div>
      )}
    </div>
  );
};

export default ActiveCell;

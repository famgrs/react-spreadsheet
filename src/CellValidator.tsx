import * as React from "react";
import classnames from "classnames";
import * as Types from "./types";
import * as Point from "./point";
import { getOffsetRect } from "./util";

export const CellValidator: React.FC<Types.CellValidatorComponentProps> = ({
  row,
  column,
  DataViewer,
  formulaParser,
  selected,
  active,
  dragging,
  mode,
  data,
  select,
  activate,
  setCellDimensions,
  readOnly,
}): React.ReactElement => {
  const rootRef = React.useRef<HTMLTableCellElement | null>(null);
  const point = React.useMemo(
    (): Point.Point => ({
      row,
      column,
    }),
    [row, column]
  );
  const invalid = React.useMemo((): boolean => {
    if (data?.validator) {
      return !data.validator(data?.value);
    }
    if (data?.required) {
      return [null, undefined, ""].includes(data?.value);
    }
    return false;
  }, [data]);

  const handleMouseDown = React.useCallback(
    (event: React.MouseEvent<HTMLTableCellElement>) => {
      if (mode === "view") {
        setCellDimensions(point, getOffsetRect(event.currentTarget));

        if (event.shiftKey) {
          select(point);
        } else {
          activate(point);
        }
      }
    },
    [mode, setCellDimensions, point, select, activate]
  );

  const handleMouseOver = React.useCallback(
    (event: React.MouseEvent<HTMLTableCellElement>) => {
      if (dragging) {
        setCellDimensions(point, getOffsetRect(event.currentTarget));
        select(point);
      }
    },
    [setCellDimensions, select, dragging, point]
  );

  React.useEffect(() => {
    const root = rootRef.current;
    if (selected && root) {
      setCellDimensions(point, getOffsetRect(root));
    }
    if (root && active && mode === "view") {
      root.focus();
    }
  }, [setCellDimensions, selected, active, mode, point]);

  if (data && data.DataViewer) {
    // @ts-ignore
    DataViewer = data.DataViewer;
  }

  return (
    <td
      ref={rootRef}
      className={classnames("Spreadsheet__cell", data?.className, {
        "Spreadsheet__cell--invalid": invalid,
        "Spreadsheet__cell--readonly": data?.readOnly || readOnly,
      })}
      onMouseOver={handleMouseOver}
      onMouseDown={handleMouseDown}
      tabIndex={0}
    >
      <DataViewer
        row={row}
        column={column}
        cell={data}
        formulaParser={formulaParser}
      />
    </td>
  );
};

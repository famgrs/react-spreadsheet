import * as React from "react";
import * as Types from "./types";
import { moveCursorToEnd } from "./util";

const DataEditor: React.FC<Types.DataEditorParserProps> = ({
  onChange,
  cell,
}) => {
  const inputRef = React.useRef<HTMLInputElement>(null);

  const checkValid = React.useCallback(
    (value: any): boolean => {
      if (cell?.validator) {
        return !cell.validator(value);
      }
      if (cell?.required) {
        return [null, undefined, ""].includes(value);
      }
      return false;
    },
    [cell]
  );

  const handleChange = React.useCallback(
    (event: React.ChangeEvent<HTMLInputElement>) => {
      onChange({ ...cell, value: event.target.value });
    },
    [onChange, cell]
  );

  const handleBlur = React.useCallback(
    (event: React.ChangeEvent<HTMLInputElement>) => {
      if (cell?.parser && checkValid(event.target.value)) {
        cell?.parser?.(event.target.value);
      }
    },
    [checkValid, cell]
  );

  React.useEffect(() => {
    if (inputRef.current) {
      moveCursorToEnd(inputRef.current);
    }
  }, [inputRef]);

  const value = cell?.value ?? "";

  return (
    <div className="Spreadsheet__data-editor">
      <input
        ref={inputRef}
        type="text"
        onChange={handleChange}
        onBlur={handleBlur}
        value={value}
        autoFocus
      />
    </div>
  );
};

export default DataEditor;

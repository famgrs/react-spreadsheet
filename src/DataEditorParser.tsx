import * as React from "react";
import * as Types from "./types";
import { moveCursorToEnd } from "./util";

const DataEditor: React.FC<Types.DataEditorParserProps> = ({
  onChange,
  cell,
}) => {
  const inputRef = React.useRef<HTMLInputElement>(null);

  const handleChange = React.useCallback(
    (event: React.ChangeEvent<HTMLInputElement>) => {
      console.log("handle change cell", cell);
      const value = event.target.value;
      onChange({ ...cell, value: cell?.parser?.(value) || value });
    },
    [onChange, cell]
  );

  const handleBlur = React.useCallback(
    (event: React.ChangeEvent<HTMLInputElement>) => {
      console.log("DataEditorParser blur", cell);
      const value = event.target.value;
      onChange({ ...cell, value: cell?.parser?.(value) || value });
    },
    [onChange, cell]
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

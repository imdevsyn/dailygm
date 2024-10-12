import { space } from "node_modules/postcss/lib/list";
import { useState } from "react";

export function TableHeader({
  headers, 
  onSortColumnChange,
  sortColumn,
  sortDirection
}) {

  function handleHeaderClick(column) {
    onSortColumnChange(column)
  }

  return (
    <thead>
      <tr>
        {
          headers.map((header) => (
            <th key={header.column} onClick={() => handleHeaderClick(header.column)}>
              {header.label}{" "}
              {sortColumn === header.column && (
                <span>{sortDirection === "asc" ? ""}</span>
              )}
            </th>
          ))
        }
      </tr>
    </thead>
  )
}



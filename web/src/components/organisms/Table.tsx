import type { ReactNode } from 'react';

export interface TableColumn<T> {
  key: string;
  header: string;
  render: (row: T) => ReactNode;
}

interface TableProps<T> {
  columns: TableColumn<T>[];
  rows: T[];
  rowKey: (row: T) => string;
  onRowClick?: (row: T) => void;
  emptyMessage?: string;
}

// Tabella generica: poche colonne essenziali per riga, testo troncato — mai overflow orizzontale.
export function Table<T>({ columns, rows, rowKey, onRowClick, emptyMessage = 'Nessun risultato' }: TableProps<T>) {
  return (
    <table className="w-full table-fixed border-collapse">
      <thead>
        <tr className="border-b border-border">
          {columns.map((col) => (
            <th key={col.key} className="px-3 py-2 text-left text-sm font-semibold text-disabled">
              {col.header}
            </th>
          ))}
        </tr>
      </thead>
      <tbody>
        {rows.length === 0 && (
          <tr>
            <td colSpan={columns.length} className="px-3 py-6 text-center text-sm text-disabled">
              {emptyMessage}
            </td>
          </tr>
        )}
        {rows.map((row) => (
          <tr
            key={rowKey(row)}
            onClick={() => onRowClick?.(row)}
            className={`border-b border-border last:border-0 ${onRowClick ? 'cursor-pointer hover:bg-background' : ''}`}
          >
            {columns.map((col) => (
              <td key={col.key} className="truncate px-3 py-2.5 text-sm text-text-color">
                {col.render(row)}
              </td>
            ))}
          </tr>
        ))}
      </tbody>
    </table>
  );
}

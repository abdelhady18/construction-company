interface Column {
  key: string;
  label: string;
  render?: (value: unknown, row: Record<string, unknown>) => React.ReactNode;
}

interface DataTableProps {
  columns: Column[];
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  data: any[];
  onView?: (id: string) => void;
  onDelete?: (id: string) => void;
  onRowClick?: (id: string) => void;
}

export default function DataTable({ columns, data, onView, onDelete, onRowClick }: DataTableProps) {
  return (
    <div className="overflow-x-auto bg-surface rounded-xl border border-border">
      <table className="w-full text-sm">
        <thead>
          <tr className="border-b border-border bg-background">
            {columns.map((col) => (
              <th key={col.key} className="text-left px-6 py-3 font-semibold text-muted">
                {col.label}
              </th>
            ))}
            {(onView || onDelete) && (
              <th className="text-left px-6 py-3 font-semibold text-muted">Actions</th>
            )}
          </tr>
        </thead>
        <tbody>
          {data.map((row, idx) => (
            <tr
              key={row.id as string || idx}
              className={`border-b border-border hover:bg-background ${onRowClick ? "cursor-pointer" : ""}`}
              onClick={onRowClick ? () => onRowClick(row.id as string) : undefined}
            >
              {columns.map((col) => (
                <td key={col.key} className="px-6 py-4 text-foreground">
                  {col.render ? col.render(row[col.key], row) : String(row[col.key] ?? "")}
                </td>
              ))}
              {(onView || onDelete) && (
                <td className="px-6 py-4">
                  <div className="flex gap-2">
                    {onView && (
                      <button
                        onClick={(e) => { e.stopPropagation(); onView(row.id as string); }}
                        className="px-3 py-1.5 text-xs font-medium text-accent bg-accent/10 rounded-lg hover:bg-accent/20 cursor-pointer"
                      >
                        View
                      </button>
                    )}
                    {onDelete && (
                      <button
                        onClick={(e) => { e.stopPropagation(); onDelete(row.id as string); }}
                        className="px-3 py-1.5 text-xs font-medium text-red-600 bg-red-50 rounded-lg hover:bg-red-100 cursor-pointer"
                      >
                        Delete
                      </button>
                    )}
                  </div>
                </td>
              )}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

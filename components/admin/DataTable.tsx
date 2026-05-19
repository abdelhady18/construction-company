interface Column {
  key: string;
  label: string;
  render?: (value: unknown, row: Record<string, unknown>) => React.ReactNode;
}

interface DataTableProps {
  columns: Column[];
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  data: any[];
  onEdit?: (id: string) => void;
  onDelete?: (id: string) => void;
}

export default function DataTable({ columns, data, onEdit, onDelete }: DataTableProps) {
  return (
    <div className="overflow-x-auto bg-white rounded-xl shadow-sm">
      <table className="w-full text-sm">
        <thead>
          <tr className="border-b border-gray-200 bg-gray-50">
            {columns.map((col) => (
              <th key={col.key} className="text-left px-6 py-3 font-semibold text-gray-600">
                {col.label}
              </th>
            ))}
            {(onEdit || onDelete) && (
              <th className="text-left px-6 py-3 font-semibold text-gray-600">Actions</th>
            )}
          </tr>
        </thead>
        <tbody>
          {data.map((row, idx) => (
            <tr key={row.id as string || idx} className="border-b border-gray-100 hover:bg-gray-50">
              {columns.map((col) => (
                <td key={col.key} className="px-6 py-4 text-gray-700">
                  {col.render ? col.render(row[col.key], row) : String(row[col.key] ?? "")}
                </td>
              ))}
              {(onEdit || onDelete) && (
                <td className="px-6 py-4">
                  <div className="flex gap-2">
                    {onEdit && (
                      <button
                        onClick={() => onEdit(row.id as string)}
                        className="px-3 py-1.5 text-xs font-medium text-primary bg-primary/10 rounded-lg hover:bg-primary/20 cursor-pointer"
                      >
                        Edit
                      </button>
                    )}
                    {onDelete && (
                      <button
                        onClick={() => onDelete(row.id as string)}
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

import { Paper, Stack, Table, TableBody, TableCell, TableContainer, TableHead, TableRow } from '@mui/material';
import { IActionItem } from 'shared-types';

export interface ActionItemsColumn {
  id: keyof Pick<IActionItem, 'value' | 'isCompleted'>;
  label: string;
  minWidth: number;
  align?: 'right' | 'center' | 'left';
  render: (value: any, review: IActionItem) => JSX.Element;
}

interface ActionItemsTableProps {
  rows: IActionItem[];
  columns: readonly ActionItemsColumn[];
}

const ActionItemsTable: React.FC<ActionItemsTableProps> = ({ rows, columns }) => {
  return (
    <Paper sx={{ maxHeight: 'inherit', height: '100%', width: '100%', overflow: 'hidden' }}>
      <Stack height="100%" direction="column" justifyContent="space-between">
        <TableContainer style={{ height: '90%' }}>
          <Table stickyHeader aria-label="sticky table">
            <TableHead>
              <TableRow>
                {columns.map((column) => (
                  <TableCell key={column.id} align={column.align} style={{ minWidth: `${column.minWidth}vh` }}>
                    {column.label}
                  </TableCell>
                ))}
              </TableRow>
            </TableHead>
             <TableBody>
                {rows.map((row) => (
                    <TableRow hover key={row._id?.toString()}>
                      {columns.map((column) => {
                        return (
                          <TableCell key={`${row._id!}-${column.id}`} align={column.align}>
                            {column.render(column.id, row)}
                          </TableCell>
                        );
                      })}
                    </TableRow>
                  ))}
             </TableBody>
          </Table>
        </TableContainer>
      </Stack>
    </Paper>
  );
};

export default ActionItemsTable;
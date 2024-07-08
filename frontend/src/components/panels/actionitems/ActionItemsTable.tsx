import { Paper, Stack, Table, TableBody, TableCell, TableContainer, TableHead, TableRow } from '@mui/material';
import { useState } from 'react';
import { IActionItem } from 'shared-types';
import ActionItemReason from './ActionItemReason';

export interface ActionItemsColumn {
  id: keyof Pick<IActionItem, 'value' | 'isCompleted'>;
  label: string;
  minWidth: number;
  align?: 'right' | 'center' | 'left';
  render: (value: any, item: IActionItem) => JSX.Element;
}

interface ActionItemsTableProps {
  rows: IActionItem[];
  columns: readonly ActionItemsColumn[];
}

const ActionItemsTable: React.FC<ActionItemsTableProps> = ({ rows, columns }) => {
  const [showReasonDialog, setShowReasonDialog] = useState<boolean>(false);
  const [selectedItem, setSelectedItem] = useState<IActionItem>();
  
  const openReasonDialog = (item: IActionItem) => {
    setSelectedItem(item);
    setShowReasonDialog(true);
  };

  const closeReasonDialog = () => {
    setShowReasonDialog(false);
  }
  
  return (
    <>
    <Paper sx={{ maxHeight: 'inherit', height: '95%', width: '100%', overflow: 'hidden' }} elevation={0}>
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
                          <TableCell key={`${row._id!}-${column.id}`} align={column.align} onClick={() => column.id !== 'isCompleted' && openReasonDialog(row) }>
                            {column.render(row[column.id], row)}
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
    <ActionItemReason open={showReasonDialog} onClose={closeReasonDialog} item={selectedItem}/>
    </>
  );
};

export default ActionItemsTable;
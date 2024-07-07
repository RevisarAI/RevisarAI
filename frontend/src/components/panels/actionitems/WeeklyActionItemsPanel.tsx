import { Paper, Typography } from '@mui/material';
import ActionItemsTable, { ActionItemsColumn } from './ActionItemsTable';
import { IActionItem } from 'shared-types';
import ActionItemCheckbox from './ActionItemCheckbox';
import './WeeklyActionItemsPanel.css';

interface ActionItemsPanelProps {
  data: IActionItem[];
  height: number;
  itemsID: string;
  updateActionItemStatus: (item: IActionItem, itemsID: string) => void;
}

const WeeklyActionItemsPanel: React.FC<ActionItemsPanelProps> = ({ data, height, itemsID, updateActionItemStatus }) => {
  const columns: readonly ActionItemsColumn[] = [
    {
      id: 'value',
      label: 'Title',
      align: 'left',
      minWidth: 50,
      render: (value: IActionItem['value'], item: IActionItem) => (
        <span className={item.isCompleted ? 'actionItemCompleted' : ''}>{value}</span>
      ),
    },
    {
      id: 'isCompleted',
      label: 'Is done',
      align: 'left',
      minWidth: 5,
      render: (isCompleted: IActionItem['isCompleted'], item: IActionItem) => (
        <ActionItemCheckbox
          isCompleted={isCompleted}
          updateActionItemStatus={() => {
            updateActionItemStatus(item, itemsID);
          }}
        />
      ),
    },
  ];

  return (
    <Paper style={{ padding: 16, borderRadius: 15, height: height }}>
      <Typography variant="body1" sx={{ fontWeight: 'semibold' }}>
        Weekly action items
      </Typography>
      <ActionItemsTable rows={data} columns={columns} />
    </Paper>
  );
};

export default WeeklyActionItemsPanel;
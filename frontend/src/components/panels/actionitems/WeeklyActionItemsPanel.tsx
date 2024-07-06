import { Paper, Typography } from '@mui/material';
import ActionItemsTable, { ActionItemsColumn } from './ActionItemsTable';
import { IActionItem } from 'shared-types';
import ActionItemCheckbox from './ActionItemCheckbox';
import './WeeklyActionItemsPanel.css';
import { actionItemsService } from '@/services/action-items-service';
import { ObjectId } from 'mongoose';

interface ActionItemsPanelProps {
  data: IActionItem[];
  height: number;
  itemsID: string;
}

const WeeklyActionItemsPanel: React.FC<ActionItemsPanelProps> = ({ data, height, itemsID }) => {
  const updateActionItemStatus = (item: IActionItem, itemsID: string) => {
    item.isCompleted = !item.isCompleted;
    actionItemsService.updateActionItemStatus(item, itemsID);
  };

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

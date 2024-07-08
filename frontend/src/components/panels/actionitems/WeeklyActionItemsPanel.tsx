import { Checkbox, Paper, Typography } from '@mui/material';
import ActionItemsTable, { ActionItemsColumn } from './ActionItemsTable';
import { IActionItem } from 'shared-types';
import './WeeklyActionItemsPanel.css';

interface ActionItemsPanelProps {
  data: IActionItem[];
  height: number;
  onComplete: (item: IActionItem) => void;
  loading: boolean;
}

const WeeklyActionItemsPanel: React.FC<ActionItemsPanelProps> = ({ data, height, onComplete, loading }) => {
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
        <Checkbox checked={isCompleted} onClick={() => onComplete(item)} />
      ),
    },
  ];

  return (
    <Paper style={{ padding: 16, borderRadius: 15, height: height }}>
      <Typography variant="body1" sx={{ fontWeight: 'semibold' }}>
        Weekly action items
      </Typography>
      <ActionItemsTable rows={data} columns={columns} loading={loading} />
    </Paper>
  );
};

export default WeeklyActionItemsPanel;

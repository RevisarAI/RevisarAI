import { Paper, Typography } from "@mui/material";
import ActionItemsTable, { ActionItemsColumn } from './ActionItemsTable';
import { IActionItem } from "shared-types";
import ActionItemText from "./ActionItemText";
import ActionItemCheckbox from "./ActionItemCheckbox";

interface ActionItemsPanelProps {
  data: IActionItem[];
}

const columns: readonly ActionItemsColumn[] = [
    {
        id: 'value',
        label: 'Title',
        align: 'left',
        minWidth: 71,
        render: (item: IActionItem) => (
            <ActionItemText key={item._id?.toString()} text={item.value} />
        ),
    },
    {
        id: 'isCompleted',
        label: 'Is done',
        align: 'left',
        minWidth: 5,
        render: (isCompleted: IActionItem['isCompleted']) => (
            <ActionItemCheckbox isCompleted={isCompleted}/>
        ),
    }
];

const WeeklyActionItemsPanel: React.FC<ActionItemsPanelProps> = ({ data }) => {
    return (
        <Paper style={{ padding: 16, borderRadius: 15 }}>
        <Typography variant="body1" sx={{ fontWeight: 'semibold' }}>
            Weekly action items
        </Typography>
        <ActionItemsTable
        rows={data}
        columns={columns}
        />
      </Paper>
    );
};

export default WeeklyActionItemsPanel;
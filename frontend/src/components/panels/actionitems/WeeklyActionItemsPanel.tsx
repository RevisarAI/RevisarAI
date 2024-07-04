import { Paper, Typography } from "@mui/material";

interface ActionItemsPanelProps {
//   data: IWordFrequency[];
//   height: number;
//   loading: boolean;
//   colors: string[];
}

const WeeklyActionItemsPanel: React.FC<ActionItemsPanelProps> = () => {
    return (
        <Paper style={{ padding: 16, borderRadius: 15 }}>
        <Typography variant="body1" sx={{ fontWeight: 'semibold' }}>
            Weekly action items
        </Typography>
      </Paper>
    );
};

export default WeeklyActionItemsPanel;
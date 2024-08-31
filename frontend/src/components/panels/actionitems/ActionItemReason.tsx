import { Dialog, IconButton, Stack, Typography } from '@mui/material';
import { Close as CloseIcon } from '@mui/icons-material';
import { IActionItem } from 'shared-types';

interface ActionItemReasonProps {
  open: boolean;
  item: IActionItem | undefined;
  onClose: () => void;
}

const ActionItemReason: React.FC<ActionItemReasonProps> = ({ open, item, onClose }) => (
  <Dialog PaperProps={{ sx: { borderRadius: '1rem' } }} fullWidth onClose={onClose} open={open}>
    <Stack minHeight="30vh" display="flex" direction="column" paddingLeft={5} paddingRight={4} paddingTop={8}>
      <IconButton
        aria-label="close"
        onClick={onClose}
        sx={{
          position: 'absolute',
          left: 8,
          top: 8,
          color: (theme) => theme.palette.grey[500],
        }}
      >
        <CloseIcon />
      </IconButton>
      <Stack direction="row" justifyContent="space-between" alignItems="center">
        <Typography variant="h5">{item?.value}</Typography>
      </Stack>
      <Typography
        maxHeight="40vh"
        minHeight="20vh"
        paddingTop={3}
        variant="body1"
        style={{ overflow: 'auto', whiteSpace: 'pre-line' }}
      >
        {item?.reason}
      </Typography>
    </Stack>
  </Dialog>
);

export default ActionItemReason;

import { MoreVert as MoreVertIcon, SvgIconComponent } from '@mui/icons-material';
import { Dialog, DialogTitle, Divider, Grid, IconButton, Popover, Tooltip, Typography, Zoom } from '@mui/material';
import { useState } from 'react';
import { TypeAnimation } from 'react-type-animation';
import { ContentCopy as ClipboardIcon, Check as CopiedIcon, Quickreply as QuickReplyIcon } from '@mui/icons-material';

export interface ReviewAction {
  label: string;
  icon: SvgIconComponent;
  clickedIcon?: SvgIconComponent;
  onClick: (reviewText: string) => void | Promise<void>;
}

const ReviewActions: React.FC<{ reviewText: string }> = ({ reviewText }) => {
  const [anchorEl, setAnchorEl] = useState<HTMLButtonElement | null>(null);
  const [showResponseDialog, setShowResponseDialog] = useState<boolean>(false);

  const actions: ReviewAction[] = [
    {
      icon: ClipboardIcon,
      label: 'Copy review to clipboard',
      clickedIcon: CopiedIcon,
      onClick: async (text) => {
        if (navigator.clipboard) {
          await navigator.clipboard.writeText(text);
        } else {
          console.error('Clipboard API not available');
        }
      },
    },
    {
      icon: QuickReplyIcon,
      label: 'Generate response',
      onClick: (text) => {
        setShowResponseDialog(true);
      },
    },
  ];

  const [actionsClickedState, setActionsClickedState] = useState<boolean[]>(new Array(actions.length).fill(false));

  const handleClick = (event: React.MouseEvent<HTMLButtonElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const isClicked = (index: number) => actionsClickedState[index];

  return (
    <>
      <IconButton onClick={handleClick}>
        <MoreVertIcon />
      </IconButton>
      <Popover
        slotProps={{ paper: { sx: { borderRadius: '0.7rem', padding: '0.2rem' } } }}
        open={Boolean(anchorEl)}
        anchorEl={anchorEl}
        onClose={handleClose}
        transformOrigin={{
          vertical: 'center',
          horizontal: 'right',
        }}
        anchorOrigin={{
          vertical: 'center',
          horizontal: 'left',
        }}
      >
        <Grid container direction="row" justifyContent="center" alignItems="center">
          {actions.map((action, index) => (
            <>
              <Tooltip
                arrow
                TransitionComponent={Zoom}
                TransitionProps={{ timeout: 200 }}
                title={<Typography variant="body2">{action.label}</Typography>}
                placement="top"
              >
                <IconButton
                  key={action.label}
                  disabled={isClicked(index)}
                  onClick={async () => {
                    await action.onClick(reviewText);
                    setActionsClickedState((prev) => prev.map((val, i) => (i === index ? true : val)));
                  }}
                >
                  {isClicked(index) && action.clickedIcon ? <action.clickedIcon /> : <action.icon />}
                </IconButton>
              </Tooltip>
              {index !== actions.length - 1 && <Divider orientation="vertical" flexItem />}
            </>
          ))}
        </Grid>
      </Popover>
      <Dialog
        PaperProps={{ sx: { borderRadius: '1rem' } }}
        fullWidth
        onClose={() => setShowResponseDialog(false)}
        open={showResponseDialog}
      >
        <DialogTitle>Generated response for review</DialogTitle>
        <Typography padding={3} paddingTop={0} minHeight="40vh" variant="body1">
          <TypeAnimation
            sequence={[
              'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Vivamus nibh nunc, laoreet vel ex non, ultrices ullamcorper nibh. Donec cursus neque egestas dui congue, ac dapibus orci pellentesque. Nulla a porta tellus. Ut scelerisque blandit dolor. Nulla sit amet mauris suscipit, mattis massa id, cursus tellus. Nam pulvinar interdum euismod. Maecenas sed eleifend nunc, sed congue arcu. Sed egestas nulla et purus sollicitudin hendrerit. Aliquam tortor orci, lacinia nec tempus et, egestas pulvinar odio. Donec condimentum risus sit amet nulla placerat, id interdum ipsum fermentum. Cras non tellus sapien. Vestibulum efficitur laoreet nunc, sed dapibus nulla fermentum vitae. Suspendisse cursus nec massa ac ullamcorper. Mauris hendrerit ligula at sollicitudin ultrices. Praesent nisi est, ullamcorper sit amet ligula sed, tristique faucibus felis. Nulla interdum sapien arcu, at maximus diam aliquet facilisis. Mauris sit amet congue ante. In bibendum libero massa, varius porta leo pellentesque ut. Nulla facilisi. Praesent et lobortis lectus. Aenean elit nunc, eleifend eu eleifend mattis, tincidunt laoreet mauris. Quisque laoreet urna ut metus tristique mollis. Nullam arcu urna, suscipit ut aliquet ut, lobortis vitae ante. Sed tincidunt arcu sit amet imperdiet varius.',
            ]}
            speed={70}
          ></TypeAnimation>
        </Typography>
      </Dialog>
    </>
  );
};

export default ReviewActions;

import { MoreVert as MoreVertIcon, SvgIconComponent } from '@mui/icons-material';
import { Divider, Grid, IconButton, Popover, Tooltip, Typography, Zoom } from '@mui/material';
import { useState } from 'react';
import { ContentCopy as ClipboardIcon, Check as CopiedIcon, Quickreply as QuickReplyIcon } from '@mui/icons-material';
import ReviewResponse from './ReviewResponse';

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
      onClick: () => setShowResponseDialog(true),
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
            <span key={index}>
              <Tooltip
                key={action.label}
                arrow
                TransitionComponent={Zoom}
                TransitionProps={{ timeout: 200 }}
                title={<Typography variant="body2">{action.label}</Typography>}
                placement="top"
              >
                <IconButton
                  key={action.label}
                  disabled={isClicked(index) && !!action.clickedIcon}
                  onClick={async () => {
                    await action.onClick(reviewText);
                    setActionsClickedState((prev) => prev.map((val, i) => (i === index ? true : val)));
                    setTimeout(
                      () => setActionsClickedState((prev) => prev.map((val, i) => (i === index ? false : val))),
                      2000
                    );
                  }}
                >
                  {isClicked(index) && action.clickedIcon ? <action.clickedIcon /> : <action.icon />}
                </IconButton>
              </Tooltip>
              {index !== actions.length - 1 && <Divider orientation="vertical" flexItem />}
            </span>
          ))}
        </Grid>
      </Popover>
      <ReviewResponse open={showResponseDialog} onClose={() => setShowResponseDialog(false)} reviewText={reviewText} />
    </>
  );
};

export default ReviewActions;

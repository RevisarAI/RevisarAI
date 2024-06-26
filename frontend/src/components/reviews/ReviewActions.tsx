import { MoreVert as MoreVertIcon, SvgIconComponent } from '@mui/icons-material';
import { Dialog, DialogTitle, Divider, Grid, IconButton, Popover, Tooltip, Typography, Zoom } from '@mui/material';
import { useEffect, useState } from 'react';
import { TypeAnimation } from 'react-type-animation';
import { ContentCopy as ClipboardIcon, Check as CopiedIcon, Quickreply as QuickReplyIcon } from '@mui/icons-material';
import { random } from 'lodash';

export interface ReviewAction {
  label: string;
  icon: SvgIconComponent;
  clickedIcon?: SvgIconComponent;
  onClick: (reviewText: string) => void | Promise<void>;
}

const splitStringWithDelays = (longString: string, minDelay = 30, maxDelay = 150): Array<string | number> => {
  const getRandomDelay = () => random(minDelay, maxDelay);

  const getRandomLength = (maxLength: number) => random(1, maxLength);

  const result = [];
  let currentIndex = 0;

  while (currentIndex < longString.length) {
    const remainingLength = longString.length - currentIndex;
    const randomLength = getRandomLength(Math.max(10, remainingLength / 10));

    const substring = longString.slice(0, currentIndex + randomLength);

    result.push(substring, getRandomDelay());

    currentIndex += randomLength;
  }

  return result;
};

const lorem =
  'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Vivamus nibh nunc, laoreet vel ex non, ultrices ullamcorper nibh. Donec cursus neque egestas dui congue, ac dapibus orci pellentesque. Nulla a porta tellus. Ut scelerisque blandit dolor. Nulla sit amet mauris suscipit, mattis massa id, cursus tellus. Nam pulvinar interdum euismod. Maecenas sed eleifend nunc, sed congue arcu. Sed egestas nulla et purus sollicitudin hendrerit.';

const ReviewActions: React.FC<{ reviewText: string }> = ({ reviewText }) => {
  const [anchorEl, setAnchorEl] = useState<HTMLButtonElement | null>(null);
  const [showResponseDialog, setShowResponseDialog] = useState<boolean>(false);
  const [finishedWritingResponse, setFinishedWritingResponse] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(true);

  const loadingSequence = ['Loading', 100, 'Loading.', 100, 'Loading..', 100, 'Loading...'];

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
      onClick: () => {
        setShowResponseDialog(true);
        setLoading(true);
        setTimeout(() => setLoading(false), 3500);
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
      <Dialog
        PaperProps={{ sx: { borderRadius: '1rem' } }}
        fullWidth
        onClose={() => setShowResponseDialog(false)}
        open={showResponseDialog}
      >
        <DialogTitle>{loading ? 'Generating a response...' : 'Generated response for review'}</DialogTitle>
        <Typography padding={3} paddingTop={0} minHeight="40vh" variant="body1">
          {loading ? (
            ''
          ) : (
            <TypeAnimation
              style={{ whiteSpace: 'pre - line' }}
              sequence={[...splitStringWithDelays(lorem), () => setFinishedWritingResponse(true)]}
              repeat={0}
              speed={75}
            />
          )}
        </Typography>
      </Dialog>
    </>
  );
};

export default ReviewActions;

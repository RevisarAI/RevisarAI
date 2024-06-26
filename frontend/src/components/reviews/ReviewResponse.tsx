import { Autorenew as RefreshIcon, Send as SendIcon } from '@mui/icons-material';
import { Dialog, Grid, IconButton, Stack, TextField, Tooltip, Typography, Zoom } from '@mui/material';
import { random } from 'lodash';
import { useEffect, useState } from 'react';
import { ContentCopy as ClipboardIcon, Check as CopiedIcon } from '@mui/icons-material';
import { GridLoader } from 'react-spinners';
import { TypeAnimation } from 'react-type-animation';
import { useTheme } from '@mui/material/styles';

const splitStringWithDelays = (longString: string, minDelay = 50, maxDelay = 300): Array<string | number> => {
  const getRandomDelay = () => random(minDelay, maxDelay);
  const getRandomLength = (minLength: number, maxLength: number) => random(minLength, maxLength);

  const result = [];
  let currentIndex = 0;

  while (currentIndex < longString.length) {
    const randomLength = getRandomLength(30, 50);
    const substring = longString.slice(0, currentIndex + randomLength);

    result.push(substring, getRandomDelay());
    currentIndex += randomLength;
  }

  return result;
};

interface ReviewResponseProps {
  reviewText: string;
  open: boolean;
  onClose: () => void;
}

// TODO: replace lorem ipsum
const lorem = 'Lorem ipsum dolor sit amet, consectetur adipiscing elit.'.repeat(10);

const ReviewResponse: React.FC<ReviewResponseProps> = ({ reviewText, open, onClose }) => {
  const [responseText, setResponseText] = useState<string>('');
  const [finishedWritingResponse, setFinishedWritingResponse] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(true);
  const [prompt, setPrompt] = useState<string>('');
  const [copied, setCopied] = useState<boolean>(false);
  const [typeAnimationKey, setTypeAnimationKey] = useState<number>(0);

  const theme = useTheme();

  // TODO: replace with actual query
  setTimeout(() => {
    setResponseText(lorem);
    setLoading(false);
  }, 3500);

  // Listen and rerender the TypeAnimation component
  useEffect(() => {
    setTypeAnimationKey((prev) => prev + 1);
  }, [loading, finishedWritingResponse]);

  const copyResponse = () => {
    if (navigator.clipboard) {
      navigator.clipboard.writeText(responseText).then(() => {
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
      });
    } else {
      console.error('Clipboard API not available');
    }
  };

  if (!open) {
    return;
  }

  return (
    <Dialog PaperProps={{ sx: { borderRadius: '1rem' } }} fullWidth onClose={onClose} open={open}>
      <Stack
        minHeight="30vh"
        display="flex"
        direction="column"
        padding={5}
        paddingBottom={4}
        spacing={3}
        justifyContent="space-between"
      >
        <Stack direction="row" justifyContent="space-between" alignItems="center">
          <Typography variant="h5">{loading ? 'Generating a response...' : 'Generated response'}</Typography>
          {finishedWritingResponse && (
            <Tooltip
              arrow
              TransitionComponent={Zoom}
              TransitionProps={{ timeout: 100 }}
              title={<Typography variant="body2">Copy response</Typography>}
              placement="top"
            >
              <IconButton disabled={copied} onClick={copyResponse}>
                {copied ? <CopiedIcon /> : <ClipboardIcon />}
              </IconButton>
            </Tooltip>
          )}
        </Stack>
        {loading || true ? (
          <div style={{ height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <GridLoader color={theme.palette.primary.main} />
          </div>
        ) : (
          <Typography
            maxHeight="40vh"
            minHeight="20vh"
            variant="body1"
            style={{ overflow: 'auto', whiteSpace: 'pre-line' }}
          >
            )
            {!finishedWritingResponse ? (
              <TypeAnimation
                key={typeAnimationKey}
                style={{ whiteSpace: 'pre - line' }}
                sequence={[...splitStringWithDelays(responseText), () => setFinishedWritingResponse(true)]}
                repeat={0}
                speed={80}
              />
            ) : (
              responseText
            )}
          </Typography>
        )}
        {!loading && finishedWritingResponse && (
          <>
            <Grid container direction="row" height="5vh" alignItems="center" justifyContent="center" paddingBottom={2}>
              <Grid item md>
                <TextField
                  variant="standard"
                  fullWidth
                  placeholder={'Enter a prompt or regenerate response automatically'}
                  InputProps={{
                    endAdornment: (
                      <Tooltip
                        arrow
                        TransitionComponent={Zoom}
                        TransitionProps={{ timeout: 100 }}
                        title={<Typography variant="body2">Regenerate{prompt.length > 0 && ' with prompt'}</Typography>}
                        placement="top"
                      >
                        <IconButton type="button">{prompt.length === 0 ? <RefreshIcon /> : <SendIcon />}</IconButton>
                      </Tooltip>
                    ),
                  }}
                  value={prompt}
                  onChange={(e) => setPrompt(e.target.value)}
                />
              </Grid>
            </Grid>
          </>
        )}
      </Stack>
    </Dialog>
  );
};

export default ReviewResponse;

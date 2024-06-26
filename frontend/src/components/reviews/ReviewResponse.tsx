import { Autorenew as RefreshIcon, Send as SendIcon } from '@mui/icons-material';
import { Dialog, Divider, Grid, IconButton, Stack, TextField, Tooltip, Typography, Zoom } from '@mui/material';
import { random } from 'lodash';
import { useEffect, useState } from 'react';
import { ContentCopy as ClipboardIcon, Check as CopiedIcon } from '@mui/icons-material';
import { TypeAnimation } from 'react-type-animation';

const splitStringWithDelays = (longString: string, minDelay = 100, maxDelay = 300): Array<string | number> => {
  const getRandomDelay = () => random(minDelay, maxDelay);
  const getRandomLength = (minLength: number, maxLength: number) => random(minLength, maxLength);

  const result = [];
  let currentIndex = 0;

  while (currentIndex < longString.length) {
    const randomLength = getRandomLength(10, 40);
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
const lorem =
  'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Vivamus nibh nunc, laoreet vel ex non, ultrices ullamcorper nibh. Donec cursus neque egestas dui congue, ac dapibus orci pellentesque. Nulla a porta tellus. Ut scelerisque blandit dolor. Nulla sit amet mauris suscipit, mattis massa id, cursus tellus. Nam pulvinar interdum euismod. Maecenas sed eleifend nunc, sed congue arcu. Sed egestas nulla et purus sollicitudin hendrerit.';

const ReviewResponse: React.FC<ReviewResponseProps> = ({ reviewText, open, onClose }) => {
  const [responseText, setResponseText] = useState<string>('');
  const [finishedWritingResponse, setFinishedWritingResponse] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(true);
  const [prompt, setPrompt] = useState<string>('');
  const [copied, setCopied] = useState<boolean>(false);
  const [typeAnimationKey, setTypeAnimationKey] = useState<number>(0);

  // TODO: replace with actual query
  setTimeout(() => {
    setResponseText(lorem);
    setLoading(false);
  }, 3500);

  // Listen and rerender the TypeAnimation component
  useEffect(() => {
    setTypeAnimationKey((prev) => prev + 1);
  }, [loading, finishedWritingResponse]);

  const loadingSequence = ['Loading', 100, 'Loading.', 100, 'Loading..', 100, 'Loading...'];

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
      <Stack direction="column" padding={5} spacing={3}>
        <Stack direction="row" justifyContent="space-between" alignItems="center">
          <Typography variant="h5">{loading ? 'Generating a response...' : 'Generated response'}</Typography>
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
        </Stack>
        <Stack direction="column" spacing={2} maxHeight="50vh" minHeight="30vh">
          <Typography maxHeight="40vh" variant="body1" style={{ overflow: 'auto', whiteSpace: 'pre-line' }}>
            {loading ? (
              <TypeAnimation key={typeAnimationKey} sequence={loadingSequence} repeat={0} speed={75} />
            ) : !finishedWritingResponse ? (
              <TypeAnimation
                key={typeAnimationKey}
                style={{ whiteSpace: 'pre - line' }}
                sequence={[...splitStringWithDelays(''), () => setFinishedWritingResponse(true)]}
                repeat={0}
                speed={75}
              />
            ) : (
              responseText.repeat(4)
            )}
          </Typography>
          {!loading && finishedWritingResponse && (
            <>
              <Divider></Divider>
              <Grid container direction="row" height="5vh" alignItems="center" justifyContent="center">
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
                          title={
                            <Typography variant="body2">Regenerate{prompt.length > 0 && ' with prompt'}</Typography>
                          }
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
      </Stack>
    </Dialog>
  );
};

export default ReviewResponse;

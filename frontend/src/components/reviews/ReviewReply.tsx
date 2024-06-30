import { Autorenew as RefreshIcon, Send as SendIcon } from '@mui/icons-material';
import { Dialog, Grid, IconButton, Stack, TextField, Tooltip, Typography, Zoom } from '@mui/material';
import { random } from 'lodash';
import { useEffect, useState } from 'react';
import { ContentCopy as ClipboardIcon, Check as CopiedIcon } from '@mui/icons-material';
import { GridLoader } from 'react-spinners';
import { TypeAnimation } from 'react-type-animation';
import { useQuery } from '@tanstack/react-query';
import { Close as CloseIcon } from '@mui/icons-material';
import { useTheme } from '@mui/material/styles';
import { reviewService } from '@/services/review-service';

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

interface ReviewReplyProps {
  reviewText: string;
  open: boolean;
  onClose: () => void;
}

const ReviewReply: React.FC<ReviewReplyProps> = ({ reviewText, open, onClose }) => {
  // Do not render anything when the dialog is closed
  if (!open) {
    return;
  }

  const [writingReply, setWritingReply] = useState<boolean>(false);
  const [previousReplies, setPreviousReplies] = useState<string[]>([]);
  const [prompt, setPrompt] = useState<string>('');
  const [copied, setCopied] = useState<boolean>(false);
  const [typeAnimationKey, setTypeAnimationKey] = useState<number>(0);

  const theme = useTheme();

  const query = useQuery({
    queryKey: ['generateReply', reviewText], // Unique query for each review
    refetchOnMount: false,
    refetchOnWindowFocus: false,
    queryFn: async () => {
      const reply = await reviewService.generateReviewReply({ reviewText, prompt, previousReplies });
      setPreviousReplies((prev) => [...prev, reply.text]);
      setPrompt('');
      setWritingReply(true);
      return reply;
    },
  });

  const { isFetching: loading, isError: error, data: reply } = query;
  const replyText = reply?.text || '';

  // Listen and rerender the TypeAnimation component
  useEffect(() => {
    setTypeAnimationKey((prev) => prev + 1);
  }, [loading, writingReply]);

  const copyReply = () => {
    if (navigator.clipboard) {
      navigator.clipboard.writeText(replyText).then(() => {
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
      });
    } else {
      console.error('Clipboard API not available');
    }
  };

  return (
    <Dialog PaperProps={{ sx: { borderRadius: '1rem' } }} fullWidth onClose={onClose} open={open}>
      <Stack
        minHeight="30vh"
        display="flex"
        direction="column"
        padding={5}
        paddingTop={3}
        paddingBottom={4}
        spacing={3}
        justifyContent="space-between"
      >
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
          <Typography variant="h5">
            {loading || error ? 'Generating a reply message...' : 'Generated reply message'}
          </Typography>
          {/* Allow copy if finished loading and writing a reply */}
          {!writingReply && !loading && (
            <Tooltip
              arrow
              TransitionComponent={Zoom}
              TransitionProps={{ timeout: 100 }}
              title={<Typography variant="body2">Copy reply</Typography>}
              placement="top"
            >
              <IconButton disabled={copied} onClick={copyReply}>
                {copied ? <CopiedIcon /> : <ClipboardIcon />}
              </IconButton>
            </Tooltip>
          )}
        </Stack>
        {loading ? (
          <>
            <div style={{ height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <GridLoader color={theme.palette.primary.main} />
            </div>
            {/* Div for centering */}
            <div></div>
          </>
        ) : error ? (
          <Typography variant="body1" color={theme.palette.error.main}>
            Failed with error "{error}". Please try again later.
          </Typography>
        ) : writingReply ? (
          <Typography
            maxHeight="40vh"
            minHeight="20vh"
            variant="body1"
            style={{ overflow: 'auto', whiteSpace: 'pre-line' }}
          >
            <TypeAnimation
              key={typeAnimationKey}
              style={{ whiteSpace: 'pre - line' }}
              sequence={[...splitStringWithDelays(replyText), () => setWritingReply(false)]}
              repeat={0}
              speed={80}
            />
          </Typography>
        ) : (
          <>
            <Typography
              maxHeight="40vh"
              minHeight="20vh"
              variant="body1"
              style={{ overflow: 'auto', whiteSpace: 'pre-line' }}
            >
              {replyText}
            </Typography>
            {/* Regenerate with prompt Grid */}
            <Grid container direction="row" height="5vh" alignItems="center" justifyContent="center" paddingBottom={2}>
              <Grid item md>
                <TextField
                  variant="standard"
                  fullWidth
                  inputProps={{ maxLength: 65 }}
                  placeholder={'Prompt or regenerate new reply automatically'}
                  InputProps={{
                    // Input icon
                    endAdornment: (
                      <Tooltip
                        arrow
                        TransitionComponent={Zoom}
                        TransitionProps={{ timeout: 100 }}
                        title={<Typography variant="body2">Regenerate{prompt.length > 0 && ' with prompt'}</Typography>}
                        placement="top"
                      >
                        <IconButton type="button" onClick={() => query.refetch()}>
                          {prompt.length === 0 ? <RefreshIcon /> : <SendIcon />}
                        </IconButton>
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

export default ReviewReply;

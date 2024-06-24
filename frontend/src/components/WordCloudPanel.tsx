import React, { useMemo } from 'react';
import { Box, Paper, Skeleton, Stack, Typography } from '@mui/material';
import { IWordFrequency } from 'shared-types';
import { Text } from '@visx/text';
import { scaleLog } from '@visx/scale';
import Wordcloud from '@visx/wordcloud/lib/Wordcloud';

interface WordCloudPanelProps {
  data: IWordFrequency[];
  height: number;
  loading: boolean;
}

const fixedValueGenerator = () => 0.5;

const WordCloudPanel: React.FC<WordCloudPanelProps> = ({ data, height, loading }: WordCloudPanelProps) => {
  const WordCloudSkeleton = () => {
    return (
      <Stack direction={'row'} spacing={'3vw'} padding={2.25} justifyContent={'center'}>
        <Stack direction={'row'} height={height - 20} spacing={2} alignItems={'flex-end'}>
          {Array.from({ length: 15 }).map((_, index) => (
            <Skeleton variant="rectangular" height={`${Math.random() * 100 + 15}%`} width={15} key={index} />
          ))}
        </Stack>
      </Stack>
    );
  };

  const fontScale = useMemo(() => scaleLog({ domain: [10, 100], range: [10, 50] }), []);
  return (
    <Paper style={{ padding: 16, borderRadius: 15 }}>
      <Typography variant="body1" sx={{ fontWeight: 'semibold' }}>
        Trending Keywords
      </Typography>
      {loading ? (
        <WordCloudSkeleton />
      ) : (
        <Box mt={2}>
          {/* Add box for responsive margin*/}
          <Wordcloud spiral={'archimedean'} height={height} random={fixedValueGenerator}></Wordcloud>
        </Box>
      )}
    </Paper>
  );
};

export default WordCloudPanel;

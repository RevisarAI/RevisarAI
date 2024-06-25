import React from 'react';
import { Box, Paper, Skeleton, Stack, Typography } from '@mui/material';
import { BarChart } from '@mui/x-charts';
import { ISentimentBarChartGroup, SentimentEnum } from 'shared-types';

interface SentimentOverTimePanelProps {
  data: ISentimentBarChartGroup[];
  height: number;
  loading: boolean;
}

const SentimentOverTimePanel: React.FC<SentimentOverTimePanelProps> = ({
  data,
  height,
  loading,
}: SentimentOverTimePanelProps) => {
  const BarChartSkeleton = () => {
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

  return (
    <Paper style={{ padding: 16, borderRadius: 15 }}>
      <Typography variant="body1" sx={{ fontWeight: 'semibold' }}>
        Sentiment Over Time
      </Typography>
      {loading ? (
        <BarChartSkeleton />
      ) : (
        <Box mt={2}>
          {/* Add box for responsive margin*/}
          <BarChart
            dataset={data}
            xAxis={[{ scaleType: 'band', dataKey: 'date' }]}
            height={height}
            series={Object.values(SentimentEnum).map((sentiment) => ({
              dataKey: sentiment,
              label: sentiment.charAt(0).toUpperCase() + sentiment.slice(1),
            }))}
          />
        </Box>
      )}
    </Paper>
  );
};

export default SentimentOverTimePanel;

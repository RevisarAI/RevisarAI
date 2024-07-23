import React from 'react';
import { Box, Paper, Skeleton, Stack, Typography } from '@mui/material';
import { BarChart } from '@mui/x-charts';
import { ISentimentBarChartGroup, SentimentEnum } from 'shared-types';
import BarChartSkeleton from '../skeletons/BarChartSkeleton';
import { sentimentColors } from '../reviews/HighlightedText';

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
  return (
    <Paper style={{ padding: 16, borderRadius: 15 }}>
      <Typography variant="body1" sx={{ fontWeight: 'semibold' }}>
        Sentiment Over Time
      </Typography>
      {loading ? (
        <BarChartSkeleton height={height} />
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
              color: sentimentColors[sentiment].fill,
            }))}
          />
        </Box>
      )}
    </Paper>
  );
};

export default SentimentOverTimePanel;

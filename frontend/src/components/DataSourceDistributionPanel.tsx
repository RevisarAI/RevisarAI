import React from 'react';
import { Box, Paper, Skeleton, Stack, Typography } from '@mui/material';
import { PieChart } from '@mui/x-charts';
import { IPieChartData } from 'shared-types';
import { useDrawingArea } from '@mui/x-charts/hooks';
import { styled } from '@mui/material/styles';

interface DataSourceDistributionPanelProps {
  data: IPieChartData[];
  height: number;
  loading: boolean;
}

const DataSourceDistributionPanel: React.FC<DataSourceDistributionPanelProps> = ({
  data,
  height,
  loading,
}: DataSourceDistributionPanelProps) => {
  const innerRadius = height / 2.8;
  const series = { data, paddingAngle: 3, innerRadius, cornerRadius: 5 };

  const TitleStyledText = styled('text')(({ theme }) => ({
    fill: theme.palette.text.primary,
    textAnchor: 'middle',
    dominantBaseline: 'central',
    fontSize: 14,
  }));

  const ValueStyledText = styled('text')(({ theme }) => ({
    fill: theme.palette.text.primary,
    textAnchor: 'middle',
    dominantBaseline: 'central',
    fontSize: 32,
    fontWeight: 'semibold',
  }));

  const PieCenterLabel = () => {
    const { width, height, left, top } = useDrawingArea();
    return (
      <>
        <TitleStyledText x={left + width / 2} y={top + height / 2.3}>
          Total Reviews:
        </TitleStyledText>
        <ValueStyledText x={left + width / 2} y={top + height / 1.7}>
          {data.reduce((acc, { value }) => acc + value, 0)}
        </ValueStyledText>
      </>
    );
  };

  const PieChartSkeleton = () => {
    return (
      <Stack direction={'row'} width={'100%'} spacing={'3vw'} padding={2.25} alignItems={'center'}>
        <Skeleton variant="circular" height={height - 20} width={height - 20} />
        <Stack direction={'column'} flexGrow={1} spacing={3}>
          <Skeleton variant="rectangular" height={20} width={'80%'} />
          <Skeleton variant="rectangular" height={20} width={'80%'} />
          <Skeleton variant="rectangular" height={20} width={'80%'} />
          <Skeleton variant="rectangular" height={20} width={'80%'} />
        </Stack>
      </Stack>
    );
  };

  return (
    <Paper style={{ padding: 16, borderRadius: 15 }}>
      <Typography variant="body1" sx={{ fontWeight: 'semibold' }}>
        Data Source Distribution
      </Typography>
      {loading ? (
        <PieChartSkeleton />
      ) : (
        <Box mt={2}>
          {/* Add box for responsive margin*/}
          <PieChart series={[series]} height={height} loading={loading}>
            <PieCenterLabel />
          </PieChart>
        </Box>
      )}
    </Paper>
  );
};

export default DataSourceDistributionPanel;

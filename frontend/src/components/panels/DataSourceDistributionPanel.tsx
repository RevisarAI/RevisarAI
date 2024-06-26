import React from 'react';
import { Box, Paper, Typography } from '@mui/material';
import { PieChart } from '@mui/x-charts';
import { IPieChartData } from 'shared-types';
import { useDrawingArea } from '@mui/x-charts/hooks';
import { styled } from '@mui/material/styles';
import PieChartSkeleton from '@/components/skeletons/PieChartSkeleton';
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

  return (
    <Paper style={{ padding: 16, borderRadius: 15 }}>
      <Typography variant="body1" sx={{ fontWeight: 'semibold' }}>
        Data Source Distribution
      </Typography>
      {loading ? (
        <PieChartSkeleton height={height} />
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

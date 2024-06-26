import React, { useCallback, useMemo, useState } from 'react';
import { Box, Paper, Typography } from '@mui/material';
import { IWordFrequency } from 'shared-types';
import { Text } from '@visx/text';
import { scaleLog } from '@visx/scale';
import Wordcloud from '@visx/wordcloud/lib/Wordcloud';
import WordCloudSkeleton from '../skeletons/WordCountSkeleton';

interface WordCloudPanelProps {
  data: IWordFrequency[];
  height: number;
  loading: boolean;
  colors: string[];
}

const WordCloudPanel: React.FC<WordCloudPanelProps> = ({ data, height, loading, colors }: WordCloudPanelProps) => {
  const [containerWidth, setContainerWidth] = useState<number>(0);

  const handleBoxWidth = useCallback((node?: HTMLDivElement) => {
    if (node) {
      setContainerWidth(node.getBoundingClientRect().width);
    }
  }, []);

  const fontScale = useMemo(
    () =>
      scaleLog({
        domain: [Math.min(...data.map((w) => w.value)), Math.max(...data.map((w) => w.value))],
        range: [20, 50],
      }),
    [data]
  );

  const fixedValueGenerator = () => 0.5;
  const fontSizeSetter = (word: IWordFrequency) => fontScale(word.value);

  return (
    <Paper style={{ padding: 16, borderRadius: 15 }}>
      <Typography variant="body1" sx={{ fontWeight: 'semibold' }}>
        Trending Keywords
      </Typography>
      {loading ? (
        <WordCloudSkeleton height={height} />
      ) : (
        <Box mt={2} ref={handleBoxWidth}>
          {/* Add box for responsive margin*/}
          <Wordcloud
            spiral={'archimedean'}
            height={height}
            width={containerWidth}
            random={fixedValueGenerator}
            fontSize={fontSizeSetter}
            rotate={0}
            font={'Impact'}
            words={data}
            padding={2}
          >
            {(cloudWords) =>
              cloudWords.map((w, i) => (
                <Text
                  key={w.text}
                  fill={colors[i % colors.length]}
                  textAnchor={'middle'}
                  transform={`translate(${w.x}, ${w.y}) rotate(${w.rotate})`}
                  fontSize={w.size}
                  fontFamily={w.font}
                >
                  {w.text}
                </Text>
              ))
            }
          </Wordcloud>
        </Box>
      )}
    </Paper>
  );
};

export default WordCloudPanel;

import { CSSProperties } from 'react';
import { SentimentEnum } from 'shared-types';

const sentimentColors: Record<SentimentEnum, Record<'border' | 'fill', string>> = {
  positive: {
    fill: '#defce2',
    border: '#76de83',
  },
  negative: {
    fill: '#fae3e3',
    border: '#af6863',
  },
  neutral: {
    fill: '#faf2d3',
    border: '#e0cd80',
  },
};

const HighlightedText: React.FC<{ text: string; sentiment: SentimentEnum; style?: CSSProperties }> = ({
  text,
  sentiment,
  style = {},
}) => (
  <span
    style={{
      paddingRight: '0.25rem',
      paddingLeft: '0.25rem',
      borderColor: sentimentColors[sentiment].border,
      borderWidth: '0.1rem',
      borderStyle: 'solid',
      backgroundColor: sentimentColors[sentiment].fill,
      borderRadius: '0.5rem',
      ...style,
    }}
  >
    {text}
  </span>
);

export default HighlightedText;

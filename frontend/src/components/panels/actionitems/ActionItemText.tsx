import { CSSProperties } from 'react';

interface ActionItemTextProps {
  text: string;
  style?: CSSProperties;
}

const ActionItemText: React.FC<ActionItemTextProps> = ({ text, style = {} }) => (
  <span
    style={{
      paddingRight: '0.25rem',
      paddingLeft: '0.25rem',
      borderWidth: '0.1rem',
      borderStyle: 'solid',
      borderRadius: '0.5rem',
      ...style,
    }}
  >
    {text}
  </span>
);

export default ActionItemText;

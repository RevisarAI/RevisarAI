
import Checkbox from '@mui/material/Checkbox';


interface ActionItemTextProps {
  isCompleted: boolean;
}

const ActionItemCheckbox: React.FC<ActionItemTextProps> = ({ isCompleted }) => (
  <Checkbox checked={isCompleted}/>
);

export default ActionItemCheckbox;

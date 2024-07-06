
import Checkbox from '@mui/material/Checkbox';


interface ActionItemTextProps {
  isCompleted: boolean;
  updateActionItemStatus: () => void;
}

const ActionItemCheckbox: React.FC<ActionItemTextProps> = ({ isCompleted, updateActionItemStatus }) => (
  <Checkbox checked={isCompleted} onClick={updateActionItemStatus}/>
);

export default ActionItemCheckbox;

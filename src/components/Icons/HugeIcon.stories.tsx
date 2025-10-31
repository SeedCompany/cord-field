import { Home } from '@mui/icons-material';
import { CordIcon } from './CordIcon';
import { HugeIcon } from './HugeIcon';

export default {
  title: 'Components/Huge Icon',
};

export const IconProperty = () => <HugeIcon icon={Home} />;

export const CustomChildren = () => {
  return (
    <HugeIcon>
      <CordIcon sx={{ ml: -4 }} />
    </HugeIcon>
  );
};

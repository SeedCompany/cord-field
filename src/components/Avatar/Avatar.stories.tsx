import { CreateNewFolder } from '@mui/icons-material';
import { Avatar as A, AvatarProps } from './Avatar';

export default {
  title: 'Components/Avatar',
};

const GenericAvatar = (props: AvatarProps) => (
  <>
    <A variant="circular" {...props} />
    <br></br>
    <br></br>
    <a href="https://material-ui.com/api/avatar/">MUI Docs</a>
  </>
);

export const Image = () => (
  <GenericAvatar
    src="https://randomuser.me/api/portraits/men/34.jpg"
    alt="A Glassed Man"
  />
);

export const Initials = () => {
  return <GenericAvatar children="JS" sx={{ backgroundColor: '#467F3B' }} />;
};

export const Loading = () => <GenericAvatar loading={true} />;

export const Icon = () => <GenericAvatar children={<CreateNewFolder />} />;

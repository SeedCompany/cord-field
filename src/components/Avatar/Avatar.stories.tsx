import { makeStyles } from '@material-ui/core';
import { CreateNewFolder } from '@material-ui/icons';
import { select } from '@storybook/addon-knobs';
import { Avatar as A, AvatarProps } from './Avatar';

export default {
  title: 'Components/Avatar',
};

const useStyles = makeStyles(() => ({
  color: {
    backgroundColor: '#467F3B',
  },
}));

const GenericAvatar = (props: AvatarProps) => (
  <>
    <A
      variant={select('Variant', ['square', 'rounded', 'circle'], 'circle')}
      {...props}
    />
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
  const classes = useStyles();
  return <GenericAvatar children="JS" className={classes.color} />;
};

export const Loading = () => <GenericAvatar loading={true} />;

export const Icon = () => <GenericAvatar children={<CreateNewFolder />} />;

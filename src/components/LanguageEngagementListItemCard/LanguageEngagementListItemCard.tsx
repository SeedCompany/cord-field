import {
  Card,
  CardContent,
  Grid,
  makeStyles,
  Typography,
  TypographyProps,
} from '@material-ui/core';
import clsx from 'clsx';
import { random } from 'lodash';
import { FC, useState } from 'react';
import * as React from 'react';
import { LanguageEngagementListItemFragment } from '../../api';
import { EditInfoIcon, ScriptIcon } from '../Icons';
import { Picture } from '../Picture';
import { CardActionAreaLink } from '../Routing';

const useStyles = makeStyles(({ spacing }) => {
  const cardWidth = 666;
  return {
    root: {
      width: '100%',
      maxWidth: cardWidth,
      maxHeight: 231,
    },
    card: {
      display: 'flex',
      alignItems: 'initial',
    },
    media: {
      width: cardWidth / 3,
      borderTopRightRadius: 0,
      borderBottomRightRadius: 0,
    },
    cardContent: {
      flex: 1,
      padding: spacing(2, 3),
      display: 'flex',
      justifyContent: 'space-between',
    },
    leftContent: {
      display: 'flex',
      flexDirection: 'column',
      justifyContent: 'space-between',
    },
    rightContent: {
      marginLeft: spacing(2),
      display: 'flex',
      flexDirection: 'column',
      justifyContent: 'space-between',
    },
    centerItems: {
      display: 'flex',
      alignItems: 'center',
    },
  };
});

export type LanguageEngagementListItemCardProps = LanguageEngagementListItemFragment & {
  className?: string;
};

export const LanguageEngagementListItemCard: FC<LanguageEngagementListItemCardProps> = (
  props
) => {
  const classes = useStyles();
  const genSrc = () => `https://picsum.photos/id/${random(1, 2000)}/300/200`;
  const [pic, setPic] = useState(genSrc);
  const nextPic = () => setPic(genSrc());

  return (
    <Card className={clsx(classes.root, props.className)}>
      <CardActionAreaLink
        to={`/engagements/${props.id}`}
        className={classes.card}
      >
        <div className={classes.media}>
          <Picture source={pic} fit="cover" onError={nextPic} />
        </div>
        <CardContent className={classes.cardContent}>
          <Grid
            container
            direction="column"
            justify="space-between"
            spacing={1}
          >
            <Grid item>
              <Typography variant="h4">
                {props.language.value?.name.value}
              </Typography>
            </Grid>
            <Grid item>
              <Typography variant="body2" color="textSecondary">
                {props.id}
              </Typography>
            </Grid>
            <Grid item>
              <Typography variant="body2" color="primary">
                {'Location'}
              </Typography>
            </Grid>
            <Grid item>
              <KeyValProp label="Status" value={props.status} />
            </Grid>
            <Grid item>
              <Typography variant="body2">Products:</Typography>
            </Grid>
            <Grid item>
              <Typography
                variant="inherit"
                color="textSecondary"
                className={classes.centerItems}
              >
                <ScriptIcon />
                &nbsp;{'Product'}
              </Typography>
            </Grid>
            <Grid item>
              <Typography
                variant="body2"
                color="primary"
                className={classes.centerItems}
              >
                <EditInfoIcon />
                &nbsp;Edit Info
              </Typography>
            </Grid>
          </Grid>
          <div className={classes.rightContent}>
            <KeyValProp aria-hidden="true" />
            <div>
              <Typography variant="h1" align="right">
                {0}
              </Typography>
              <Typography variant="body2" color="primary" align="right">
                population
              </Typography>
            </div>
            <KeyValProp
              label="ESAD"
              value={props.completeDate.value}
              ValueProps={{ color: 'primary' }}
            />
          </div>
        </CardContent>
      </CardActionAreaLink>
    </Card>
  );
};

const KeyValProp = ({
  label,
  LabelProps,
  value,
  ValueProps,
  ...props
}: {
  label?: string;
  LabelProps?: TypographyProps;
  value?: string | null;
  ValueProps?: TypographyProps;
} & TypographyProps) => (
  <Typography variant="body2" {...props}>
    {label && value ? (
      <Typography variant="inherit" {...LabelProps}>
        {label}:&nbsp;
      </Typography>
    ) : null}
    <Typography variant="inherit" color="textSecondary" {...ValueProps}>
      {value}
    </Typography>
  </Typography>
);

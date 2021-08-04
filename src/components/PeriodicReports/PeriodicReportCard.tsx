import {
  Card,
  CardActions,
  Divider,
  makeStyles,
  Typography,
} from '@material-ui/core';
import { AssignmentOutlined, BarChart, ShowChart } from '@material-ui/icons';
import React from 'react';
import { ReportType } from '../../api';
import { simpleSwitch } from '../../util';
import { FileActionsContextProvider } from '../files/FileActions';
import { HugeIcon } from '../Icons';
import { ButtonLink, CardActionAreaLink } from '../Routing';
import { SecuredPeriodicReportFragment } from './PeriodicReport.generated';
import { ReportInfo } from './ReportInfo';

const useStyles = makeStyles(({ spacing }) => ({
  root: {
    flex: 1,
    height: '100%',
    display: 'flex',
    flexDirection: 'column',
    position: 'relative',
    outline: 'none',
  },
  topArea: {
    flex: 1,
    display: 'flex',
    justifyContent: 'space-evenly',
    alignItems: 'flex-start',
    padding: spacing(3, 4),
  },
  icon: {
    marginRight: spacing(4),
  },
  rightContent: {
    flex: 1,
    alignSelf: 'flex-start',
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'space-evenly',
  },
  relevantReports: {
    display: 'flex',
  },
  relevantReport: {
    display: 'flex',
    flexDirection: 'column',
  },
}));

export interface PeriodicReportCardProps {
  type: ReportType;
  dueCurrently?: SecuredPeriodicReportFragment;
  dueNext?: SecuredPeriodicReportFragment;
  disableIcon?: boolean;
}

const PeriodicReportCardInContext = (props: PeriodicReportCardProps) => {
  const { type, dueCurrently, dueNext, disableIcon } = props;
  const classes = useStyles();
  const link = `reports/${type.toLowerCase()}`;

  return (
    <Card tabIndex={-1} className={classes.root}>
      <CardActionAreaLink to={link} className={classes.topArea}>
        {!disableIcon && (
          <HugeIcon
            icon={simpleSwitch(type, {
              Narrative: AssignmentOutlined,
              Financial: ShowChart,
              Progress: BarChart,
            })}
            className={classes.icon}
          />
        )}

        <div className={classes.rightContent}>
          <Typography color="initial" variant="h4" paragraph>
            {`${type} Reports`}
          </Typography>
          <div className={classes.relevantReports}>
            <ReportInfo
              title="Current"
              report={dueCurrently}
              className={classes.relevantReport}
            />
            <Divider orientation="vertical" flexItem variant="middle" />
            <ReportInfo
              title="Next"
              report={dueNext}
              className={classes.relevantReport}
            />
          </div>
        </div>
      </CardActionAreaLink>
      <CardActions>
        <ButtonLink color="primary" to={link}>
          View Reports
        </ButtonLink>
      </CardActions>
    </Card>
  );
};

export const PeriodicReportCard = (props: PeriodicReportCardProps) => (
  <FileActionsContextProvider>
    <PeriodicReportCardInContext {...props} />
  </FileActionsContextProvider>
);

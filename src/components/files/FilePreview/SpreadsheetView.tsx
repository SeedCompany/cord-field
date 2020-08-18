import { Grid, makeStyles, Tab, Tabs } from '@material-ui/core';
import React, { FC, useEffect } from 'react';
import { useFileActions } from '../FileActions';

const useStyles = makeStyles(({ spacing }) => {
  const backgroundColor = '#e6e6e6';
  const borderColor = '#d8d8df';
  const headerBorderColor = '#d1cacb';
  const headerStyles = {
    backgroundColor: backgroundColor,
    border: `1px solid ${headerBorderColor}`,
    borderWidth: '0px 1px 1px 0px',
    textAlign: 'center',
  };
  return {
    sheetHeader: {
      marginBottom: spacing(2),
    },
    container: {
      '& h2': {
        fontFamily: 'Arial',
        fontWeight: 'normal',
        textAlign: 'center',
      },
      '& table': {
        border: `1px solid ${headerBorderColor}`,
        borderCollapse: 'collapse',
        borderSpacing: '0px',
        borderWidth: '1px 0px 0px 1px',
        fontFamily: 'Arial',
      },
      '& th': {
        ...headerStyles,
      },
      '& .table-header': {
        ...headerStyles,
      },
      '& td': {
        backgroundColor: 'white',
        border: `1px solid ${borderColor}`,
        borderWidth: '0px 1px 1px 0px',
        padding: '2px 4px',
      },
    },
  };
});

export interface SheetData {
  name: string;
  html: JSX.Element | JSX.Element[];
}

interface SpreadSheetViewProps {
  data: SheetData[];
}

export const SpreadsheetView: FC<SpreadSheetViewProps> = (props) => {
  const classes = useStyles();
  const { data } = props;
  const { previewPage, setPreviewPage } = useFileActions();

  useEffect(() => {
    return () => setPreviewPage(1);
  }, [setPreviewPage]);

  function a11yProps(index: number) {
    return {
      id: `sheet-tab-${index}`,
      'aria-controls': `sheet-tabpanel-${index}`,
    };
  }

  const handleChange = (_: React.ChangeEvent<unknown>, value: number) => {
    setPreviewPage(value + 1);
  };

  const activeTab = previewPage - 1;
  return data.length === 1 ? (
    <div className={classes.container}>{data[0].html}</div>
  ) : (
    <Grid item>
      <Tabs
        value={activeTab}
        onChange={handleChange}
        aria-label="Spreadsheet tabs"
      >
        {data.map((sheet, index) => (
          <Tab key={sheet.name} label={sheet.name} {...a11yProps(index)} />
        ))}
      </Tabs>
      {data.map((sheet, index) => {
        return (
          <div
            key={sheet.name}
            aria-labelledby={`sheet-tab-${index}`}
            className={classes.container}
            hidden={activeTab !== index}
            id={`sheet-tabpanel-${index}`}
            role="tabpanel"
          >
            {activeTab === index ? sheet.html : null}
          </div>
        );
      })}
    </Grid>
  );
};

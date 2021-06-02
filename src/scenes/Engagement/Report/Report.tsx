import { useQuery } from '@apollo/client';
import {
  Breadcrumbs,
  Button,
  Grid,
  makeStyles,
  Typography,
} from '@material-ui/core';
import { PublishSharp } from '@material-ui/icons';
import { groupBy, keys } from 'lodash';
import React, { FC, MouseEvent } from 'react';
import { useDropzone } from 'react-dropzone';
import { Helmet } from 'react-helmet-async';
import { useParams } from 'react-router-dom';
import { getProductType } from '../../../api';
import { Breadcrumb } from '../../../components/Breadcrumb';
import { useDownloadFile } from '../../../components/files/hooks';
import { useFiscalQuarterFormater } from '../../../components/Formatters';
import { useListQuery } from '../../../components/List';
import { useUploadPeriodicReport } from '../../../components/PeriodicReportSummaryCard';
import { ProductCardFragment } from '../../../components/ProductCard/ProductCard.generated';
import { ProjectBreadcrumb } from '../../../components/ProjectBreadcrumb';
import { CalendarDate } from '../../../util';
import { ProductListDocument } from '../../Products/List/ProductList.generated';
import { ProgressReportsDocument } from '../Reports/EngagementReports.generated';
import { ProductsTable } from './ProductsTable';

const useStyles = makeStyles(({ spacing, breakpoints }) => ({
  root: {
    flex: 1,
    overflowY: 'auto',
    padding: spacing(4),
    maxWidth: breakpoints.values.md,
  },
  header: {
    display: 'flex',
    maxWidth: breakpoints.values.md,
    marginTop: spacing(2.5),
    marginBottom: spacing(2.5),
  },
  actions: {
    display: 'flex',
    justifyContent: 'flex-end',
  },
  fileBtn: {
    maxWidth: '118px',
    paddingLeft: spacing(0),
    paddingRight: spacing(0),
    display: 'inline-flex',
    justifyContent: 'flex-start',
    marginTop: spacing(1),
    marginBottom: spacing(2.5),
  },
  table: {
    padding: spacing(4, 0),
  },
}));

export const Report: FC = () => {
  const classes = useStyles();
  const { projectId = '', engagementId = '', reportId = '' } = useParams();
  const { data } = useQuery(ProgressReportsDocument, {
    variables: {
      projectId,
      engagementId,
    },
  });
  const list = useListQuery(ProductListDocument, {
    variables: {
      engagement: engagementId,
    },
    listAt: (data) =>
      data.engagement.__typename === 'LanguageEngagement'
        ? data.engagement.products
        : {
            items: [] as ProductCardFragment[],
            total: 0,
            hasMore: false,
            canRead: true,
            canCreate: false,
          },
  });
  const fiscalQuarterFormatter = useFiscalQuarterFormater();
  const uploadPeriodicReport = useUploadPeriodicReport();
  const downloadFile = useDownloadFile();

  const dueReport = data?.engagement.progressReports.items.find(
    (report) => +report.start === +CalendarDate.now().startOf('quarter')
  );
  const reportFile = dueReport?.reportFile.value;

  const onVersionUpload = (files: File[]) => {
    if (dueReport) {
      uploadPeriodicReport({ files, parentId: dueReport.id });
    }
  };

  const {
    getRootProps,
    getInputProps,
    open: openFileBrowser,
  } = useDropzone({
    onDrop: onVersionUpload,
    noClick: true,
  });

  const uploadOrDownloadReportFile = (event: MouseEvent<HTMLButtonElement>) => {
    event.preventDefault();
    if (reportFile) {
      void downloadFile(reportFile);
    } else {
      openFileBrowser();
    }
  };

  const reports = data?.engagement.progressReports;

  const report = reports?.items.find((item) => item.id === reportId);

  if (data?.engagement.__typename !== 'LanguageEngagement') {
    return null;
  }

  const engagement = data.engagement.language.value;
  const engagementName = engagement?.displayName.value;
  const products = list.data?.items;

  const groupedProducts = groupBy(products, (product) =>
    getProductType(product)
  );

  return (
    <div className={classes.root} {...getRootProps()}>
      <input {...getInputProps()} name="report_file_uploader" />

      <Helmet title={` - ${data.project.name.value ?? 'A Project'}`} />
      <Breadcrumbs>
        <ProjectBreadcrumb data={data.project} />
        {engagementName && (
          <Breadcrumb
            to={`/projects/${data.project.id}/engagements/${data.engagement.id}`}
          >
            {engagementName}
          </Breadcrumb>
        )}
        <Breadcrumb to=".">Progress Report</Breadcrumb>
      </Breadcrumbs>

      <header className={classes.header}>
        <Typography variant="h2">
          {fiscalQuarterFormatter(report?.start)} Progress Report
        </Typography>
      </header>

      <div className={classes.actions}>
        <Button
          color="primary"
          className={classes.fileBtn}
          startIcon={<PublishSharp />}
          onClick={uploadOrDownloadReportFile}
        >
          Upload File
        </Button>
      </div>

      <Grid container direction="column" spacing={3}>
        {keys(groupedProducts).map((productType) => (
          <Grid key={productType} item>
            <ProductsTable
              products={groupedProducts[productType] as ProductCardFragment[]}
            />
          </Grid>
        ))}
      </Grid>
    </div>
  );
};

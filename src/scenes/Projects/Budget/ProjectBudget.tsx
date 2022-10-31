import { useQuery } from '@apollo/client';
import { Box, Breadcrumbs, Grid, Skeleton, Typography } from '@mui/material';
import { Helmet } from 'react-helmet-async';
import { Breadcrumb } from '../../../components/Breadcrumb';
import { DefinedFileCard } from '../../../components/DefinedFileCard';
import { Error } from '../../../components/Error';
import { FileActionsContextProvider } from '../../../components/files/FileActions';
import { useCurrencyFormatter } from '../../../components/Formatters/useCurrencyFormatter';
import { ContentContainer as Content } from '../../../components/Layout/ContentContainer';
import { ProjectBreadcrumb } from '../../../components/ProjectBreadcrumb';
import { useProjectId } from '../useProjectId';
import {
  ProjectBudgetDocument,
  UpdateProjectBudgetUniversalTemplateDocument,
} from './ProjectBudget.graphql';
import { ProjectBudgetRecords } from './ProjectBudgetRecords';

export const ProjectBudget = () => {
  const { projectId, changesetId } = useProjectId();
  const formatCurrency = useCurrencyFormatter();

  const { data, loading, error } = useQuery(ProjectBudgetDocument, {
    variables: { id: projectId, changeset: changesetId },
  });

  const budget = data?.project.budget;

  const template = budget?.value?.universalTemplateFile;

  return (
    <Content
      sx={{
        overflowY: 'auto',
      }}
    >
      <Helmet title={`Budget - ${data?.project.name.value ?? 'A Project'}`} />
      {error ? (
        <Error error={error}>
          {{
            NotFound: "Could not find project's field budget",
            Default: "Error loading project's field budget",
          }}
        </Error>
      ) : budget?.canRead === false ? (
        <Error show>
          You do not have permission to view this project's field budget
        </Error>
      ) : (
        <>
          <Breadcrumbs>
            <ProjectBreadcrumb data={data?.project} />
            <Breadcrumb to=".">Field Budget</Breadcrumb>
          </Breadcrumbs>
          <Box
            sx={{
              my: 3,
              mr: 4,
              ml: 0,
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'flex-end',
              maxWidth: 'md',
            }}
          >
            <Typography variant="h2">Budget</Typography>
            <Typography
              variant="h3"
              sx={
                loading
                  ? {
                      width: '10%',
                    }
                  : undefined
              }
            >
              {!loading && budget?.value?.total != null ? (
                `Total: ${formatCurrency(budget.value.total)}`
              ) : (
                <Skeleton width="100%" />
              )}
            </Typography>
          </Box>
          <Box sx={{ maxWidth: 'md', mt: 0, mr: 4, mb: 4, ml: 0 }}>
            <Grid container direction="column" spacing={3}>
              <Grid item>
                <ProjectBudgetRecords loading={loading} budget={budget} />
              </Grid>
              {!budget?.value || !template || !template.canRead ? null : (
                <FileActionsContextProvider>
                  <Grid item xs={6}>
                    <DefinedFileCard
                      label="Universal Template"
                      parentId={budget.value.id}
                      uploadMutationDocument={
                        UpdateProjectBudgetUniversalTemplateDocument
                      }
                      resourceType="budget"
                      securedFile={template}
                    />
                  </Grid>
                </FileActionsContextProvider>
              )}
            </Grid>
          </Box>
        </>
      )}
    </Content>
  );
};

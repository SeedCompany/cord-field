import { Paper, Stack, Typography } from '@mui/material';
import { Helmet } from 'react-helmet-async';
import { useIsMobile } from '~/common';
import { LanguageColumns } from '~/components/LanguageDataGrid';
import { EntityList as LanguagesList } from '~/components/List';
import { SensitivityIcon } from '~/components/Sensitivity';
import { LanguageGrid } from './LanguageGrid';
import { LanguagesDocument } from './languages.graphql';

export const LanguageList = () => {
  const isMobile = useIsMobile();
  return (
    <Stack sx={{ flex: 1, padding: { xs: 2, md: 4 }, pt: 2 }}>
      <Helmet title="Languages" />
      <Stack component="main" sx={{ flex: 1 }}>
        <Typography variant="h2" paragraph>
          Languages
        </Typography>
        {isMobile ? (
          <LanguagesList
            query={LanguagesDocument}
            listAt={(data) => data.languages}
            columns={LanguageColumns}
            sortDefault={{
              field: LanguageColumns[0]!.field,
              direction: 'ASC',
            }}
            defaultSecondaryField="ethnologue.code"
            primary={(language) => language.displayName.value}
            to={(language) => `/languages/${language.id}`}
            avatar={(language) => (
              <SensitivityIcon value={language.sensitivity} />
            )}
          />
        ) : (
          // ai edge-case The grid (and its `useDataGridSource`) must only mount on desktop.
          <Stack sx={{ flex: 1, containerType: 'size' }}>
            <Paper
              sx={{
                flex: 1,
                minHeight: 375,
                maxHeight: '100cqh',
                width: 'min-content',
                maxWidth: '100cqw',
              }}
            >
              <LanguageGrid />
            </Paper>
          </Stack>
        )}
      </Stack>
    </Stack>
  );
};

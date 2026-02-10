import { Edit } from '@mui/icons-material';
import {
  Box,
  IconButton,
  Skeleton,
  Stack,
  Tooltip,
  Typography,
} from '@mui/material';
import { asDate, canEditAny } from '~/common';
import { useDialog } from '~/components/Dialog';
import {
  DisplaySimpleProperty,
  DisplaySimplePropertyProps,
} from '~/components/DisplaySimpleProperty';
import { FormattedDate, useNumberFormatter } from '~/components/Formatters';
import { TabPanelContent } from '~/components/Tabs';
import { EditLanguage } from '~/scenes/Languages/Edit';
import { FirstScripture } from '../../FirstScripture';
import { LanguageProfileFragment } from './LanguageDetailProfile.graphql';

interface LanguageDetailProfileProps {
  language: LanguageProfileFragment;
}

export const LanguageDetailProfile = ({
  language,
}: LanguageDetailProfileProps) => {
  const [editLanguageState, editLanguage] = useDialog();
  const formatNumber = useNumberFormatter();

  const canEditAnyFields = canEditAny(language);
  const {
    ethnologue,
    signLanguageCode,
    isSignLanguage,
    displayNamePronunciation,
    registryOfLanguageVarietiesCode,
    population,
    sponsorStartDate,
    sponsorEstimatedEndDate,
  } = language ?? {};

  return (
    <TabPanelContent
      sx={(theme) => ({
        display: 'flex',
        justifyContent: 'space-between',
        width: theme.breakpoints.values.md,
      })}
    >
      <Stack
        sx={{
          p: 2,
          gap: 2,
        }}
      >
        <DisplayProperty
          label="Pronunciation Guide"
          value={displayNamePronunciation?.value}
          loading={!language}
        />
        <DisplayProperty
          label="Ethnologue Name"
          value={ethnologue?.name.value}
          loading={!language}
        />
        {isSignLanguage?.value && signLanguageCode?.value ? (
          <DisplayProperty
            label="Sign Language Code"
            value={signLanguageCode.value}
            loading={!language}
          />
        ) : (
          <DisplayProperty
            label="Ethnologue Code"
            value={ethnologue?.code.value}
            loading={!language}
          />
        )}
        <DisplayProperty
          label="Provisional Code"
          value={ethnologue?.provisionalCode.value}
          loading={!language}
        />
        <DisplayProperty
          label="Registry of Language Varieties (ROLV) Code"
          value={registryOfLanguageVarietiesCode?.value}
          loading={!language}
        />
        <DisplayProperty
          label="Population"
          value={formatNumber(population?.value)}
          loading={!language}
        />
        <DisplayProperty
          label="Ethnologue Population"
          value={formatNumber(ethnologue?.population.value)}
          loading={!language}
        />
        <DisplayProperty
          label="Sponsor Start Date"
          value={<FormattedDate date={sponsorStartDate?.value} />}
          loading={!language}
        />
        <DisplayProperty
          label="Sponsor Estimated End Fiscal Year"
          value={asDate(sponsorEstimatedEndDate?.value)?.fiscalYear}
          loading={!language}
        />
        {language && <FirstScripture data={language} />}
      </Stack>
      <Box sx={{ p: 1 }}>
        {canEditAnyFields ? (
          <Tooltip title="Edit Language">
            <IconButton aria-label="edit language" onClick={editLanguage}>
              <Edit />
            </IconButton>
          </Tooltip>
        ) : null}
      </Box>
      <EditLanguage language={language} {...editLanguageState} />
    </TabPanelContent>
  );
};

const DisplayProperty = (props: DisplaySimplePropertyProps) =>
  !props.value && !props.loading ? null : (
    <DisplaySimpleProperty
      variant="body1"
      {...{ component: 'div' }}
      {...props}
      loading={
        props.loading ? (
          <>
            <Typography variant="body2">
              <Skeleton width="10%" />
            </Typography>
            <Typography variant="body1">
              <Skeleton width="40%" />
            </Typography>
          </>
        ) : null
      }
      LabelProps={{
        color: 'textSecondary',
        variant: 'body2',
        ...props.LabelProps,
      }}
      ValueProps={{
        color: 'textPrimary',
        ...props.ValueProps,
      }}
    />
  );

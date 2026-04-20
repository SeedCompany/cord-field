import { Stack } from '@mui/material';
import { asDate } from '~/common';
import {
  DisplaySimpleProperty,
  DisplaySimplePropertyProps,
} from '~/components/DisplaySimpleProperty';
import { FormattedDate, useNumberFormatter } from '~/components/Formatters';
import { TabPanelContent } from '~/components/Tabs';
import { FirstScripture } from '../../FirstScripture';
import { LanguageProfileFragment } from './LanguageDetailProfile.graphql';

interface LanguageDetailProfileProps {
  language?: LanguageProfileFragment;
}

export const LanguageDetailProfile = ({
  language,
}: LanguageDetailProfileProps) => {
  const formatNumber = useNumberFormatter();

  const {
    ethnologue,
    signLanguageCode,
    isSignLanguage,
    displayNamePronunciation,
    registryOfLanguageVarietiesCode,
    population,
    sponsorStartDate,
    sponsorEstimatedEndDate,
    usesAIAssistance,
    isAvailableForReporting,
  } = language ?? {};

  return (
    <TabPanelContent
      sx={(theme) => ({
        display: 'flex',
        justifyContent: 'space-between',
        maxWidth: theme.breakpoints.values.md,
        width: '100%',
      })}
    >
      <Stack
        sx={{
          p: 2,
          gap: 2,
          width: '100%',
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
        <DisplayProperty
          label="Uses AI assistance"
          value={usesAIAssistance?.value ? 'Yes' : 'No'}
          loading={!language}
        />
        <DisplayProperty
          label="Available for Reporting"
          value={isAvailableForReporting?.value ? 'Yes' : 'No'}
          loading={!language}
        />
        {language && <FirstScripture data={language} />}
      </Stack>
    </TabPanelContent>
  );
};

const DisplayProperty = (props: DisplaySimplePropertyProps) =>
  !props.value && !props.loading ? null : (
    <DisplaySimpleProperty
      variant="body1"
      {...{ component: 'div' }}
      {...props}
      loadingWidth="20ch"
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

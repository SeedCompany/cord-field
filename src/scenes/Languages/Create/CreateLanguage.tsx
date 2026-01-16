import { useMutation } from '@apollo/client';
import { useSnackbar } from 'notistack';
import { Except } from 'type-fest';
import { addItemToList } from '~/api';
import { CreateLanguage as CreateLanguageType } from '~/api/schema.graphql';
import { CalendarDate } from '~/common';
import { ButtonLink } from '../../../components/Routing';
import { LanguageForm, LanguageFormProps } from '../LanguageForm';
import { CreateLanguageDocument } from './CreateLanguage.graphql';

export type CreateLanguageProps = Except<
  LanguageFormProps<CreateLanguageType>,
  'onSubmit'
>;
export const CreateLanguage = (props: CreateLanguageProps) => {
  const [createLang] = useMutation(CreateLanguageDocument, {
    update: addItemToList({
      listId: 'languages',
      outputToItem: (data) => data.createLanguage.language,
    }),
  });
  const { enqueueSnackbar } = useSnackbar();

  return (
    <LanguageForm<CreateLanguageType>
      title="Create Language"
      {...props}
      onSubmit={async ({ sponsorEstimatedEndFY, ...rest }) => {
        const res = await createLang({
          variables: {
            input: {
              sponsorEstimatedEndDate: CalendarDate.fiscalYearEndToCalendarDate(
                sponsorEstimatedEndFY
              ),
              ...rest,
            },
          },
        });

        const { language } = res.data!.createLanguage;

        enqueueSnackbar(`Created language: ${language.name.value}`, {
          variant: 'success',
          action: () => (
            <ButtonLink color="inherit" to={`/languages/${language.id}`}>
              View
            </ButtonLink>
          ),
        });

        return language;
      }}
    />
  );
};

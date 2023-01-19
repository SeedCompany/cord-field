import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogProps,
  DialogTitle,
  Typography,
} from '@mui/material';
import { useSession } from '../../../components/Session';

export const InstructionsDialog = (props: DialogProps) => {
  const { session } = useSession();
  const roles = new Set(session?.roles.value);

  return (
    <Dialog {...props} aria-labelledby="instructions-dialog-title">
      <DialogTitle id="instructions-dialog-title">Instructions</DialogTitle>
      <DialogContent dividers sx={{ ul: { paddingInlineStart: 3 } }}>
        <Typography paragraph>
          The Quarterly Field Report is used to manage for quality results and
          inform Investors. Each section here currently informs our investors on
          what the team has been doing, how God’s Word is impacting the lives of
          the language community, and the language progress.
        </Typography>
        <Typography paragraph>
          <b>
            Please ensure ALL information is scrubbed for security &
            sensitivity.
          </b>
        </Typography>
        <Typography paragraph>
          After reviewing and filling out all sections for your role, submit or
          approve the Quarterly Report under <i>Final Details</i>.
        </Typography>
        <Typography component="h3" variant="h4" id="sensitivity-checklist">
          Sensitivity Checklist
        </Typography>
        <ul aria-labelledby="sensitivity-checklist">
          <li>Replace Personal and Place Names with Pseudonyms</li>
          <li>Remove contact information</li>
          <li>Remove or make generic any other identifying information</li>
        </ul>

        <Typography component="h2" variant="h3" paragraph>
          Sections / Steps
        </Typography>
        <Typography component="h3" variant="h4" id="team-news">
          Team News
        </Typography>
        <ul aria-labelledby="team-news">
          <li>
            Please write a succinct reflection of the translation activities and
            what the team has been doing over the last quarter.
          </li>
          {roles.has('ProjectManager') && (
            <>
              <li>
                Write as if you were speaking to an <i>Investor</i>.
              </li>
              <li>
                The communications team will edit grammar prior to publishing
                and sending to the <i>Investor</i>.
              </li>
            </>
          )}
        </ul>
        {roles.has('ProjectManager') && (
          <>
            <Typography component="h3" variant="h4" id="community-story">
              Story
            </Typography>
            <ul aria-labelledby="community-story">
              <li>
                Review and scrub the <i>Field Partner</i> and <i>Translation</i>{' '}
                variants.
              </li>
              <li>
                Please provide any additional context, correction, or clarity on
                the story submitted by the <i>Field Partner</i> - write out
                acronyms, clarify names & their role with the project, and add
                context that was assumed in the Partners submission.
              </li>
              <li>
                This information will provide context for the{' '}
                <i>Communications Writer</i> to write and edit the story.
              </li>
              <li>
                No input is needed if the story is clear in the{' '}
                <i>Field Partner</i> or
                <i>Translation</i> variant.
              </li>
            </ul>
            <Typography component="h3" variant="h4" id="variance-explanation">
              Explanation of Progress
            </Typography>
            <ul aria-labelledby="variance-explanation">
              <li>
                Required
                <ul>
                  <li>
                    Please select an appropriate reflection on the status of the
                    project, including selection of a reason for languages that
                    are behind/delayed or ahead of schedule.
                  </li>
                  <li>
                    This selection will provide context for the <i>Investor</i>{' '}
                    (the reason selected will be appropriately worded for the{' '}
                    <i>Investor</i> to give understanding while honoring the
                    translation team and <i>Field Partner</i>)
                  </li>
                </ul>
              </li>
              <li>
                Optional Comments
                <ul>
                  <li>
                    Provide any additional context that would be helpful for{' '}
                    <i>Field Leadership</i>, peers, and/or{' '}
                    <i>Investor Representatives</i> to understand why the
                    language is <i>Behind/Delayed, On-Time, or Ahead</i>
                  </li>
                </ul>
              </li>
            </ul>
          </>
        )}

        <Typography component="h3" variant="h4" id="workflow">
          Submit Report
        </Typography>
        <ul aria-labelledby="workflow">
          <li>
            Final Notes
            <ul>
              <li>
                This section is a place to capture any additional information
                not covered in the Quarterly Report.
              </li>
              <li>
                It's for internal use only. This could be what was previously
                sent in an email.
              </li>
            </ul>
          </li>
          <li>
            Submit Button(s)
            <ul>
              <li>
                Select the most appropriate button once you have completed the
                Quarterly Report.
              </li>
              <li>
                For example, if the report is <i>In Review</i>:
                <ul>
                  <li>
                    Select <i>Approve</i> once you have completed your review
                    and updates to the Quarterly Report
                  </li>
                  <li>
                    Select <i>Needs Translation</i> if the report was not
                    translated into English.
                  </li>
                  <li>
                    Select <i>Request Changes</i> if the report is missing
                    information from the <i>Field Partner</i>
                  </li>
                </ul>
              </li>
            </ul>
          </li>
        </ul>
      </DialogContent>
      <DialogActions>
        <Button
          onClick={() => props.onClose?.({}, 'backdropClick')}
          variant="text"
          color="secondary"
        >
          Close
        </Button>
      </DialogActions>
    </Dialog>
  );
};

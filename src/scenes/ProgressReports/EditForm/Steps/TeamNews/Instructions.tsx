import { Typography } from '@mui/material';
import { InstructionText } from '../PromptVariant/InstructionText';

export const TeamNewsPartnerInstructions = () => (
  <InstructionText>
    <Typography variant="subtitle1">Audience - Investor</Typography>
    <ul>
      <li>
        Imagine you are updating a friend or respected leader who may not know
        much about bible translation
      </li>
    </ul>
    <Typography variant="subtitle1">
      Action - Scrub update for sensitive information on "High" sensitivity
      projects
    </Typography>
    <ul>
      <li>Personal Names, Place Names etc replaced with pseudonyms</li>
    </ul>
    <Typography variant="subtitle1">
      Answer - What did the translation team accomplish last quarter
    </Typography>
    <ul>
      <li>
        Provide 2-4 succinct sentences or bullets on what was accomplished last
        quarter (from Outcomes section 1)
        <Typography variant="subtitle2">Example:</Typography>
        <ol>
          <li>Drafting/Exegesis of Romans</li>
          <li>Consultant Check of Matthew</li>
          <li>Paratext Training</li>
          <li>Community Testing of Romans</li>
        </ol>
      </li>
    </ul>
  </InstructionText>
);

export const TeamNewsFieldOperationsInstructions = () => (
  <InstructionText>
    <Typography variant="subtitle1">Audience - Investor</Typography>
    <ul>
      <li>Validate update is appropriate to share with the Investor</li>
    </ul>
    <Typography variant="subtitle1">Action - Review</Typography>
    <ul>
      <li>
        Review Partner update to ensure all sensitive information is scrubbed.
        Provide clarity on any abbreviations or context..
      </li>
    </ul>
    <Typography variant="subtitle1">
      Answer - Is the Partner Update clear & informative?
    </Typography>
    <ul>
      <li>
        Is additional information needed to inform the investor of what was
        accomplished?
      </li>
    </ul>
  </InstructionText>
);

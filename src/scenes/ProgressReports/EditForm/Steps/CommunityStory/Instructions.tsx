import { Typography } from '@mui/material';
import { InstructionText } from '../PromptVariant/InstructionText';

export const StoryPartnerText = () => (
  <InstructionText>
    <Typography variant="subtitle1">Audience - Investor</Typography>
    <ul>
      <li>
        Imagine you are telling a friend or respected leader a story about the
        selected prompt.
      </li>
    </ul>
    <Typography variant="subtitle1">
      Action - Scrub update for sensitive information, and include clarifying
      details
    </Typography>
    <ul>
      <li>Personal Names, Place Names, etc. are replaced with pseudonyms</li>
      <li>Acronyms are spelled out</li>
      <li>Events are clearly explained rather than alluded to</li>
    </ul>
    <Typography variant="subtitle1">
      Answer - Write an answer to the selected prompt that communicates how this
      work is impacting the community
    </Typography>
    <ul>
      <li>
        Please write a few paragraphs explaining your answer to the selected
        prompt
      </li>
    </ul>
    <Typography variant="subtitle1">Example:</Typography>
    <ul>
      <li>
        This is a testimony of a young man named Sa’adu Alhassan at Mareveni
        village that read the printed material of the book Deuteronomy. He said
        these books were given to me as gift by my friend; this is a book that
        is written in our language, so I should try to read a part of the book.
        One day in the afternoon I take the book so I can see what is written in
        the book, since I can read in my language, so I started reading, the
        first thing that encourage me in reading the book was that the words
        written are pure Tsikimba and natural as the Tsikimba man can speak,
        with that am so happy about that. In our conversation, I ask him which
        portion of the Bible you read. Though he is not able to mention the name
        of the book but he put a mark in the place, so he showed me the place
        and I notice that he read the book of Deuteronomy chapter 19:20-21. As
        we continue, I ask him what was the amazing thing you saw in the potion
        you read He said, the type of judgment that God expect from us. This is
        the potion in Tsikimba: \v 20 Ama a ɗa a buwai vi a ka pana ta̱ ukuna vi
        kpam a pana uwonvo, a ka doku kpam a yain icun i tsicingi tsu nala asuvu
        a ɗe wa. \v 21 Kotsu i pana asuvayali wa. Mavura mi ma woko ta̱ uma a una̱
        u uma, keshi a una̱ u keshi, kanga a una̱ u kanga, kukere a una̱ u kukere,
        kune a una̱ u kune. {'>'}
        {'>'} In English 20 And the rest †shall hear and fear, and shall never
        again commit any such evil among you. 21 †Your eye shall not pity. †It
        shall be life for life eye for eye, tooth for tooth, hand for hand, foot
        for foot. At the end of our conversation I make him to understand the
        word you read are the word of God, so if you continue reading you will
        see more amazing thing and you will know more about God. I also gave him
        more books to read
      </li>
    </ul>
  </InstructionText>
);

export const StoryFieldOperationsText = () => (
  <InstructionText>
    <Typography variant="subtitle1">Audience - Communication Writer</Typography>
    <ul>
      <li>
        Remember that they often do not have the same context and information
        that you do when reading the story
      </li>
    </ul>
    <Typography variant="subtitle1">
      Action - Scrub update for sensitive information, and include clarifying
      details
    </Typography>
    <ul>
      <li>
        Review and scrub the Field Partner and Translation variants; Personal
        Names, Place Names, etc. are replaced with pseudonyms
      </li>
      <li>Acronyms are spelled out</li>
      <li>Events are clearly explained rather than alluded toos</li>
    </ul>
    <Typography variant="subtitle1">
      Answer - Write an answer to the selected prompt that communicates how this
      work is impacting the community
    </Typography>
    <ul>
      <li>
        Provide any additional context, correction, or clarity on the story
        submitted by the Field Partner - write out acronyms, clarify names &
        their role with the project, and add context that was assumed in the
        Partners submission.
      </li>
      <li>
        This information will provide context for the Communications Writer to
        write and edit the story
      </li>
    </ul>
    <Typography variant="subtitle2">Example:</Typography>
    <ul>
      <li>
        Sa'adu is one of the villagers in the village the team works in
        (Mareveni). His friend's name is Luke. Luke is the son of the lead
        translator.
      </li>
    </ul>
  </InstructionText>
);

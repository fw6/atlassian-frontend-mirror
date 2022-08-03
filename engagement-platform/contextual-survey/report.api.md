## API Report File for "@atlaskit/contextual-survey"

> Do not edit this file. It is a report generated by [API Extractor](https://api-extractor.com/).

```ts
/// <reference types="react" />

import { ReactNode } from 'react';

export declare const ContextualSurvey: ({
  question,
  statement,
  onDismiss,
  onSubmit,
  onMailingListAnswer,
  getUserHasAnsweredMailingList,
  textLabel,
  textPlaceholder,
}: Props) => JSX.Element;

export declare enum DismissTrigger {
  AutoDismiss = 'AUTO_DISMISS',
  Manual = 'MANUAL',
  Finished = 'FINISHED',
  Unmount = 'UNMOUNT',
}

declare type FormValues = {
  feedbackScore: number;
  canContact: boolean;
  writtenFeedback: string;
};

export declare type OnDismissArgs = {
  trigger: DismissTrigger;
};

declare interface Props {
  /** Optional statement, to be used in conjunction with the question for the survey
   * Example: "How strongly do you agree or disagree with this statement"
   */
  statement?: string;
  /** Question used for the survey
   * Example: "It is easy to find what I am looking for in Jira"
   */
  question: string;
  /** Accessible label text for the survey text area */
  textLabel?: string;
  /** Text placeholder for the survey text area
   * Example: "Tell us why"
   */
  textPlaceholder?: string;
  /** Callback that is triggered when the survey should be dismissed */
  onDismiss: (args: OnDismissArgs) => void;
  /** Gets whether user has already signed up to the Atlassian Research Group list.
   * If `true` is returned then the user will not be prompted to sign up to the Research Group.
   */
  getUserHasAnsweredMailingList: () => Promise<boolean>;
  /** Callback that is triggered when the survey is submitted, it will get the survey data as a parameter */
  onSubmit: (formValues: FormValues) => Promise<void>;
  /** Callback that is triggered when the user clicks 'Yes' or 'No' to sign up to the Atlassian Research Group */
  onMailingListAnswer: (answer: boolean) => Promise<void>;
}

declare type Props_2 = {
  /** Whether the form should be rendered */
  shouldShow: boolean;
  /** A function that returns Node to be rendered (`<ContextualSurvey/>`)
   * Using a function as child so that the child node does
   * not need to be evaluated if it is not mounted
   */
  children: () => ReactNode;
};

export declare function SurveyMarshal(props: Props_2): JSX.Element;

export {};
```
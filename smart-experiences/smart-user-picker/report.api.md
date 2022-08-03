## API Report File for "@atlaskit/smart-user-picker"

> Do not edit this file. It is a report generated by [API Extractor](https://api-extractor.com/).

```ts
import { ActionTypes } from '@atlaskit/user-picker';
import { Appearance } from '@atlaskit/user-picker';
import { AtlasKitSelectChange } from '@atlaskit/user-picker';
import { AtlaskitSelectValue } from '@atlaskit/user-picker';
import { DefaultValue } from '@atlaskit/user-picker';
import { Email } from '@atlaskit/user-picker';
import { EmailType } from '@atlaskit/user-picker';
import { EmailValidationResponse } from '@atlaskit/user-picker';
import { EmailValidator } from '@atlaskit/user-picker';
import { ExternalUser } from '@atlaskit/user-picker';
import { Group } from '@atlaskit/user-picker';
import { GroupHighlight } from '@atlaskit/user-picker';
import { GroupType } from '@atlaskit/user-picker';
import { HighlightRange } from '@atlaskit/user-picker';
import { InputActionTypes } from '@atlaskit/user-picker';
import { IntlShape } from 'react-intl-next';
import { isEmail } from '@atlaskit/user-picker';
import { isTeam } from '@atlaskit/user-picker';
import { isUser } from '@atlaskit/user-picker';
import { isValidEmail } from '@atlaskit/user-picker';
import { LoadOptions } from '@atlaskit/user-picker';
import { LozengeProps } from '@atlaskit/user-picker';
import { OnChange } from '@atlaskit/user-picker';
import { OnInputChange } from '@atlaskit/user-picker';
import { OnOption } from '@atlaskit/user-picker';
import { OnPicker } from '@atlaskit/user-picker';
import { Option as Option_2 } from '@atlaskit/user-picker';
import { OptionData } from '@atlaskit/user-picker';
import { OptionIdentifier } from '@atlaskit/user-picker';
import { PopupUserPickerProps } from '@atlaskit/user-picker';
import { Promisable } from '@atlaskit/user-picker';
import { default as React_2 } from 'react';
import { Target } from '@atlaskit/user-picker';
import { Team } from '@atlaskit/user-picker';
import { TeamHighlight } from '@atlaskit/user-picker';
import { TeamMember } from '@atlaskit/user-picker';
import { TeamType } from '@atlaskit/user-picker';
import { User } from '@atlaskit/user-picker';
import { UserHighlight } from '@atlaskit/user-picker';
import { UserPickerProps } from '@atlaskit/user-picker';
import { UserPickerState } from '@atlaskit/user-picker';
import { UserSource } from '@atlaskit/user-picker';
import { UserType } from '@atlaskit/user-picker';
import { Value } from '@atlaskit/user-picker';
import { WithAnalyticsEventsProps } from '@atlaskit/analytics-next';

export { ActionTypes };

export { Appearance };

export { AtlasKitSelectChange };

export { AtlaskitSelectValue };

declare interface BitbucketAttributes {
  /**
   * Identifies whether this is a public repository or not.
   */
  isPublicRepo?: boolean;
  /**
   * A list of bitbucket workspace Ids used within container result set and noted in analytics.
   */
  workspaceIds?: string[];
  /**
   * The users current email domain which may be used to boost the results for relevant users.
   */
  emailDomain?: string;
}

declare interface ConfluenceAttributes {
  /**
   * Identifies whether this user is a confluence guest
   */
  isEntitledConfluenceExternalCollaborator?: boolean;
}

declare interface Context {
  containerId?: string;
  contextType: string;
  objectId?: string;
  sessionId?: string;
  principalId?: string;
  childObjectId?: string;
  productKey: string;
  siteId: string;
  organizationId?: string;
  productAttributes?: ProductAttributes;
}

export { DefaultValue };

export { Email };

export { EmailType };

export { EmailValidationResponse };

export { EmailValidator };

export { ExternalUser };

declare type FilterOptions = (
  options: OptionData[],
  query: string,
) => OptionData[];

export declare const getUserRecommendations: (
  request: RecommendationRequest,
  intl: IntlShape,
) => Promise<OptionData[]>;

export { Group };

export { GroupHighlight };

export { GroupType };

export { HighlightRange };

export declare function hydrateDefaultValues(
  baseUrl: string | undefined,
  value: DefaultValue,
  productKey: string,
): Promise<DefaultValue>;

export { InputActionTypes };

export { isEmail };

export { isTeam };

export { isUser };

export { isValidEmail };

export { LoadOptions };

export { LozengeProps };

export { OnChange };

declare type OnEmpty = (query: string) => Promise<OptionData[]>;

declare type OnError = (
  error: any,
  request: RecommendationRequest,
) => Promise<OptionData[]> | void;

export { OnInputChange };

export { OnOption };

export { OnPicker };

declare type OnValueError = (
  error: any,
  defaultValue: DefaultValue,
) => Promise<OptionData[]> | void;

export { Option_2 as Option };

export { OptionData };

export { OptionIdentifier };

export { PopupUserPickerProps };

declare type ProductAttributes = BitbucketAttributes | ConfluenceAttributes;

export { Promisable };

export declare interface Props
  extends SmartProps,
    UserPickerProps,
    WithAnalyticsEventsProps {
  /**
   * The pre-selected values for the smart user picker. Supports only Users and Teams default value hydration.
   * If the `DefaultValue` contains only an `id` and `type` (it conforms to an `OptionIdentifier`)
   * then the values will be automatically hydrated.
   * If the value has a `name` then it is considered hydrated and will be ignored.
   * Uses Confluence and Jira if called from there, else uses Identity or Legion for teams. If a value could not be found, or there was
   * a network failure during the hydration, the value will be rendered with the label 'Unknown'. Else, if there were any other error
   * during default value hydration, no default values will be rendered, use `onValueError` to handle this.
   * `defaultValue` differs from `value` in that it sets the initial value then leaves the component 'uncontrolled'
   * whereas setting the `value` prop delegates responsibility for maintaining the value to the caller
   * (i.e. listen to `onChange`)
   */
  defaultValue?: DefaultValue;
  /**
   * Identifier for informing the server on where the user picker has been mounted.
   * Unlike User Picker, the fieldId in Smart User Picker is mandatory.
   * The server uses the fieldId to determine which model to utilize when
   * generating suggestions.
   * All fieldId's will be bucketed into a model that provides generic smart results,
   * except "assignee", "mentions" which are specifically trained for Jira Assignee and
   * @Mentions. For specifically trained models, please contact #help-smart-experiences.
   */
  fieldId: string;
}

export declare interface RecommendationRequest {
  baseUrl?: string;
  context: Context;
  maxNumberOfResults: number;
  query?: string;
  searchQueryFilter?: string;
  includeUsers?: boolean;
  includeGroups?: boolean;
  includeTeams?: boolean;
}

export declare const setSmartUserPickerEnv: (
  newEnv: 'prod' | 'local',
) => 'prod' | 'local';

declare interface SmartProps {
  /**
   * The base URL of the site eg: hello.atlassian.net
   */
  baseUrl?: string;
  /**
   * Hydrated user suggestions to show when the query is blank. If not provided, smart user picker
   *  will still provide a smart-ranked list of suggestions for blank queries. Please refer to @atlaskit/user-picker
   *  for OptionData type.
   */
  bootstrapOptions?: OptionData[];
  /**
   * Context information for analytics. Eg: if a user picker was put inside a comment, the childObjectId would be
   *  the ID of the comment. Optional, but please provide if available.
   */
  childObjectId?: string;
  /**
   * The container Id to identify context.
   *
   * e.g. Jira: projectId. Confluence: spaceId. Bitbucket: repositoryId.
   */
  containerId?: string;
  /**
   * Time to debounce the suggestions fetching (in milliseconds). Defaults to 150ms.
   */
  debounceTime?: number;
  /**
   * Function to transform options suggested by the server before showing to the user. Can be used to filter out suggestions.
   * The results of filterOptions are the results displayed in the suggestions UI.
   */
  filterOptions?: FilterOptions;
  /**
   * Whether to include groups in the resultset. Only supported for Confluence. @default false
   */
  includeGroups?: boolean;
  /**
   * Whether to include teams in the resultset. @default false
   */
  includeTeams?: boolean;
  /**
   * Whether to include users in the resultset. @default true
   */
  includeUsers?: boolean;
  /**
   * An identifier of the closest context object, e.g. issueId, pageId, pullRequestId.
   * Used for analytics. Optional, but please include if available.
   */
  objectId?: string;
  /**
   * Custom handler to give opportunity for caller to return list of options when server returns empty list.
   * this is called if server returns empty list. This will NOT be called if props.filterOptions returns empty list.
   */
  onEmpty?: OnEmpty;
  /**
   * Error handler for when the server fails to suggest users and returns with an error response.
   * `error`: the error.
   * `RecommendationRequest`: the original recommendationRequest containing the query and other search parameters.
   * This may be used to provide a fail over search direct to the product backend.
   * Helper fail over clients exist under /helpers.
   * Note that OnError results are filtered.
   */
  onError?: OnError;
  /**
   * Error handler used to provide OptionData[] values when the server fails to hydrate the `defaultValue` prop's values.
   */
  onValueError?: OnValueError;
  /**
   * Prefetch the list of suggested assignees before the user picker is focused.
   * WARNING: please consider carefully before deciding to prefetch your suggestions
   * as this will increase the load on the recommendations services (has caused HOTs).
   * Please give #help-smart-experiences a ballpark on the expected request volume.
   */
  prefetch?: boolean;
  /**
   * Id of the user interacting with the component.
   * If principalId is not provided, server will extract principalId from the context header, assuming that the user is logged in
   *  when making the request. @default “context”
   */
  principalId?: string;
  /**
   * Product-specific Attributes - you should pass in the attribute type that matches your current SupportedProduct.
   * Currently we support additional attributes (BitbucketAttributes) for bitbucket and (ConfluenceAttributes) for Confluence.
   */
  productAttributes?: ProductAttributes;
  /**
   * Product identifier. If you are an NPF, please ensure your product has been onboarded with
   *  Cross-product user-search @see https://developer.atlassian.com/cloud/cross-product-user-search/
   * If you are still waiting for CPUS, you can use the `people` productKey in the interim.
   */
  productKey: string;
  /**
   * Filter to be applied to the eventual query to CPUS for user suggestions.
   * Example:`account_status:"active" AND (NOT email_domain:"connect.atlassian.com")`
   *  will remove inactive users from the list of suggestions.
   */
  searchQueryFilter?: string;
  /**
   * Identifier for the product's tenant, also known as tenantId or cloudId
   */
  siteId: string;
  /**
   * Identifier for the organization in which to search for teams.
   */
  orgId?: string;
}

declare const SmartUserPickerWithIntlProvider: React_2.FunctionComponent<Props>;
export default SmartUserPickerWithIntlProvider;

export declare interface State {
  users: OptionData[];
  loading: boolean;
  closed: boolean;
  query: string;
  sessionId?: string;
  defaultValue?: DefaultValue;
  bootstrapOptions: OptionData[];
}

export { Target };

export { Team };

export { TeamHighlight };

export { TeamMember };

export { TeamType };

export { User };

export { UserHighlight };

export { UserPickerProps };

export { UserPickerState };

export { UserSource };

export { UserType };

export { Value };

export {};
```
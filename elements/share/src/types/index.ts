export type {
  ConfigResponse,
  ConfigResponseMode,
  ShareClient,
  ShareRequest,
  ShareResponse,
} from '../clients/ShareServiceClient';
export type { FormChildrenArgs } from './form';
export { ADMIN_NOTIFIED, OBJECT_SHARED } from './Flag';
export type { Flag, FlagType, MessageDescriptor } from './Flag';
export type {
  OriginAnalyticAttributes,
  OriginTracing,
  OriginTracingFactory,
  OriginTracingForSubSequentEvents,
  OriginTracingWithIdGenerated,
} from './OriginTracing';
export type { ProductId, ProductName } from './Products';
export type { ShareButtonStyle, TooltipPosition } from './ShareButton';
export type {
  DialogContentState,
  ShareContentState,
  ShareError,
} from './ShareContentState';
export type {
  DialogPlacement,
  DialogBoundariesElement,
  RenderCustomTriggerButton,
} from './ShareDialogWithTrigger';
export type { Comment, Content, MetaData } from './ShareEntities';
export type { User, UserWithEmail, UserWithId } from './User';
export type {
  ShareToSlackResponse,
  SlackTeamsResponse,
  SlackTeamsServiceResponse,
  SlackConversationsResponse,
  SlackConversationsServiceResponse,
  SelectOption,
  SlackContentState,
  Channel,
  SlackUser,
  Workspace,
  Team,
  Conversation,
} from './ShareToSlackEntities';
export type { ShareToSlackClient } from '../clients/ShareToSlackClient';

export type KeysOfType<T, TProp> = {
  [P in keyof T]: T[P] extends TProp ? P : never;
}[keyof T];

## API Report File for "@atlaskit/task-decision"

> Do not edit this file. It is a report generated by [API Extractor](https://api-extractor.com/).

```ts
/// <reference types="react" />

import { PureComponent } from 'react';
import { default as React_2 } from 'react';
import { ReactNode } from 'react';
import { ServiceConfig } from '@atlaskit/util-service-support';
import { WithAnalyticsEventsProps } from '@atlaskit/analytics-next';

export declare type Appearance = 'inline';

/**
 * Same as PubSub client types (don't want a direct dep though)
 */
export declare type ARI = string;

export declare type AVI = string;

export declare interface BaseItem<S> extends ObjectKey {
  state: S;
  lastUpdateDate: Date;
  type: DecisionType | TaskType;
}

export declare interface ContentRef {
  (ref: HTMLElement | null): void;
}

export declare type Cursor = string;

export declare interface Decision extends BaseItem<DecisionState> {
  creationDate?: Date;
  creator?: UserId;
  lastUpdater?: UserId;
  lastUpdateDate: Date;
  participants?: UserId[];
  status: DecisionStatus;
  type: DecisionType;
}

export declare class DecisionItem extends PureComponent<Props, {}> {
  static defaultProps: Partial<Props>;
  render(): JSX.Element;
}

export declare class DecisionList extends PureComponent<Props_2, {}> {
  render(): JSX.Element | null;
}

export declare type DecisionState = 'DECIDED';

export declare type DecisionStatus = 'CREATED';

export declare type DecisionType = 'DECISION';

export declare type Handler = (state: TaskState | DecisionState) => void;

export declare type Item = Decision | Task;

export declare interface Meta {
  cursor?: string;
}

export declare interface ObjectKey {
  localId: string;
  containerAri?: string;
  objectAri: string;
}

export declare interface OnUpdate<T> {
  (allDecisions: T[], newDecisions: T[]): void;
}

declare interface Props {
  children?: any;
  contentRef?: ContentRef;
  placeholder?: string;
  showPlaceholder?: boolean;
  appearance?: Appearance;
  dataAttributes?: {
    [key: string]: string | number;
  };
}

declare interface Props_2 {
  children?: ReactNode;
}

declare interface Props_3 {
  taskId: string;
  isDone?: boolean;
  isRenderer?: boolean;
  onChange?: (taskId: string, isChecked: boolean) => void;
  contentRef?: ContentRef;
  children?: any;
  taskDecisionProvider?: Promise<TaskDecisionProvider>;
  objectAri?: string;
  showPlaceholder?: boolean;
  placeholder?: string;
  appearance?: Appearance;
  disabled?: boolean;
  dataAttributes?: {
    [key: string]: string | number;
  };
}

declare interface Props_4 {
  taskId: string;
  isDone?: boolean;
  isRenderer?: boolean;
  onChange?: (taskId: string, isChecked: boolean) => void;
  contentRef?: ContentRef;
  children?: any;
  placeholder?: string;
  showPlaceholder?: boolean;
  appearance?: Appearance;
  disabled?: boolean;
  dataAttributes?: {
    [key: string]: string | number;
  };
}

declare interface Props_5 {
  listId?: string;
  children?: ReactNode;
}

export declare interface PubSubClient {
  on(eventAvi: string, listener: PubSubOnEvent): PubSubClient;
  off(eventAvi: string, listener: PubSubOnEvent): PubSubClient;
  join(aris: ARI[]): Promise<PubSubClient>;
  leave(aris: ARI[]): Promise<PubSubClient>;
}

export declare interface PubSubOnEvent<T = any> {
  (event: string, data: T): void;
}

export declare enum PubSubSpecialEventType {
  ERROR = 'ERROR',
  CONNECTED = 'CONNECTED',
  RECONNECT = 'RECONNECT',
}

export declare interface RecentUpdateContext {
  objectAri: string;
  localId?: string;
}

export declare type RecentUpdatesId = string;

/**
 * A subscriber interface that can be called back if there are new decisions/tasks/items
 * available as the result of an external change.
 */
export declare interface RecentUpdatesListener {
  /**
   * An id that can be used to unsubscribe
   */
  id(id: RecentUpdatesId): void;
  /**
   * Indicates there are recent updates, and the listener should refresh
   * the latest items from the TaskDecisionProvider.
   *
   * There will be a number of retries until expectedLocalId, if passed.
   *
   * @param updateContext Recent update context
   */
  recentUpdates(updateContext: RecentUpdateContext): void;
}

export declare interface RenderDocument {
  (document: any, rendererContext?: RendererContext): JSX.Element;
}

/**
 * Same as RendererContext in editor-core (don't want an direct dep though)
 */
export declare interface RendererContext {
  objectAri: string;
  containerAri?: string;
}

export declare class ResourcedTaskItem extends PureComponent<Props_3, State> {
  static defaultProps: Partial<Props_3>;
  private mounted;
  constructor(props: Props_3);
  componentDidMount(): void;
  UNSAFE_componentWillReceiveProps(nextProps: Props_3): void;
  componentWillUnmount(): void;
  private subscribe;
  private unsubscribe;
  private onUpdate;
  private handleOnChange;
  render(): JSX.Element;
}

export declare interface ServiceDecision {
  creationDate?: string;
  creatorId?: UserId;
  lastUpdaterId?: UserId;
  lastUpdateDate: string;
  localId: string;
  objectAri: string;
  participants?: UserId[];
  state?: DecisionState;
  status: DecisionStatus;
  type: DecisionType;
}

export declare interface ServiceDecisionResponse {
  decisions: ServiceDecision[];
  meta: Meta;
}

export declare type ServiceItem = ServiceDecision | ServiceTask;

export declare interface ServiceTask {
  creationDate?: string;
  creatorId?: UserId;
  lastUpdaterId?: UserId;
  lastUpdateDate: string;
  localId: string;
  objectAri: string;
  parentLocalId?: string;
  participants?: UserId[];
  position: number;
  state: TaskState;
  type: TaskType;
}

export declare interface ServiceTaskState {
  lastUpdateDate: string;
  localId: string;
  objectAri: string;
  state: TaskState;
}

declare interface State {
  isDone?: boolean;
}

export declare interface Task extends BaseItem<TaskState> {
  creationDate?: Date;
  creator?: UserId;
  lastUpdater?: UserId;
  lastUpdateDate: Date;
  parentLocalId?: string;
  participants?: UserId[];
  position?: number;
  type: TaskType;
}

export declare interface TaskDecisionProvider {
  unsubscribeRecentUpdates(id: RecentUpdatesId): void;
  notifyRecentUpdates(updateContext: RecentUpdateContext): void;
  toggleTask(objectKey: ObjectKey, state: TaskState): Promise<TaskState>;
  subscribe(
    objectKey: ObjectKey,
    handler: Handler,
    item?: BaseItem<TaskState | DecisionState>,
  ): void;
  unsubscribe(objectKey: ObjectKey, handler: Handler): void;
}

export declare class TaskDecisionResource implements TaskDecisionProvider {
  private recentUpdates;
  private itemStateManager;
  constructor(serviceConfig: TaskDecisionResourceConfig);
  unsubscribeRecentUpdates(id: RecentUpdatesId): void;
  notifyRecentUpdates(recentUpdateContext: RecentUpdateContext): void;
  toggleTask(objectKey: ObjectKey, state: TaskState): Promise<TaskState>;
  subscribe(
    objectKey: ObjectKey,
    handler: Handler,
    item?: BaseItem<TaskState | DecisionState>,
  ): void;
  unsubscribe(objectKey: ObjectKey, handler: Handler): void;
  /**
   * Usually only needed for testing to ensure no outstanding requests
   * are sent to a server (typically mocked).
   */
  destroy(): void;
}

export declare interface TaskDecisionResourceConfig extends ServiceConfig {
  pubSubClient?: PubSubClient;
  /**
   * Indicates if initial state for an action or decision is should be cached,
   * from the content, i.e. was originally hydrated from the service initially,
   * and so should be considered up to date.
   *
   * Will stop the initiation of the hydration from the service the first
   * time an action or decision is seen.
   *
   * If false the state will always be hydrated from the service on first view.
   */
  disableServiceHydration?: boolean;
}

export declare const TaskItem: React_2.ForwardRefExoticComponent<
  Pick<
    Omit<Props_4 & WithAnalyticsEventsProps, keyof WithAnalyticsEventsProps>,
    never
  > &
    Partial<
      Pick<
        Omit<
          Props_4 & WithAnalyticsEventsProps,
          keyof WithAnalyticsEventsProps
        >,
        keyof Props_4
      >
    > &
    Partial<Pick<Partial<Props_4>, never>> &
    React_2.RefAttributes<any>
>;

export declare class TaskList extends PureComponent<Props_5, {}> {
  render(): JSX.Element | null;
}

export declare type TaskState = 'TODO' | 'DONE';

export declare type TaskType = 'TASK';

export declare type UserId = string;

export {};
```
## API Report File for "@atlaskit/media-core"

> Do not edit this file. It is a report generated by [API Extractor](https://api-extractor.com/).

```ts
import { EventEmitter2 } from 'eventemitter2';
import { LRUCache } from 'lru-fast';
import { ReplaySubject } from 'rxjs/ReplaySubject';

export declare interface AsapBasedAuth {
  readonly asapIssuer: string;
  readonly token: string;
  readonly baseUrl: string;
}

export declare type Auth = ClientBasedAuth | AsapBasedAuth;

export declare interface AuthContext {
  readonly collectionName?: string;
}

declare type AuthFromContextProvider = (contextId: string) => Promise<Auth>;

export declare type AuthProvider = (context?: AuthContext) => Promise<Auth>;

export declare const authToOwner: (
  auth: Auth,
) => ClientAltBasedAuth | AsapBasedAuth;

export declare interface CachedMediaState<T> {
  streams: LRUCache<string, ReplaySubject<T>>;
  stateDeferreds: Map<string, StateDeferredValue<T>>;
  eventEmitter?: EventEmitter2;
}

export declare interface ClientAltBasedAuth {
  readonly id: string;
  readonly token: string;
  readonly baseUrl: string;
}

export declare interface ClientBasedAuth {
  readonly clientId: string;
  readonly token: string;
  readonly baseUrl: string;
}

export declare function isAsapBasedAuth(auth: Auth): auth is AsapBasedAuth;

export declare function isClientBasedAuth(auth: Auth): auth is ClientBasedAuth;

export declare type MediaApiConfig = {
  authProvider: AuthProvider;
  initialAuth?: Auth;
};

export declare interface MediaClientConfig {
  readonly authProvider: AuthProvider;
  readonly initialAuth?: Auth;
  readonly stargateBaseUrl?: string;
  readonly getAuthFromContext?: AuthFromContextProvider;
}

export declare const mediaState: CachedMediaState<Object>;

export declare interface StateDeferredValue<T> {
  promise: Promise<T>;
  resolve: Function;
  value?: T;
}

export {};
```
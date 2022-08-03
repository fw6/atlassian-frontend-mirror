## API Report File for "@atlaskit/util-service-support"

> Do not edit this file. It is a report generated by [API Extractor](https://api-extractor.com/).

```ts
export declare abstract class AbstractResource<Q, R, E, I, O>
  implements Provider<Q, R, E, I, O> {
  private lastResult;
  private listeners;
  abstract filter(query?: Q, options?: O): void;
  subscribe(onChange: OnProviderChange<R, E, I>): void;
  unsubscribe(onChange: OnProviderChange<R, E, I>): void;
  protected notifyResult(result: R): void;
  protected notifyError(error: E): void;
  protected notifyInfo(info: I): void;
  protected notifyNotReady(): void;
}

export declare const buildCredentials: (
  secOptions?: SecurityOptions | undefined,
) => 'omit' | 'include';

export declare interface KeyValues {
  [index: string]: any;
}

export declare interface OnProviderChange<R, E, I> {
  /**
   * Normal callback on a search result, or updated search result.
   */
  result(result: R): void;
  /**
   * When something goes wrong, e.g. underlying service is not available.
   */
  error?(error: E): void;
  /**
   * Information to display, e.g. due to slow searches, initial message, etc.
   */
  info?(info: I): void;
  /**
   * Notifies if the Resource is not ready and won't respond to searches
   * in a timely manner. Note searches that occur while not ready Will
   * eventually be fulfilled.
   */
  notReady?(): void;
}

/**
 * Defines a typical Resource.
 *
 * Q = query type
 * R = result type
 * E = error type
 * I = info type
 * O = options that filter can accept
 */
export declare interface Provider<Q, R, E, I, O> {
  /**
   * Results are returned to the OnSearchResult
   * in the subscriber.
   *
   * There may not be a 1-on-1 relationship between a search
   * and a callback.
   *
   * For example, multiple queries may result in one callback if the
   * responses are out of order (i.e. old responses are dropped). Or
   * multiple callbacks may be fired, for example if the underlying data
   * set to search has changed, the last search may be executed again
   * with updated results.
   */
  filter(query?: Q, options?: O): void;
  subscribe(onChange: OnProviderChange<R, E, I>): void;
  unsubscribe(onChange: OnProviderChange<R, E, I>): void;
}

/**
 * Returns a promise to a SecurityOptions that has just been forcibly refreshed with a
 * new token. Will be used for single retry per request if a 401 is returned.
 */
export declare interface RefreshSecurityProvider {
  (): Promise<SecurityOptions>;
}

/**
 * @returns Promise containing the json response
 */
declare const requestService: <T>(
  serviceConfig: ServiceConfig,
  options?: RequestServiceOptions | undefined,
) => Promise<T>;

export declare interface RequestServiceOptions {
  path?: string;
  queryParams?: KeyValues;
  requestInit?: RequestInit;
  ignoreResponsePayload?: boolean;
}

export declare interface SecurityOptions {
  params?: KeyValues;
  headers?: KeyValues;
  omitCredentials?: boolean;
}

/**
 * Returns the current SecurityOptions for the mentions service.
 */
export declare interface SecurityProvider {
  (): SecurityOptions;
}

export declare interface ServiceConfig {
  url: string;
  securityProvider?: SecurityProvider;
  refreshedSecurityProvider?: RefreshSecurityProvider;
}

declare namespace serviceUtils {
  export { requestService };
}

export declare const utils: typeof serviceUtils;

export {};
```
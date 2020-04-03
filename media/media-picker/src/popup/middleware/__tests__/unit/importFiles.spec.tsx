jest.mock('uuid/v4', () => ({
  __esModule: true, // this property makes it work
  default: jest.fn().mockReturnValue('some-scope'),
}));

import {
  globalMediaEventEmitter,
  isErrorFileState,
  observableToPromise,
  getFileStreamsCache,
  FileState,
  FilePreview,
  ProcessedFileState,
  ProcessingFileState,
  ErrorFileState,
  UploadingFileState,
} from '@atlaskit/media-client';
import { Store } from 'redux';
import { RECENTS_COLLECTION } from '@atlaskit/media-client/constants';
import { ReplaySubject } from 'rxjs/ReplaySubject';
const globalEmitSpy = jest.spyOn(globalMediaEventEmitter, 'emit');
import uuidV4 from 'uuid/v4';
import {
  mockStore,
  mockWsConnectionHolder,
  mockPopupUploadEventEmitter,
  nextTick,
  asMock,
  expectFunctionToHaveBeenCalledWith,
  expectToEqual,
  asMockFunction,
} from '@atlaskit/media-test-helpers';
import { Action } from 'redux';

import {
  importFilesMiddleware,
  isRemoteService,
  importFiles,
  SelectedUploadFile,
  getTenantFileState,
  touchSelectedFile,
} from '../../importFiles';
import { LocalUpload, LocalUploads, State } from '../../../domain';
import { UploadEventName } from '../../../../domain/uploadEvent';
import {
  finalizeUpload,
  isFinalizeUploadAction,
} from '../../../actions/finalizeUpload';
import { startImport } from '../../../actions/startImport';
import { resetView } from '../../../actions/resetView';
import { hidePopup } from '../../../actions/hidePopup';
import { getPreview, isGetPreviewAction } from '../../../actions/getPreview';
import { MediaFile } from '../../../../types';
import {
  isSendUploadEventAction,
  SendUploadEventActionPayload,
} from '../../../actions/sendUploadEvent';

describe('importFiles middleware', () => {
  const expectUUID = expect.stringMatching(/[a-f0-9\-]+/);
  const todayDate = Date.now();
  interface SetupOptions {
    withSelectedItems: boolean;
  }
  const defaultOptions: SetupOptions = {
    withSelectedItems: true,
  };
  const makeFileData = (index: number) => ({
    id: `some-selected-item-id-${index}`,
    name: `picture${index}.jpg`,
    mimeType: 'image/jpg',
    size: 42 + index,
    occurrenceKey: `occurrence-key-${index}`,
  });

  const getSendUploadEventPayloads = (
    store: Store<State>,
    eventName: UploadEventName,
  ): SendUploadEventActionPayload[] => {
    return getDispatchCallsByType(store, isSendUploadEventAction)
      .filter(({ payload: { event } }) => event.name === eventName)
      .map(({ payload }) => payload);
  };

  const setup = (opts: Partial<SetupOptions> = {}) => {
    const { withSelectedItems } = {
      ...defaultOptions,
      ...opts,
    } as SetupOptions;

    const makeLocalUpload = (index: number): LocalUpload => {
      return {
        file: {
          metadata: {
            ...makeFileData(index),
          },
        },
        index,
        timeStarted: 0,
      };
    };

    const localUploads: LocalUploads = {
      'some-selected-item-id-1': makeLocalUpload(1),
      'some-selected-item-id-2': makeLocalUpload(2),
      'some-selected-item-id-3': makeLocalUpload(3),
    };

    type OmittedKeys = 'id' | 'mimeType' | 'name' | 'size';
    const pushFileStateForLocalUploads = (
      extraParams:
        | Omit<UploadingFileState, OmittedKeys>
        | Omit<ProcessedFileState, OmittedKeys>
        | Omit<ProcessingFileState, OmittedKeys>
        | Omit<ErrorFileState, 'id'>,
      options: {
        shouldExist: boolean;
      } = {
        shouldExist: true,
      },
    ) => {
      // Go through all local uploads
      Object.keys(localUploads).forEach(key => {
        const { id, mimeType, name, size } = localUploads[key].file.metadata;
        // Find corresponding FileState in the stream cache.
        let userFileStateSubject = getFileStreamsCache().get(id);
        if (!options.shouldExist) {
          userFileStateSubject = new ReplaySubject<FileState>(1);
          getFileStreamsCache().set(id, userFileStateSubject);
        } else if (!userFileStateSubject) {
          return expect(userFileStateSubject).toBeDefined();
        }
        const nextFileState: FileState =
          extraParams.status === 'error'
            ? {
                id,
                ...extraParams,
              }
            : {
                id,
                mimeType,
                name,
                size,
                ...extraParams,
              };
        userFileStateSubject.next(nextFileState);
      });
    };

    // We fill in cache with local upload states as it would be in real world
    pushFileStateForLocalUploads(
      {
        status: 'uploading',
        mediaType: 'doc', // Doc is for getPreviewFromBlob to work
        progress: 0.5,
        occurrenceKey: 'some-occurrence-key',
      },
      {
        shouldExist: false,
      },
    );

    const finishUploading = (
      previewValue: FilePreview['value'] = 'some-preview-value',
    ) => {
      pushFileStateForLocalUploads({
        status: 'processing',
        mediaType: 'doc',
        occurrenceKey: 'some-occurrence-key',
        preview: {
          value: previewValue,
        },
      });
    };

    const finishProcessing = (
      previewValue: FilePreview['value'] = 'some-preview-value',
    ) => {
      pushFileStateForLocalUploads({
        status: 'processed',
        mediaType: 'doc',
        occurrenceKey: 'some-occurrence-key',
        artifacts: {},
        preview: {
          value: previewValue,
        },
      });
    };

    const causeUploadError = () => {
      pushFileStateForLocalUploads({
        status: 'error',
        message: 'some-error-file-status-message',
        occurrenceKey: 'some-occurrence-key',
      });
    };

    const store = mockStore(
      withSelectedItems
        ? {
            uploads: localUploads,
            config: {
              uploadParams: {
                collection: 'tenant-collection',
              },
            },
            selectedItems: [
              {
                serviceName: 'upload',
                ...makeFileData(1),
                accountId: '',
                date: todayDate,
              },
              // Not all uploaded files are being selected. number 2 was skipped
              {
                serviceName: 'upload',
                ...makeFileData(3),
                accountId: '',
                date: todayDate,
              },
              {
                serviceName: 'recent_files',
                ...makeFileData(4),
                accountId: '',
                date: todayDate,
              },
              {
                serviceName: 'dropbox',
                ...makeFileData(5),
                accountId: 'some-account-id',
                date: 0,
              },
              {
                serviceName: 'plugin-1',
                ...makeFileData(5),
                accountId: 'some-account-id',
                date: 0,
              },
            ],
          }
        : {},
    );

    // Mock getFileState() with "smart" mock implementation.
    // This will allow all the parts to work together. There are places where cache is manipulated
    // directly in importFiles.ts, and later other parts try to access those Observables via getFileState.
    const getFileStateImpl = (id: string) => getFileStreamsCache().get(id);
    asMock(
      store.getState().userMediaClient.file.getFileState,
    ).mockImplementation(getFileStateImpl);
    asMock(
      store.getState().tenantMediaClient.file.getFileState,
    ).mockImplementation(getFileStateImpl);

    const wsConnectionHolder = mockWsConnectionHolder();
    const mockWsProvider = {
      getWsConnectionHolder: jest.fn(() => wsConnectionHolder),
    } as any;
    const nextDispatch = jest.fn();

    return {
      mockWsProvider,
      wsConnectionHolder,
      store,
      nextDispatch,
      eventEmitter: mockPopupUploadEventEmitter(),
      finishUploading,
      finishProcessing,
      causeUploadError,
    };
  };

  const importFilesMiddlewareAndAwait = async (
    setupResult: ReturnType<typeof setup>,
    action: Action = startImport(),
  ) => {
    const { eventEmitter, mockWsProvider, store, nextDispatch } = setupResult;
    importFilesMiddleware(eventEmitter, mockWsProvider)(store)(nextDispatch)(
      action,
    );

    await nextTick(); // wait for auth provider
    await nextTick(); // wait for first `await observableToPromise` in getTenantFileState()
    await nextTick(); // wait for second `await observableToPromise` in getTenantFileState()
  };

  function getDispatchCallsByType<T extends Action>(
    store: Store<State>,
    actionTypeCheckPredicate: (action: Action) => action is T,
  ): T[] {
    const actions = asMockFunction(store.dispatch).mock.calls.map(
      args => args[0],
    ) as Action[];
    return actions.filter(actionTypeCheckPredicate);
  }

  let uuidCounter = 0;
  beforeEach(() => {
    asMock(uuidV4).mockImplementation(() => `some-uuid-${uuidCounter++}`);
  });

  afterEach(() => {
    uuidCounter = 0;
    jest.resetAllMocks();
    getFileStreamsCache().removeAll();
  });

  it('should call next dispatch if action is START_IMPORT', async () => {
    const setupResult = setup();
    const action = startImport();
    await importFilesMiddlewareAndAwait(setupResult, action);
    const { nextDispatch } = setupResult;

    expect(nextDispatch).toBeCalledWith(action);
  });

  it('should call next dispatch even if action is not START_IMPORT', async () => {
    const setupResult = setup();
    const action = resetView();
    await importFilesMiddlewareAndAwait(setupResult, action);
    const { nextDispatch } = setupResult;

    expect(nextDispatch).toBeCalledWith(action);
  });

  describe('when START_IMPORT action supplied', () => {
    it('should emit uploads-start event back to container for all selected items', async () => {
      const { eventEmitter, mockWsProvider, store } = setup();
      await importFiles(eventEmitter, store, mockWsProvider);

      expect(eventEmitter.emitUploadsStart).toBeCalledWith([
        {
          id: 'some-uuid-0',
          name: 'picture1.jpg',
          type: 'image/jpg',
          size: 43,
          creationDate: todayDate,
          occurrenceKey: 'occurrence-key-1',
        },
        {
          id: 'some-uuid-1',
          name: 'picture3.jpg',
          type: 'image/jpg',
          size: 45,
          creationDate: todayDate,
          occurrenceKey: 'occurrence-key-3',
        },
        {
          id: 'some-uuid-2',
          name: 'picture4.jpg',
          type: 'image/jpg',
          size: 46,
          creationDate: todayDate,
          occurrenceKey: 'occurrence-key-4',
        },
        {
          id: 'some-uuid-3',
          name: 'picture5.jpg',
          type: 'image/jpg',
          size: 47,
          creationDate: expect.any(Number),
          occurrenceKey: 'occurrence-key-5',
        },
      ]);

      expect(eventEmitter.emitPluginItemsInserted).toBeCalledWith([
        {
          serviceName: 'plugin-1',
          accountId: 'some-account-id',
          id: 'some-selected-item-id-5',
          name: 'picture5.jpg',
          mimeType: 'image/jpg',
          date: 0,
          size: 47,
          occurrenceKey: 'occurrence-key-5',
        },
      ]);
    });

    it('should add tenant file state to cache for all selected items', async () => {
      const { eventEmitter, mockWsProvider, store } = setup();
      await importFiles(eventEmitter, store, mockWsProvider);
      const tenantFileStateSubject = getFileStreamsCache().get('some-uuid-0');

      if (!tenantFileStateSubject) {
        return expect(tenantFileStateSubject).toBeDefined();
      }
      const tenantFileState1 = await observableToPromise(
        tenantFileStateSubject,
      );
      expectToEqual(tenantFileState1, {
        id: 'some-uuid-0',
        mediaType: 'doc',
        mimeType: 'image/jpg',
        name: 'picture1.jpg',
        progress: 0.5,
        size: 43,
        status: 'uploading',
        occurrenceKey: 'some-occurrence-key',
        preview: expect.anything(),
      });
      expect(getFileStreamsCache().get('some-uuid-1')).toBeDefined();
      expect(getFileStreamsCache().get('some-uuid-2')).toBeDefined();
      expect(getFileStreamsCache().get('some-uuid-3')).toBeDefined();
      return;
    });

    describe('while piping user file state to tenant file state', () => {
      let initialTenantFileState1: FileState;
      let newTenantFileState1: FileState;

      beforeEach(async () => {
        const { eventEmitter, mockWsProvider, store } = setup();
        await importFiles(eventEmitter, store, mockWsProvider);

        // Tenant file state stream
        const tenantFileStateSubject = getFileStreamsCache().get('some-uuid-0');
        if (!tenantFileStateSubject) {
          return expect(tenantFileStateSubject).toBeDefined();
        }

        // It's counterpart user file state stream
        const userFileStateSubject = getFileStreamsCache().get(
          'some-selected-item-id-1',
        ) as ReplaySubject<FileState>;
        if (!userFileStateSubject) {
          return expect(userFileStateSubject).toBeDefined();
        }

        // Get tenant file state before user file state pushed a change
        initialTenantFileState1 = await observableToPromise(
          tenantFileStateSubject,
        );

        // Get user file state
        const userFileState1 = await observableToPromise(userFileStateSubject);
        if (isErrorFileState(userFileState1)) {
          return expect(userFileState1.status).not.toBe('error');
        }

        // Push new file state (based on an old one) but with new details
        userFileStateSubject.next({
          ...userFileState1,
          preview: Promise.resolve({} as any),
          name: 'new name',
        });

        // Get latest tenant file state
        newTenantFileState1 = await observableToPromise(tenantFileStateSubject);
      });

      it('should pipe new data from user file state to tenant one', () => {
        if (isErrorFileState(newTenantFileState1)) {
          return expect(initialTenantFileState1.status).not.toBe('error');
        }
        expect(newTenantFileState1.name).toEqual('new name');
      });

      it('should keep existing tenant id (not overwrite with user one)', () => {
        expect(newTenantFileState1.id).toEqual(initialTenantFileState1.id);
      });

      it('should keep existing promise/object of a preview.', () => {
        if (isErrorFileState(newTenantFileState1)) {
          return expect(newTenantFileState1.status).not.toBe('error');
        }
        if (isErrorFileState(initialTenantFileState1)) {
          return expect(initialTenantFileState1.status).not.toBe('error');
        }
        expect(newTenantFileState1.preview).toBe(
          initialTenantFileState1.preview,
        );
      });
    });

    it('should close popup', async () => {
      const setupResult = setup();
      await importFilesMiddlewareAndAwait(setupResult);
      const { store } = setupResult;

      expect(store.dispatch).toHaveBeenCalledWith(hidePopup());
    });

    describe('each selected and recent file', () => {
      it('should dispatch GET_PREVIEW action', async () => {
        const setupResult = setup();
        await importFilesMiddlewareAndAwait(setupResult);
        const { store } = setupResult;
        const actions = getDispatchCallsByType(store, isGetPreviewAction);
        expect(actions).toHaveLength(1);
        expect(actions[0]).toEqual(
          getPreview(
            // Has index 2 because `const tenantFileId = uuid();` was called 3rd
            `some-uuid-2`,
            {
              id: 'some-selected-item-id-4',
              name: 'picture4.jpg',
              type: 'image/jpg',
              size: 46,
              creationDate: todayDate,
              occurrenceKey: 'occurrence-key-4',
            },
            RECENTS_COLLECTION,
          ),
        );
      });

      it('should dispatch FINALIZE_UPLOAD action', async () => {
        const setupResult = setup();
        await importFilesMiddlewareAndAwait(setupResult);
        const { store } = setupResult;

        const actions = getDispatchCallsByType(store, isFinalizeUploadAction);

        expect(actions).toHaveLength(1);

        expect(actions).toEqual([
          finalizeUpload(
            {
              id: 'some-selected-item-id-4',
              name: 'picture4.jpg',
              type: 'image/jpg',
              size: 46,
              creationDate: todayDate,
              occurrenceKey: 'occurrence-key-4',
            },
            'some-uuid-2',
            {
              id: 'some-selected-item-id-4',
              collection: RECENTS_COLLECTION,
            },
          ),
        ]);
      });
    });

    describe('each selected and locally uploaded file', () => {
      let setupResult: ReturnType<typeof setup>;

      const assertFinalizeUploadAction = () => {
        const { store } = setupResult;
        const actions = getDispatchCallsByType(
          store,
          isFinalizeUploadAction,
        ).slice(1); // Ignore first - result of `recent_files`

        expect(actions).toHaveLength(2);

        expect(actions).toEqual([
          finalizeUpload(
            {
              creationDate: -1,
              id: 'some-uuid-0',
              name: 'picture1.jpg',
              size: 43,
              type: 'image/jpg',
              occurrenceKey: 'some-occurrence-key',
            },
            'some-uuid-0',
            {
              id: 'some-selected-item-id-1',
              collection: RECENTS_COLLECTION,
            },
          ),
          finalizeUpload(
            {
              creationDate: -1,
              id: 'some-uuid-1',
              name: 'picture3.jpg',
              size: 45,
              type: 'image/jpg',
              occurrenceKey: 'some-occurrence-key',
            },
            'some-uuid-1',
            {
              id: 'some-selected-item-id-3',
              collection: RECENTS_COLLECTION,
            },
          ),
        ]);
      };

      beforeEach(async () => {
        setupResult = setup();
        await importFilesMiddlewareAndAwait(setupResult);
      });

      it('should dispatch FINALIZE_UPLOAD action once after "processing" status', async () => {
        const { finishUploading, finishProcessing } = setupResult;

        finishUploading();
        await nextTick();
        await nextTick();

        finishProcessing();
        await nextTick();
        await nextTick();

        assertFinalizeUploadAction();
      });

      it('should dispatch FINALIZE_UPLOAD action once after "processed" status', async () => {
        const { finishProcessing } = setupResult;

        finishProcessing();
        await nextTick();
        await nextTick();

        // Do it second time to make sure it doesn't trigger it second time.
        finishProcessing();
        await nextTick();
        await nextTick();

        assertFinalizeUploadAction();
      });

      it('should dispatch SEND_UPLOAD_EVENT with "upload-preview-update" once', async () => {
        const { finishProcessing, store } = setupResult;

        const blob = new Blob([], { type: 'text' });

        finishProcessing(blob);
        await nextTick();
        await nextTick();

        // Second time to prove it dispatches only once per file
        finishProcessing(blob);
        await nextTick();
        await nextTick();

        const payloads = getSendUploadEventPayloads(
          store,
          'upload-preview-update',
        );
        expect(payloads).toHaveLength(2);
        expectToEqual(payloads, [
          {
            fileId: 'some-uuid-0',
            event: {
              name: 'upload-preview-update',
              data: {
                file: {
                  creationDate: -1,
                  id: 'some-uuid-0',
                  name: 'picture1.jpg',
                  size: 43,
                  type: 'image/jpg',
                  occurrenceKey: 'some-occurrence-key',
                },
                preview: {
                  file: blob,
                },
              },
            },
          },
          {
            fileId: 'some-uuid-1',
            event: {
              name: 'upload-preview-update',
              data: {
                file: {
                  creationDate: -1,
                  id: 'some-uuid-1',
                  name: 'picture3.jpg',
                  size: 45,
                  type: 'image/jpg',
                  occurrenceKey: 'some-occurrence-key',
                },
                preview: {
                  file: blob,
                },
              },
            },
          },
        ]);
      });

      it('should dispatch SEND_UPLOAD_EVENT with "upload-error" once', async () => {
        const { causeUploadError, store } = setupResult;

        causeUploadError();
        // Second time to prove it dispatches only once per file
        causeUploadError();

        // This next ticks are not strictly necessary, but here just in case
        await nextTick();
        await nextTick();

        const payloads = getSendUploadEventPayloads(store, 'upload-error');
        expect(payloads).toHaveLength(2);
        expectToEqual(payloads, [
          {
            fileId: 'some-uuid-0',
            event: {
              name: 'upload-error',
              data: {
                error: {
                  description: 'some-error-file-status-message',
                  fileId: 'some-uuid-0',
                  name: 'upload_fail',
                },
                fileId: 'some-uuid-0',
              },
            },
          },
          {
            fileId: 'some-uuid-1',
            event: {
              name: 'upload-error',
              data: {
                error: {
                  description: 'some-error-file-status-message',
                  fileId: 'some-uuid-1',
                  name: 'upload_fail',
                },
                fileId: 'some-uuid-1',
              },
            },
          },
        ]);
      });

      it('should not bubble up other events', () => {
        const { eventEmitter, store } = setupResult;

        expect(eventEmitter.emitUploadsStart).toHaveBeenCalledTimes(1);
        expect(getSendUploadEventPayloads(store, 'uploads-start')).toHaveLength(
          0,
        );
        expect(getSendUploadEventPayloads(store, 'upload-end')).toHaveLength(0);
      });
    });

    describe('each selected and remote file', () => {
      it('should initiate the import with a websocket message', async () => {
        const setupResult = setup();
        await importFilesMiddlewareAndAwait(setupResult);
        const { wsConnectionHolder } = setupResult;

        expect(wsConnectionHolder.openConnection).toHaveBeenCalledTimes(1);
        expect(wsConnectionHolder.send).toHaveBeenCalledTimes(1);
        expect(wsConnectionHolder.send).toHaveBeenCalledWith({
          type: 'fetchFile',
          params: {
            serviceName: 'dropbox',
            accountId: 'some-account-id',
            fileId: 'some-selected-item-id-5',
            fileName: 'picture5.jpg',
            collection: RECENTS_COLLECTION,
            jobId: expectUUID,
          },
        });
      });

      it('should touch all files to import', async () => {
        const setupResult = setup();
        await importFilesMiddlewareAndAwait(setupResult);
        const { store } = setupResult;

        const { tenantMediaClient } = store.getState();
        expect(tenantMediaClient.file.touchFiles).toBeCalledTimes(4);
        expect(tenantMediaClient.file.touchFiles).toBeCalledWith(
          [
            {
              collection: 'tenant-collection',
              fileId: expectUUID,
              occurrenceKey: 'occurrence-key-1',
            },
          ],
          'tenant-collection',
        );
        expect(tenantMediaClient.file.touchFiles).toBeCalledWith(
          [
            {
              collection: 'tenant-collection',
              fileId: expectUUID,
              occurrenceKey: 'occurrence-key-3',
            },
          ],
          'tenant-collection',
        );
        expect(tenantMediaClient.file.touchFiles).toBeCalledWith(
          [
            {
              collection: 'tenant-collection',
              fileId: expectUUID,
              occurrenceKey: 'occurrence-key-4',
            },
          ],
          'tenant-collection',
        );
        expect(tenantMediaClient.file.touchFiles).toBeCalledWith(
          [
            {
              collection: 'tenant-collection',
              fileId: expectUUID,
              occurrenceKey: 'occurrence-key-5',
            },
          ],
          'tenant-collection',
        );
      });
    });

    it('should emit file-added in tenant mediaClient and globalMediaEventEmitter', async () => {
      const setupResult = setup();
      await importFilesMiddlewareAndAwait(setupResult);
      const { store } = setupResult;

      const { tenantMediaClient } = store.getState();
      const fileState = {
        id: expectUUID,
        mediaType: 'image',
        mimeType: 'image/jpg',
        name: 'picture5.jpg',
        preview: undefined,
        representations: {},
        size: 47,
        status: 'processing',
      };

      expect(globalEmitSpy).toBeCalledTimes(4);
      expect(tenantMediaClient.emit).toBeCalledTimes(4);

      const globalEmitSpyCall = globalEmitSpy.mock.calls.find(
        // @ts-ignore This violated type definition upgrade of @types/jest to v24.0.18 & ts-jest v24.1.0.
        //See BUILDTOOLS-210-clean: https://bitbucket.org/atlassian/atlaskit-mk-2/pull-requests/7178/buildtools-210-clean/diff
        call => call[1].name === fileState.name,
      );
      expect(globalEmitSpyCall).toEqual(['file-added', fileState]);

      const tenantMediaClientEmitCall = asMock(
        tenantMediaClient.emit,
      ).mock.calls.find(call => call[1].name === fileState.name);
      expect(tenantMediaClientEmitCall).toEqual(['file-added', fileState]);
    });

    it('should not modify client file state', async () => {
      const setupResult = setup();
      // We take client state from client observable, create new tenant state with all the client data,
      // but with extra preview and new tenant id and put that under tenant file id into the cache.
      await importFilesMiddlewareAndAwait(setupResult);

      // Now we get that tenant observable and just push it again (.next below)
      const tenantFileSateSubject = getFileStreamsCache().get(
        'some-uuid-0',
      ) as ReplaySubject<FileState>;
      if (!tenantFileSateSubject) {
        return expect(tenantFileSateSubject).toBeDefined();
      }
      const tenantFileSate = await observableToPromise(tenantFileSateSubject);
      tenantFileSateSubject.next(tenantFileSate);

      // Now we read client observable again from the cache
      const userFileStateSubject = getFileStreamsCache().get(
        'some-selected-item-id-1',
      );
      if (!userFileStateSubject) {
        return expect(userFileStateSubject).toBeDefined();
      }
      const userFileState = await observableToPromise(userFileStateSubject);

      // We are verifying that actions above didn't meddle with it's ID.
      expect(userFileState.id).toBe('some-selected-item-id-1');
      return;
    });
  });

  describe('isRemoteService', () => {
    it('should return true for service name "dropbox"', () => {
      expect(isRemoteService('dropbox')).toEqual(true);
    });

    it('should return true for service name "google"', () => {
      expect(isRemoteService('google')).toEqual(true);
    });

    it('should return false for service name other than "dropbox" or "google"', () => {
      expect(isRemoteService('recent_files')).toEqual(false);
    });
  });

  describe('getTenantFileState()', () => {
    const file: MediaFile = {
      id: 'user-id-1',
      creationDate: 1,
      name: '',
      size: 1,
      type: 'image/png',
    };

    it('should add file preview for Giphy files', async () => {
      const selectedFile: SelectedUploadFile = {
        file,
        serviceName: 'giphy',
        touchFileDescriptor: {
          fileId: 'id-1',
        },
      };

      const store = mockStore({
        giphy: {
          imageCardModels: [
            {
              dataURI: 'giphy-preview-1',
              dimensions: { height: 1, width: 1 },
              metadata: {
                id: 'user-id-1',
              },
            },
            {
              dataURI: 'giphy-preview-2',
              dimensions: { height: 1, width: 1 },
              metadata: {
                id: 'user-id-2',
              },
            },
          ],
        },
      });
      const fileState = await getTenantFileState(store, selectedFile);
      if (isErrorFileState(fileState)) {
        return expect(fileState.status).not.toBe('error');
      }
      expect(await fileState.preview).toEqual({
        value: 'giphy-preview-1',
        origin: 'remote',
      });
      return;
    });

    it('should add file preview for local uploads', async () => {
      const subject = new ReplaySubject<FileState>(1);
      subject.next({
        id: 'user-id-1',
        status: 'processing',
        name: 'some-name',
        size: 42,
        mediaType: 'audio',
        mimeType: 'some-type',
        preview: {
          value: 'some-local-preview',
        },
      });
      getFileStreamsCache().set('user-id-1', subject);
      const selectedFile: SelectedUploadFile = {
        file,
        serviceName: 'upload',
        touchFileDescriptor: {
          fileId: 'id-1',
        },
      };
      const store = mockStore();
      const fileState = await getTenantFileState(store, selectedFile);

      if (isErrorFileState(fileState)) {
        return expect(fileState.status).not.toBe('error');
      }

      expect(await fileState.preview).toEqual({
        value: 'some-local-preview',
      });
      return;
    });

    it('should fetch remote preview for recent files if image is previewable', async () => {
      const selectedFile: SelectedUploadFile = {
        file,
        serviceName: 'recent_files',
        touchFileDescriptor: {
          fileId: 'id-1',
        },
      };
      const store = mockStore();

      const fileState = await getTenantFileState(store, selectedFile);

      if (isErrorFileState(fileState)) {
        return expect(fileState.status).not.toBe('error');
      }

      await fileState.preview;
      const { userMediaClient } = store.getState();
      expect(userMediaClient.getImage).toBeCalledTimes(1);
      expect(userMediaClient.getImage).toBeCalledWith(
        'user-id-1',
        {
          collection: RECENTS_COLLECTION,
          mode: 'fit',
        },
        undefined,
        true,
      );
      return;
    });

    it('should set value of public file id to be new file state', async () => {
      const selectedFile: SelectedUploadFile = {
        file,
        serviceName: 'upload',
        touchFileDescriptor: {
          fileId: 'id-foo-1',
        },
      };

      const store = mockStore();

      const fileState = await getTenantFileState(store, selectedFile);

      if (isErrorFileState(fileState)) {
        return expect(fileState.status).not.toBe('error');
      }

      expect(await fileState.id).toBe('id-foo-1');
      return;
    });

    it('should reuse existing user file state for tenant id', async () => {
      const userFile: MediaFile = {
        id: 'user-id',
        creationDate: 1,
        name: 'some_file_name',
        size: 1,
        type: 'image/png',
      };
      const selectedFile: SelectedUploadFile = {
        file: userFile,
        serviceName: 'upload',
        touchFileDescriptor: {
          fileId: 'tenant-upfront-id',
        },
      };

      const subject = new ReplaySubject<FileState>(1);
      subject.next({
        id: 'user-id',
        status: 'uploading',
        name: 'some_file_name',
        progress: 0.5,
        size: 42,
        mediaType: 'video',
        mimeType: 'some-type',
        preview: {
          value: 'some-existing-preview',
        },
      });
      getFileStreamsCache().set('user-id', subject);

      const store = mockStore();
      const fileState = await getTenantFileState(store, selectedFile);

      if (isErrorFileState(fileState)) {
        return expect(fileState.status).not.toBe('error');
      }
      if (fileState.status !== 'uploading') {
        return expect(fileState.status).toBe('uploading');
      }

      expect(fileState.name).toEqual('some_file_name');
      expect(fileState.progress).toEqual(0.5);
      expect(fileState.mediaType).toEqual('video');
      expect(await fileState.preview).toEqual({
        value: 'some-existing-preview',
      });

      return;
    });
  });

  describe('touchSelectedFile()', () => {
    const file: MediaFile = {
      id: 'id-1',
      creationDate: 1,
      name: '',
      size: 1,
      type: 'image/png',
    };

    it('should call touch endpoint', async () => {
      const selectedFiles: SelectedUploadFile[] = [
        {
          file,
          serviceName: 'upload',
          touchFileDescriptor: {
            fileId: 'tenant-upfront-id',
          },
        },
        {
          file,
          serviceName: 'upload',
          touchFileDescriptor: {
            fileId: 'tenant-upfront-id-2',
          },
        },
      ];
      const store = mockStore({
        config: { uploadParams: { collection: 'some-collection-name' } },
      });
      const { tenantMediaClient } = store.getState();
      await Promise.all(
        selectedFiles.map(selectedFile =>
          touchSelectedFile(selectedFile.touchFileDescriptor, store),
        ),
      );
      expectFunctionToHaveBeenCalledWith(tenantMediaClient.file.touchFiles, [
        [
          {
            fileId: 'tenant-upfront-id',
          },
        ],
        'some-collection-name',
      ]);
      expectFunctionToHaveBeenCalledWith(tenantMediaClient.file.touchFiles, [
        [
          {
            fileId: 'tenant-upfront-id-2',
          },
        ],
        'some-collection-name',
      ]);
    });
  });
});

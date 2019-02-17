export class AutoscaledPool {
  public maxConcurrency: any;
  public minConcurrency: any;
  public desiredConcurrencyRatio: any;
  public scaleUpStepRatio: any;
  public scaleDownStepRatio: any;
  public maybeRunIntervalMillis: any;
  public loggingIntervalMillis: any;
  public autoscaleIntervalMillis: any;
  public runTaskFunction: any;
  public isFinishedFunction: any;
  public isTaskReadyFunction: any;
  public isStopped: any;
  public desiredConcurrency: any;
  public currentConcurrency: any;
  public lastLoggingTime: any;
  public resolve: any;
  public reject: any;
  public snapshotter: any;
  public systemStatus: any;
  constructor(options: any);
  public abort(): void;
  public pause(timeoutSecs: any): any;
  public resume(): void;
  public run(): void;
  public setMaxConcurrency(maxConcurrency: any): void;
  public setMinConcurrency(minConcurrency: any): void;
}
export class BasicCrawler {
  public requestList: any;
  public requestQueue: any;
  public handleRequestFunction: any;
  public handleFailedRequestFunction: any;
  public maxRequestRetries: any;
  public handledRequestsCount: any;
  public autoscaledPoolOptions: any;
  public isRunningPromise: any;
  constructor(options: any);
  public run(): any;
}
export class CheerioCrawler {
  public requestFunction: any;
  public requestOptions: any;
  public handlePageFunction: any;
  public handlePageTimeoutMillis: any;
  public requestTimeoutMillis: any;
  public ignoreSslErrors: any;
  public useApifyProxy: any;
  public apifyProxyGroups: any;
  public apifyProxySession: any;
  public proxyUrls: any;
  public lastUsedProxyUrlIndex: any;
  public basicCrawler: any;
  public tunnelAgentExceptionListener: any;
  public isRunningPromise: any;
  constructor(options: any);
  public run(): any;
}
export class PseudoUrl {
  public regex: any;
  public requestTemplate: any;
  constructor(purl: any, requestTemplate: any);
  public createRequest(url: any): any;
  public matches(url: any): any;
}
export class PuppeteerCrawler {
  public handlePageFunction: any;
  public gotoFunction: any;
  public handlePageTimeoutMillis: any;
  public puppeteerPoolOptions: any;
  public puppeteerPool: any;
  public basicCrawler: any;
  constructor(options: any);
  public run(): any;
}
export class PuppeteerPool {
  public reusePages: any;
  public maxOpenPagesPerInstance: any;
  public retireInstanceAfterRequestCount: any;
  public killInstanceAfterMillis: any;
  public recycledDiskCacheDirs: any;
  public proxyUrls: any;
  public launchPuppeteerFunction: any;
  public browserCounter: any;
  public activeInstances: any;
  public retiredInstances: any;
  public lastUsedProxyUrlIndex: any;
  public instanceKillerInterval: any;
  public idlePages: any;
  public closedPages: any;
  public pagesToInstancesMap: any;
  public sigintListener: any;
  constructor(options: any);
  public destroy(): void;
  public newPage(): any;
  public recyclePage(page: any): void;
  public retire(browser: any): any;
}
export class Request {
  public id: any;
  public url: any;
  public uniqueKey: any;
  public method: any;
  public payload: any;
  public noRetry: any;
  public retryCount: any;
  public errorMessages: any;
  public headers: any;
  public userData: any;
  public handledAt: any;
  constructor(options: any);
  public doNotRetry(message: any): void;
  public pushErrorMessage(errorOrMessage: any, options: any): void;
}
export class RequestList {
  public requests: any;
  public nextIndex: any;
  public uniqueKeyToIndex: any;
  public inProgress: any;
  public reclaimed: any;
  public persistStateKey: any;
  public persistSourcesKey: any;
  public initialState: any;
  public keepDuplicateUrls: any;
  public isStatePersisted: any;
  public areSourcesPersisted: any;
  public isLoading: any;
  public isInitialized: any;
  public sources: any;
  constructor(options: any);
  public fetchNextRequest(): any;
  public getState(): any;
  public handledCount(): any;
  public initialize(): void;
  public isEmpty(): any;
  public isFinished(): any;
  public length(): any;
  public markRequestHandled(request: any): void;
  public persistState(): void;
  public reclaimRequest(request: any): void;
}
export class SettingsRotator {
  public maxUsages: any;
  public newSettingsFunction: any;
  public currentSettings: any;
  public currentSettingsUsageCount: any;
  constructor(opts: any);
  public fetchSettings(): any;
  public reclaimSettings(settings: any): void;
}
export function browse(url: any, options: any): any;
export function call(actId: any, input: any, options: any): any;
export function callTask(taskId: any, input: any, options: any): any;
export const client: {
  acts: {
    abortBuild: Function;
    abortRun: Function;
    buildAct: Function;
    createAct: Function;
    createActVersion: Function;
    deleteAct: Function;
    deleteActVersion: Function;
    getAct: Function;
    getActVersion: Function;
    getBuild: Function;
    getRun: Function;
    listActVersions: Function;
    listActs: Function;
    listBuilds: Function;
    listRuns: Function;
    runAct: Function;
    updateAct: Function;
    updateActVersion: Function;
  };
  crawlers: {
    createCrawler: Function;
    deleteCrawler: Function;
    getCrawlerSettings: Function;
    getExecutionDetails: Function;
    getExecutionResults: Function;
    getLastExecution: Function;
    getLastExecutionResults: Function;
    getListOfExecutions: Function;
    listCrawlers: Function;
    startExecution: Function;
    stopExecution: Function;
    updateCrawler: Function;
  };
  datasets: {
    deleteDataset: Function;
    getDataset: Function;
    getItems: Function;
    getOrCreateDataset: Function;
    listDatasets: Function;
    putItems: Function;
  };
  getDefaultOptions: Function;
  getOptions: Function;
  keyValueStores: {
    deleteRecord: Function;
    deleteStore: Function;
    getOrCreateStore: Function;
    getRecord: Function;
    getStore: Function;
    listKeys: Function;
    listStores: Function;
    putRecord: Function;
  };
  logs: {
    getLog: Function;
  };
  requestQueues: {
    addRequest: Function;
    deleteQueue: Function;
    deleteRequest: Function;
    getHead: Function;
    getOrCreateQueue: Function;
    getQueue: Function;
    getRequest: Function;
    listQueues: Function;
    updateRequest: Function;
  };
  setOptions: Function;
  stats: {
    calls: number;
    rateLimitErrors: number;
    requests: number;
  };
  tasks: {
    createTask: Function;
    deleteTask: Function;
    getTask: Function;
    listRuns: Function;
    listTasks: Function;
    runTask: Function;
    updateTask: Function;
  };
  users: {
    getUser: Function;
  };
};
export const events: {
  addListener: Function;
  emit: Function;
  eventNames: Function;
  getMaxListeners: Function;
  listenerCount: Function;
  listeners: Function;
  off: Function;
  on: Function;
  once: Function;
  prependListener: Function;
  prependOnceListener: Function;
  rawListeners: Function;
  removeAllListeners: Function;
  removeListener: Function;
  setMaxListeners: Function;
};
export function getApifyProxyUrl(options: any): any;
export function getEnv(): any;
export function getMemoryInfo(): any;
export function getValue(key: any): void;
export function initializeEvents(): void;
export function isAtHome(): void;
export function launchPuppeteer(options: any): any;
export function launchWebDriver(options: any): any;
export function main(userFunc: any): void;
export function openDataset(datasetIdOrName: any, options: any): any;
export function openKeyValueStore(storeIdOrName: any, options: any): any;
export function openRequestList(listName: any, sources: any, options: any): any;
export function openRequestQueue(queueIdOrName?: any, options?: any): any;
export function pushData(item: any): void;
export function setValue(key: any, value: any, options: any): void;
export function stopEvents(): void;
export namespace utils {
  const URL_NO_COMMAS_REGEX: RegExp;
  const URL_WITH_COMMAS_REGEX: RegExp;
  function createRequestDebugInfo(
    request: any,
    response: any,
    additionalFields: any,
  ): any;
  function downloadListOfUrls({ url, encoding, urlRegExp }: any): any;
  function enqueueLinks(args: any): any;
  function extractUrls({ string, urlRegExp }: any): any;
  function getRandomUserAgent(): any;
  function htmlToText(html: any): any;
  function isDocker(forceReset: any): any;
  namespace log {
    const LEVELS: {
      DEBUG: number;
      ERROR: number;
      INFO: number;
      OFF: number;
      PERF: number;
      SOFT_FAIL: number;
      WARNING: number;
    };
    function debug(message: any, data: any): void;
    function error(message: any, data: any): void;
    function exception(exception: any, message: any, data: any): void;
    function getLevel(): any;
    function info(message: any, data: any): void;
    function internal(
      message: any,
      data: any,
      level: any,
      exception: any,
    ): void;
    const isDebugMode: any;
    const logJson: boolean;
    function methodCall(self: any, methodName: any, args: any): void;
    function methodException(
      exception: any,
      self: any,
      methodName: any,
      args: any,
    ): void;
    function perf(message: any, data: any): void;
    function prepareInternalJsonLogLine(
      message: any,
      data: any,
      level: any,
      exception: any,
    ): any;
    function prepareInternalLogLine(
      message: any,
      data: any,
      level: any,
      exception: any,
    ): any;
    function prepareInternalPlainLogLine(
      message: any,
      data: any,
      level: any,
      exception: any,
    ): any;
    function setLevel(level: any): void;
    const skipLevelInfo: boolean;
    const skipTimeInDev: boolean;
    function softFail(message: any, data: any): void;
    function warning(message: any, data: any): void;
  }
  namespace puppeteer {
    function blockResources(page: any, resourceTypes: any): void;
    function cacheResponses(page: any, cache: any, responseUrlRules: any): void;
    function compileScript(scriptString: any, context: any): any;
    function enqueueLinks(args: any): any;
    function enqueueRequestsFromClickableElements(
      page: any,
      selector: any,
      purls: any,
      requestQueue: any,
      requestOpts: any,
    ): any;
    function hideWebDriver(page: any): void;
    function injectFile(page: any, filePath: any): any;
    function injectJQuery(page: any): any;
    function injectUnderscore(page: any): any;
  }
  function sleep(millis: any): any;
  namespace social {
    const EMAIL_REGEX: RegExp;
    const EMAIL_REGEX_GLOBAL: RegExp;
    const FACEBOOK_REGEX: RegExp;
    const FACEBOOK_REGEX_GLOBAL: RegExp;
    const INSTAGRAM_REGEX: RegExp;
    const INSTAGRAM_REGEX_GLOBAL: RegExp;
    const LINKEDIN_REGEX: RegExp;
    const LINKEDIN_REGEX_GLOBAL: RegExp;
    const TWITTER_REGEX: RegExp;
    const TWITTER_REGEX_GLOBAL: RegExp;
    function emailsFromText(text: any): any;
    function emailsFromUrls(urls: any): any;
    function parseHandlesFromHtml(html: any, data: any): any;
    function phonesFromText(text: any): any;
    function phonesFromUrls(urls: any): any;
  }
}

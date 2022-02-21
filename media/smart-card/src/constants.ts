export enum SmartLinkAlignment {
  Left = 'left',
  Right = 'right',
}

export enum SmartLinkDirection {
  Horizontal = 'horizontal',
  Vertical = 'vertical',
}

export enum SmartLinkPosition {
  Top = 'top',
  Center = 'center',
}

export enum SmartLinkSize {
  XLarge = 'xlarge',
  Large = 'large',
  Medium = 'medium',
  Small = 'small',
}

export enum SmartLinkStatus {
  Pending = 'pending',
  Resolving = 'resolving',
  Resolved = 'resolved',

  Forbidden = 'forbidden',
  Errored = 'errored',
  NotFound = 'not_found',
  Unauthorized = 'unauthorized',

  Fallback = 'fallback',
}

export enum SmartLinkTheme {
  Black = 'black',
  Link = 'link',
}

export enum SmartLinkWidth {
  FitToContent = 'fit-to-content',
  Flexible = 'flexible',
}

// When adding an element...
// 1) Create base element if it doesn't already existed.
//    Base element are inside src/view/FlexibleCard/components/elements.
//    E.g. Badge,DateTime, Icon, Lozenge, etc.
// 2) Update FlexibleUiContext with the new prop for data representing
//    the element, preferably with the same name as the element itself.
//    (src/state/flexible-ui-context/types.ts)
// 3) Update Flexible UI extractor (src/extractors/flexible/index.ts)
// 4) Set base element and data mapping.
//    (src/view/FlexibleCard/components/elements/utils.tsx)
// 5) Create element. (src/view/FlexibleCard/components/elements/index.ts)
// 6) Update element ElementDisplaySchema for inline/block display
//    (src/view/FlexibleCard/components/blocks/utils.tsx)
export enum ElementName {
  AuthorGroup = 'AuthorGroup',
  CollaboratorGroup = 'CollaboratorGroup',
  CommentCount = 'CommentCount',
  CreatedBy = 'CreatedBy',
  CreatedOn = 'CreatedOn',
  LinkIcon = 'LinkIcon',
  ModifiedBy = 'ModifiedBy',
  ModifiedOn = 'ModifiedOn',
  Priority = 'Priority',
  ProgrammingLanguage = 'ProgrammingLanguage',
  Snippet = 'Snippet',
  State = 'State',
  SubscriberCount = 'SubscriberCount',
  Title = 'Title',
}

export enum ActionName {
  DeleteAction = 'DeleteAction',
}

export enum IconType {
  Archive = 'FileType:Archive',
  Audio = 'FileType:Audio',
  Blog = 'FileType:Blog',
  Code = 'FileType:Code',
  Document = 'FileType:Document',
  Executable = 'FileType:Executable',
  File = 'FileType:File',
  Folder = 'FileType:Folder',
  Generic = 'FileType:Generic',
  GIF = 'FileType:GIF',
  GoogleDocs = 'FileType:GoogleDocs',
  GoogleForms = 'FileType:GoogleForms',
  GoogleSheets = 'FileType:GoogleSheets',
  GoogleSlides = 'FileType:GoogleSlides',
  Image = 'FileType.Image',
  MSExcel = 'FileType:Excel',
  MSPowerpoint = 'FileType:Powerpoint',
  MSWord = 'FileType:WordDocument',
  PDF = 'FileType:PDF',
  Presentation = 'FileType:Presentation',
  Sketch = 'FileType:Sketch',
  Spreadsheet = 'FileType:Spreadsheet',
  Template = 'FileType:Template',
  Video = 'FileType:Video',

  // BitBucket?
  Branch = 'BitBucket:Branch',
  Commit = 'BitBucket:Commit',
  Project = 'BitBucket:Project',
  PullRequest = 'BitBucket:PullRequest',
  Repo = 'BitBucket:Repo',

  // Jira?
  Bug = 'Jira:Bug',
  Change = 'Jira:Change',
  Epic = 'Jira:Epic',
  Incident = 'Jira:Incident',
  Problem = 'Jira:Problem',
  ServiceRequest = 'Jira:ServiceRequest',
  Story = 'Jira:Story',
  SubTask = 'Jira:SubTask',
  Task = 'Jira:Task',

  // Provider
  Confluence = 'Provider:Confluence',
  Jira = 'Provider:Jira',

  // Fallback
  Default = 'Default',
  Error = 'Default:Error',
  Forbidden = 'Default:Forbidden',

  // Badge
  Comment = 'Badge:Comment',
  PriorityBlocker = 'Badge:PriorityBlocker',
  PriorityCritical = 'Badge:PriorityCritical',
  PriorityHigh = 'Badge:PriorityHigh',
  PriorityHighest = 'Badge:PriorityHighest',
  PriorityLow = 'Badge:PriorityLow',
  PriorityLowest = 'Badge:PriorityLowest',
  PriorityMajor = 'Badge:PriorityMajor',
  PriorityMedium = 'Badge:PriorityMedium',
  PriorityMinor = 'Badge:PriorityMinor',
  PriorityTrivial = 'Badge:PriorityTrivial',
  PriorityUndefined = 'Badge:PriorityUndefined',
  ProgrammingLanguage = 'Badge:ProgrammingLanguage',
  Subscriber = 'Badge:Subscriber',
}

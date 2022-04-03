export type SupernovaPluginOptions = {
  apiToken: string
  workspaceId: string
  designSystemId: string
  designSystemVersionId: string

  searchOptions?: {
    indexText: boolean
    indexPageTitles: boolean
    indexGroupTitles: boolean
  }
}

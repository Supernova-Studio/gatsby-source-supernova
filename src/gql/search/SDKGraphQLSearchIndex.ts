//
//  SDKGraphQLSearchIndex.ts
//  Supernova Gatsby Source
//
//  Created by Jiri Trecak <jiri@supernova.io>
//  Supernova.io
//

// --- --- --- --- --- --- --- --- --- --- --- --- --- --- --- --- --- --- --- --- --- --- --- --- --- --- ---
// MARK: - Imports

import * as SupernovaSDK from "@supernovaio/supernova-sdk"
import { GraphQLNode, SearchIndexEntry } from "../../gql_types/SupernovaTypes"
import { UtilsLookup } from "../convenience/UtilLookup"
import { PARENT_SOURCE, SDKGraphQLObjectConvertor } from "../SDKGraphQLObjectConvertor"

// --- --- --- --- --- --- --- --- --- --- --- --- --- --- --- --- --- --- --- --- --- --- --- --- --- --- ---
// MARK: - Search index configuration

export type SDKGraphQLSearchIndexSettings = {
  indexText: boolean
  indexPageTitles: boolean
  indexGroupTitles: boolean
}

// --- --- --- --- --- --- --- --- --- --- --- --- --- --- --- --- --- --- --- --- --- --- --- --- --- --- ---
// MARK: - Search index implementation

export class SDKGraphQLSearchIndex {
  // --- Properties

  settings: SDKGraphQLSearchIndexSettings

  // --- Constructor

  constructor(settings: SDKGraphQLSearchIndexSettings | undefined) {
    this.settings = settings ?? SDKGraphQLSearchIndex.defaultSearchIndexSettings()
  }

  // --- Settings

  /** Retrieve default-configured index settings */
  static defaultSearchIndexSettings(): SDKGraphQLSearchIndexSettings {
    return {
      indexText: true,
      indexPageTitles: true,
      indexGroupTitles: true,
    }
  }

  // --- Search index

  /** Build search index nodes based on the configuration */
  buildSearchIndex(
    pages: Array<SupernovaSDK.DocumentationPage>,
    groups: Array<SupernovaSDK.DocumentationGroup>
  ): {
    sdkPages: Array<SupernovaSDK.DocumentationPage>
    sdkGroups: Array<SupernovaSDK.DocumentationGroup>
    graphQLNodes: Array<SearchIndexEntry>
  } {
    let nodes = this.constructSearchIndexNodes(this.settings, pages, groups)
    return {
      sdkPages: pages,
      sdkGroups: groups,
      graphQLNodes: nodes,
    }
  }

  private constructSearchIndexNodes(
    settings: SDKGraphQLSearchIndexSettings,
    pages: Array<SupernovaSDK.DocumentationPage>,
    groups: Array<SupernovaSDK.DocumentationGroup>
  ): Array<SearchIndexEntry> {
    let entries = new Array<SearchIndexEntry>()

    // Push index nodes for pages
    for (let page of pages) {
      let blocks = UtilsLookup.flattenedBlocksOfPage(page)
      if (settings.indexPageTitles) {
        entries.push(this.indexedPageTitle(page))
      }
      if (settings.indexText) {
        entries = entries.concat(this.indexedPageTexts(page, blocks))
      }
    }

    // Push index nodes for groups
    if (settings.indexGroupTitles) {
      for (let group of groups) {
        entries.push(this.indexedGroupTitle(group))
      }
    }

    // Important: Fix search id for all blocks
    this.computeHash(entries)

    return entries
  }

  private indexedPageTitle(page: SupernovaSDK.DocumentationPage): SearchIndexEntry {
    let entry: SearchIndexEntry = {
      ...this.baseGQLObject(),
      text: page.title,
      origin: {
        pageId: page.id,
        groupId: null,
        blockId: null,
        blockType: null,
        type: "page",
      },
    }

    return entry
  }

  private indexedPageTexts(page: SupernovaSDK.DocumentationPage, blocks: Array<SupernovaSDK.DocumentationPageBlock>): Array<SearchIndexEntry> {
    let entries = new Array<SearchIndexEntry>()
    for (let block of blocks) {
      // Index only blocks with usable text
      let usableText = this.indexableRichText(block)
      if (usableText) {
        let text = usableText.spans.map((t) => t.text).join("")
        if (text.length > 0) {
          let entry: SearchIndexEntry = {
            ...this.baseGQLObject(),
            text: text,
            origin: {
              pageId: page.id,
              blockId: block.id,
              type: "block",
              blockType: block.type,
              groupId: null,
            },
          }
          entries.push(entry)
        }
      }
    }
    return entries
  }

  private indexedGroupTitle(group: SupernovaSDK.DocumentationGroup): SearchIndexEntry {
    let entry: SearchIndexEntry = {
      ...this.baseGQLObject(),
      text: group.title,
      origin: {
        pageId: null,
        groupId: group.id,
        blockId: null,
        blockType: null,
        type: "group",
      },
    }

    return entry
  }

  private indexableRichText(block: SupernovaSDK.DocumentationPageBlock): SupernovaSDK.DocumentationRichText | null {
    if (block instanceof SupernovaSDK.DocumentationPageBlockText) {
      let text = block.text
      return text
    }

    return null
  }

  private computeHash(entries: Array<SearchIndexEntry>): Array<SearchIndexEntry> {

    let id = 1
    for (let entry of entries) {
      // For each object, fix ID in sequence and compute hash afterwards
      let xid = `si-${id++}`
      entry.id = xid
      entry.internal.contentDigest = SDKGraphQLObjectConvertor.nodeDigest(entry)
    }
    return entries
  }

  private baseGQLObject(): GraphQLNode {
    return {
      id: "",
      parent: PARENT_SOURCE,
      internal: SDKGraphQLObjectConvertor.nodeInternals("SearchIndexEntry"),
      children: [],
    }
  }
}

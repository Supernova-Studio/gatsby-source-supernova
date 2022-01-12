//
//  SDKGraphQLObjectConvertor.ts
//  Supernova Gatsby Source
//
//  Created by Jiri Trecak <jiri@supernova.io> 
//  Supernova.io 
//

// --- --- --- --- --- --- --- --- --- --- --- --- --- --- --- --- --- --- --- --- --- --- --- --- --- --- ---
// MARK: - Imports

import { DocumentationItemHeader } from "@supernova-studio/supernova-sdk/build/main/sdk/src/model/documentation/configuration/SDKDocumentationItemHeader"
import { DocumentationConfiguration } from "@supernova-studio/supernova-sdk/build/main/sdk/src/model/documentation/SDKDocumentationConfiguration"
import { DocumentationGroup } from "@supernova-studio/supernova-sdk/build/main/sdk/src/model/documentation/SDKDocumentationGroup"
import { DocumentationPage } from "@supernova-studio/supernova-sdk/build/main/sdk/src/model/documentation/SDKDocumentationPage"

import crypto from 'crypto'
import { SupernovaTypes } from "../gql_types/SupernovaTypes"
import { UtilsUrls } from "./convenience/UtilsUrls"


// --- --- --- --- --- --- --- --- --- --- --- --- --- --- --- --- --- --- --- --- --- --- --- --- --- --- ---
// MARK: - Definitions

export type NodeInternals = {
  type: string,
  contentDigest: string | null
}

export const PARENT_SOURCE: string = "__SOURCE__"


// --- --- --- --- --- --- --- --- --- --- --- --- --- --- --- --- --- --- --- --- --- --- --- --- --- --- ---
// MARK: - Template implementation

export class SDKGraphQLObjectConvertor {

  // --- Documentation objects

  documentationPages(sdkGroups: Array<DocumentationGroup>, sdkPages: Array<DocumentationPage>): Array<SupernovaTypes.DocumentationPage> {

    let graphQLNodes: Array<SupernovaTypes.DocumentationPage> = []
    for (let page of sdkPages) {
      let header = page.configuration.header
      const pageNode = {
        id: page.id,
        persistentId: page.persistentId,
        parent: PARENT_SOURCE,
        internal: SDKGraphQLObjectConvertor.nodeInternals("DocumentationItem"),
        children: [],
        itemType: page.type,

        slug: UtilsUrls.documentationObjectSlug(page),
        firstPageSlug: UtilsUrls.documentationObjectSlug(page), // Note: For page, first page slug is always the page slug itself
        parentGroupId: page.parent?.id ?? null,
        parentGroupChain: UtilsUrls.groupChainUntilRoot(page),

        title: page.title,
        blockIds: page.blocks.map(b => b.id),
        configuration: {
          showSidebar: page.configuration.showSidebar,
          header: this.documentationItemHeader(header)
        }
      }
      pageNode.internal.contentDigest = SDKGraphQLObjectConvertor.nodeDigest(pageNode)
      graphQLNodes.push(pageNode)
    }

    return graphQLNodes
  }

  documentationGroups(sdkGroups: Array<DocumentationGroup>): Array<SupernovaTypes.DocumentationGroup> {

    let graphQLNodes: Array<SupernovaTypes.DocumentationGroup> = []
    for (let group of sdkGroups) {
      let header = group.configuration.header
      const groupNode = {
        id: group.id,
        persistentId: group.persistentId,
        parent: PARENT_SOURCE,
        internal: SDKGraphQLObjectConvertor.nodeInternals("DocumentationItem"),
        children: [],
        itemType: group.type,

        slug: UtilsUrls.documentationObjectSlug(group),
        firstPageSlug: UtilsUrls.firstPageObjectSlug(group),
        parentGroupId: group.parent?.id ?? null,
        parentGroupChain: UtilsUrls.groupChainUntilRoot(group),

        subpageIds: group.pages.map(p => p.id),
        subgroupIds: group.subgroups.map(g => g.id),
        subitemIds: group.childrenIds,

        title: group.title,
        isRoot: group.isRoot,
        groupBehavior: group.groupBehavior,
        configuration: {
          showSidebar: group.configuration.showSidebar,
          header: this.documentationItemHeader(header)
        }
      }
      groupNode.internal.contentDigest = SDKGraphQLObjectConvertor.nodeDigest(groupNode)
      graphQLNodes.push(groupNode)
    }

    return graphQLNodes
  }

  documentationItemHeader(header: DocumentationItemHeader): SupernovaTypes.DocumentationItemHeader {

    return {
      backgroundImageAssetUrl: header.backgroundImageAssetUrl,
      backgroundImageAssetId: header.backgroundImageAssetId,
      backgroundImageScaleType: header.backgroundImageScaleType,
      description: header.description,
      alignment: header.alignment,
      foregroundColor: header.foregroundColor?.value ?? null,
      backgroundColor: header.backgroundColor?.value ?? null,
      showBackgroundOverlay: header.showBackgroundOverlay,
      showCoverText: header.showCoverText,
      minHeight: header.minHeight,
    }
  }

  documentationConfiguration(sdkConfiguration: DocumentationConfiguration): SupernovaTypes.DocumentationConfiguration {

    let configurationNode = {
      id: "configuration",
      parent: PARENT_SOURCE,
      internal: SDKGraphQLObjectConvertor.nodeInternals("DocumentationConfiguration"),
      children: [],
      tabbedNavigation: sdkConfiguration.tabbedNavigation,
      storybookError: sdkConfiguration.storybookError,
      packageJson: sdkConfiguration.packageJson
    }

    configurationNode.internal.contentDigest = SDKGraphQLObjectConvertor.nodeDigest(configurationNode)
    return configurationNode
  }

  // --- Convenience

  static nodeInternals(type: string): NodeInternals {
    return {
      type: type,
      contentDigest: null
    }
  }

  static nodeDigest(node: Object): string {
    let content = JSON.stringify(node)
    return crypto.createHash(`md5`).update(content).digest(`hex`)
  }
}
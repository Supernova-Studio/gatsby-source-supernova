//
//  SDKGraphQLObjectConvertor.ts
//  Supernova Gatsby Source
//
//  Created by Jiri Trecak <jiri@supernova.io> 
//  Supernova.io 
//

// --- --- --- --- --- --- --- --- --- --- --- --- --- --- --- --- --- --- --- --- --- --- --- --- --- --- ---
// MARK: - Imports

import * as SupernovaSDK from '@supernovaio/supernova-sdk'
import { ExporterCustomBlockProperty } from '@supernovaio/supernova-sdk'
import crypto from 'crypto'
import { DocumentationGroupBehavior, DocumentationConfiguration, DocumentationGroup, DocumentationItemHeader, DocumentationPage, AssetScaleType, Alignment, DocumentationItemType, ExporterCustomBlock, ExporterConfigurationProperty, Exporter, ExporterCustomBlockVariant, ExporterCustomBlockMode } from 'gql_types/SupernovaTypes'
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

  documentationPages(sdkGroups: Array<SupernovaSDK.DocumentationGroup>, sdkPages: Array<SupernovaSDK.DocumentationPage>): Array<DocumentationPage> {

    let graphQLNodes: Array<DocumentationPage> = []
    for (let page of sdkPages) {
      let header = page.configuration.header
      const pageNode = {
        id: page.id,
        persistentId: page.persistentId,
        parent: PARENT_SOURCE,
        internal: SDKGraphQLObjectConvertor.nodeInternals("DocumentationItem"),
        children: [],
        itemType: this.convertItemType(page.type),

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

  documentationGroups(sdkGroups: Array<SupernovaSDK.DocumentationGroup>): Array<DocumentationGroup> {

    let graphQLNodes: Array<DocumentationGroup> = []
    for (let group of sdkGroups) {
      let header = group.configuration.header
      const groupNode = {
        id: group.id,
        persistentId: group.persistentId,
        parent: PARENT_SOURCE,
        internal: SDKGraphQLObjectConvertor.nodeInternals("DocumentationItem"),
        children: [],
        itemType: this.convertItemType(group.type),

        slug: UtilsUrls.documentationObjectSlug(group),
        firstPageSlug: UtilsUrls.firstPageObjectSlug(group),
        parentGroupId: group.parent?.id ?? null,
        parentGroupChain: UtilsUrls.groupChainUntilRoot(group),

        subpageIds: group.pages.map(p => p.id),
        subgroupIds: group.subgroups.map(g => g.id),
        subitemIds: group.childrenIds,

        title: group.title,
        isRoot: group.isRoot,
        groupBehavior: this.convertGroupBehavior(group.groupBehavior),
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

  documentationItemHeader(header: SupernovaSDK.DocumentationItemHeader): DocumentationItemHeader {

    return {
      backgroundImageAssetUrl: header.backgroundImageAssetUrl,
      backgroundImageAssetId: header.backgroundImageAssetId,
      backgroundImageScaleType: this.convertBackgroundImageScaleType(header.backgroundImageScaleType),
      description: header.description,
      alignment: this.convertAlignment(header.alignment),
      foregroundColor: header.foregroundColor?.value ?? null,
      backgroundColor: header.backgroundColor?.value ?? null,
      showBackgroundOverlay: header.showBackgroundOverlay,
      showCoverText: header.showCoverText,
      minHeight: header.minHeight,
    }
  }

  documentationConfiguration(sdkConfiguration: SupernovaSDK.DocumentationConfiguration): DocumentationConfiguration {

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

  exporters(sdkExporters: Array<SupernovaSDK.Exporter>): Array<Exporter> {

    let graphQLNodes: Array<Exporter> = []
    for (let exporter of sdkExporters) {
      const exporterNode = {
        id: exporter.id,
        parent: PARENT_SOURCE,
        internal: SDKGraphQLObjectConvertor.nodeInternals("Exporter"),
        children: [],
        
        packageId: exporter.packageId,
        isPrivate: exporter.isPrivate,
        isDefaultDocumentationExporter: exporter.isDefaultDocumentationExporter,
        usesBrands: exporter.usesBrands,
        name: exporter.name,
        description: exporter.description,
        version: exporter.version,
        author: exporter.author,
        organization: exporter.organization,
        homepage: exporter.homepage,
        readme: exporter.readme,
        iconURL: exporter.iconURL,
        tags: exporter.tags,
        origin: exporter.origin,

        contributes: {
          customBlocks: this.exporterCustomBlocks(exporter.contributes.blocks),
          customConfigurationProperties: this.exporterConfigurationProperties(exporter.contributes.configuration),
          customBlockVariants: this.exporterCustomVariants(exporter.contributes.blockVariants)
        }
      }
      exporterNode.internal.contentDigest = SDKGraphQLObjectConvertor.nodeDigest(exporterNode)
      graphQLNodes.push(exporterNode)
    }

    return graphQLNodes
  }

  exporterCustomBlocks(sdkBlocks: Array<SupernovaSDK.ExporterCustomBlock>): Array<ExporterCustomBlock> {

    let graphQLNodes: Array<ExporterCustomBlock> = []
    let idC = 0
    for (let block of sdkBlocks) {
      const blockNode = {
        id: `${idC++}`,
        parent: PARENT_SOURCE,
        internal: SDKGraphQLObjectConvertor.nodeInternals("ExporterBlock"),
        children: [],

        key: block.key,
        title: block.title,
        description: block.description,
        category: block.category,
        iconUrl: block.iconUrl,
        mode: this.convertBlockMode(block.mode),
        properties: this.exporterCustomBlockProperties(block.properties)
      }
      blockNode.internal.contentDigest = SDKGraphQLObjectConvertor.nodeDigest(blockNode)
      graphQLNodes.push(blockNode)
    }

    return graphQLNodes
  }

  exporterCustomBlockProperties(sdkProperty: Array<SupernovaSDK.ExporterCustomBlockProperty>): Array<ExporterCustomBlockProperty> {

  }

  exporterConfigurationProperties(sdkProperties: Array<SupernovaSDK.ExporterConfigurationProperty>): Array<ExporterConfigurationProperty> {

  }

  exporterCustomVariants(sdkVariants: Array<SupernovaSDK.ExporterCustomBlockVariant>): Array<ExporterCustomBlockVariant> {

    let graphQLNodes: Array<ExporterCustomBlockVariant> = []
    let idC = 0
    for (let variant of sdkVariants) {
      const variantNode = {
        id: `${idC++}`,
        parent: PARENT_SOURCE,
        internal: SDKGraphQLObjectConvertor.nodeInternals("ExporterVariant"),
        children: [],

        blockKey: variant.blockKey,
        variantKey: variant.variantKey,
        name: variant.name,
        isDefault: variant.isDefault
      }
      variantNode.internal.contentDigest = SDKGraphQLObjectConvertor.nodeDigest(variantNode)
      graphQLNodes.push(variantNode)
    }

    return graphQLNodes
  }

  // --- Subconversions

  convertBlockMode(mode: SupernovaSDK.ExporterCustomBlockMode): ExporterCustomBlockMode {

    switch (mode) {
      case SupernovaSDK.ExporterCustomBlockMode.block: return ExporterCustomBlockMode.block
    }
  }

  convertItemType(itemType: SupernovaSDK.DocumentationItemType): DocumentationItemType {

    switch (itemType) {
      case SupernovaSDK.DocumentationItemType.group: return DocumentationItemType.group 
      case SupernovaSDK.DocumentationItemType.page: return DocumentationItemType.page
    }
  }

  convertBackgroundImageScaleType(scaleType: SupernovaSDK.AssetScaleType): AssetScaleType {

    switch (scaleType) {
      case SupernovaSDK.AssetScaleType.aspectFill: return AssetScaleType.aspectFill 
      case SupernovaSDK.AssetScaleType.aspectFit: return AssetScaleType.aspectFit
    }
  }

  convertAlignment(alignment: SupernovaSDK.Alignment): Alignment {

    switch (alignment) {
      case SupernovaSDK.Alignment.center: return Alignment.center 
      case SupernovaSDK.Alignment.left: return Alignment.left 
      case SupernovaSDK.Alignment.stretch: return Alignment.stretch 
    }
  }

  convertGroupBehavior(groupBehavior: SupernovaSDK.DocumentationGroupBehavior): DocumentationGroupBehavior {

    switch (groupBehavior) {
      case SupernovaSDK.DocumentationGroupBehavior.group: return DocumentationGroupBehavior.group 
      case SupernovaSDK.DocumentationGroupBehavior.tabs: return DocumentationGroupBehavior.tabs
    }
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
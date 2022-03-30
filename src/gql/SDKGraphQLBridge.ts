//
//  SDKGraphQLBridge.ts
//  Supernova Gatsby Source
//
//  Created by Jiri Trecak <jiri@supernova.io> 
//  Supernova.io 
//

// --- --- --- --- --- --- --- --- --- --- --- --- --- --- --- --- --- --- --- --- --- --- --- --- --- --- ---
// MARK: - Imports

import * as SupernovaSDK from "@supernovaio/supernova-sdk"
import { Supernova } from "@supernovaio/supernova-sdk"
import { DocumentationPage, DocumentationPageBlock, DocumentationGroup, DocumentationConfiguration, Asset, Token, TokenGroup, ExporterCustomBlock, ExporterCustomBlockVariant, ExporterConfigurationProperty } from "../gql_types/SupernovaTypes"
import { SDKGraphQLAssetConvertor } from "./SDKGraphQLAssetConvertor"
import { SDKGraphQLDocBlockConvertor } from "./SDKGraphQLDocBlockConvertor"
import { SDKGraphQLObjectConvertor } from "./SDKGraphQLObjectConvertor"
import { SDKGraphQLTokenConvertor } from "./SDKGraphQLTokenConvertor"


// --- --- --- --- --- --- --- --- --- --- --- --- --- --- --- --- --- --- --- --- --- --- --- --- --- --- ---
// MARK: - Template implementation

export class SDKGraphQLBridge {

  // --- Properties

  supernova: SupernovaSDK.Supernova
  workspace: SupernovaSDK.Workspace
  version: SupernovaSDK.DesignSystemVersion
  documentation: SupernovaSDK.Documentation
  itemConvertor: SDKGraphQLObjectConvertor
  assetConvertor: SDKGraphQLAssetConvertor
  tokenConvertor: SDKGraphQLTokenConvertor
  docBlockConvertor: SDKGraphQLDocBlockConvertor

  // --- Constructor

  constructor(supernova: SupernovaSDK.Supernova, workspace: SupernovaSDK.Workspace, version: SupernovaSDK.DesignSystemVersion, documentation: SupernovaSDK.Documentation) {
    this.supernova = supernova
    this.workspace = workspace
    this.version = version
    this.documentation = documentation
    this.itemConvertor = new SDKGraphQLObjectConvertor()
    this.assetConvertor = new SDKGraphQLAssetConvertor()
    this.tokenConvertor = new SDKGraphQLTokenConvertor()
    this.docBlockConvertor = new SDKGraphQLDocBlockConvertor()
  }

  // --- Data Bridge

  /** Build and convert SDK documentation pages */
  async documentationPages(groups: Array<SupernovaSDK.DocumentationGroup>): Promise<{
    sdkObjects: Array<SupernovaSDK.DocumentationPage>
    graphQLNodes: Array<DocumentationPage>
  }> {

    let pages = await this.documentation.pages()
    return {
      sdkObjects: pages,
      graphQLNodes: this.itemConvertor.documentationPages(groups, pages)
    }
  }

  /** Build and convert SDK documentation blocks */
  async documentationBlocks(pages: Array<SupernovaSDK.DocumentationPage>): Promise<{
    sdkObjects: Array<SupernovaSDK.DocumentationPageBlock>
    graphQLNodes: Array<DocumentationPageBlock>
  }> {

    let blocks: Array<SupernovaSDK.DocumentationPageBlock> = []
    let graphQLNodes: Array<DocumentationPageBlock> = []

    for (let page of pages) {
      let pageBlocks = this.docBlockConvertor.flattenedBlocksOfPage(page)
      let graphQLBlocks = this.docBlockConvertor.documentationPageBlocks(page)
      blocks = pageBlocks.concat(blocks)
      graphQLNodes = graphQLBlocks.concat(graphQLNodes)
    }
    return {
      sdkObjects: blocks,
      graphQLNodes: graphQLNodes
    }
  }

  /** Build and convert SDK documentation groups */
  async documentationGroups(): Promise<{
    sdkObjects: Array<SupernovaSDK.DocumentationGroup>
    graphQLNodes: Array<DocumentationGroup>
  }> {

    let groups = await this.documentation.groups()
    return {
      sdkObjects: groups,
      graphQLNodes: this.itemConvertor.documentationGroups(groups)
    }
  }

  /** Build and convert SDK documentation configuration */
  async documentationConfiguration(): Promise<{
    sdkObject: SupernovaSDK.DocumentationConfiguration
    graphQLNode: DocumentationConfiguration
  }> {
    let configuration = this.documentation.settings
    return {
      sdkObject: configuration,
      graphQLNode: this.itemConvertor.documentationConfiguration(configuration)
    }
  }

  /** Build and convert SDK exporters */
  /*
  async exporters(): Promise<{
    sdkObjects: Array<SupernovaSDK.Exporter>,
    graphQLNodes: Array<Exporter>
  }> {

    let exporters = await this.workspace.exporters()
    return {
      sdkObjects: exporters,
      graphQLNodes: this.itemConvertor.exporters(exporters)
    }
  }
  */

  /** Build and convert SDK documentation custom blocks */
  async documentationCustomBlocks(): Promise<{
    sdkObjects: Array<SupernovaSDK.ExporterCustomBlock>,
    graphQLNodes: Array<ExporterCustomBlock>
  }> {

    let blocks = await this.documentation.customBlocks()
    return {
      sdkObjects: blocks,
      graphQLNodes: this.itemConvertor.exporterCustomBlocks(blocks)
    }
  }

  /** Build and convert SDK documentation custom block variants */
  async documentationCustomBlockVariants(): Promise<{
    sdkObjects: Array<SupernovaSDK.ExporterCustomBlockVariant>,
    graphQLNodes: Array<ExporterCustomBlockVariant>
  }> {

    let blockVariants = await this.documentation.customBlockVariants()
    return {
      sdkObjects: blockVariants,
      graphQLNodes: this.itemConvertor.exporterCustomVariants(blockVariants)
    }
  }

  /** Build and convert SDK documentation custom configuration */
  async documentationCustomConfiguration(): Promise<{
    sdkObjects: Array<SupernovaSDK.ExporterConfigurationProperty>,
    graphQLNodes: Array<ExporterConfigurationProperty>
  }> {

    let properties = await this.documentation.customConfiguration()
    return {
      sdkObjects: properties,
      graphQLNodes: this.itemConvertor.exporterConfigurationProperties(properties)
    }
  }

  /** Build and convert SDK assets */
  async assets(): Promise<{
    sdkObjects: Array<SupernovaSDK.Asset>
    graphQLNodes: Array<Asset>
  }> {

    let assets = await this.version.assets()
    return {
      sdkObjects: assets,
      graphQLNodes: this.assetConvertor.assets(assets)
    }
  }

  /** Build and convert SDK tokens */
  async tokens(): Promise<{
    sdkObjects: Array<SupernovaSDK.Token>
    graphQLNodes: Array<Token>
  }> {

    let tokens = await this.version.tokens()
    return {
      sdkObjects: tokens,
      graphQLNodes: this.tokenConvertor.tokens(tokens)
    }
  }

  /** Build and convert SDK token groups */
  async tokenGroups(): Promise<{
    sdkObjects: Array<SupernovaSDK.TokenGroup>
    graphQLNodes: Array<TokenGroup>
  }> {

    let tokenGroups = await this.version.tokenGroups()
    return {
      sdkObjects: tokenGroups,
      graphQLNodes: this.tokenConvertor.tokenGroups(tokenGroups)
    }
  }
}
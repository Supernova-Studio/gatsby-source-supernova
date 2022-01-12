//
//  SDKGraphQLBridge.ts
//  Supernova Gatsby Source
//
//  Created by Jiri Trecak <jiri@supernova.io> 
//  Supernova.io 
//

// --- --- --- --- --- --- --- --- --- --- --- --- --- --- --- --- --- --- --- --- --- --- --- --- --- --- ---
// MARK: - Imports

import { DesignSystemVersion } from "@supernova-studio/supernova-sdk/build/main/sdk/src/core/SDKDesignSystemVersion"
import { Documentation } from "@supernova-studio/supernova-sdk/build/main/sdk/src/core/SDKDocumentation"
import { Asset } from "@supernova-studio/supernova-sdk/build/main/sdk/src/model/assets/SDKAsset"
import { DocumentationConfiguration } from "@supernova-studio/supernova-sdk/build/main/sdk/src/model/documentation/SDKDocumentationConfiguration"
import { DocumentationGroup } from "@supernova-studio/supernova-sdk/build/main/sdk/src/model/documentation/SDKDocumentationGroup"
import { DocumentationPage } from "@supernova-studio/supernova-sdk/build/main/sdk/src/model/documentation/SDKDocumentationPage"
import { DocumentationPageBlock } from "@supernova-studio/supernova-sdk/build/main/sdk/src/model/documentation/SDKDocumentationPageBlock"
import { TokenGroup } from "@supernova-studio/supernova-sdk/build/main/sdk/src/model/groups/SDKTokenGroup"
import { Token } from "@supernova-studio/supernova-sdk/build/main/sdk/src/model/tokens/SDKToken"
import { SupernovaTypes } from "../gql_types/SupernovaTypes"
import { SDKGraphQLAssetConvertor } from "./SDKGraphQLAssetConvertor"
import { SDKGraphQLDocBlockConvertor } from "./SDKGraphQLDocBlockConvertor"
import { SDKGraphQLObjectConvertor } from "./SDKGraphQLObjectConvertor"
import { SDKGraphQLTokenConvertor } from "./SDKGraphQLTokenConvertor"


// --- --- --- --- --- --- --- --- --- --- --- --- --- --- --- --- --- --- --- --- --- --- --- --- --- --- ---
// MARK: - Template implementation

export class SDKGraphQLBridge {

  // --- Properties

  version: DesignSystemVersion
  documentation: Documentation
  itemConvertor: SDKGraphQLObjectConvertor
  assetConvertor: SDKGraphQLAssetConvertor
  tokenConvertor: SDKGraphQLTokenConvertor
  docBlockConvertor: SDKGraphQLDocBlockConvertor

  // --- Constructor

  constructor(version: DesignSystemVersion, documentation: Documentation) {
    this.version = version
    this.documentation = documentation
    this.itemConvertor = new SDKGraphQLObjectConvertor()
    this.assetConvertor = new SDKGraphQLAssetConvertor()
    this.tokenConvertor = new SDKGraphQLTokenConvertor()
    this.docBlockConvertor = new SDKGraphQLDocBlockConvertor()
  }

  // --- Data Bridge

  /** Build and convert SDK documentation pages */
  async documentationPages(groups: Array<DocumentationGroup>): Promise<{
    sdkObjects: Array<DocumentationPage>
    graphQLNodes: Array<SupernovaTypes.DocumentationPage>
  }> {

    let pages = await this.documentation.pages()
    return {
      sdkObjects: pages,
      graphQLNodes: this.itemConvertor.documentationPages(groups, pages)
    }
  }

  /** Build and convert SDK documentation blocks */
  async documentationBlocks(pages: Array<DocumentationPage>): Promise<{
    sdkObjects: Array<DocumentationPageBlock>
    graphQLNodes: Array<SupernovaTypes.DocumentationPageBlock>
  }> {

    let blocks: Array<DocumentationPageBlock> = []
    let graphQLNodes: Array<SupernovaTypes.DocumentationPageBlock> = []

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
    sdkObjects: Array<DocumentationGroup>
    graphQLNodes: Array<SupernovaTypes.DocumentationGroup>
  }> {

    let groups = await this.documentation.groups()
    return {
      sdkObjects: groups,
      graphQLNodes: this.itemConvertor.documentationGroups(groups)
    }
  }

  /** Build and convert SDK documentation configuration */
  async documentationConfiguration(): Promise<{
    sdkObject: DocumentationConfiguration
    graphQLNode: SupernovaTypes.DocumentationConfiguration
  }> {
    let configuration = this.documentation.settings
    return {
      sdkObject: configuration,
      graphQLNode: this.itemConvertor.documentationConfiguration(configuration)
    }
  }

  /** Build and convert SDK assets */
  async assets(): Promise<{
    sdkObjects: Array<Asset>
    graphQLNodes: Array<SupernovaTypes.Asset>
  }> {

    let assets = await this.version.assets()
    return {
      sdkObjects: assets,
      graphQLNodes: this.assetConvertor.assets(assets)
    }
  }

  /** Build and convert SDK tokens */
  async tokens(): Promise<{
    sdkObjects: Array<Token>
    graphQLNodes: Array<SupernovaTypes.Token>
  }> {

    let tokens = await this.version.tokens()
    return {
      sdkObjects: tokens,
      graphQLNodes: this.tokenConvertor.tokens(tokens)
    }
  }

  /** Build and convert SDK token groups */
  async tokenGroups(): Promise<{
    sdkObjects: Array<TokenGroup>
    graphQLNodes: Array<SupernovaTypes.TokenGroup>
  }> {

    let tokenGroups = await this.version.tokenGroups()
    return {
      sdkObjects: tokenGroups,
      graphQLNodes: this.tokenConvertor.tokenGroups(tokenGroups)
    }
  }
}
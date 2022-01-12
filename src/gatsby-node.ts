//
//  SDKGraphQLObjectConvertor.ts
//  Supernova Gatsby Source
//
//  Created by Jiri Trecak <jiri@supernova.io> 
//  Supernova.io 
//

// --- --- --- --- --- --- --- --- --- --- --- --- --- --- --- --- --- --- --- --- --- --- --- --- --- --- ---
// MARK: - Imports

import { Supernova } from '@supernova-studio/supernova-sdk'
import { SupernovaPluginOptions } from './types'
import { SDKGraphQLBridge } from './gql/SDKGraphQLBridge'


// --- --- --- --- --- --- --- --- --- --- --- --- --- --- --- --- --- --- --- --- --- --- --- --- --- --- ---
// MARK: - GraphQL Node Processing

exports.sourceNodes = async ({ actions }: { actions: any }, pluginOptions: SupernovaPluginOptions) => {

  // Create Supernova instance, connect it and create data bridge
  let instance = new Supernova(pluginOptions.apiToken, null, null)
  // let designSystem = await instance.designSystem(pluginOptions.designSystemId)
  
  let version = await instance.designSystemVersion(pluginOptions.designSystemId, pluginOptions.designSystemVersionId)
  if (!version) {
    throw Error("Unable to fetch design system version, please provide connect api key, documentation and version id")
  }

  let docs = await version.documentation()
  let bridge = new SDKGraphQLBridge(version, docs)

  // Create all documentation nodes
  let groupResult = await bridge.documentationGroups()
  groupResult.graphQLNodes.forEach(n => actions.createNode(n))

  let pageResult = await bridge.documentationPages(groupResult.sdkObjects)
  pageResult.graphQLNodes.forEach(n => actions.createNode(n))

  let blockResult = await bridge.documentationBlocks(pageResult.sdkObjects)
  blockResult.graphQLNodes.forEach(n => actions.createNode(n))

  let assetResult = await bridge.assets()
  assetResult.graphQLNodes.forEach(n => actions.createNode(n))

  let tokenResult = await bridge.tokens()
  tokenResult.graphQLNodes.forEach(n => actions.createNode(n))

  let tokenGroupResult = await bridge.tokenGroups()
  tokenGroupResult.graphQLNodes.forEach(n => actions.createNode(n))

  let configurationResult = await bridge.documentationConfiguration()
  actions.createNode(configurationResult.graphQLNode)

  return
}

exports.createSchemaCustomization = ({ actions }: { actions: any }) => {

  const { createTypes } = actions

  // Note: Hard-coped from gql-types.graphql. Keep both updated until we load it dynamically
  const typeDefs = `
  type DocumentationBlock implements Node @dontInfer {
    beginsTypeChain: Boolean!
    endsTypeChain: Boolean!
    blockIds: [String]!
    blockType: String!
    groupId: String
    showNestedGroups: Boolean
    text: DocumentationBlockText
    calloutType: String
    headingType: Int
    assets: [DocumentationBlockAsset]
    frames: [DocumentationBlockFigmaFrame]
    shortcuts: [DocumentationBlockShortcut]
    properties: DocumentationBlockProperties
    url: String
    size: Size
    caption: String
    codeLanguage: String
    alignment: String
    key: String
    block: DocumentationCustomBlock
    backgroundColor: String
    showCode: Boolean
    code: String
    packageJSON: String
    height: Int
    sandboxData: String
    sandboxType: String
    tokenIds: [String]
    title: String
    description: String
    thumbnailUrl: String
  }
  
  type DocumentationBlockText @dontInfer {
    spans: [DocumentationBlockTextSpan]
  }
  
  type DocumentationBlockTextSpan @dontInfer {
    text: String
    attributes: [DocumentationBlockTextSpansAttribute]
  }
  
  type DocumentationBlockTextSpansAttribute @dontInfer {
    link: String
    type: String
  }
  
  type DocumentationBlockAsset @dontInfer {
    assetId: String!
    title: String
    description: String
    backgroundColor: String
    previewUrl: String
  }
  
  type DocumentationBlockFigmaFrame @dontInfer {
    sourceFileId: String
    sourceFrameId: String
    sourceFileName: String
    title: String
    description: String
    previewUrl: String
    backgroundColor: String
  }
  
  type DocumentationBlockShortcut @dontInfer {
    title: String
    description: String
    previewUrl: String
    externalUrl: String
    internalId: String
    shortcutType: String
  }
  
  type DocumentationBlockProperties @dontInfer {
    color: String
    alignment: String
    layout: String
    markdownUrl: String
  }
  
  type Size @dontInfer {
    width: Int
    height: Int
  }
  
  type DocumentationCustomBlock @dontInfer {
    key: String!
    title: String!
    category: String
    description: String
    iconUrl: String
    properties: [DocumentationCustomBlockProperty]
  }
  
  type DocumentationCustomBlockProperty @dontInfer {
    label: String
    key: String
    type: String
    default: String
  }
  
  type Asset implements Node @dontInfer {
    brandId: String!
    thumbnailUrl: String
    name: String
    description: String
    componentId: String
    previouslyDuplicatedNames: Int
  }
  
  type DocumentationConfiguration implements Node @dontInfer {
    tabbedNavigation: Boolean
    storybookError: String
    packageJson: String
  }
  
  
  # --- Tokens
  
  type Token implements Node @dontInfer {
  
    id: String!
    brandId: String!
    name: String
    description: String
    tokenType: String!
    origin: SourceOrigin
    properties: [TokenProperty]!
  
    value: TokenValue
  }
  
  type TokenValue {
  
    # Color token value
    hex: String
    r: Int
    g: Int
    b: Int
    a: Int
  
    # Font token value
    font: FontTokenValue
    fontSize: MeasureTokenValue
    textDecoration: String
    textCase: String
    letterSpacing: MeasureTokenValue
    lineHeight: MeasureTokenValue
    paragraphIndent: MeasureTokenValue
  
    # Radius token value
    radius: MeasureTokenValue
    topLeft: MeasureTokenValue
    topRight: MeasureTokenValue
    bottomLeft: MeasureTokenValue
    bottomRight: MeasureTokenValue
  
    # Shadow token value
    color: ColorTokenValue
    x: MeasureTokenValue
    y: MeasureTokenValue
    radius: MeasureTokenValue
    spread: MeasureTokenValue
    opacity: Float
    type: String
  
    # Measure token value
    unit: String
    measure: Float
  
    # Font value
    family: String
    subfamily: String
  
    # Border token value
    # color: ColorTokenValue -> Already included
    width: MeasureTokenValue
    position: String
  
    # Gradient value
    to: GradientPosition
    from: GradientPosition
  
    # type: String -> Already included
    aspectRatio: Float
    stops: [GradientStopValue]
  
    # Text, Generic
    text: String
  
    # Blur 
    # type: String -> Already included
    # radius: MeasureTokenValue -> Already included
  
    # Aliasing
    referencedTokenId: String
  }
  
  type ColorTokenValue {
    hex: String
    r: Int
    g: Int
    b: Int
    a: Int
    referencedTokenId: String
  }
  
  type FontTokenValue {
    family: String
    subfamily: String
    referencedTokenId: String
  }
  
  type MeasureTokenValue {
    unit: String
    measure: Float
    referencedTokenId: String
  }
  
  type GradientStopValue {
    position: Int
    color: ColorTokenValue
    referencedTokenId: String
  }
  
  type GradientPosition {
    x: Float
    y: Float
  }
  
  type TokenProperty {
    name: String
    codeName: String
    type: String
    stringValue: String
    booleanValue: String
    numericValue: String
  }
  
  type SourceOrigin {
    source: String
    id: String
    name: String
  }
  
  
  # --- Token Groups
  
  type GroupToken implements Node @dontInfer {
    brandId: String
    name: String
    description: String!
    tokenType: String
    isRoot: Boolean
    childrenIds: [String]!
    subgroupIds: [String]!
    tokenIds: [String]!
    parentId: String
    path: [String]!
  }
  `

  createTypes(typeDefs)
}
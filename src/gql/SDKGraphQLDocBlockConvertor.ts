//
//  SDKGraphQLDocBlockConvertor.ts
//  Supernova Gatsby Source
//
//  Created by Jiri Trecak <jiri@supernova.io> 
//  Supernova.io 
//

// --- --- --- --- --- --- --- --- --- --- --- --- --- --- --- --- --- --- --- --- --- --- --- --- --- --- ---
// MARK: - Imports

import { DocumentationPage } from "@supernova-studio/supernova-sdk/build/main/sdk/src/model/documentation/SDKDocumentationPage"
import { DocumentationPageBlock } from "@supernova-studio/supernova-sdk/build/main/sdk/src/model/documentation/SDKDocumentationPageBlock"
import { DocumentationPageBlockType } from "@supernova-studio/supernova-sdk/build/main/sdk/src/model/enums/SDKDocumentationPageBlockType"
import { DocumentationPageBlockText } from "@supernova-studio/supernova-sdk/build/main/sdk/src/model/documentation/blocks/SDKDocumentationPageBlockText"
import { DocumentationPageBlockHeading } from "@supernova-studio/supernova-sdk/build/main/sdk/src/model/documentation/blocks/SDKDocumentationPageBlockHeading"
import { DocumentationPageBlockCode } from "@supernova-studio/supernova-sdk/build/main/sdk/src/model/documentation/blocks/SDKDocumentationPageBlockCode"
import { DocumentationPageUnorderedList } from "@supernova-studio/supernova-sdk/build/main/sdk/src/model/documentation/blocks/SDKDocumentationPageBlockUnorderedList"
import { DocumentationPageOrderedList } from "@supernova-studio/supernova-sdk/build/main/sdk/src/model/documentation/blocks/SDKDocumentationPageBlockOrderedList"
import { DocumentationPageBlockQuote } from "@supernova-studio/supernova-sdk/build/main/sdk/src/model/documentation/blocks/SDKDocumentationPageBlockQuote"
import { DocumentationPageBlockCallout } from "@supernova-studio/supernova-sdk/build/main/sdk/src/model/documentation/blocks/SDKDocumentationPageBlockCallout"
import { DocumentationPageBlockDivider } from "@supernova-studio/supernova-sdk/build/main/sdk/src/model/documentation/blocks/SDKDocumentationPageBlockDivider"
import { DocumentationPageBlockImage } from "@supernova-studio/supernova-sdk/build/main/sdk/src/model/documentation/blocks/SDKDocumentationPageBlockImage"
import { DocumentationPageBlockToken } from "@supernova-studio/supernova-sdk/build/main/sdk/src/model/documentation/blocks/SDKDocumentationPageBlockToken"
import { DocumentationPageBlockTokenList } from "@supernova-studio/supernova-sdk/build/main/sdk/src/model/documentation/blocks/SDKDocumentationPageBlockTokenList"
import { DocumentationPageBlockTokenGroup } from "@supernova-studio/supernova-sdk/build/main/sdk/src/model/documentation/blocks/SDKDocumentationPageBlockTokenGroup"
import { DocumentationPageBlockShortcuts } from "@supernova-studio/supernova-sdk/build/main/sdk/src/model/documentation/blocks/SDKDocumentationPageBlockShortcuts"
import { DocumentationPageBlockShortcut, DocumentationPageBlockShortcutType } from "@supernova-studio/supernova-sdk/build/main/sdk/src/model/documentation/blocks/SDKDocumentationPageBlockShortcut"
import { DocumentationPageBlockEmbedLink } from "@supernova-studio/supernova-sdk/build/main/sdk/src/model/documentation/blocks/SDKDocumentationPageBlockEmbedLink"
import { DocumentationPageBlockEmbedFigma } from "@supernova-studio/supernova-sdk/build/main/sdk/src/model/documentation/blocks/SDKDocumentationPageBlockEmbedFigma"
import { DocumentationPageBlockEmbedYoutube } from "@supernova-studio/supernova-sdk/build/main/sdk/src/model/documentation/blocks/SDKDocumentationPageBlockEmbedYoutube"
import { DocumentationPageBlockEmbedStorybook } from "@supernova-studio/supernova-sdk/build/main/sdk/src/model/documentation/blocks/SDKDocumentationPageBlockEmbedStorybook"
import { DocumentationPageBlockEmbedGeneric } from "@supernova-studio/supernova-sdk/build/main/sdk/src/model/documentation/blocks/SDKDocumentationPageBlockEmbedGeneric"
import { DocumentationPageBlockFrames } from "@supernova-studio/supernova-sdk/build/main/sdk/src/model/documentation/blocks/SDKDocumentationPageBlockFrames"
import { DocumentationPageBlockFrame } from "@supernova-studio/supernova-sdk/build/main/sdk/src/model/documentation/blocks/SDKDocumentationPageBlockFrame"
import { DocumentationPageBlockRenderCode } from "@supernova-studio/supernova-sdk/build/main/sdk/src/model/documentation/blocks/SDKDocumentationPageBlockRenderCode"
import { DocumentationPageBlockCustom } from "@supernova-studio/supernova-sdk/build/main/sdk/src/model/documentation/blocks/SDKDocumentationPageBlockCustom"
import { DocumentationPageBlockAssets } from "@supernova-studio/supernova-sdk/build/main/sdk/src/model/documentation/blocks/SDKDocumentationPageBlockAssets"
import { DocumentationPageBlockAsset } from "@supernova-studio/supernova-sdk/build/main/sdk/src/model/documentation/blocks/SDKDocumentationPageBlockAsset"

import { PARENT_SOURCE, SDKGraphQLObjectConvertor } from "./SDKGraphQLObjectConvertor"
import { DocumentationRichText } from "@supernova-studio/supernova-sdk/build/main/sdk/src/model/documentation/SDKDocumentationRichText"
import { Size } from "@supernova-studio/supernova-sdk/build/main/sdk/src/model/support/SDKSize"
import { DocumentationHeadingType } from "@supernova-studio/supernova-sdk/build/main/sdk/src/model/enums/SDKDocumentationHeadingType"
import { DocumentationCalloutType } from "@supernova-studio/supernova-sdk/build/main/sdk/src/model/enums/SDKDocumentationCalloutType"
import { DocumentationCustomBlockPropertyType } from "@supernova-studio/supernova-sdk/build/main/sdk/src/model/documentation/custom_blocks/SDKDocumentationCustomBlockProperty"
import { SupernovaTypes } from "../gql_types/SupernovaTypes"


// --- --- --- --- --- --- --- --- --- --- --- --- --- --- --- --- --- --- --- --- --- --- --- --- --- --- ---
// MARK: - Convertor

export class SDKGraphQLDocBlockConvertor {

  // --- Documentation blocks conversion

  documentationPageBlocks(sdkPage: DocumentationPage): Array<SupernovaTypes.DocumentationPageBlock> {

    let graphQLNodes: Array<SupernovaTypes.DocumentationPageBlock> = []
    let blocks = this.flattenedBlocksOfPage(sdkPage)
    for (let block of blocks) {
      graphQLNodes.push(this.convertBlockToGraphQL(block))
    }

    return graphQLNodes
  }

  convertBlockToGraphQL(block: DocumentationPageBlock): SupernovaTypes.DocumentationPageBlock {

    // Convert base information about blocks
    const blockDescription = {
      id: block.id,
      parent: PARENT_SOURCE,
      internal: SDKGraphQLObjectConvertor.nodeInternals("DocumentationBlock"),
      children: [],
      beginsTypeChain: block.beginsTypeChain,
      endsTypeChain: block.endsTypeChain,
      blockIds: block.children.map(c => c.id),
      blockType: block.type
    } 

    // Convert all details
    let detailedBlockObject = this.convertBlockDetailsToGraphQL(block, blockDescription)

    // Checksum
    detailedBlockObject.internal.contentDigest = SDKGraphQLObjectConvertor.nodeDigest(detailedBlockObject)
    return detailedBlockObject
  }

  // --- Block specifics

  convertBlockDetailsToGraphQL(block: DocumentationPageBlock, baseObject: SupernovaTypes.DocumentationPageBlock): SupernovaTypes.DocumentationPageBlock {

    switch (block.type) {
      case DocumentationPageBlockType.text:
        return this.convertBlockTextDetailsToGraphQL(block as DocumentationPageBlockText, baseObject)
      case DocumentationPageBlockType.heading:
        return this.convertBlockHeadingDetailsToGraphQL(block as DocumentationPageBlockHeading, baseObject)
      case DocumentationPageBlockType.code:
        return this.convertBlockCodeDetailsToGraphQL(block as DocumentationPageBlockCode, baseObject)
      case DocumentationPageBlockType.unorderedList:
        return this.convertBlockUnorderedListDetailsToGraphQL(block as DocumentationPageUnorderedList, baseObject)
      case DocumentationPageBlockType.orderedList:
        return this.convertBlockOrderedListDetailsToGraphQL(block as DocumentationPageOrderedList, baseObject)
      case DocumentationPageBlockType.quote:
        return this.convertBlockQuoteDetailsToGraphQL(block as DocumentationPageBlockQuote, baseObject)
      case DocumentationPageBlockType.callout:
        return this.convertBlockCalloutDetailsToGraphQL(block as DocumentationPageBlockCallout, baseObject)
      case DocumentationPageBlockType.divider:
        return this.convertBlockDividerDetailsToGraphQL(block as DocumentationPageBlockDivider, baseObject)
      case DocumentationPageBlockType.image:
        return this.convertBlockImageDetailsToGraphQL(block as DocumentationPageBlockImage, baseObject)
      case DocumentationPageBlockType.token:
        return this.convertBlockTokenDetailsToGraphQL(block as DocumentationPageBlockToken, baseObject)
      case DocumentationPageBlockType.tokenList:
        return this.convertBlockTokenListDetailsToGraphQL(block as DocumentationPageBlockTokenList, baseObject)
      case DocumentationPageBlockType.tokenGroup:
        return this.convertBlockTokenGroupDetailsToGraphQL(block as DocumentationPageBlockTokenGroup, baseObject)
      case DocumentationPageBlockType.shortcuts:
        return this.convertBlockShortcutsDetailsToGraphQL(block as DocumentationPageBlockShortcuts, baseObject)
      case DocumentationPageBlockType.link:
        return this.convertBlockLinkDetailsToGraphQL(block as DocumentationPageBlockEmbedLink, baseObject)
      case DocumentationPageBlockType.figmaEmbed:
        return this.convertBlockFigmaEmbedDetailsToGraphQL(block as DocumentationPageBlockEmbedFigma, baseObject)
      case DocumentationPageBlockType.youtubeEmbed:
        return this.convertBlockYoutubeEmbedDetailsToGraphQL(block as DocumentationPageBlockEmbedYoutube, baseObject)
      case DocumentationPageBlockType.storybookEmbed:
        return this.convertBlockStorybookEmbedDetailsToGraphQL(block as DocumentationPageBlockEmbedStorybook, baseObject)
      case DocumentationPageBlockType.genericEmbed:
        return this.convertBlockGenericEmbedDetailsToGraphQL(block as DocumentationPageBlockEmbedGeneric, baseObject)
      case DocumentationPageBlockType.figmaFrames:
        return this.convertBlockFigmaFramesDetailsToGraphQL(block as DocumentationPageBlockFrames, baseObject)
      case DocumentationPageBlockType.custom:
        return this.convertBlockCustomDetailsToGraphQL(block as DocumentationPageBlockCustom, baseObject)
      case DocumentationPageBlockType.renderCode:
        return this.convertBlockRenderCodeDetailsToGraphQL(block as DocumentationPageBlockRenderCode, baseObject)
      case DocumentationPageBlockType.componentAssets:
        return this.convertBlockComponentAssetsDetailsToGraphQL(block as DocumentationPageBlockAssets, baseObject)
    }
  }

  convertBlockTextDetailsToGraphQL(block: DocumentationPageBlockText, baseObject: SupernovaTypes.DocumentationPageBlock): SupernovaTypes.DocumentationPageBlockText {
    return {
      ...baseObject,
      text: this.convertRichText(block.text),
    }
  }

  convertBlockHeadingDetailsToGraphQL(block: DocumentationPageBlockHeading, baseObject: SupernovaTypes.DocumentationPageBlock): SupernovaTypes.DocumentationPageBlockHeading {
    return {
      ...baseObject,
      headingType: this.convertBlockHeadingType(block.headingType),
      text: this.convertRichText(block.text)
    }
  }

  convertBlockCodeDetailsToGraphQL(block: DocumentationPageBlockCode, baseObject: SupernovaTypes.DocumentationPageBlock): SupernovaTypes.DocumentationPageBlockCode {
    return {
      ...baseObject,
      codeLanguage: block.codeLanguage,
      caption: block.caption,
      text: this.convertRichText(block.text)
    }
  }

  convertBlockUnorderedListDetailsToGraphQL(block: DocumentationPageUnorderedList, baseObject: SupernovaTypes.DocumentationPageBlock): SupernovaTypes.DocumentationPageBlockUnorderedList {
    return {
      ...baseObject,
      text: this.convertRichText(block.text)
    }
  }

  convertBlockOrderedListDetailsToGraphQL(block: DocumentationPageOrderedList, baseObject: SupernovaTypes.DocumentationPageBlock): SupernovaTypes.DocumentationPageBlockOrderedList {
    return {
      ...baseObject,
      text: this.convertRichText(block.text)
    }
  }

  convertBlockQuoteDetailsToGraphQL(block: DocumentationPageBlockQuote, baseObject: SupernovaTypes.DocumentationPageBlock): SupernovaTypes.DocumentationPageBlockQuote {
    return {
      ...baseObject,
      text: this.convertRichText(block.text)
    }
  }

  convertBlockCalloutDetailsToGraphQL(block: DocumentationPageBlockCallout, baseObject: SupernovaTypes.DocumentationPageBlock): SupernovaTypes.DocumentationPageBlockCallout {
    return {
      ...baseObject,
      calloutType: this.convertCalloutType(block.calloutType),
      text: this.convertRichText(block.text)
    }
  }

  convertBlockDividerDetailsToGraphQL(block: DocumentationPageBlockDivider, baseObject: SupernovaTypes.DocumentationPageBlock): SupernovaTypes.DocumentationPageBlockDivider {
    return {
      ...baseObject
    }
  }

  convertBlockImageDetailsToGraphQL(block: DocumentationPageBlockImage, baseObject: SupernovaTypes.DocumentationPageBlock): SupernovaTypes.DocumentationPageBlockImage {
    return {
      ...baseObject,
      url: block.url ?? null,
      caption: block.caption ?? null,
      alignment: block.alignment
    }
  }

  convertBlockTokenDetailsToGraphQL(block: DocumentationPageBlockToken, baseObject: SupernovaTypes.DocumentationPageBlock): SupernovaTypes.DocumentationPageBlockToken {
    return {
      ...baseObject,
      tokenId: block.tokenId ?? null
    }
  }

  convertBlockTokenListDetailsToGraphQL(block: DocumentationPageBlockTokenList, baseObject: SupernovaTypes.DocumentationPageBlock): SupernovaTypes.DocumentationPageBlockTokenList {
    return {
      ...baseObject,
      tokenIds: block.tokenIds
    }
  }

  convertBlockTokenGroupDetailsToGraphQL(block: DocumentationPageBlockTokenGroup, baseObject: SupernovaTypes.DocumentationPageBlock): SupernovaTypes.DocumentationPageBlockTokenGroup {
    return {
      ...baseObject,
      groupId: block.groupId ?? null,
      showNestedGroups: block.showNestedGroups
    }
  }

  convertBlockShortcutsDetailsToGraphQL(block: DocumentationPageBlockShortcuts, baseObject: SupernovaTypes.DocumentationPageBlock): SupernovaTypes.DocumentationPageBlockShortcuts {
    return {
      ...baseObject,
      shortcuts: block.shortcuts.map(s => this.convertBlockShortcutDetailsToGraphQL(s as DocumentationPageBlockShortcut)) // TODO: Fix incorrect type in SDK so it doesn't have to be enforced
    }
  }

  convertBlockShortcutDetailsToGraphQL(shortcut: DocumentationPageBlockShortcut): SupernovaTypes.DocumentationPageBlockShortcut {
    return {
      title: shortcut.title ?? null,
      description: shortcut.description ?? null,
      previewUrl: shortcut.previewUrl ?? null,
      externalUrl: shortcut.externalUrl ?? null,
      internalId: shortcut.internalId ?? null,
      shortcutType: this.convertShortcutType(shortcut.type)
    }
  }

  convertBlockLinkDetailsToGraphQL(block: DocumentationPageBlockEmbedLink, baseObject: SupernovaTypes.DocumentationPageBlock): SupernovaTypes.DocumentationPageBlockLink {
    return {
      ...baseObject,
      title: block.title ?? null,
      description: block.description ?? null,
      thumbnailUrl: block.thumbnailUrl ?? null,
      url: block.url ?? null,
      size: this.convertSize(block.size),
      caption: block.caption ?? null
    }
  }

  convertBlockFigmaEmbedDetailsToGraphQL(block: DocumentationPageBlockEmbedFigma, baseObject: SupernovaTypes.DocumentationPageBlock): SupernovaTypes.DocumentationPageBlockEmbedFigma {
    return {
      ...baseObject,
      url: block.url ?? null,
      size: this.convertSize(block.size),
      caption: block.caption ?? null
    }
  }

  convertBlockYoutubeEmbedDetailsToGraphQL(block: DocumentationPageBlockEmbedYoutube, baseObject: SupernovaTypes.DocumentationPageBlock): SupernovaTypes.DocumentationPageBlockEmbedYoutube {
    return {
      ...baseObject,
      url: block.url ?? null,
      size: this.convertSize(block.size),
      caption: block.caption ?? null
    }
  }

  convertBlockStorybookEmbedDetailsToGraphQL(block: DocumentationPageBlockEmbedStorybook, baseObject: SupernovaTypes.DocumentationPageBlock): SupernovaTypes.DocumentationPageBlockEmbedStorybook {
    return {
      ...baseObject,
      url: block.url ?? null,
      size: this.convertSize(block.size),
      caption: block.caption ?? null
    }
  }

  convertBlockGenericEmbedDetailsToGraphQL(block: DocumentationPageBlockEmbedGeneric, baseObject: SupernovaTypes.DocumentationPageBlock): SupernovaTypes.DocumentationPageBlockEmbedGeneric {
    return {
      ...baseObject,
      url: block.url ?? null,
      size: this.convertSize(block.size),
      caption: block.caption ?? null
    }
  }

  convertBlockFigmaFramesDetailsToGraphQL(block: DocumentationPageBlockFrames, baseObject: SupernovaTypes.DocumentationPageBlock): SupernovaTypes.DocumentationPageBlockFrames {
    return {
      ...baseObject,
      frames: block.frames.map(f => this.convertBlockFigmaFrameDetailsToGraphQL(f)),
      properties: {
        backgroundColor: block.properties.color ?? null,
        alignment: block.properties.alignment ?? null,
        layout: block.properties.layout,
      }
    }
  }

  convertBlockFigmaFrameDetailsToGraphQL(block: DocumentationPageBlockFrame): SupernovaTypes.DocumentationPageBlockFrame {
    return {
      sourceFileId: block.sourceFileId ?? null,
      sourceFrameId: block.sourceFrameId ?? null,
      sourceFileName: block.sourceFileName ?? null,
      title: block.title ?? null,
      description: block.description ?? null,
      previewUrl: block.previewUrl ?? null,
      backgroundColor: block.backgroundColor ?? null
    }
  }

  convertBlockCustomDetailsToGraphQL(block: DocumentationPageBlockCustom, baseObject: SupernovaTypes.DocumentationPageBlock): SupernovaTypes.DocumentationPageBlockCustom {
    return {
      ...baseObject,
      key: block.key,
      properties: block.properties,
      block: block.block ? {
        key: block.block.key,
        title: block.block.title,
        category: block.block.category,
        description: block.block.description,
        iconUrl: block.block.iconUrl,
        properties: block.block.properties.map(p => {
          return {
            label: p.label,
            key: p.key,
            type: this.convertCustomBlockPropertyType(p.type),
            values: p.values,
            default: p.default
          }
        })
      } : null
    }
  }

  convertBlockRenderCodeDetailsToGraphQL(block: DocumentationPageBlockRenderCode, baseObject: SupernovaTypes.DocumentationPageBlock): SupernovaTypes.DocumentationPageBlockRenderCode {
    return {
      ...baseObject,
      alignment: block.alignment,
      backgroundColor: block.backgroundColor ?? null,
      showCode: block.showCode,
      code: block.code,
      packageJSON: block.packageJSON,
      height: block.height ?? null,
      sandboxData: block.sandboxData,
      sandboxType: this.convertSandboxType(block.sandboxType)
    }
  }

  convertBlockComponentAssetsDetailsToGraphQL(block: DocumentationPageBlockAssets, baseObject: SupernovaTypes.DocumentationPageBlock): SupernovaTypes.DocumentationPageBlockAssets {
    return {
      ...baseObject,
      assets: block.assets.map(a => this.convertBlockAssetDetailsToGraphQL(a)),
      properties: {
        color: block.properties.color ?? null,
        alignment: block.properties.alignment ?? null,
        layout: block.properties.layout,
      }
    }
  }

  convertBlockAssetDetailsToGraphQL(block: DocumentationPageBlockAsset): SupernovaTypes.DocumentationPageBlockAsset {
    
    return {
      assetId: block.assetId,
      title: block.title ?? null,
      description: block.description ?? null,
      previewUrl: block.previewUrl ?? null,
      backgroundColor: block.backgroundColor ?? null
    }
  }

  // --- Subconversions

  convertRichText(richText: DocumentationRichText): SupernovaTypes.DocumentationPageBlockTextRich {

    // Replicate raw rich text structure
    return {
      spans: richText.spans.map(s => {
        return {
          text: s.text,
          attributes: s.attributes.map(a => {
            return {
              link: a.link ?? null,
              type: a.type
            }
          })
        }
      }
      )
    }
  }

  convertSize(size: Size | null): { width: number | null, height: number | null } {

    if (size) {
      return {
        width: size.width ?? null,
        height: size.height ?? null
      }
    } else {
      return {
        width: null, height: null
      }
    }
  }

  convertBlockHeadingType(headingType: DocumentationHeadingType): SupernovaTypes.HeadingType {

    switch (headingType) {
      case DocumentationHeadingType.h1: return SupernovaTypes.HeadingType.h1
      case DocumentationHeadingType.h2: return SupernovaTypes.HeadingType.h2
      case DocumentationHeadingType.h3: return SupernovaTypes.HeadingType.h3
    }
  }

  convertShortcutType(shortcutType: DocumentationPageBlockShortcutType): SupernovaTypes.ShortcutType {

    switch (shortcutType) {
      case DocumentationPageBlockShortcutType.external: return SupernovaTypes.ShortcutType.External
      case DocumentationPageBlockShortcutType.internal: return SupernovaTypes.ShortcutType.Internal
    }
  }

  convertCalloutType(calloutType: DocumentationCalloutType): SupernovaTypes.CalloutType {

    switch (calloutType) {
      case DocumentationCalloutType.error: return SupernovaTypes.CalloutType.error
      case DocumentationCalloutType.info: return SupernovaTypes.CalloutType.info
      case DocumentationCalloutType.success: return SupernovaTypes.CalloutType.success
      case DocumentationCalloutType.warning: return SupernovaTypes.CalloutType.warning
    }
  }

  convertSandboxType(sandboxType: any): SupernovaTypes.SandboxType {

    // Static for now
    return SupernovaTypes.SandboxType.React
  }

  convertCustomBlockPropertyType(propType: DocumentationCustomBlockPropertyType): SupernovaTypes.CustomBlockPropertyType {
    switch (propType) {
      case DocumentationCustomBlockPropertyType.boolean: return SupernovaTypes.CustomBlockPropertyType.boolean
      case DocumentationCustomBlockPropertyType.enum: return SupernovaTypes.CustomBlockPropertyType.enum
      case DocumentationCustomBlockPropertyType.image: return SupernovaTypes.CustomBlockPropertyType.image
      case DocumentationCustomBlockPropertyType.number: return SupernovaTypes.CustomBlockPropertyType.number
      case DocumentationCustomBlockPropertyType.string: return SupernovaTypes.CustomBlockPropertyType.string
    }
  }

  // --- Convenience

  flattenedBlocksOfPage(page: DocumentationPage): Array<DocumentationPageBlock> {

    let blocks: Array<DocumentationPageBlock> = []
    for (let block of page.blocks) {
      blocks = blocks.concat(this.flattenedBlocksOfBlock(block))
    }
    return blocks
  }

  flattenedBlocksOfBlock(block: DocumentationPageBlock): Array<DocumentationPageBlock> {

    let blocks: Array<DocumentationPageBlock> = [block]
    for (let child of block.children) {
      blocks = blocks.concat(this.flattenedBlocksOfBlock(child))
    }
    return blocks
  }
}
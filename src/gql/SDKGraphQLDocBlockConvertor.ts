//
//  SDKGraphQLDocBlockConvertor.ts
//  Supernova Gatsby Source
//
//  Created by Jiri Trecak <jiri@supernova.io> 
//  Supernova.io 
//

// --- --- --- --- --- --- --- --- --- --- --- --- --- --- --- --- --- --- --- --- --- --- --- --- --- --- ---
// MARK: - Imports

import * as SupernovaSDK from "@supernovaio/supernova-sdk"
import { Alignment, RichTextSpanAttributeType, FrameLayout, DocumentationPageBlockType, FrameAlignment, DocumentationPageBlock, DocumentationPageBlockText, DocumentationPageBlockHeading, DocumentationPageBlockCode, DocumentationPageBlockQuote, DocumentationPageBlockCallout, DocumentationPageBlockDivider, DocumentationPageBlockImage, DocumentationPageBlockToken, DocumentationPageBlockTokenList, DocumentationPageBlockTokenGroup, DocumentationPageBlockShortcuts, DocumentationPageBlockEmbedFigma, DocumentationPageBlockEmbedYoutube, DocumentationPageBlockEmbedStorybook, DocumentationPageBlockEmbedGeneric, DocumentationPageBlockFrames, DocumentationPageBlockCustom, DocumentationPageBlockRenderCode, DocumentationPageBlockAssets, DocumentationPageBlockShortcut, DocumentationPageBlockFrame, DocumentationPageBlockAsset, DocumentationPageBlockUnorderedList, DocumentationPageBlockOrderedList, DocumentationPageBlockLink, DocumentationPageBlockTextRich, HeadingType, ShortcutType, CalloutType, SandboxType, CustomBlockPropertyType } from "gql_types/SupernovaTypes"
import { PARENT_SOURCE } from "./SDKGraphQLAssetConvertor"
import { SDKGraphQLObjectConvertor } from "./SDKGraphQLObjectConvertor"



// --- --- --- --- --- --- --- --- --- --- --- --- --- --- --- --- --- --- --- --- --- --- --- --- --- --- ---
// MARK: - Convertor

export class SDKGraphQLDocBlockConvertor {

  // --- Documentation blocks conversion

  documentationPageBlocks(sdkPage: SupernovaSDK.DocumentationPage): Array<DocumentationPageBlock> {

    let graphQLNodes: Array<DocumentationPageBlock> = []
    let blocks = this.flattenedBlocksOfPage(sdkPage)
    for (let block of blocks) {
      graphQLNodes.push(this.convertBlockToGraphQL(block))
    }

    return graphQLNodes
  }

  convertBlockToGraphQL(block: SupernovaSDK.DocumentationPageBlock): DocumentationPageBlock {

    // Convert base information about blocks
    const blockDescription = {
      id: block.id,
      parent: PARENT_SOURCE,
      internal: SDKGraphQLObjectConvertor.nodeInternals("DocumentationBlock"),
      children: [],
      beginsTypeChain: block.beginsTypeChain,
      endsTypeChain: block.endsTypeChain,
      blockIds: block.children.map(c => c.id),
      blockType: this.convertBlockType(block.type)
    } 

    // Convert all details
    let detailedBlockObject = this.convertBlockDetailsToGraphQL(block, blockDescription)

    // Checksum
    detailedBlockObject.internal.contentDigest = SDKGraphQLObjectConvertor.nodeDigest(detailedBlockObject)
    return detailedBlockObject
  }

  // --- Block specifics

  convertBlockDetailsToGraphQL(block: SupernovaSDK.DocumentationPageBlock, baseObject: DocumentationPageBlock): DocumentationPageBlock {

    switch (block.type) {
      case SupernovaSDK.DocumentationPageBlockType.text:
        return this.convertBlockTextDetailsToGraphQL(block as SupernovaSDK.DocumentationPageBlockText, baseObject)
      case SupernovaSDK.DocumentationPageBlockType.heading:
        return this.convertBlockHeadingDetailsToGraphQL(block as SupernovaSDK.DocumentationPageBlockHeading, baseObject)
      case SupernovaSDK.DocumentationPageBlockType.code:
        return this.convertBlockCodeDetailsToGraphQL(block as SupernovaSDK.DocumentationPageBlockCode, baseObject)
      case SupernovaSDK.DocumentationPageBlockType.unorderedList:
        return this.convertBlockUnorderedListDetailsToGraphQL(block as SupernovaSDK.DocumentationPageUnorderedList, baseObject)
      case SupernovaSDK.DocumentationPageBlockType.orderedList:
        return this.convertBlockOrderedListDetailsToGraphQL(block as SupernovaSDK.DocumentationPageOrderedList, baseObject)
      case SupernovaSDK.DocumentationPageBlockType.quote:
        return this.convertBlockQuoteDetailsToGraphQL(block as SupernovaSDK.DocumentationPageBlockQuote, baseObject)
      case SupernovaSDK.DocumentationPageBlockType.callout:
        return this.convertBlockCalloutDetailsToGraphQL(block as SupernovaSDK.DocumentationPageBlockCallout, baseObject)
      case SupernovaSDK.DocumentationPageBlockType.divider:
        return this.convertBlockDividerDetailsToGraphQL(block as SupernovaSDK.DocumentationPageBlockDivider, baseObject)
      case SupernovaSDK.DocumentationPageBlockType.image:
        return this.convertBlockImageDetailsToGraphQL(block as SupernovaSDK.DocumentationPageBlockImage, baseObject)
      case SupernovaSDK.DocumentationPageBlockType.token:
        return this.convertBlockTokenDetailsToGraphQL(block as SupernovaSDK.DocumentationPageBlockToken, baseObject)
      case SupernovaSDK.DocumentationPageBlockType.tokenList:
        return this.convertBlockTokenListDetailsToGraphQL(block as SupernovaSDK.DocumentationPageBlockTokenList, baseObject)
      case SupernovaSDK.DocumentationPageBlockType.tokenGroup:
        return this.convertBlockTokenGroupDetailsToGraphQL(block as SupernovaSDK.DocumentationPageBlockTokenGroup, baseObject)
      case SupernovaSDK.DocumentationPageBlockType.shortcuts:
        return this.convertBlockShortcutsDetailsToGraphQL(block as SupernovaSDK.DocumentationPageBlockShortcuts, baseObject)
      case SupernovaSDK.DocumentationPageBlockType.link:
        return this.convertBlockLinkDetailsToGraphQL(block as SupernovaSDK.DocumentationPageBlockEmbedLink, baseObject)
      case SupernovaSDK.DocumentationPageBlockType.figmaEmbed:
        return this.convertBlockFigmaEmbedDetailsToGraphQL(block as SupernovaSDK.DocumentationPageBlockEmbedFigma, baseObject)
      case SupernovaSDK.DocumentationPageBlockType.youtubeEmbed:
        return this.convertBlockYoutubeEmbedDetailsToGraphQL(block as SupernovaSDK.DocumentationPageBlockEmbedYoutube, baseObject)
      case SupernovaSDK.DocumentationPageBlockType.storybookEmbed:
        return this.convertBlockStorybookEmbedDetailsToGraphQL(block as SupernovaSDK.DocumentationPageBlockEmbedStorybook, baseObject)
      case SupernovaSDK.DocumentationPageBlockType.genericEmbed:
        return this.convertBlockGenericEmbedDetailsToGraphQL(block as SupernovaSDK.DocumentationPageBlockEmbedGeneric, baseObject)
      case SupernovaSDK.DocumentationPageBlockType.figmaFrames:
        return this.convertBlockFigmaFramesDetailsToGraphQL(block as SupernovaSDK.DocumentationPageBlockFrames, baseObject)
      case SupernovaSDK.DocumentationPageBlockType.custom:
        return this.convertBlockCustomDetailsToGraphQL(block as SupernovaSDK.DocumentationPageBlockCustom, baseObject)
      case SupernovaSDK.DocumentationPageBlockType.renderCode:
        return this.convertBlockRenderCodeDetailsToGraphQL(block as SupernovaSDK.DocumentationPageBlockRenderCode, baseObject)
      case SupernovaSDK.DocumentationPageBlockType.componentAssets:
        return this.convertBlockComponentAssetsDetailsToGraphQL(block as SupernovaSDK.DocumentationPageBlockAssets, baseObject)
    }
  }

  convertBlockTextDetailsToGraphQL(block: SupernovaSDK.DocumentationPageBlockText, baseObject: DocumentationPageBlock): DocumentationPageBlockText {
    return {
      ...baseObject,
      text: this.convertRichText(block.text),
    }
  }

  convertBlockHeadingDetailsToGraphQL(block: SupernovaSDK.DocumentationPageBlockHeading, baseObject: DocumentationPageBlock): DocumentationPageBlockHeading {
    return {
      ...baseObject,
      headingType: this.convertBlockHeadingType(block.headingType),
      text: this.convertRichText(block.text)
    }
  }

  convertBlockCodeDetailsToGraphQL(block: SupernovaSDK.DocumentationPageBlockCode, baseObject: DocumentationPageBlock): DocumentationPageBlockCode {
    return {
      ...baseObject,
      codeLanguage: block.codeLanguage,
      caption: block.caption,
      text: this.convertRichText(block.text)
    }
  }

  convertBlockUnorderedListDetailsToGraphQL(block: SupernovaSDK.DocumentationPageUnorderedList, baseObject: DocumentationPageBlock): DocumentationPageBlockUnorderedList {
    return {
      ...baseObject,
      text: this.convertRichText(block.text)
    }
  }

  convertBlockOrderedListDetailsToGraphQL(block: SupernovaSDK.DocumentationPageOrderedList, baseObject: DocumentationPageBlock): DocumentationPageBlockOrderedList {
    return {
      ...baseObject,
      text: this.convertRichText(block.text)
    }
  }

  convertBlockQuoteDetailsToGraphQL(block: SupernovaSDK.DocumentationPageBlockQuote, baseObject: DocumentationPageBlock): DocumentationPageBlockQuote {
    return {
      ...baseObject,
      text: this.convertRichText(block.text)
    }
  }

  convertBlockCalloutDetailsToGraphQL(block: SupernovaSDK.DocumentationPageBlockCallout, baseObject: DocumentationPageBlock): DocumentationPageBlockCallout {
    return {
      ...baseObject,
      calloutType: this.convertCalloutType(block.calloutType),
      text: this.convertRichText(block.text)
    }
  }

  convertBlockDividerDetailsToGraphQL(block: SupernovaSDK.DocumentationPageBlockDivider, baseObject: DocumentationPageBlock): DocumentationPageBlockDivider {
    return {
      ...baseObject
    }
  }

  convertBlockImageDetailsToGraphQL(block: SupernovaSDK.DocumentationPageBlockImage, baseObject: DocumentationPageBlock): DocumentationPageBlockImage {
    return {
      ...baseObject,
      url: block.url ?? null,
      caption: block.caption ?? null,
      alignment: this.convertAlignment(block.alignment)
    }
  }

  convertBlockTokenDetailsToGraphQL(block: SupernovaSDK.DocumentationPageBlockToken, baseObject: DocumentationPageBlock): DocumentationPageBlockToken {
    return {
      ...baseObject,
      tokenId: block.tokenId ?? null
    }
  }

  convertBlockTokenListDetailsToGraphQL(block: SupernovaSDK.DocumentationPageBlockTokenList, baseObject: DocumentationPageBlock): DocumentationPageBlockTokenList {
    return {
      ...baseObject,
      tokenIds: block.tokenIds
    }
  }

  convertBlockTokenGroupDetailsToGraphQL(block: SupernovaSDK.DocumentationPageBlockTokenGroup, baseObject: DocumentationPageBlock): DocumentationPageBlockTokenGroup {
    return {
      ...baseObject,
      groupId: block.groupId ?? null,
      showNestedGroups: block.showNestedGroups
    }
  }

  convertBlockShortcutsDetailsToGraphQL(block: SupernovaSDK.DocumentationPageBlockShortcuts, baseObject: DocumentationPageBlock): DocumentationPageBlockShortcuts {
    return {
      ...baseObject,
      shortcuts: block.shortcuts.map(s => this.convertBlockShortcutDetailsToGraphQL(s as SupernovaSDK.DocumentationPageBlockShortcut)) // TODO: Fix incorrect type in SDK so it doesn't have to be enforced
    }
  }

  convertBlockShortcutDetailsToGraphQL(shortcut: SupernovaSDK.DocumentationPageBlockShortcut): DocumentationPageBlockShortcut {
    return {
      title: shortcut.title ?? null,
      description: shortcut.description ?? null,
      previewUrl: shortcut.previewUrl ?? null,
      externalUrl: shortcut.externalUrl ?? null,
      internalId: shortcut.internalId ?? null,
      shortcutType: this.convertShortcutType(shortcut.type)
    }
  }

  convertBlockLinkDetailsToGraphQL(block: SupernovaSDK.DocumentationPageBlockEmbedLink, baseObject: DocumentationPageBlock): DocumentationPageBlockLink {
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

  convertBlockFigmaEmbedDetailsToGraphQL(block: SupernovaSDK.DocumentationPageBlockEmbedFigma, baseObject: DocumentationPageBlock): DocumentationPageBlockEmbedFigma {
    return {
      ...baseObject,
      url: block.url ?? null,
      size: this.convertSize(block.size),
      caption: block.caption ?? null
    }
  }

  convertBlockYoutubeEmbedDetailsToGraphQL(block: SupernovaSDK.DocumentationPageBlockEmbedYoutube, baseObject: DocumentationPageBlock): DocumentationPageBlockEmbedYoutube {
    return {
      ...baseObject,
      url: block.url ?? null,
      size: this.convertSize(block.size),
      caption: block.caption ?? null
    }
  }

  convertBlockStorybookEmbedDetailsToGraphQL(block: SupernovaSDK.DocumentationPageBlockEmbedStorybook, baseObject: DocumentationPageBlock): DocumentationPageBlockEmbedStorybook {
    return {
      ...baseObject,
      url: block.url ?? null,
      size: this.convertSize(block.size),
      caption: block.caption ?? null
    }
  }

  convertBlockGenericEmbedDetailsToGraphQL(block: SupernovaSDK.DocumentationPageBlockEmbedGeneric, baseObject: DocumentationPageBlock): DocumentationPageBlockEmbedGeneric {
    return {
      ...baseObject,
      url: block.url ?? null,
      size: this.convertSize(block.size),
      caption: block.caption ?? null
    }
  }

  convertBlockFigmaFramesDetailsToGraphQL(block: SupernovaSDK.DocumentationPageBlockFrames, baseObject: DocumentationPageBlock): DocumentationPageBlockFrames {
    return {
      ...baseObject,
      frames: block.frames.map(f => this.convertBlockFigmaFrameDetailsToGraphQL(f)),
      properties: {
        backgroundColor: block.properties.color ?? null,
        alignment: this.convertFrameAlignment(block.properties.alignment),
        layout: this.convertLayout(block.properties.layout),
      }
    }
  }

  convertBlockFigmaFrameDetailsToGraphQL(block: SupernovaSDK.DocumentationPageBlockFrame): DocumentationPageBlockFrame {
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

  convertBlockCustomDetailsToGraphQL(block: SupernovaSDK.DocumentationPageBlockCustom, baseObject: DocumentationPageBlock): DocumentationPageBlockCustom {
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

  convertBlockRenderCodeDetailsToGraphQL(block: SupernovaSDK.DocumentationPageBlockRenderCode, baseObject: DocumentationPageBlock): DocumentationPageBlockRenderCode {
    return {
      ...baseObject,
      alignment: this.convertAlignment(block.alignment),
      backgroundColor: block.backgroundColor ?? null,
      showCode: block.showCode,
      code: block.code,
      packageJSON: block.packageJSON,
      height: block.height ?? null,
      sandboxData: block.sandboxData,
      sandboxType: this.convertSandboxType(block.sandboxType)
    }
  }

  convertBlockComponentAssetsDetailsToGraphQL(block: SupernovaSDK.DocumentationPageBlockAssets, baseObject: DocumentationPageBlock): DocumentationPageBlockAssets {
    return {
      ...baseObject,
      assets: block.assets.map(a => this.convertBlockAssetDetailsToGraphQL(a)),
      properties: {
        color: block.properties.color ?? null,
        alignment: this.convertFrameAlignment(block.properties.alignment),
        layout: this.convertLayout(block.properties.layout),
      }
    }
  }

  convertBlockAssetDetailsToGraphQL(block: SupernovaSDK.DocumentationPageBlockAsset): DocumentationPageBlockAsset {
    
    return {
      assetId: block.assetId,
      title: block.title ?? null,
      description: block.description ?? null,
      previewUrl: block.previewUrl ?? null,
      backgroundColor: block.backgroundColor ?? null
    }
  }

  // --- Subconversions

  convertRichText(richText: SupernovaSDK.DocumentationRichText): DocumentationPageBlockTextRich {

    // Replicate raw rich text structure
    return {
      spans: richText.spans.map(s => {
        return {
          text: s.text,
          attributes: s.attributes.map(a => {
            return {
              link: a.link ?? null,
              type: this.convertRichAttributeType(a.type)
            }
          })
        }
      }
      )
    }
  }

  convertSize(size: SupernovaSDK.Size | null): { width: number | null, height: number | null } {

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

  convertBlockHeadingType(headingType: SupernovaSDK.DocumentationHeadingType): HeadingType {

    switch (headingType) {
      case SupernovaSDK.DocumentationHeadingType.h1: return HeadingType.h1
      case SupernovaSDK.DocumentationHeadingType.h2: return HeadingType.h2
      case SupernovaSDK.DocumentationHeadingType.h3: return HeadingType.h3
    }
  }

  convertShortcutType(shortcutType: SupernovaSDK.DocumentationPageBlockShortcutType): ShortcutType {

    switch (shortcutType) {
      case SupernovaSDK.DocumentationPageBlockShortcutType.external: return ShortcutType.External
      case SupernovaSDK.DocumentationPageBlockShortcutType.internal: return ShortcutType.Internal
    }
  }

  convertCalloutType(calloutType: SupernovaSDK.DocumentationCalloutType): CalloutType {

    switch (calloutType) {
      case SupernovaSDK.DocumentationCalloutType.error: return CalloutType.error
      case SupernovaSDK.DocumentationCalloutType.info: return CalloutType.info
      case SupernovaSDK.DocumentationCalloutType.success: return CalloutType.success
      case SupernovaSDK.DocumentationCalloutType.warning: return CalloutType.warning
    }
  }

  convertSandboxType(sandboxType: any): SandboxType {

    // Static for now
    return SandboxType.React
  }

  convertCustomBlockPropertyType(propType: SupernovaSDK.DocumentationCustomBlockPropertyType): CustomBlockPropertyType {
    switch (propType) {
      case SupernovaSDK.DocumentationCustomBlockPropertyType.boolean: return CustomBlockPropertyType.boolean
      case SupernovaSDK.DocumentationCustomBlockPropertyType.enum: return CustomBlockPropertyType.enum
      case SupernovaSDK.DocumentationCustomBlockPropertyType.image: return CustomBlockPropertyType.image
      case SupernovaSDK.DocumentationCustomBlockPropertyType.number: return CustomBlockPropertyType.number
      case SupernovaSDK.DocumentationCustomBlockPropertyType.string: return CustomBlockPropertyType.string
    }
  }

  convertAlignment(alignment: SupernovaSDK.Alignment): Alignment {

    switch (alignment) {
      case SupernovaSDK.Alignment.center: return Alignment.center 
      case SupernovaSDK.Alignment.left: return Alignment.left 
      case SupernovaSDK.Alignment.stretch: return Alignment.stretch 
    }
  }

  convertFrameAlignment(alignment: SupernovaSDK.FrameAlignment): FrameAlignment {

    switch (alignment) {
      case SupernovaSDK.FrameAlignment.center: return FrameAlignment.center 
      case SupernovaSDK.FrameAlignment.frameHeight: return FrameAlignment.frameHeight
    }
  }

  convertRichAttributeType(type: SupernovaSDK.RichTextSpanAttributeType): RichTextSpanAttributeType {

    switch (type) {
      case SupernovaSDK.RichTextSpanAttributeType.bold: return RichTextSpanAttributeType.bold 
      case SupernovaSDK.RichTextSpanAttributeType.italic: return RichTextSpanAttributeType.italic 
      case SupernovaSDK.RichTextSpanAttributeType.link: return RichTextSpanAttributeType.link 
      case SupernovaSDK.RichTextSpanAttributeType.code: return RichTextSpanAttributeType.code
      case SupernovaSDK.RichTextSpanAttributeType.strikethrough: return RichTextSpanAttributeType.strikethrough 
    }
  }

  convertLayout(layout: SupernovaSDK.FrameLayout): FrameLayout {

    switch (layout) {
      case SupernovaSDK.FrameLayout.c1: return FrameLayout.c1
      case SupernovaSDK.FrameLayout.c175: return FrameLayout.c175
      case SupernovaSDK.FrameLayout.c2: return FrameLayout.c2
      case SupernovaSDK.FrameLayout.c3: return FrameLayout.c3
      case SupernovaSDK.FrameLayout.c4: return FrameLayout.c4
      case SupernovaSDK.FrameLayout.c5: return FrameLayout.c5
      case SupernovaSDK.FrameLayout.c6: return FrameLayout.c6
      case SupernovaSDK.FrameLayout.c7: return FrameLayout.c7
      case SupernovaSDK.FrameLayout.c8: return FrameLayout.c8
    }
  }

  convertBlockType(type: SupernovaSDK.DocumentationPageBlockType): DocumentationPageBlockType {

    switch (type) {
      case SupernovaSDK.DocumentationPageBlockType.code: return DocumentationPageBlockType.code
      case SupernovaSDK.DocumentationPageBlockType.componentAssets: return DocumentationPageBlockType.componentAssets
      case SupernovaSDK.DocumentationPageBlockType.custom: return DocumentationPageBlockType.custom
      case SupernovaSDK.DocumentationPageBlockType.callout: return DocumentationPageBlockType.callout
      case SupernovaSDK.DocumentationPageBlockType.divider: return DocumentationPageBlockType.divider
      case SupernovaSDK.DocumentationPageBlockType.figmaEmbed: return DocumentationPageBlockType.figmaEmbed
      case SupernovaSDK.DocumentationPageBlockType.figmaFrames: return DocumentationPageBlockType.figmaFrames
      case SupernovaSDK.DocumentationPageBlockType.genericEmbed: return DocumentationPageBlockType.genericEmbed
      case SupernovaSDK.DocumentationPageBlockType.heading: return DocumentationPageBlockType.heading
      case SupernovaSDK.DocumentationPageBlockType.image: return DocumentationPageBlockType.image
      case SupernovaSDK.DocumentationPageBlockType.link: return DocumentationPageBlockType.link
      case SupernovaSDK.DocumentationPageBlockType.orderedList: return DocumentationPageBlockType.orderedList
      case SupernovaSDK.DocumentationPageBlockType.quote: return DocumentationPageBlockType.quote
      case SupernovaSDK.DocumentationPageBlockType.renderCode: return DocumentationPageBlockType.renderCode
      case SupernovaSDK.DocumentationPageBlockType.shortcuts: return DocumentationPageBlockType.shortcuts
      case SupernovaSDK.DocumentationPageBlockType.storybookEmbed: return DocumentationPageBlockType.storybookEmbed
      case SupernovaSDK.DocumentationPageBlockType.text: return DocumentationPageBlockType.text
      case SupernovaSDK.DocumentationPageBlockType.token: return DocumentationPageBlockType.token
      case SupernovaSDK.DocumentationPageBlockType.tokenGroup: return DocumentationPageBlockType.tokenGroup
      case SupernovaSDK.DocumentationPageBlockType.tokenList: return DocumentationPageBlockType.tokenList
      case SupernovaSDK.DocumentationPageBlockType.unorderedList: return DocumentationPageBlockType.unorderedList
      case SupernovaSDK.DocumentationPageBlockType.youtubeEmbed: return DocumentationPageBlockType.youtubeEmbed
    }
  }

  // --- Convenience

  flattenedBlocksOfPage(page: SupernovaSDK.DocumentationPage): Array<SupernovaSDK.DocumentationPageBlock> {

    let blocks: Array<SupernovaSDK.DocumentationPageBlock> = []
    for (let block of page.blocks) {
      blocks = blocks.concat(this.flattenedBlocksOfBlock(block))
    }
    return blocks
  }

  flattenedBlocksOfBlock(block: SupernovaSDK.DocumentationPageBlock): Array<SupernovaSDK.DocumentationPageBlock> {

    let blocks: Array<SupernovaSDK.DocumentationPageBlock> = [block]
    for (let child of block.children) {
      blocks = blocks.concat(this.flattenedBlocksOfBlock(child))
    }
    return blocks
  }
}
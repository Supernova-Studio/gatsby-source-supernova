//
//  UtilsLookup.ts
//  Supernova Gatsby Source
//
//  Created by Jiri Trecak <jiri@supernova.io>
//  Supernova.io
//

// --- --- --- --- --- --- --- --- --- --- --- --- --- --- --- --- --- --- --- --- --- --- --- --- --- --- ---
// MARK: - Imports

import * as SupernovaSDK from "@supernovaio/supernova-sdk"


// --- --- --- --- --- --- --- --- --- --- --- --- --- --- --- --- --- --- --- --- --- --- --- --- --- --- ---
// MARK: - Template implementation

export class UtilsLookup {
  // --- Conveniences

  static flattenedPageStructure(root: SupernovaSDK.DocumentationGroup): Array<SupernovaSDK.DocumentationPage> {
    let pages: Array<SupernovaSDK.DocumentationPage> = []
    for (let item of root.children) {
      if (item.type === "Page") {
        pages.push(item as SupernovaSDK.DocumentationPage)
      } else if (item.type === "Group") {
        pages = pages.concat(this.flattenedPageStructure(item as SupernovaSDK.DocumentationGroup))
      }
    }

    return pages
  }


  static flattenedBlocksOfPage(page: SupernovaSDK.DocumentationPage): Array<SupernovaSDK.DocumentationPageBlock> {

    let blocks: Array<SupernovaSDK.DocumentationPageBlock> = []
    for (let block of page.blocks) {
      blocks = blocks.concat(this.flattenedBlocksOfBlock(block))
    }
    return blocks
  }

  static flattenedBlocksOfBlock(block: SupernovaSDK.DocumentationPageBlock): Array<SupernovaSDK.DocumentationPageBlock> {

    let blocks: Array<SupernovaSDK.DocumentationPageBlock> = [block]
    for (let child of block.children) {
      blocks = blocks.concat(this.flattenedBlocksOfBlock(child))
    }
    return blocks
  }
}

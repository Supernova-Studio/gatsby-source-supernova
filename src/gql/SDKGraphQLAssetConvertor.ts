//
//  SDKGraphQLAssetConvertor.ts
//  Supernova Gatsby Source
//
//  Created by Jiri Trecak <jiri@supernova.io> 
//  Supernova.io 
//

// --- --- --- --- --- --- --- --- --- --- --- --- --- --- --- --- --- --- --- --- --- --- --- --- --- --- ---
// MARK: - Imports

import * as SupernovaSDK from '@supernovaio/supernova-sdk'
import crypto from 'crypto'
import { Asset } from 'gql_types/SupernovaTypes'


// --- --- --- --- --- --- --- --- --- --- --- --- --- --- --- --- --- --- --- --- --- --- --- --- --- --- ---
// MARK: - Definitions

export type NodeInternals = {
  type: string,
  contentDigest: string | null
}

export const PARENT_SOURCE: string = "__SOURCE__"


// --- --- --- --- --- --- --- --- --- --- --- --- --- --- --- --- --- --- --- --- --- --- --- --- --- --- ---
// MARK: - Template implementation

export class SDKGraphQLAssetConvertor {

  // --- Documentation objects

  assets(sdkAssets: Array<SupernovaSDK.Asset>): Array<Asset> {

    let graphQLNodes: Array<Asset> = []
    for (let asset of sdkAssets) {
      const assetNode = {
        id: asset.id,
        parent: PARENT_SOURCE,
        internal: SDKGraphQLAssetConvertor.nodeInternals("Asset"),
        children: [],

        brandId: asset.brandId,
        thumbnailUrl: asset.thumbnailUrl ?? null,
        name: asset.name,
        description: asset.description,
        componentId: asset.componentId,
        previouslyDuplicatedNames: asset.previouslyDuplicatedNames,
      }
      assetNode.internal.contentDigest = SDKGraphQLAssetConvertor.nodeDigest(assetNode)
      graphQLNodes.push(assetNode)
    }

    return graphQLNodes
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
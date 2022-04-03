//
//  UtilsUrls.ts
//  Supernova Gatsby Source
//
//  Created by Jiri Trecak <jiri@supernova.io>
//  Supernova.io
//

// --- --- --- --- --- --- --- --- --- --- --- --- --- --- --- --- --- --- --- --- --- --- --- --- --- --- ---
// MARK: - Imports

import * as SupernovaSDK from "@supernovaio/supernova-sdk"
import slugify from "slugify"
import { UtilsLookup } from "./UtilLookup"

// --- --- --- --- --- --- --- --- --- --- --- --- --- --- --- --- --- --- --- --- --- --- --- --- --- --- ---
// MARK: - Template implementation

export class UtilsUrls {
  // --- Conveniences

  /** Constructs documentation object slug that can be used to reference page fully (those are unique), or retrieve partial URL for a group */
  static documentationObjectSlug(d: SupernovaSDK.DocumentationPage | SupernovaSDK.DocumentationGroup): string {
    if (!d) {
      return ""
    }

    let pageSlug: string
    if (d instanceof SupernovaSDK.DocumentationPage) {
      pageSlug = d.userSlug ?? d.slug
    } else if (d instanceof SupernovaSDK.DocumentationGroup) {
      pageSlug = d.title // Eventually we will introduce slugs for groups as well
    } else {
      throw new Error("Unsupported documentation slug entity")
    }

    let subpaths: Array<string> = []

    // Construct group path segments
    let parent: SupernovaSDK.DocumentationGroup | null = d.parent
    while (parent) {
      subpaths.push(slugify(parent.title))
      parent = parent.parent
    }

    // Remove last segment added, because we don't care about root group
    subpaths.pop()

    // Retrieve url-safe path constructed as [group-slugs][path-slug]
    let path = [...subpaths.reverse(), pageSlug].join("/")
    return "/" + path.toLowerCase()
  }

  /** Constructs slug for the first page object in specific group (this can be page, or tab in case of tab groups). Returns null when there is no page inside group (group should not link to anything then) */
  static firstPageObjectSlug(group: SupernovaSDK.DocumentationGroup): string | null {
    let firstPage = this.firstPageFromTop(group)
    return firstPage ? this.documentationObjectSlug(firstPage) : null
  }

  /** Retrieves first page from the specific group, from the top, descending deeper and deeper into subgroups if not found immediately. Returns null when there is no page in the group */
  static firstPageFromTop(documentationRoot: SupernovaSDK.DocumentationGroup): SupernovaSDK.DocumentationPage | null {
    for (let child of documentationRoot.children) {
      if (child.type === "Page") {
        return child as SupernovaSDK.DocumentationPage
      } else {
        let possiblePage = UtilsUrls.firstPageFromTop(child as SupernovaSDK.DocumentationGroup)
        if (possiblePage) {
          return possiblePage
        }
      }
    }
    return null
  }

  /** Retrieves id chain of groups up to the root group for a documentation page */
  static groupChainUntilRoot(item: SupernovaSDK.DocumentationItem): Array<string> {
    let parent: SupernovaSDK.DocumentationItem | null = (item as any).parent
    let ids = new Array<string>()
    while (parent) {
      ids.push(parent.persistentId)
      parent = (parent as any).parent
    }
    return ids
  }

  static rootGroup(sdkGroups: Array<SupernovaSDK.DocumentationGroup>): SupernovaSDK.DocumentationGroup {
    for (let group of sdkGroups) {
      if (group.isRoot) {
        return group
      }
    }
    throw new Error("Root group was not found, which can never happen")
  }

  static previousPage(
    sdkGroups: Array<SupernovaSDK.DocumentationGroup>,
    page: SupernovaSDK.DocumentationPage
  ): SupernovaSDK.DocumentationPage | null {
    let root = UtilsUrls.rootGroup(sdkGroups)
    let flattenedPages = UtilsLookup.flattenedPageStructure(root)
    let pageIndex = flattenedPages.findIndex((p) => p.id === page.id)
    if (pageIndex > 0) {
      return flattenedPages[pageIndex - 1]
    }
    return null
  }

  static nextPage(
    sdkGroups: Array<SupernovaSDK.DocumentationGroup>,
    page: SupernovaSDK.DocumentationPage
  ): SupernovaSDK.DocumentationPage | null {
    let root = UtilsUrls.rootGroup(sdkGroups)
    let flattenedPages = UtilsLookup.flattenedPageStructure(root)
    let pageIndex = flattenedPages.findIndex((p) => p.id === page.id)
    if (pageIndex !== -1) {
      if (pageIndex < flattenedPages.length - 1) {
        return flattenedPages[pageIndex + 1]
      }
    }
    return null
  }
}

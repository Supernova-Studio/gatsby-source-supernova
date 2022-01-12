//
//  UtilsUrls.ts
//  Supernova Gatsby Source
//
//  Created by Jiri Trecak <jiri@supernova.io> 
//  Supernova.io 
//

// --- --- --- --- --- --- --- --- --- --- --- --- --- --- --- --- --- --- --- --- --- --- --- --- --- --- ---
// MARK: - Imports

import { DocumentationGroup } from "@supernova-studio/supernova-sdk/build/main/sdk/src/model/documentation/SDKDocumentationGroup"
import { DocumentationItem } from "@supernova-studio/supernova-sdk/build/main/sdk/src/model/documentation/SDKDocumentationItem"
import { DocumentationPage } from "@supernova-studio/supernova-sdk/build/main/sdk/src/model/documentation/SDKDocumentationPage"

import slugify from 'slugify'


// --- --- --- --- --- --- --- --- --- --- --- --- --- --- --- --- --- --- --- --- --- --- --- --- --- --- ---
// MARK: - Template implementation

export class UtilsUrls {

    // --- Conveniences

    /** Constructs documentation object slug that can be used to reference page fully (those are unique), or retrieve partial URL for a group */
    static documentationObjectSlug(d: DocumentationPage | DocumentationGroup): string {

        if (!d) {
            return ""
        }

        let pageSlug: string
        if (d instanceof DocumentationPage) {
            pageSlug = d.userSlug ?? d.slug
        } else if (d instanceof DocumentationGroup) {
            pageSlug = d.title // Eventually we will introduce slugs for groups as well
        } else {
            throw new Error("Unsupported documentation slug entity")
        }

        let subpaths: Array<string> = []

        // Construct group path segments
        let parent: DocumentationGroup | null = d.parent
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
    static firstPageObjectSlug(group: DocumentationGroup): string | null {

        let firstPage = this.firstPageFromTop(group)
        return firstPage ? this.documentationObjectSlug(firstPage) : null
    }

    /** Retrieves first page from the specific group, from the top, descending deeper and deeper into subgroups if not found immediately. Returns null when there is no page in the group */
    static firstPageFromTop(documentationRoot: DocumentationGroup): DocumentationPage | null {
        for (let child of documentationRoot.children) {
            if (child.type === "Page") {
                return child as DocumentationPage
            } else {
                let possiblePage = UtilsUrls.firstPageFromTop(child as DocumentationGroup)
                if (possiblePage) {
                    return possiblePage
                }
            }
        }
        return null
    }

    /** Retrieves id chain of groups up to the root group for a documentation page */
    static groupChainUntilRoot(item: DocumentationItem): Array<string> {
        let parent: DocumentationItem | null = (item as any).parent
        let ids = new Array<string>()
        while (parent) {
            ids.push(parent.persistentId)
            parent = (parent as any).parent
        }
        return ids
    }
}
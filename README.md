<img src="https://github.com/Supernova-Studio/gastby-source-supernova/blob/main/readme-icon.png?raw=true" alt="Supernova + Gatsby Source Plugin" style="max-width:100%; margin-bottom: 20px;" />

# Supernova + Gatsby source plugin

Custom source plugin for Gatsby to access data from design system supereditor, [Supernova.io](https://supernova.io). With this source plugin, you can use Supernova to build your documentation sites and customize every aspect of it.

To see example of documentation built using this plugin, see the [Supernova Gatsby starter pack](https://github.com/Supernova-Studio/gatsby-documentation-site).

## Features

Here are some things this plugin does and can do for you:

- [x] Automatic and efficient download of Supernova data
- [x] Automatic conversion of Supernova REST to Gatsby GraphQL representation
- [x] Stable and well-defined model
- [x] Typescript interface
- [x] Fully "autonomous" mode - just install & run
- [x] Support for all documentation objects, blocks
- [x] Support for design system tokens, assets
- [x] Support for targeting a specific design system version

Note that compared to many other plugins like this, we went the extra mile and defined all type interfaces for all the objects, including nullability, references and many others. 

This also means that all GraphQL types are always present, and you can query them without worrying about queries failing because of missing data from which they would be infered.

## Install

To install Supernova plugin in your Gatsby project, simply install npm package:

```shell
npm install @supernovaio/gatsby-source-supernova
```

## Setting up plugin

Before you can use the plugin, you must configure the data target - your API key, which workspace and design system you want to work with. This is done by providing options when you include source plugin in your `gatsby-config.js`:

```javascript
module.exports = {
    plugins: [
        {
            resolve: "@supernovaio/gatsby-source-supernova",
            options: supernovaConfig,
        }
    ]
}
```

`supernovaConfig` is an object with the following definition. You can fill it with information defined in your `env` variable. This is recommended as you will usually not commit it to your repositories, keeping the keys safe:

```javascript
const supernovaConfig = {
    apiToken: process.env.SUPERNOVA_API_TOKEN,
    workspaceId: process.env.SUPERNOVA_WORKSPACE_ID,
    designSystemId: process.env.SUPERNOVA_DESIGN_SYSTEM_ID,
    designSystemVersionId: process.env.SUPERNOVA_DESIGN_SYSTEM_VERSION_ID
};
```

To make it easy for you to get all the neccessary information, we have prepared interactive setup that does all of the above. [Use Supernova starter](https://github.com/Supernova-Studio/gatsby-documentation-site) and run `npm run setup` to create `env` file for you, automatically.

## Using source plugin 

This source plugin works autonomously so there is no work from your side needed. It runs in the background before your site builds and downloads all required information about your design system. Then, it converts data to GraphQL and makes them available for querying.

Because the packages automatically creates all model classes inside GraphQL when it runs, you don't have to worry about attributes not defined in queries if you haven't use them in Supernova just yet. 

You can find full GraphQL interface this plugin creates [here](https://github.com/Supernova-Studio/gastby-source-supernova/blob/main/src/gatsby-gql-types.graphql).

## Using Typescript

To make it easier to develop queries and use results from GraphQL, source plugin comes with the entire type system prepared for you. 

To import the types, we recommend the following:

```typescript
import * as SupernovaTypes from "@supernovaio/gatsby-source-supernova"
```

Then, all types are clearly defined under `SupernovaTypes` object and will match the results of GraphQL queries. For example, to fetch all token names, your query could look like this:

```graphql
query QueryAllTokens {
    allToken {
        nodes {
            brandId
            description
            id
            name
        }
    }
}
```

and to get objects properly typed:

```typescript
const data = useStaticQuery(query)
const tokens = data.allToken.nodes as Array<SupernovaTypes.Token>
```

## Masking

In some cases, our implementation uses something that we call masking. Take the following as an example:

In Supernova, there are two types of documentation items - `groups` and `pages`. They both have nearly identical interface with one exception - pages contain `blocks of content` (headers, text, code blocks..) while groups contain other groups and pages. 

It makes little sense to define them as 2 separate objects - because it also makes it hard to fetch combined tree containing both groups and pages, so we combined them and made certain attributes optional in GraphQL definition - however, not optional in TypeScript definitions.

Take the following query as an example:

```graphql
query QueryAllItems {
    allDocumentationItem {
        nodes {
            id
            itemType
            blockIds // This is page attribute
            groupBehavior // This is group attribute
            ... (all other item attributes)
        }
    }
}
```

You can use interface masking to decide what object you are dealing with:

```typescript
const data = useStaticQuery(query)
const items = data.allDocumentationItem.nodes as Array<SupernovaTypes.DocumentationItem>

for (let item of items)
    if (item.itemType === SupernovaTypes.DocumentationItemType.Group) {
        const group = item as SupernovaTypes.DocumentationGroup
        const behavior = group.groupBehavior
        // group.blockIds doesn't exist
    } else {
        const page = item as SupernovaTypes.DocumentationPage
        const blockIds = page.blockIds
        // group.groupBehavior doesn't exist
    }
```

Because Supernova's backend enforces all the rules, we can count on this implementation to be always correct and it makes working with complex model like Supernova has much easier, especially with documentation blocks.


## Example queries

We have created many of the queries you might need that you can just copy into your project and use out of the box. [You can find all examples here](https://github.com/Supernova-Studio/gatsby-documentation-site/tree/main/src/model/queries).


## What's next

As this is still beta, we are working hard on improving it before the first official release. The following are areas we'd like to solve before general release:

- [ ] Using resharp for image urls 
- [ ] Add native support for MD and MDX
- [ ] Option to download partial updates
- [ ] Option to sync data even in non-build time, on demand


## Contributions

If you have additional ideas about how to make this project better, let us know by opening an issue! You can also open pull requests if you've worked on improving something yourself and would like to contribute back to the community. 

We will be reviewing feature-pull-requests on case-by-case basis, but in general, we are super open to your new ideas and we welcome them! And finally, thank you for your support! You are an amazing community.

Supernova Engineering Team
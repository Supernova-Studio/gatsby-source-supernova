# Changelog

All notable changes to this Supernova <> Gatsby data plugin are mentioned here in this file.

## [0.7.0] - 2022-29-03
### Custom exporter data + new data types

We have added ability to access data defined in custom exporter packages. This allows you to access block, property and variant data defined in your `exporter.json` through GQL, but also access configuration of the custom blocks you have spawned

- All available documentation exporter `Custom Blocks` are now available in GQL
- All available documentation exporter `Custom Block Variants` are now available in GQL
- All available documentation exporter `Configuration Properties` are now available in GQL
- New `Tabs` block data model is available in GQL (+ all required subblocks)
- New `Table` block data model is available in GQL (+ all required subblocks)
- New `Column` block data model is available in GQL (+ all required subblocks)

We have additionally added ability to access `variant` of each block set in the editor through `variantKey` available for each block. Finally, properties for custom blocks were completely reworked. 

They can now be accessed through `block.blockProperties` which gives access to definitions of all properties for that custom block. Each property, in addition to the entire definition, contains `value` field that either contains `user-defined`, `default` or `null` property. 

Properties are defined as new `MultitypeValue` type introduced that can contain `string`, `boolean`, `number`, `image`, `color`, `enum` or `typography`. To make work with this system even easier, we have added helpers into the Gatsby Supernova Starter pack (to be released).


## [until 0.6.X] - 2021 - 2022
### Initial implementation


# Changelog

All notable changes to this Supernova <> Gatsby data plugin are mentioned here in this file.

## [0.7.0] - 2022-29-03
### Custom exporter data + new data types

We have added ability to access data defined in custom exporter packages. This allows you to access block, property and variant data defined in your `exporter.json` through GQL, but also access configuration of the custom blocks you have spawned

- All available documentation exporter `Custom Blocks` are now available in GQL
- All available documentation exporter `Custom Block Variants` are now available in GQL
- All available documentation exporter `Configuration Properties` are now available in GQL
- New `MultitypeValue` type introduced that can contain `string`, `boolean`, `number`, `image`, `color`, `enum` or `typography`

We have additionally added ability to access `variant` of each block set in the editor through `variantKey` available for each block.


## [until 0.6.X] - 2021 - 2022
### Initial implementation


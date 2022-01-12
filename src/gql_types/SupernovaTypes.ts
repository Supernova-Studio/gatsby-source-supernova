export namespace SupernovaTypes {
  export enum TokenType {
    Color = "Color",
    Typography = "Typography",
    Radius = "Radius",
    Font = "Font",
    Measure = "Measure",
    Shadow = "Shadow",
    Border = "Border",
    Gradient = "Gradient",
    Generic = "Generic",
    Blur = "Blur",
    Text = "Text",
  }

  export enum TokenPropertyType {
    Number = "Number",
    Boolean = "Boolean",
    String = "String",
    Generic = "Generic",
  }

  export enum SourceType {
    Supernova = "Supernova",
    Figma = "Figma",
  }

  export enum TextCase {
    Original = "Original",
    Upper = "Upper",
    Lower = "Lower",
    Camel = "Camel",
  }

  export enum TextDecoration {
    Original = "Original",
    Underline = "Underline",
    Strikethrough = "Strikethrough",
  }

  export enum Unit {
    pixels = "Pixels",
    points = "Points",
    percent = "Percent",
    ems = "Ems",
  }

  export enum BorderPosition {
    inside = "Inside",
    center = "Center",
    outside = "Outside",
  }

  export enum GradientType {
    linear = "Linear",
    radial = "Radial",
    angular = "Angular",
  }

  export enum DocumentationItemType {
    group = "Group",
    page = "Page",
  }

  export enum DocumentationPageBlockType {
    text = "Text",
    heading = "Heading",
    code = "Code",
    unorderedList = "UnorderedList",
    orderedList = "OrderedList",
    quote = "Quote",
    callout = "Callout",
    divider = "Divider",
    image = "Image",
    token = "Token",
    tokenList = "TokenList",
    tokenGroup = "TokenGroup",
    shortcuts = "Shortcuts",
    link = "Link",
    figmaEmbed = "FigmaEmbed",
    youtubeEmbed = "YoutubeEmbed",
    storybookEmbed = "StorybookEmbed",
    genericEmbed = "Embed",
    figmaFrames = "FigmaFrames",
    custom = "Custom",
    renderCode = "RenderCode",
    componentAssets = "ComponentAssets",
  }

  export enum RichTextSpanAttributeType {
    bold = "Bold",
    italic = "Italic",
    link = "Link",
    strikethrough = "Strikethrough",
    code = "Code",
  }

  export enum CalloutType {
    info = "Info",
    success = "Success",
    warning = "Warning",
    error = "Error",
  }

  export enum HeadingType {
    h1 = 1,
    h2 = 2,
    h3 = 3,
  }

  export type HeaderAlignment = "Default" | "Center"

  export enum FrameAlignment {
    frameHeight = "FrameHeight",
    center = "Center",
  }

  export enum Alignment {
    left = "Left",
    center = "Center",
    stretch = "Stretch",
  }

  export enum FrameLayout {
    c8 = "C8",
    c7 = "C7",
    c6 = "C6",
    c5 = "C5",
    c4 = "C4",
    c3 = "C3",
    c2 = "C2",
    c1 = "C1",
    c175 = "C1_75",
  }

  export enum ShortcutType {
    Internal = "Internal",
    External = "External",
  }
  export enum ShadowType {
    Drop = "Drop",
    Inner = "Inner",
  }

  export enum SandboxType {
    React = "React",
  }

  export enum AssetFormat {
    png = "png",
    pdf = "pdf",
    svg = "svg",
  }

  export enum AssetScale {
    x1 = "x1",
    x2 = "x2",
    x3 = "x3",
    x4 = "x4",
  }

  export enum AssetScaleType {
    aspectFill = "AspectFill",
    aspectFit = "AspectFit",
  }

  export enum CustomBlockPropertyType {
    string = "string",
    number = "number",
    boolean = "boolean",
    enum = "enum",
    image = "image",
  }

  export enum DocumentationGroupBehavior {
    group = "Group",
    tabs = "Tabs",
  }
  
  export enum BlurType {
    layer = "Layer",
    background = "Background"
  }

  export type GraphQLNode = {
    id: string
    internal: any
    /* Internal properties that are not exposed
    parent: any
    internal: any
    children: Array<any>
    */ 
  }

  export type DocumentationItem = GraphQLNode & {
    persistentId: string
    title: string
    configuration: {
      header: DocumentationItemHeader
      showSidebar: boolean
    }
    itemType: DocumentationItemType,
    slug: string,
    firstPageSlug: string | null, // Note: For page, first page slug is always the page slug itself
    parentGroupId: string | null,
    parentGroupChain: Array<string>,
  }

  export type DocumentationItemHeader = {
    backgroundImageAssetUrl: string | null
    backgroundImageAssetId: string | null
    backgroundImageScaleType: AssetScaleType
    description: string
    alignment: Alignment
    foregroundColor: string | null
    backgroundColor: string | null
    showBackgroundOverlay: boolean
    showCoverText: boolean
    minHeight: number
  }

  export type DocumentationGroup = DocumentationItem & {
    isRoot: boolean
    subpageIds: Array<string>,
    subgroupIds: Array<string>,
    subitemIds: Array<string>,
    groupBehavior: DocumentationGroupBehavior
  }

  export type DocumentationPage = DocumentationItem & {
    blockIds: Array<string>
  }

  export type DocumentationConfiguration = {
    tabbedNavigation: boolean
    storybookError: string | null
    packageJson: string | null
  }

  //
  // Data Types
  // Subcategory: Documentation Blocks

  export type DocumentationPageBlock = GraphQLNode & {
    id: string
    blockIds: Array<string>
    blockType: DocumentationPageBlockType
    beginsTypeChain: boolean
    endsTypeChain: boolean
  }

  export type DocumentationPageBlockCallout = DocumentationPageBlockText & {
    calloutType: CalloutType
  }

  export type DocumentationPageBlockCode = DocumentationPageBlockText & {
    codeLanguage: string | null
    caption: string | null
  }

  export type DocumentationPageBlockDivider = DocumentationPageBlock & {
    // No extra attributes
  }

  export type DocumentationPageBlockHeading = DocumentationPageBlockText & {
    headingType: HeadingType
  }

  export type DocumentationPageBlockImage = DocumentationPageBlock & {
    url: string | null
    caption: string | null
    alignment: Alignment
  }

  export type DocumentationPageBlockOrderedList = DocumentationPageBlockText & {
    // No extra attributes
  }

  export type DocumentationPageBlockQuote = DocumentationPageBlockText & {
    // No extra attributes
  }

  export type DocumentationPageBlockText = DocumentationPageBlock & {
    text: DocumentationPageBlockTextRich
  }

  export type DocumentationPageBlockTextRich = {
    spans: Array<{
      text: string
      attributes: Array<{
        type: RichTextSpanAttributeType
        link: string | null
      }>
    }>
  }

  export type DocumentationPageBlockToken = DocumentationPageBlock & {
    tokenId: string | null
  }

  export type DocumentationPageBlockTokenGroup = DocumentationPageBlock & {
    groupId: string | null
    showNestedGroups: boolean
  }

  export type DocumentationPageBlockTokenList = DocumentationPageBlock & {
    tokenIds: Array<string>
  }

  export type DocumentationPageBlockUnorderedList =
    DocumentationPageBlockText & {
      // No extra attributes
    }

  export type DocumentationPageBlockEmbedGeneric = DocumentationPageBlock & {
    url: string | null
    size: {
      width: number | null
      height: number | null
    }
    caption: string | null
  }

  export type DocumentationPageBlockLink =
    DocumentationPageBlockEmbedGeneric & {
      title: string | null
      description: string | null
      thumbnailUrl: string | null
    }

  export type DocumentationPageBlockEmbedYoutube =
    DocumentationPageBlockEmbedGeneric & {}

  export type DocumentationPageBlockEmbedFigma =
    DocumentationPageBlockEmbedGeneric & {}

  export type DocumentationPageBlockEmbedStorybook =
    DocumentationPageBlockEmbedGeneric & {}

  export type DocumentationPageBlockEmbedUrl =
    DocumentationPageBlockEmbedGeneric & {
      title: string | null
      description: string | null
      thumbnailUrl: string | null
    }

  export type DocumentationPageBlockFrames = DocumentationPageBlock & {
    frames: Array<DocumentationPageBlockFrame>
    properties: {
      alignment: FrameAlignment
      layout: FrameLayout
      backgroundColor: string | null
    }
  }

  export type DocumentationPageBlockFrame = {
    sourceFileId: string
    sourceFrameId: string
    sourceFileName: string

    title: string | null
    description: string | null
    previewUrl: string | null
    backgroundColor: string | null
  }

  export type DocumentationPageBlockCustom = DocumentationPageBlock & {
    key: string
    properties: Object
    block: DocumentationCustomBlock | null
  }

  export type DocumentationCustomBlock = {
    key: string
    title: string
    description: string
    category: string
    iconUrl: string | null
    properties: Array<DocumentationCustomBlockProperty>
  }

  export type DocumentationCustomBlockProperty = {
    label: string
    key: string
    type: CustomBlockPropertyType
    default: string | number | boolean | null
    values: Array<string>
  }

  export type DocumentationPageBlockRenderCode = DocumentationPageBlock & {
    alignment: Alignment
    backgroundColor: string | null
    showCode: boolean
    code: string
    packageJSON: string
    height: number | null
    sandboxData: string
    sandboxType: SandboxType
  }

  export type DocumentationPageBlockAssets = DocumentationPageBlock & {
    assets: Array<DocumentationPageBlockAsset>
    properties: {
      color: string | null
      alignment: FrameAlignment
      layout: FrameLayout
    }
  }

  export type DocumentationPageBlockAsset = {
    assetId: string
    title: string | null
    description: string | null
    previewUrl: string | null
    backgroundColor: string | null
  }

  export type DocumentationPageBlockShortcuts = DocumentationPageBlock & {
    shortcuts: Array<DocumentationPageBlockShortcut>
  }

  export type DocumentationPageBlockShortcut = {
    // Visual data
    title: string | null
    description: string | null
    previewUrl: string | null

    // Linking data
    externalUrl: string | null
    internalId: string | null

    // Shortcut type
    shortcutType: ShortcutType
  }

  export type TokenGroup = GraphQLNode & {
    id: string
    name: string
    description: string
    path: Array<string>
    tokenType: TokenType
    isRoot: boolean
    childrenIds: Array<string>
    subgroupIds: Array<string>
    tokenIds: Array<string>
    parentId: string | null
  }

  export type Workspace = GraphQLNode & {
    id: string
    handle: string
    name: string
    color: string
  }

  export type DesignSystem = GraphQLNode & {
    id: string
    workspaceId: string
    name: string
    description: string
    isPublic: boolean
  }

  export type DesignSystemVersion = GraphQLNode & {
    id: string
    designSystemId: string
    name: string
    description: string
    version: string
    changeLog: string | null
    isReadOnly: boolean
  }

  export type SourceOrigin = {
    source: SourceType
    id: string | null
    name: string | null
  }

  export type Token = GraphQLNode & TokenValue & {}

  export type ColorToken = Token & {
    value: ColorTokenValue
  }

  export type TypographyToken = Token & {
    value: TypographyTokenValue
  }

  export type RadiusToken = Token & {
    value: RadiusTokenValue
  }

  export type ShadowToken = Token & {
    value: ShadowTokenValue
  }

  export type MeasureToken = Token & {
    value: MeasureTokenValue
  }

  export type BorderToken = Token & {
    value: BorderTokenValue
  }

  export type GradientToken = Token & {
    value: GradientTokenValue
  }

  export type TextToken = Token & {
    value: TextTokenValue
  }

  export type FontToken = Token & {
    value: FontTokenValue
  }

  export type BlurToken = Token & {
    value: BlurTokenValue
  }

  export type GenericToken = Token & {
    value: GenericTokenValue
  }

  export type TokenValue = {
    id: string
    brandId: string
    name: string
    description: string
    tokenType: TokenType
    origin: SourceOrigin | null
    properties: Array<TokenProperty>
  }

  export type TokenProperty = {
    name: string
    codeName: string
    type: TokenPropertyType
    booleanValue: boolean | null
    stringValue: string | null
    numericValue: number | null
  }

  export type ColorTokenValue = {
    hex: string
    r: number
    g: number
    b: number
    a: number
    referencedTokenId: string | null
  }

  export type TypographyTokenValue = {
    font: FontTokenValue
    fontSize: MeasureTokenValue
    textDecoration: TextDecoration
    textCase: TextCase
    letterSpacing: MeasureTokenValue
    lineHeight: MeasureTokenValue | null
    paragraphIndent: MeasureTokenValue
    referencedTokenId: string | null
  }

  export type RadiusTokenValue = {
    radius: MeasureTokenValue
    topLeft: MeasureTokenValue | null
    topRight: MeasureTokenValue | null
    bottomLeft: MeasureTokenValue | null
    bottomRight: MeasureTokenValue | null
    referencedTokenId: string | null
  }

  export type ShadowTokenValue = {
    color: ColorTokenValue
    x: MeasureTokenValue
    y: MeasureTokenValue
    radius: MeasureTokenValue
    spread: MeasureTokenValue
    opacity: number
    type: ShadowType
    referencedTokenId: string | null
  }

  export type MeasureTokenValue = {
    unit: Unit
    measure: number
    referencedTokenId: string | null
  }

  export type FontTokenValue = {
    family: string
    subfamily: string
    referencedTokenId: string | null
  }

  export type BorderTokenValue = {
    color: ColorTokenValue
    width: MeasureTokenValue
    position: BorderPosition
    referencedTokenId: string | null
  }

  export type GradientTokenValue = {
    to: {
      x: number
      y: number
    }
    from: {
      x: number
      y: number
    }
    type: GradientType
    aspectRatio: number
    stops: Array<GradientStopValue>
    referencedTokenId: string | null
  }

  export type GradientStopValue = {
    position: number
    color: ColorTokenValue
  }

  export type TextTokenValue = {
    text: string
    referencedTokenId: string | null
  }

  export type GenericTokenValue = {
    text: string
    referencedTokenId: string | null
  }

  export type BlurTokenValue = {
    type: BlurType
    radius: MeasureTokenValue
    referencedTokenId: string | null
  }

  export type Asset = GraphQLNode & {
    brandId: string;
    thumbnailUrl: string | null;
    name: string;
    description: string;
    componentId: string | null;
    previouslyDuplicatedNames: number;
  }
}
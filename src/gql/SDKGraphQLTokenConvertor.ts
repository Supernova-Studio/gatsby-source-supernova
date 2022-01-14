//
//  SDKGraphQLTokenConvertor.ts
//  Supernova Gatsby Source
//
//  Created by Jiri Trecak <jiri@supernova.io> 
//  Supernova.io 
//

// --- --- --- --- --- --- --- --- --- --- --- --- --- --- --- --- --- --- --- --- --- --- --- --- --- --- ---
// MARK: - Imports

import * as SupernovaSDK from "@supernovaio/supernova-sdk"
import { TokenPropertyType, BorderPosition, ColorToken, BlurToken, BorderToken, FontToken, GenericToken, GradientToken, MeasureToken, RadiusToken, ShadowToken, TextToken, TypographyToken, TokenGroup, SourceType, ShadowType, TextCase, TextDecoration, TokenProperty, GradientStopValue, GradientType, Unit, Token, TokenType, BlurType } from "../gql_types/SupernovaTypes"
import { SDKGraphQLObjectConvertor } from "./SDKGraphQLObjectConvertor"


  
const PARENT_SOURCE: string = "__SOURCE__"


// --- --- --- --- --- --- --- --- --- --- --- --- --- --- --- --- --- --- --- --- --- --- --- --- --- --- ---
// MARK: - Convertor

export class SDKGraphQLTokenConvertor {

  // --- Token conversion

  tokens(sdkTokens: Array<SupernovaSDK.Token>): Array<Token> {

    let graphQLNodes: Array<Token> = []
    for (let token of sdkTokens) {
      graphQLNodes.push(this.convertTokenToGraphQL(token))
    }

    return graphQLNodes
  }

  convertTokenToGraphQL(token: SupernovaSDK.Token): Token {

    // Convert base information about tokens
    const tokenDescription = {
      id: token.id,
      parent: PARENT_SOURCE,
      internal: SDKGraphQLObjectConvertor.nodeInternals("Token"),
      children: [],
      brandId: token.brandId,
      name: token.name,
      description: token.description,
      tokenType: this.convertTokenType(token.tokenType),
      origin: token.origin ? {
          id: token.origin.id,
          source: this.convertSourceType(token.origin.source),
          name: token.origin.name
      } : null,
      properties: token.properties.map(p => this.convertTokenProperty(p))
    } 

    // Convert all details
    let detailedTokenObject = this.convertTokenDetailsToGraphQL(token, tokenDescription)

    // Checksum
    detailedTokenObject.internal.contentDigest = SDKGraphQLObjectConvertor.nodeDigest(detailedTokenObject)
    return detailedTokenObject
  }

  // --- Token specifics

  convertTokenDetailsToGraphQL(token: SupernovaSDK.Token, baseObject: Token): Token {

    switch (token.tokenType) {
        case SupernovaSDK.TokenType.color: return this.convertTokenColorDetailsToGraphQL(token as SupernovaSDK.ColorToken, baseObject)
        case SupernovaSDK.TokenType.blur: return this.convertTokenBlurDetailsToGraphQL(token as SupernovaSDK.BlurToken, baseObject)
        case SupernovaSDK.TokenType.border: return this.convertTokenBorderDetailsToGraphQL(token as SupernovaSDK.BorderToken, baseObject)
        case SupernovaSDK.TokenType.font: return this.convertTokenFontDetailsToGraphQL(token as SupernovaSDK.FontToken, baseObject)
        case SupernovaSDK.TokenType.generic: return this.convertTokenGenericDetailsToGraphQL(token as SupernovaSDK.GenericToken, baseObject)
        case SupernovaSDK.TokenType.gradient: return this.convertTokenGradientDetailsToGraphQL(token as SupernovaSDK.GradientToken, baseObject)
        case SupernovaSDK.TokenType.measure: return this.convertTokenMeasureDetailsToGraphQL(token as SupernovaSDK.MeasureToken, baseObject)
        case SupernovaSDK.TokenType.radius: return this.convertTokenRadiusDetailsToGraphQL(token as SupernovaSDK.RadiusToken, baseObject)
        case SupernovaSDK.TokenType.shadow: return this.convertTokenShadowDetailsToGraphQL(token as SupernovaSDK.ShadowToken, baseObject)
        case SupernovaSDK.TokenType.text: return this.convertTokenTextDetailsToGraphQL(token as SupernovaSDK.TextToken, baseObject)
        case SupernovaSDK.TokenType.typography: return this.convertTokenTypographyDetailsToGraphQL(token as SupernovaSDK.TypographyToken, baseObject)
        default: throw new Error("Unsupported token type encountered")
    }
  }

  convertTokenGradientDetailsToGraphQL(token: SupernovaSDK.GradientToken, baseObject: Token): GradientToken {
    return {
        ...baseObject,
        value: {
            to: {
                x: token.value.to.x,
                y: token.value.to.y,
            },
            from: {
                x: token.value.to.x,
                y: token.value.to.y,
            },
            type: this.convertGradientType(token.value.type),
            aspectRatio: token.value.aspectRatio,
            stops: token.value.stops.map(s => this.convertTokenGradientStopToGraphQL(s)),
            referencedTokenId: token.value.referencedToken ? token.value.referencedToken.id : null
        }
    } 
  }

  convertTokenGradientStopToGraphQL(gradientStop: SupernovaSDK.GradientStopValue): GradientStopValue {
    return {
        position: gradientStop.position,
        color: {
            hex: gradientStop.color.hex,
            r: gradientStop.color.r,
            g: gradientStop.color.g,
            b: gradientStop.color.b,
            a: gradientStop.color.a,
            referencedTokenId: gradientStop.color.referencedToken ? gradientStop.color.referencedToken.id : null
        }
    }
  }


  convertTokenTypographyDetailsToGraphQL(token: SupernovaSDK.TypographyToken, baseObject: Token): TypographyToken {
    return {
        ...baseObject,
        value: {
            font: {
                family: token.value.font.family,
                subfamily: token.value.font.subfamily,
                referencedTokenId: token.value.font.referencedToken ? token.value.font.referencedToken.id : null
            },
            fontSize: {
                measure: token.value.fontSize.measure,
                unit: this.convertUnit(token.value.fontSize.unit),
                referencedTokenId: token.value.fontSize.referencedToken ? token.value.fontSize.referencedToken.id : null
            },
            textDecoration: this.convertTextDecoration(token.value.textDecoration),
            textCase: this.convertTextCase(token.value.textCase),
            letterSpacing: {
                measure: token.value.letterSpacing.measure,
                unit: this.convertUnit(token.value.letterSpacing.unit),
                referencedTokenId: token.value.letterSpacing.referencedToken ? token.value.letterSpacing.referencedToken.id : null
            },
            lineHeight: token.value.lineHeight ? {
                measure: token.value.lineHeight.measure,
                unit: this.convertUnit(token.value.lineHeight.unit),
                referencedTokenId: token.value.lineHeight.referencedToken ? token.value.lineHeight.referencedToken.id : null
            } : null,
            paragraphIndent: {
                measure: token.value.paragraphIndent.measure,
                unit: this.convertUnit(token.value.paragraphIndent.unit),
                referencedTokenId: token.value.paragraphIndent.referencedToken ? token.value.paragraphIndent.referencedToken.id : null
            },
            referencedTokenId: token.value.referencedToken ? token.value.referencedToken.id : null
        }
    } 
  }

  convertTokenFontDetailsToGraphQL(token: SupernovaSDK.FontToken, baseObject: Token): FontToken {
    return {
        ...baseObject,
        value: {
            family: token.value.family,
            subfamily: token.value.subfamily,
            referencedTokenId: token.value.referencedToken ? token.value.referencedToken.id : null
        }
    }  
  }

  convertTokenRadiusDetailsToGraphQL(token: SupernovaSDK.RadiusToken, baseObject: Token): RadiusToken {
    return {
        ...baseObject,
        value: {
            radius: {
                measure: token.value.radius.measure,
                unit: this.convertUnit(token.value.radius.unit),
                referencedTokenId: token.value.radius.referencedToken ? token.value.radius.referencedToken.id : null
            },
                topLeft: token.value.topLeft ? {
                measure: token.value.topLeft.measure,
                unit: this.convertUnit(token.value.topLeft.unit),
                referencedTokenId: token.value.topLeft.referencedToken ? token.value.topLeft.referencedToken.id : null
            } : null,
                topRight: token.value.topRight ? {
                measure: token.value.topRight.measure,
                unit: this.convertUnit(token.value.topRight.unit),
                referencedTokenId: token.value.topRight.referencedToken ? token.value.topRight.referencedToken.id : null
            } : null,
                bottomLeft: token.value.bottomLeft ? {
                measure: token.value.bottomLeft.measure,
                unit: this.convertUnit(token.value.bottomLeft.unit),
                referencedTokenId: token.value.bottomLeft.referencedToken ? token.value.bottomLeft.referencedToken.id : null
            } : null,
                bottomRight: token.value.bottomRight ? {
                measure: token.value.bottomRight.measure,
                unit: this.convertUnit(token.value.bottomRight.unit),
                referencedTokenId: token.value.bottomRight.referencedToken ? token.value.bottomRight.referencedToken.id : null
            } : null,
            referencedTokenId: token.value.referencedToken ? token.value.referencedToken.id : null
        }
    }
  }

  convertTokenGenericDetailsToGraphQL(token: SupernovaSDK.GenericToken, baseObject: Token): GenericToken {
    return {
        ...baseObject,
        value: {
            text: token.value.text,
            referencedTokenId: token.value.referencedToken ? token.value.referencedToken.id : null
        }
    }
  }
 
  convertTokenColorDetailsToGraphQL(token: SupernovaSDK.ColorToken, baseObject: Token): ColorToken {
    return {
      ...baseObject,
      value: {
          hex: token.value.hex,
          r: token.value.r,
          g: token.value.g,
          b: token.value.b,
          a: token.value.a,
          referencedTokenId: token.value.referencedToken ? token.value.referencedToken.id : null
      }
    }
  }

  convertTokenBorderDetailsToGraphQL(token: SupernovaSDK.BorderToken, baseObject: Token): BorderToken {
    return {
        ...baseObject,
        value: {
            color: {
                r: token.value.color.r,
                g: token.value.color.g,
                b: token.value.color.b,
                a: token.value.color.a,
                hex: token.value.color.hex,
                referencedTokenId: token.value.color.referencedToken ? token.value.color.referencedToken.id : null
            },
            width: {
                measure: token.value.width.measure,
                unit: this.convertUnit(token.value.width.unit),
                referencedTokenId: token.value.width.referencedToken ? token.value.width.referencedToken.id : null
            },
            position: this.convertBorderPosition(token.value.position),
            referencedTokenId: token.value.referencedToken ? token.value.referencedToken.id : null
        }
    }
  }

  convertTokenShadowDetailsToGraphQL(token: SupernovaSDK.ShadowToken, baseObject: Token): ShadowToken {
    return {
        ...baseObject,
        value: {
            color: {
                r: token.value.color.r,
                g: token.value.color.g,
                b: token.value.color.b,
                a: token.value.color.a,
                hex: token.value.color.hex,
                referencedTokenId: token.value.color.referencedToken ? token.value.color.referencedToken.id : null
            },
            x: {
                measure: token.value.x.measure,
                unit: this.convertUnit(token.value.x.unit),
                referencedTokenId: token.value.x.referencedToken ? token.value.x.referencedToken.id : null
            },
            y: {
                measure: token.value.y.measure,
                unit: this.convertUnit(token.value.y.unit),
                referencedTokenId: token.value.y.referencedToken ? token.value.y.referencedToken.id : null
            },
            radius: {
                measure: token.value.radius.measure,
                unit: this.convertUnit(token.value.radius.unit),
                referencedTokenId: token.value.radius.referencedToken ? token.value.radius.referencedToken.id : null
            },
            spread: {
                measure: token.value.spread.measure,
                unit: this.convertUnit(token.value.spread.unit),
                referencedTokenId: token.value.spread.referencedToken ? token.value.spread.referencedToken.id : null
            },
            opacity: token.value.opacity,
            type: this.convertShadowType(token.value.type),
            referencedTokenId: token.value.referencedToken ? token.value.referencedToken.id : null
        }
    }
  }

  convertTokenMeasureDetailsToGraphQL(token: SupernovaSDK.MeasureToken, baseObject: Token): MeasureToken {
    return {
        ...baseObject,
        value: {
            unit: this.convertUnit(token.value.unit),
            measure: token.value.measure,
            referencedTokenId: token.value.referencedToken ? token.value.referencedToken.id : null
        }
    }
  }

  convertTokenTextDetailsToGraphQL(token: SupernovaSDK.TextToken, baseObject: Token): TextToken {
    return {
        ...baseObject,
        value: {
            text: token.value.text,
            referencedTokenId: token.value.referencedToken ? token.value.referencedToken.id : null
        }
    }
  }

  convertTokenBlurDetailsToGraphQL(token: SupernovaSDK.BlurToken, baseObject: Token): BlurToken {
    return {
        ...baseObject,
        value: {
            radius: {
                measure: token.value.radius.measure,
                unit: this.convertUnit(token.value.radius.unit),
                referencedTokenId: token.value.radius.referencedToken ? token.value.radius.referencedToken.id : null
            },
            type: this.convertBlurType(token.value.type),
            referencedTokenId: token.value.referencedToken ? token.value.referencedToken.id : null
        }
    }
  }

  // --- Token group conversion

  tokenGroups(sdkTokenGroups: Array<SupernovaSDK.TokenGroup>): Array<TokenGroup> {

    let graphQLNodes: Array<TokenGroup> = []
    for (let group of sdkTokenGroups) {
      graphQLNodes.push(this.convertTokenGroupToGraphQL(group))
    }

    return graphQLNodes
  }

  convertTokenGroupToGraphQL(group: SupernovaSDK.TokenGroup): TokenGroup {

    // Convert base information about tokens
    const tokenGroupDescription = {
      id: group.id,
      parent: PARENT_SOURCE,
      internal: SDKGraphQLObjectConvertor.nodeInternals("GroupToken"),
      children: [],
      brandId: group.brandId,
      name: group.name,
      description: group.description,
      tokenType: this.convertTokenType(group.tokenType),
      isRoot: group.isRoot,
      childrenIds: group.childrenIds,
      subgroupIds: group.subgroups.map(g => g.id),
      tokenIds: group.tokenIds,
      parentId: group.parent ? group.parent.id : null,
      path: group.path
    } 

    // Checksum
    tokenGroupDescription.internal.contentDigest = SDKGraphQLObjectConvertor.nodeDigest(tokenGroupDescription)
    return tokenGroupDescription
  }


  // --- Subconversions

  convertBlurType(type: SupernovaSDK.BlurType): BlurType {

    switch (type) {
      case SupernovaSDK.BlurType.background: return BlurType.background
      case SupernovaSDK.BlurType.layer: return BlurType.layer
    }
  }

  convertBorderPosition(position: SupernovaSDK.BorderPosition): BorderPosition {

    switch (position) {
      case SupernovaSDK.BorderPosition.center: return BorderPosition.center
      case SupernovaSDK.BorderPosition.inside: return BorderPosition.inside
      case SupernovaSDK.BorderPosition.outside: return BorderPosition.outside
    }
  }

  convertUnit(unit: SupernovaSDK.Unit): Unit {

    switch (unit) {
      case SupernovaSDK.Unit.ems: return Unit.ems
      case SupernovaSDK.Unit.percent: return Unit.percent
      case SupernovaSDK.Unit.pixels: return Unit.pixels
      case SupernovaSDK.Unit.points: return Unit.points
    }
  }

  convertGradientType(gradientType: SupernovaSDK.GradientType): GradientType {

    switch (gradientType) {
      case SupernovaSDK.GradientType.angular: return GradientType.angular
      case SupernovaSDK.GradientType.linear: return GradientType.linear
      case SupernovaSDK.GradientType.radial: return GradientType.radial
    }
  }

  convertTokenType(tokenType: SupernovaSDK.TokenType): TokenType {

    switch (tokenType) {
      case SupernovaSDK.TokenType.color: return TokenType.Color
      case SupernovaSDK.TokenType.blur: return TokenType.Blur
      case SupernovaSDK.TokenType.border: return TokenType.Border
      case SupernovaSDK.TokenType.font: return TokenType.Font
      case SupernovaSDK.TokenType.generic: return TokenType.Generic
      case SupernovaSDK.TokenType.gradient: return TokenType.Gradient
      case SupernovaSDK.TokenType.measure: return TokenType.Measure
      case SupernovaSDK.TokenType.radius: return TokenType.Radius
      case SupernovaSDK.TokenType.shadow: return TokenType.Shadow
      case SupernovaSDK.TokenType.text: return TokenType.Text
      case SupernovaSDK.TokenType.typography: return TokenType.Typography
    }
  }

  convertSourceType(sourceType: SupernovaSDK.SourceType): SourceType {

    switch (sourceType) {
      case SupernovaSDK.SourceType.supernova: return SourceType.Supernova
      case SupernovaSDK.SourceType.figma: return SourceType.Figma
    }
  }

  convertTokenPropertyType(propertyType: SupernovaSDK.CustomTokenPropertyType): TokenPropertyType {

    switch (propertyType) {
      case SupernovaSDK.CustomTokenPropertyType.boolean: return TokenPropertyType.Boolean
      case SupernovaSDK.CustomTokenPropertyType.generic: return TokenPropertyType.Generic
      case SupernovaSDK.CustomTokenPropertyType.number: return TokenPropertyType.Number
      case SupernovaSDK.CustomTokenPropertyType.string: return TokenPropertyType.String
    }
  }

  convertShadowType(propertyType: SupernovaSDK.ShadowType): ShadowType {

    switch (propertyType) {
      case SupernovaSDK.ShadowType.drop: return ShadowType.Drop
      case SupernovaSDK.ShadowType.inner: return ShadowType.Inner
    }
  }

  convertTextCase(textCase: SupernovaSDK.TextCase): TextCase {

    switch (textCase) {
      case SupernovaSDK.TextCase.camel: return TextCase.Camel
      case SupernovaSDK.TextCase.lower: return TextCase.Lower
      case SupernovaSDK.TextCase.original: return TextCase.Original
      case SupernovaSDK.TextCase.upper: return TextCase.Upper
    }
  }

  convertTextDecoration(textDecoration: SupernovaSDK.TextDecoration): TextDecoration {

    switch (textDecoration) {
      case SupernovaSDK.TextDecoration.original: return TextDecoration.Original
      case SupernovaSDK.TextDecoration.strikethrough: return TextDecoration.Strikethrough
      case SupernovaSDK.TextDecoration.underline: return TextDecoration.Underline
    }
  }

  convertTokenProperty(property: SupernovaSDK.TokenProperty): TokenProperty {

    return {
        name: property.name,
        codeName: property.codeName,
        type: this.convertTokenPropertyType(property.type),
        booleanValue: property.type === SupernovaSDK.CustomTokenPropertyType.boolean ? (property.value as boolean) ?? null : null,
        stringValue: property.type === SupernovaSDK.CustomTokenPropertyType.string || property.type === SupernovaSDK.CustomTokenPropertyType.generic ? (property.value as string) ?? null : null,
        numericValue: property.type === SupernovaSDK.CustomTokenPropertyType.number ? (property.value as number) ?? null : null,
    }
  }
}
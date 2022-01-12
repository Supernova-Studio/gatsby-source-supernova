//
//  SDKGraphQLTokenConvertor.ts
//  Supernova Gatsby Source
//
//  Created by Jiri Trecak <jiri@supernova.io> 
//  Supernova.io 
//

// --- --- --- --- --- --- --- --- --- --- --- --- --- --- --- --- --- --- --- --- --- --- --- --- --- --- ---
// MARK: - Imports

import { CustomTokenPropertyType } from "@supernova-studio/supernova-sdk/build/main/sdk/src/model/enums/SDKCustomTokenPropertyType"
import { ShadowType } from "@supernova-studio/supernova-sdk/build/main/sdk/src/model/enums/SDKShadowType"
import { SourceType } from "@supernova-studio/supernova-sdk/build/main/sdk/src/model/enums/SDKSourceType"
import { TextCase } from "@supernova-studio/supernova-sdk/build/main/sdk/src/model/enums/SDKTextCase"
import { TextDecoration } from "@supernova-studio/supernova-sdk/build/main/sdk/src/model/enums/SDKTextDecoration"
import { TokenType } from "@supernova-studio/supernova-sdk/build/main/sdk/src/model/enums/SDKTokenType"
import { TokenGroup } from "@supernova-studio/supernova-sdk/build/main/sdk/src/model/groups/SDKTokenGroup"
import { BlurToken } from "@supernova-studio/supernova-sdk/build/main/sdk/src/model/tokens/SDKBlurToken"
import { BorderToken } from "@supernova-studio/supernova-sdk/build/main/sdk/src/model/tokens/SDKBorderToken"
import { ColorToken } from "@supernova-studio/supernova-sdk/build/main/sdk/src/model/tokens/SDKColorToken"
import { FontToken } from "@supernova-studio/supernova-sdk/build/main/sdk/src/model/tokens/SDKFontToken"
import { GenericToken } from "@supernova-studio/supernova-sdk/build/main/sdk/src/model/tokens/SDKGenericToken"
import { GradientToken } from "@supernova-studio/supernova-sdk/build/main/sdk/src/model/tokens/SDKGradientToken"
import { MeasureToken } from "@supernova-studio/supernova-sdk/build/main/sdk/src/model/tokens/SDKMeasureToken"
import { RadiusToken } from "@supernova-studio/supernova-sdk/build/main/sdk/src/model/tokens/SDKRadiusToken"
import { ShadowToken } from "@supernova-studio/supernova-sdk/build/main/sdk/src/model/tokens/SDKShadowToken"
import { TextToken } from "@supernova-studio/supernova-sdk/build/main/sdk/src/model/tokens/SDKTextToken"
import { Token } from "@supernova-studio/supernova-sdk/build/main/sdk/src/model/tokens/SDKToken"
import { TokenProperty } from "@supernova-studio/supernova-sdk/build/main/sdk/src/model/tokens/SDKTokenProperty"
import { GradientStopValue } from "@supernova-studio/supernova-sdk/build/main/sdk/src/model/tokens/SDKTokenValue"
import { TypographyToken } from "@supernova-studio/supernova-sdk/build/main/sdk/src/model/tokens/SDKTypographyToken"
import { SupernovaTypes } from "../gql_types/SupernovaTypes"
import { SDKGraphQLObjectConvertor } from "./SDKGraphQLObjectConvertor"

  
const PARENT_SOURCE: string = "__SOURCE__"


// --- --- --- --- --- --- --- --- --- --- --- --- --- --- --- --- --- --- --- --- --- --- --- --- --- --- ---
// MARK: - Convertor

export class SDKGraphQLTokenConvertor {

  // --- Token conversion

  tokens(sdkTokens: Array<Token>): Array<SupernovaTypes.Token> {

    let graphQLNodes: Array<SupernovaTypes.Token> = []
    for (let token of sdkTokens) {
      graphQLNodes.push(this.convertTokenToGraphQL(token))
    }

    return graphQLNodes
  }

  convertTokenToGraphQL(token: Token): SupernovaTypes.Token {

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

  convertTokenDetailsToGraphQL(token: Token, baseObject: SupernovaTypes.Token): SupernovaTypes.Token {

    switch (token.tokenType) {
        case TokenType.color: return this.convertTokenColorDetailsToGraphQL(token as ColorToken, baseObject)
        case TokenType.blur: return this.convertTokenBlurDetailsToGraphQL(token as BlurToken, baseObject)
        case TokenType.border: return this.convertTokenBorderDetailsToGraphQL(token as BorderToken, baseObject)
        case TokenType.font: return this.convertTokenFontDetailsToGraphQL(token as FontToken, baseObject)
        case TokenType.generic: return this.convertTokenGenericDetailsToGraphQL(token as GenericToken, baseObject)
        case TokenType.gradient: return this.convertTokenGradientDetailsToGraphQL(token as GradientToken, baseObject)
        case TokenType.measure: return this.convertTokenMeasureDetailsToGraphQL(token as MeasureToken, baseObject)
        case TokenType.radius: return this.convertTokenRadiusDetailsToGraphQL(token as RadiusToken, baseObject)
        case TokenType.shadow: return this.convertTokenShadowDetailsToGraphQL(token as ShadowToken, baseObject)
        case TokenType.text: return this.convertTokenTextDetailsToGraphQL(token as TextToken, baseObject)
        case TokenType.typography: return this.convertTokenTypographyDetailsToGraphQL(token as TypographyToken, baseObject)
        default: throw new Error("Unsupported token type encountered")
    }
  }

  convertTokenGradientDetailsToGraphQL(token: GradientToken, baseObject: SupernovaTypes.Token): SupernovaTypes.GradientToken {
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
            type: token.value.type,
            aspectRatio: token.value.aspectRatio,
            stops: token.value.stops.map(s => this.convertTokenGradientStopToGraphQL(s)),
            referencedTokenId: token.value.referencedToken ? token.value.referencedToken.id : null
        }
    } 
  }

  convertTokenGradientStopToGraphQL(gradientStop: GradientStopValue): SupernovaTypes.GradientStopValue {
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


  convertTokenTypographyDetailsToGraphQL(token: TypographyToken, baseObject: SupernovaTypes.Token): SupernovaTypes.TypographyToken {
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
                unit: token.value.fontSize.unit,
                referencedTokenId: token.value.fontSize.referencedToken ? token.value.fontSize.referencedToken.id : null
            },
            textDecoration: this.convertTextDecoration(token.value.textDecoration),
            textCase: this.convertTextCase(token.value.textCase),
            letterSpacing: {
                measure: token.value.letterSpacing.measure,
                unit: token.value.letterSpacing.unit,
                referencedTokenId: token.value.letterSpacing.referencedToken ? token.value.letterSpacing.referencedToken.id : null
            },
            lineHeight: token.value.lineHeight ? {
                measure: token.value.lineHeight.measure,
                unit: token.value.lineHeight.unit,
                referencedTokenId: token.value.lineHeight.referencedToken ? token.value.lineHeight.referencedToken.id : null
            } : null,
            paragraphIndent: {
                measure: token.value.paragraphIndent.measure,
                unit: token.value.paragraphIndent.unit,
                referencedTokenId: token.value.paragraphIndent.referencedToken ? token.value.paragraphIndent.referencedToken.id : null
            },
            referencedTokenId: token.value.referencedToken ? token.value.referencedToken.id : null
        }
    } 
  }

  convertTokenFontDetailsToGraphQL(token: FontToken, baseObject: SupernovaTypes.Token): SupernovaTypes.FontToken {
    return {
        ...baseObject,
        value: {
            family: token.value.family,
            subfamily: token.value.subfamily,
            referencedTokenId: token.value.referencedToken ? token.value.referencedToken.id : null
        }
    }  
  }

  convertTokenRadiusDetailsToGraphQL(token: RadiusToken, baseObject: SupernovaTypes.Token): SupernovaTypes.RadiusToken {
    return {
        ...baseObject,
        value: {
            radius: {
                measure: token.value.radius.measure,
                unit: token.value.radius.unit,
                referencedTokenId: token.value.radius.referencedToken ? token.value.radius.referencedToken.id : null
            },
                topLeft: token.value.topLeft ? {
                measure: token.value.topLeft.measure,
                unit: token.value.topLeft.unit,
                referencedTokenId: token.value.topLeft.referencedToken ? token.value.topLeft.referencedToken.id : null
            } : null,
                topRight: token.value.topRight ? {
                measure: token.value.topRight.measure,
                unit: token.value.topRight.unit,
                referencedTokenId: token.value.topRight.referencedToken ? token.value.topRight.referencedToken.id : null
            } : null,
                bottomLeft: token.value.bottomLeft ? {
                measure: token.value.bottomLeft.measure,
                unit: token.value.bottomLeft.unit,
                referencedTokenId: token.value.bottomLeft.referencedToken ? token.value.bottomLeft.referencedToken.id : null
            } : null,
                bottomRight: token.value.bottomRight ? {
                measure: token.value.bottomRight.measure,
                unit: token.value.bottomRight.unit,
                referencedTokenId: token.value.bottomRight.referencedToken ? token.value.bottomRight.referencedToken.id : null
            } : null,
            referencedTokenId: token.value.referencedToken ? token.value.referencedToken.id : null
        }
    }
  }

  convertTokenGenericDetailsToGraphQL(token: GenericToken, baseObject: SupernovaTypes.Token): SupernovaTypes.GenericToken {
    return {
        ...baseObject,
        value: {
            text: token.value.text,
            referencedTokenId: token.value.referencedToken ? token.value.referencedToken.id : null
        }
    }
  }
 
  convertTokenColorDetailsToGraphQL(token: ColorToken, baseObject: SupernovaTypes.Token): SupernovaTypes.ColorToken {
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

  convertTokenBorderDetailsToGraphQL(token: BorderToken, baseObject: SupernovaTypes.Token): SupernovaTypes.BorderToken {
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
                unit: token.value.width.unit,
                referencedTokenId: token.value.width.referencedToken ? token.value.width.referencedToken.id : null
            },
            position: token.value.position,
            referencedTokenId: token.value.referencedToken ? token.value.referencedToken.id : null
        }
    }
  }

  convertTokenShadowDetailsToGraphQL(token: ShadowToken, baseObject: SupernovaTypes.Token): SupernovaTypes.ShadowToken {
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
                unit: token.value.x.unit,
                referencedTokenId: token.value.x.referencedToken ? token.value.x.referencedToken.id : null
            },
            y: {
                measure: token.value.y.measure,
                unit: token.value.y.unit,
                referencedTokenId: token.value.y.referencedToken ? token.value.y.referencedToken.id : null
            },
            radius: {
                measure: token.value.radius.measure,
                unit: token.value.radius.unit,
                referencedTokenId: token.value.radius.referencedToken ? token.value.radius.referencedToken.id : null
            },
            spread: {
                measure: token.value.spread.measure,
                unit: token.value.spread.unit,
                referencedTokenId: token.value.spread.referencedToken ? token.value.spread.referencedToken.id : null
            },
            opacity: token.value.opacity,
            type: this.convertShadowType(token.value.type),
            referencedTokenId: token.value.referencedToken ? token.value.referencedToken.id : null
        }
    }
  }

  convertTokenMeasureDetailsToGraphQL(token: MeasureToken, baseObject: SupernovaTypes.Token): SupernovaTypes.MeasureToken {
    return {
        ...baseObject,
        value: {
            unit: token.value.unit,
            measure: token.value.measure,
            referencedTokenId: token.value.referencedToken ? token.value.referencedToken.id : null
        }
    }
  }

  convertTokenTextDetailsToGraphQL(token: TextToken, baseObject: SupernovaTypes.Token): SupernovaTypes.TextToken {
    return {
        ...baseObject,
        value: {
            text: token.value.text,
            referencedTokenId: token.value.referencedToken ? token.value.referencedToken.id : null
        }
    }
  }

  convertTokenBlurDetailsToGraphQL(token: BlurToken, baseObject: SupernovaTypes.Token): SupernovaTypes.BlurToken {
    return {
        ...baseObject,
        value: {
            radius: {
                measure: token.value.radius.measure,
                unit: token.value.radius.unit,
                referencedTokenId: token.value.radius.referencedToken ? token.value.radius.referencedToken.id : null
            },
            type: token.value.type,
            referencedTokenId: token.value.referencedToken ? token.value.referencedToken.id : null
        }
    }
  }

  // --- Token group conversion

  tokenGroups(sdkTokenGroups: Array<TokenGroup>): Array<SupernovaTypes.TokenGroup> {

    let graphQLNodes: Array<SupernovaTypes.TokenGroup> = []
    for (let group of sdkTokenGroups) {
      graphQLNodes.push(this.convertTokenGroupToGraphQL(group))
    }

    return graphQLNodes
  }

  convertTokenGroupToGraphQL(group: TokenGroup): SupernovaTypes.TokenGroup {

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

  convertTokenType(tokenType: TokenType): SupernovaTypes.TokenType {

    switch (tokenType) {
      case TokenType.color: return SupernovaTypes.TokenType.Color
      case TokenType.blur: return SupernovaTypes.TokenType.Blur
      case TokenType.border: return SupernovaTypes.TokenType.Border
      case TokenType.font: return SupernovaTypes.TokenType.Font
      case TokenType.generic: return SupernovaTypes.TokenType.Generic
      case TokenType.gradient: return SupernovaTypes.TokenType.Gradient
      case TokenType.measure: return SupernovaTypes.TokenType.Measure
      case TokenType.radius: return SupernovaTypes.TokenType.Radius
      case TokenType.shadow: return SupernovaTypes.TokenType.Shadow
      case TokenType.text: return SupernovaTypes.TokenType.Text
      case TokenType.typography: return SupernovaTypes.TokenType.Typography
    }
  }

  convertSourceType(sourceType: SourceType): SupernovaTypes.SourceType {

    switch (sourceType) {
      case SourceType.supernova: return SupernovaTypes.SourceType.Supernova
      case SourceType.figma: return SupernovaTypes.SourceType.Figma
    }
  }

  convertTokenPropertyType(propertyType: CustomTokenPropertyType): SupernovaTypes.TokenPropertyType {

    switch (propertyType) {
      case CustomTokenPropertyType.boolean: return SupernovaTypes.TokenPropertyType.Boolean
      case CustomTokenPropertyType.generic: return SupernovaTypes.TokenPropertyType.Generic
      case CustomTokenPropertyType.number: return SupernovaTypes.TokenPropertyType.Number
      case CustomTokenPropertyType.string: return SupernovaTypes.TokenPropertyType.String
    }
  }

  convertShadowType(propertyType: ShadowType): SupernovaTypes.ShadowType {

    switch (propertyType) {
      case ShadowType.drop: return SupernovaTypes.ShadowType.Drop
      case ShadowType.inner: return SupernovaTypes.ShadowType.Inner
    }
  }

  convertTextCase(textCase: TextCase): SupernovaTypes.TextCase {

    switch (textCase) {
      case TextCase.camel: return SupernovaTypes.TextCase.Camel
      case TextCase.lower: return SupernovaTypes.TextCase.Lower
      case TextCase.original: return SupernovaTypes.TextCase.Original
      case TextCase.upper: return SupernovaTypes.TextCase.Upper
    }
  }

  convertTextDecoration(textDecoration: TextDecoration): SupernovaTypes.TextDecoration {

    switch (textDecoration) {
      case TextDecoration.original: return SupernovaTypes.TextDecoration.Original
      case TextDecoration.strikethrough: return SupernovaTypes.TextDecoration.Strikethrough
      case TextDecoration.underline: return SupernovaTypes.TextDecoration.Underline
    }
  }

  convertTokenProperty(property: TokenProperty): SupernovaTypes.TokenProperty {

    return {
        name: property.name,
        codeName: property.codeName,
        type: this.convertTokenPropertyType(property.type),
        booleanValue: property.type === CustomTokenPropertyType.boolean ? (property.value as boolean) ?? null : null,
        stringValue: property.type === CustomTokenPropertyType.string || property.type === CustomTokenPropertyType.generic ? (property.value as string) ?? null : null,
        numericValue: property.type === CustomTokenPropertyType.number ? (property.value as number) ?? null : null,
    }
  }
}
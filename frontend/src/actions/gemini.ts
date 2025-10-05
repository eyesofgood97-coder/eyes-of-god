"use server"

import { GoogleGenAI } from "@google/genai"

const ai = new GoogleGenAI({
  apiKey: process.env.API_KEY,
})

const SPACE_TILE_ANALYSIS_PROMPT = `You are an expert astronomer and astrophysicist analyzing a tile fragment from a gigapixel space image. This tile represents a small section of the complete astronomical observation.

Please provide a comprehensive analysis of this space tile fragment in **markdown format** with the following structure:

# 🔬 Space Tile Fragment Analysis

## 📍 Overview
Provide a brief summary of what you observe in this specific tile section of the larger space image.

## 🌟 Celestial Objects & Features Detected

### Stars & Stellar Objects
- **Probability of presence**: [High/Medium/Low/None]
- **Estimated count**: [Number or range if visible]
- **Characteristics**: [Color, brightness, distribution patterns]
- **Notable features**: [Any particularly bright or unusual stars]

### Blue Celestial Bodies & Phenomena
- **Probability of presence**: [High/Medium/Low/None]
- **Possible identifications**: [Blue stars, blue shift phenomena, hot stellar objects]
- **Characteristics**: [Intensity, spectral signature, size estimation]
- **Scientific significance**: [What blue coloration indicates in astronomical context]

### Nebulae & Gas Clouds
- **Probability of presence**: [High/Medium/Low/None]
- **Type indicators**: [Emission, reflection, dark matter, ionized regions]
- **Observable features**: [Color gradients, density variations, filamentary structures]

### Galactic Structures
- **Probability of presence**: [High/Medium/Low/None]
- **Structural elements**: [Spiral arms, galactic core regions, star forming regions]
- **Depth field**: [Foreground/background objects]

### Cosmic Phenomena
- **Dust lanes**: [Present/Absent, characteristics]
- **Light diffraction patterns**: [Detected/Not detected]
- **Unusual features**: [Any anomalies or rare phenomena]
- **Background sources**: [Distant galaxies, quasars, etc.]

## 📊 Quantitative Analysis

### Brightness Distribution
- **Overall luminosity**: [Scale 1-10]
- **Dynamic range**: [Low/Medium/High contrast]
- **Dominant wavelengths**: [If identifiable from colors]

### Color Palette
- **Primary colors**: [List dominant colors observed]
- **Color diversity**: [Sparse/Moderate/Rich]
- **Spectral indicators**: [What colors suggest about object types]

### Spatial Density
- **Object concentration**: [Sparse/Moderate/Dense field]
- **Distribution pattern**: [Random, clustered, structured]

### Image Quality Assessment
- **Resolution quality**: [Excellent/Good/Fair/Poor]
- **Noise levels**: [Low/Medium/High]
- **Clarity**: [Sharp/Moderate/Blurred features]

## 🎯 Key Observations
List 3-5 most significant and scientifically interesting findings from this tile fragment:

1. [Most prominent feature]
2. [Second notable feature]
3. [Additional observations]

## 🔬 Scientific Context
Provide interpretation of what this tile fragment reveals within broader astronomical context:
- What type of region this appears to be from
- Potential cosmic environment (galaxy type, nebula region, stellar cluster, etc.)
- Astronomical significance of observed features
- Possible distance/scale indicators

## 🧩 Tile Context Notes
- **Field coverage**: This is a small fragment of a much larger astronomical image
- **Boundary effects**: Note if objects appear to be cut off at edges
- **Neighboring context**: Suggest what might be visible in adjacent tiles

## ⚠️ Analysis Limitations
- Constraints due to viewing only a fragment vs complete image
- Resolution or quality factors affecting identification
- Spectral range limitations (visible light vs other wavelengths)
- Need for additional data (spectroscopy, multi-wavelength observations)

## 💡 Recommendations for Further Study
- Suggested follow-up observations or analysis
- Adjacent tiles that might provide additional context
- Complementary data that would enhance understanding

---
*Analysis generated with AI-assisted astronomical pattern recognition from tile fragment*
*Complete understanding requires viewing in context of full gigapixel image*

**Important**: Be thorough and scientific. Use proper astronomical terminology. Provide probability assessments and confidence levels. Note that this is a fragment analysis and complete interpretation may require viewing the full image context.`

interface AnalyzeTileParams {
  tileUrl: string // Ahora es base64 data
  tileMetadata: {
    position: { col: number; row: number; x: number; y: number }
    content: { avg_brightness: number; is_empty: boolean }
    dimensions: { width: number; height: number }
    originalCoords?: { x: number; y: number; width: number; height: number }
  }
  celestialObject?: {
    name: string
    type: string
  }
}

export async function analyzeTileWithAI(params: AnalyzeTileParams): Promise<string> {
  try {
    const { tileUrl, tileMetadata, celestialObject } = params

    // tileUrl ahora es base64 data directamente desde el cliente
    const base64Image = tileUrl

    // Get image mime type from response
    const contentType = 'image/jpeg'

    // Build context-aware prompt
    let contextualPrompt = SPACE_TILE_ANALYSIS_PROMPT

    if (celestialObject) {
      contextualPrompt += `\n\n**CONTEXTUAL INFORMATION:**
This tile is part of a gigapixel observation of **${celestialObject.name}** (${celestialObject.type}).
Keep this context in mind when analyzing the tile, as features should be interpreted within this larger astronomical object.`
    }

    contextualPrompt += `\n\n**TILE TECHNICAL DETAILS:**
- Position in grid: Column ${tileMetadata.position.col}, Row ${tileMetadata.position.row}
- Average brightness: ${tileMetadata.content.avg_brightness.toFixed(2)}/255
- Tile dimensions: ${tileMetadata.dimensions.width}x${tileMetadata.dimensions.height}px`

    if (tileMetadata.originalCoords) {
      contextualPrompt += `
- Original image coordinates: (${tileMetadata.originalCoords.x}, ${tileMetadata.originalCoords.y})`
    }

    // Generate analysis using Gemini
    const aiResponse = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: [
        { text: contextualPrompt },
        {
          inlineData: {
            mimeType: contentType,
            data: base64Image,
          }
        }
      ],
    })

    const analysisResult = aiResponse.text

    if (!analysisResult) {
      throw new Error('AI failed to generate analysis')
    }

    return analysisResult

  } catch (error) {
    console.error('Error analyzing tile with AI:', error)
    
    return `# ❌ Tile Analysis Error

An error occurred while analyzing this space tile fragment:

**Error Details**: ${error instanceof Error ? error.message : 'Unknown error'}

**Troubleshooting**:
- Verify the tile image is accessible
- Check your API configuration and quota
- Ensure network connectivity

Please try selecting another tile or refresh the page.`
  }
}
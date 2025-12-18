# Methodology

## Overview

This document provides a detailed explanation of the methods used to predict Urban Heat Islands across 10 global cities.

## Data Acquisition

### Satellite Imagery
- **Source**: Landsat 8 Collection 2, Level 2
- **Time Period**: 2017-2022 (5-year analysis)
- **Spatial Resolution**: 30 meters
- **Temporal Resolution**: 16-day revisit cycle

### Bands Used

| Band | Wavelength | Use |
|------|------------|-----|
| Band 2 (Blue) | 0.45-0.51 μm | Surface Reflectance |
| Band 3 (Green) | 0.53-0.59 μm | Surface Reflectance |
| Band 4 (Red) | 0.64-0.67 μm | Vegetation analysis (NDVI) |
| Band 5 (NIR) | 0.85-0.88 μm | Vegetation analysis (NDVI) |
| Band 6 (SWIR 1) | 1.57-1.65 μm | Built-up area detection |
| Band 7 (SWIR 2) | 2.11-2.29 μm | Built-up area detection |
| Band 10 (TIR) | 10.60-11.19 μm | Land Surface Temperature |

## Preprocessing Pipeline

### 1. Cloud Masking

Clouds and cloud shadows can interfere with accurate surface measurements. We use the QA_PIXEL band to identify and mask these features.

```javascript
function maskL8sr(col) {
    var cloudShadowBitMask = (1 << 3);  // Bit 3: Cloud shadow
    var cloudsBitMask = (1 << 5);        // Bit 5: Cloud
    var qa = col.select('QA_PIXEL');
    
    var mask = qa.bitwiseAnd(cloudShadowBitMask).eq(0)
                 .and(qa.bitwiseAnd(cloudsBitMask).eq(0));
    
    return col.updateMask(mask);
}
```

### 2. Scaling Factors

Landsat 8 data is stored as Digital Numbers (DN) and must be converted to physical units:

**Optical Bands (Surface Reflectance):**
```
SR = DN × 0.0000275 - 0.2
```

**Thermal Band (Brightness Temperature):**
```
BT = DN × 0.00341802 + 149.0 (Kelvin)
```

## Index Calculations

### NDVI (Normalized Difference Vegetation Index)

Measures vegetation health and density:

```
NDVI = (NIR - Red) / (NIR + Red)
```

**Interpretation:**
- `-1 to 0`: Water bodies, bare soil
- `0 to 0.2`: Sparse vegetation
- `0.2 to 0.5`: Moderate vegetation
- `0.5 to 1.0`: Dense, healthy vegetation

### Fractional Vegetation (FV)

Estimates the proportion of vegetation cover:

```
FV = ((NDVI - NDVI_min) / (NDVI_max - NDVI_min))²
```

### Emissivity (ε)

Surface emissivity affects thermal emission:

```
ε = 0.004 × FV + 0.986
```

### Land Surface Temperature (LST)

Derived from thermal band using the radiative transfer equation:

```
LST = Tb / (1 + (λ × Tb / ρ) × ln(ε)) - 273.15
```

Where:
- `Tb` = Brightness temperature (K)
- `λ` = 11.5 μm (wavelength of Band 10)
- `ρ` = 14380 μm·K (Planck's constant term)
- `ε` = Surface emissivity

**Output**: Temperature in degrees Celsius

## Urban Heat Island Metrics

### 1. Urban Heat Island Index (UHI)

Normalized temperature deviation:

```
UHI = (Ts - Tm) / σ
```

Where:
- `Ts` = Surface temperature at pixel
- `Tm` = Mean temperature of AOI
- `σ` = Standard deviation of temperature

**Interpretation:**
- `< 0`: Cooler than average
- `0`: Average temperature
- `> 0`: Hotter than average (heat island)

### 2. Urban Thermal Field Variance Index (UTFVI)

Ecological impact assessment:

```
UTFVI = (Ts - Tm) / Ts
```

**Classification:**

| UTFVI Range | UHI Phenomenon | Ecological Status |
|-------------|----------------|-------------------|
| < 0 | None | Excellent |
| 0 - 0.005 | Weak | Good |
| 0.005 - 0.010 | Middle | Normal |
| 0.010 - 0.015 | Strong | Bad |
| 0.015 - 0.020 | Stronger | Worse |
| > 0.020 | Strongest | Worst |

## Predictive Models

### Method 1: Random Forest Regression

**Approach**: Machine learning model that uses 2017 data to predict 2022 LST.

**Training Features:**
- NDVI (vegetation index)
- Emissivity
- 2017 LST values

**Process:**
1. Split 2017 data into 70% training, 30% testing
2. Train Random Forest with 100 decision trees
3. Predict 2022 LST across entire AOI
4. Calculate UHI and UTFVI from predicted LST

**Advantages:**
- Handles non-linear relationships
- Resistant to overfitting
- Works well across all city types

**Limitations:**
- Requires substantial training data
- Limited to features provided

### Method 2: Markov Chain Modeling

**Approach**: Probabilistic simulation of urban expansion based on transition matrices.

**Key Concept**: Urban growth follows probability patterns where future state depends only on current state (Markov Property).

**Transition Matrix:**
```
P = | P(urban→urban)     P(urban→non-urban)    |
    | P(non-urban→urban) P(non-urban→non-urban)|
```

**Process:**
1. Classify 2017 NDVI into urban (< 0.3) and non-urban (≥ 0.3)
2. Calculate transition probabilities from historical data
3. Apply transition matrix iteratively (5 times for 5 years)
4. Increase LST by 2°C for newly urbanized areas
5. Calculate resulting UHI and UTFVI

**Advantages:**
- Good for cities with predictable growth patterns
- Computationally efficient
- Probabilistic uncertainty quantification

**Limitations:**
- Assumes stationary transition probabilities
- Doesn't capture neighborhood effects
- Less accurate for chaotic growth

### Method 3: Cellular Automation

**Approach**: Grid-based simulation where cells evolve based on neighbor states.

**Key Concept**: Urban expansion spreads spatially—urbanization of one cell influences nearby cells.

**Neighborhood Kernel:**
```
[ 1  1  1 ]
[ 1  1  1 ]  → 3x3 Moore neighborhood
[ 1  1  1 ]
```

**Rules:**
1. Urban cells remain urban
2. Non-urban cells become urban if ≥ 5 neighbors are urban
3. Process repeats for 5 iterations (years)

**Process:**
1. Define urban areas (NDVI < 0.3) in 2017
2. Apply convolution with neighborhood kernel
3. Update cells based on neighbor count
4. Increase LST by 2°C for new urban cells
5. Calculate UHI and UTFVI

**Advantages:**
- Captures spatial clustering
- Good for rapidly expanding cities
- Models organic, neighborhood-based growth

**Limitations:**
- Highly sensitive to initial conditions
- Can produce unrealistic patterns
- Variable accuracy across cities

## Validation & Accuracy Assessment

### Metrics Used

1. **Mean Absolute Error (MAE)**
   ```
   MAE = (1/n) × Σ|predicted - actual|
   ```

2. **Root Mean Square Error (RMSE)**
   ```
   RMSE = √[(1/n) × Σ(predicted - actual)²]
   ```

3. **Percentage of Critical UTFVI Areas**
   - Calculated for both actual and predicted
   - Areas where UTFVI > 0.05 (dangerous thermal stress)

### Comparison Process

For each city:
1. Generate "ground truth" 2022 LST from actual Landsat data
2. Run all three predictive models
3. Compare predicted vs. actual:
   - Mean LST
   - UHI distribution
   - UTFVI critical area percentage
4. Visual comparison of heat maps

## City-Specific Considerations

### Climate Zones
- **Tropical** (Singapore, Mumbai, Lagos): High base temperatures, humidity effects
- **Arid** (Dubai): Extreme heat, minimal vegetation
- **Temperate** (NYC, London, Tokyo): Seasonal variations
- **Continental** (Toronto): Large temperature swings

### Urban Characteristics
- **Mature cities** (NYC, London, Tokyo): Slower growth, better for Markov Chain
- **Rapid growth** (Lagos, Dubai, Mumbai): Better for Cellular Automation
- **Planned cities** (Singapore): Green infrastructure considerations
- **Informal settlements** (Mumbai, Lagos): Chaotic growth patterns

## Software & Tools

- **Google Earth Engine**: Cloud-based geospatial processing
- **JavaScript**: GEE Code Editor scripting
- **Landsat 8**: Primary satellite imagery source
- **USGS Earth Explorer**: Supplementary data download

## References

1. Sobrino, J. A., et al. (2004). "Land surface temperature retrieval from LANDSAT TM 5." *Remote Sensing of Environment*.

2. Zhang, Y., et al. (2006). "Estimation of the relationship between vegetation patches and urban land surface temperature with remote sensing." *International Journal of Remote Sensing*.

3. Guha, S., et al. (2018). "Analytical study of land surface temperature with NDVI and NDBI using Landsat 8 OLI and TIRS data in Florence and Naples city, Italy." *European Journal of Remote Sensing*.

4. EPA (2008). "Reducing Urban Heat Islands: Compendium of Strategies." *United States Environmental Protection Agency*.

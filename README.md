# Urban Heat Islands Prediction Using Machine Learning and Geospatial Modeling

**Author:** Sadhil Mehta  
**Grade:** 12th Grade, Tippecanoe High School, Tipp City, OH

[![Google Earth Engine](https://img.shields.io/badge/Google%20Earth%20Engine-Enabled-green.svg)](https://earthengine.google.com/)

## Overview

This research project investigates Urban Heat Islands (UHIs) across 10 major global cities using advanced geospatial analysis and predictive modeling. Urban Heat Islands are localized regions within metropolitan areas that experience significantly higher temperatures than surrounding rural areas, posing serious threats to public health, infrastructure, and urban sustainability.

### Key Features

- **Multi-Method Prediction Framework**: Implements three distinct approaches for UHI prediction
  - Random Forest Regression (Machine Learning)
  - Markov Chain Modeling (Stochastic Simulation)
  - Cellular Automation (Neighborhood-Based Simulation)
- **Global Scale Analysis**: Comparative study across 10 diverse cities
- **Google Earth Engine Integration**: Leverages Landsat 8 satellite imagery for remote sensing analysis
- **Comprehensive Metrics**: Calculates Land Surface Temperature (LST), UHI Index, and Urban Thermal Field Variance Index (UTFVI)

## Study Cities

The research analyzes cities with diverse characteristics to test model performance across different urban environments:

| City | Country | Climate Zone | Key Characteristics |
|------|---------|--------------|---------------------|
| New York City | USA | Temperate | High density, mature urban development |
| Singapore | Singapore | Tropical | Sustainable planning, extensive greenery |
| Dubai | UAE | Arid | Rapid desert urbanization, extreme heat |
| São Paulo | Brazil | Subtropical | Urban sprawl, mixed development |
| Mumbai | India | Tropical | High humidity, informal settlements |
| London | UK | Temperate | Historical development, green spaces |
| Lagos | Nigeria | Tropical | Fast-growing, informal housing |
| Tokyo | Japan | Temperate | High-tech, seasonal variations |
| Toronto | Canada | Continental | Cold climate, seasonal UHI |
| Istanbul | Turkey | Mediterranean | Complex topography, transcontinental |

## Methodology

### Data Source
- **Satellite Data**: Landsat 8 Collection 2, Level 2 (2017-2022)
- **Platform**: Google Earth Engine
- **Resolution**: 30m spatial resolution
- **Bands Used**: 
  - Optical: Bands 2-7 (Surface Reflectance)
  - Thermal: Band 10 (Land Surface Temperature)

### Analysis Pipeline

```
Landsat 8 Data → Cloud Masking → Scaling Factors → 
↓
Calculate NDVI → Fractional Vegetation → Emissivity → 
↓
Land Surface Temperature (LST) → 
↓
Three Prediction Methods:
├── Random Forest Regression (2017 → 2022)
├── Markov Chain Modeling (Urban Expansion)
└── Cellular Automation (Neighborhood Growth)
↓
Calculate UHI Index & UTFVI → Compare Results
```

### Key Indices Calculated

1. **NDVI (Normalized Difference Vegetation Index)**
   ```
   NDVI = (NIR - Red) / (NIR + Red)
   ```

2. **NDBI (Normalized Difference Built-up Index)**
   ```
   NDBI = (SWIR - NIR) / (SWIR + NIR)
   ```

3. **Land Surface Temperature (LST)**
   ```
   LST = Tb / (1 + (λ × Tb / ρ) × ln(ε)) - 273.15
   ```

4. **Urban Heat Island Index (UHI)**
   ```
   UHI = (Ts - Tm) / TStd
   ```

5. **Urban Thermal Field Variance Index (UTFVI)**
   ```
   UTFVI = (Ts - Tm) / Ts
   ```

## Repository Structure

```
urban-heat-islands-prediction/
├── src/
│   ├── cities/              # Individual city analysis scripts
│   │   ├── nyc.js
│   │   ├── dubai.js
│   │   ├── istanbul.js
│   │   ├── lagos.js
│   │   ├── london.js
│   │   ├── mumbai.js
│   │   ├── sao_paulo.js
│   │   ├── singapore.js
│   │   ├── tokyo.js
│   │   └── toronto.js
│   ├── utils/
│   │   ├── preprocessing.js     # Cloud masking, scaling functions
│   │   ├── indices.js           # NDVI, NDBI, LST calculations
│   │   └── visualization.js     # Map visualization utilities
│   └── models/
│       ├── random_forest.js     # Random Forest implementation
│       ├── markov_chain.js      # Markov Chain modeling
│       └── cellular_automata.js # Cellular Automation simulation
├── data/
│   └── coordinates/         # City boundary coordinates
├── results/
│   ├── visualizations/      # Generated heat maps
│   ├── statistics/          # LST, UHI, UTFVI metrics
│   └── comparison/          # Model performance comparisons
├── docs/
│   ├── paper.pdf            # Full research paper
│   ├── methodology.md       # Detailed methodology
│   └── results_analysis.md  # Results interpretation
├── .gitignore
├── LICENSE
└── README.md
```

## Key Findings

### Model Performance Summary

| Model | Best For | Average Accuracy | Strengths |
|-------|----------|------------------|-----------|
| **Random Forest Regression** | All cities | >90% | Consistent, handles non-linear relationships |
| **Markov Chain** | Stable/mature cities | Variable (±1-3°C) | Good for probability-based growth |
| **Cellular Automation** | Rapidly growing cities | Variable (±0.25-15°C) | Captures neighborhood dynamics |

### City-Specific Results

#### Best Performers by Model

**Random Forest Regression:**
- ✅ Excellent performance across all 10 cities
- Lowest error in: NYC, London, Singapore

**Markov Chain:**
- ✅ London (< 1°C error)
- ✅ Singapore, Tokyo, Toronto
- ⚠️ Struggles with: Dubai, NYC (rapid/chaotic growth)

**Cellular Automation:**
- ✅ NYC (±0.25°C), Istanbul, Lagos, Dubai
- ⚠️ Poor performance: Singapore (16°C error)

### Critical UTFVI Areas

Percentage of urban areas with dangerous thermal stress (UTFVI > 0.05):

- 🔴 **Dubai**: 47.8% (highest)
- 🔴 **Mumbai**: 40.9%
- 🟡 **Lagos**: 37.5%
- 🟡 **NYC**: 38.3%
- 🟢 **Singapore**: 44.2% (but well-managed)

## 🚀 Getting Started

### Prerequisites

- Google Earth Engine account
- JavaScript knowledge for GEE Code Editor
- Basic understanding of remote sensing concepts

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/yourusername/urban-heat-islands-prediction.git
   cd urban-heat-islands-prediction
   ```

2. **Access Google Earth Engine**
   - Sign up at [Google Earth Engine](https://earthengine.google.com/)
   - Open the [Code Editor](https://code.earthengine.google.com/)

3. **Run analysis for a specific city**
   - Copy code from `src/cities/nyc.js` (or any city)
   - Paste into GEE Code Editor
   - Adjust Area of Interest (AOI) coordinates if needed
   - Click "Run"

### Basic Usage Example

```javascript
// Define your Area of Interest
var aoi = ee.Geometry.Polygon([
    [[-74.6000, 41.0000],  // Top-left
     [-74.6000, 40.4000],  // Bottom-left
     [-73.7000, 40.4000],  // Bottom-right
     [-73.7000, 41.0000]]  // Top-right
]);

// Set date range
var startDate = '2022-05-01';
var endDate = '2022-12-31';

// Load and process Landsat 8 imagery
var image = ee.ImageCollection('LANDSAT/LC08/C02/T1_L2')
    .filterDate(startDate, endDate)
    .filterBounds(aoi)
    .map(applyScaleFactors)
    .map(maskL8sr)
    .median();

// Calculate LST, UHI, UTFVI
// ... (see full code in src/cities/)
```

## 📈 Results & Visualizations

### Sample Outputs

Each city analysis generates:
- **LST Maps**: Land Surface Temperature distribution
- **UHI Maps**: Urban Heat Island intensity
- **UTFVI Maps**: Thermal field variance classification
- **Comparative Maps**: Base vs. Predicted (CA/MC/RFR)

### Interpretation Guide

**UTFVI Classification:**
- `< 0`: Excellent (No UHI)
- `0-0.005`: Good (Weak UHI)
- `0.005-0.010`: Normal (Middle UHI)
- `0.010-0.015`: Bad (Strong UHI)
- `0.015-0.020`: Worse (Stronger UHI)
- `> 0.020`: Worst (Strongest UHI)

## Future Work

- [ ] Expand to 20+ global cities
- [ ] Incorporate additional environmental variables (wind, humidity, pollution)
- [ ] Develop real-time UHI monitoring dashboard
- [ ] Test deep learning models (CNN, LSTM)
- [ ] Integrate socioeconomic vulnerability data
- [ ] Create mitigation strategy recommendations



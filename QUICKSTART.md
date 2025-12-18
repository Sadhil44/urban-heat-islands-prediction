# Quick Start Guide

Get started with the Urban Heat Island analysis!

## Step 1: Access Google Earth Engine

1. Go to [code.earthengine.google.com](https://code.earthengine.google.com/)
2. Sign in with your Google account
3. You're ready to code!

## Step 2: Run Your First Analysis

### Option A: Copy-Paste Method (Easiest)

1. Open [src/cities/nyc.js](../src/cities/nyc.js) in this repository
2. **Copy all the code** (Ctrl+A, Ctrl+C)
3. **Paste into GEE Code Editor** (Ctrl+V)
4. **Click "Run"** (or press Ctrl+Enter)
5. **Watch the map populate** with temperature data!

### Option B: Try Different Cities

Pick any city from the `src/cities/` folder:
- `dubai.js` - See extreme desert heat
- `singapore.js` - Tropical heat management
- `london.js` - Temperate climate UHI
- `tokyo.js` - High-tech urban analysis

## Step 3: Understand the Results (2 minutes)

### Map Layers You'll See

**1. True Color (432)** - Satellite image of the city
- Toggle on to see what the area looks like
- RGB composite from Landsat bands

**2. LST AOI** - Land Surface Temperature
- 🔵 **Blue**: Cool areas (parks, water)
- 🟡 **Yellow**: Moderate temperatures
- 🔴 **Red**: Hot urban areas

**3. UHI AOI** - Urban Heat Island Index
- Shows how much hotter areas are than average
- Normalized scale (-4 to 4)

**4. UTFVI AOI** - Ecological Thermal Stress
- 🟢 **Green**: Safe (<0.005)
- 🟡 **Yellow**: Normal (0.005-0.010)
- 🔴 **Red**: Dangerous (>0.020)

### Console Output

You'll see statistics like:
```
Mean LST in AOI: 26.8°C
Percentage of Critical UTFVI Areas: 38.3%
```

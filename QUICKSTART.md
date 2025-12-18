# Quick Start Guide

Get started with Urban Heat Island analysis in 5 minutes! 🚀

## Step 1: Access Google Earth Engine (30 seconds)

1. Go to [code.earthengine.google.com](https://code.earthengine.google.com/)
2. Sign in with your Google account
3. You're ready to code!

## Step 2: Run Your First Analysis (2 minutes)

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

## What's Next?

### Beginner Path 🌱
1. ✅ Run 3-5 different cities
2. ✅ Compare their temperature patterns
3. ✅ Notice differences in green space impact
4. ✅ Read the [Usage Guide](USAGE.md)

### Intermediate Path 🌿
1. ✅ Analyze your own city (see [Usage Guide](USAGE.md))
2. ✅ Export results to Google Drive
3. ✅ Compare all three prediction models
4. ✅ Read the [Methodology](methodology.md)

### Advanced Path 🌳
1. ✅ Modify model parameters
2. ✅ Add new cities to the repository
3. ✅ Implement improvements (see [Contributing](../CONTRIBUTING.md))
4. ✅ Validate with ground truth data

## Common Questions

### Q: The map looks empty?
**A:** Make sure you clicked "Run" and wait 10-30 seconds for processing.

### Q: I see errors in the console?
**A:** Check that:
- Your Google Earth Engine account is active
- The code was copied completely
- Internet connection is stable

### Q: How do I change the city?
**A:** See the detailed guide in [docs/USAGE.md](USAGE.md) under "Analyzing a New City"

### Q: What do the colors mean?
**A:** 
- **Temperature scale**: Blue (cold) → Red (hot)
- **UHI scale**: Negative (cooler than average) → Positive (hotter)
- **UTFVI**: See the classification table in results

### Q: Can I download the results?
**A:** Yes! Go to the **Tasks** tab and run any exports. Files will save to your Google Drive.

## 5-Minute Challenge 🏁

Can you:
1. ✅ Run analysis for NYC
2. ✅ Find the hottest neighborhood
3. ✅ Calculate the temperature difference between Central Park and downtown
4. ✅ Run analysis for your home city

## Real-World Applications

This analysis helps:
- 🏙️ **Urban planners** identify heat-vulnerable areas
- 🌳 **Environmental scientists** measure green space impact
- 🏥 **Public health officials** plan cooling centers
- 📊 **Researchers** study climate change effects
- 🏘️ **City officials** prioritize mitigation investments

## Example Insights You'll Discover

### New York City
- Central Park is **5-8°C cooler** than surrounding buildings
- Manhattan's financial district has **highest UHI intensity**
- Brooklyn waterfront shows **coastal cooling effects**

### Dubai
- Urban areas reach **50+°C** in summer
- **47.8% of city** experiences dangerous thermal stress
- Desert surroundings provide minimal temperature relief

### Singapore
- Despite tropical heat, green planning keeps UHI **lower than expected**
- Vertical gardens and parks create **cool corridors**
- Shows how policy can mitigate heat islands

## Learning Resources

### Recommended Reading Order
1. 📖 This Quick Start (you're here!)
2. 📖 [USAGE.md](USAGE.md) - Detailed instructions
3. 📖 [methodology.md](methodology.md) - How it works
4. 📖 [results_analysis.md](results_analysis.md) - Interpretation
5. 📄 [research_paper.pdf](research_paper.pdf) - Full academic paper

### Video Tutorials
- [Google Earth Engine Tutorial](https://developers.google.com/earth-engine/tutorials/tutorial_js_01)
- [Landsat Data Basics](https://www.usgs.gov/landsat-missions/landsat-8)

### Key Concepts to Know
- **Landsat 8**: Satellite that captures Earth images every 16 days
- **NDVI**: Vegetation index (green plants absorb red light)
- **LST**: Land Surface Temperature from thermal infrared
- **UHI**: Urban Heat Island effect
- **UTFVI**: Thermal stress classification index

## Tips for Success

### 🎯 Best Practices
- **Use summer dates** for maximum UHI effect
- **Avoid cloudy seasons** for clearer images
- **Make AOI large enough** to include suburbs
- **Compare multiple cities** to understand patterns

### ⚠️ Common Mistakes
- ❌ Using winter data (UHI less pronounced)
- ❌ AOI too small (missing context)
- ❌ Forgetting to click "Run"
- ❌ Not waiting for processing to complete

### 💡 Pro Tips
- Export results before closing GEE
- Save your code snippets in scripts
- Document your findings as you go
- Compare results across seasons

## Need Help?

- 💬 **Questions?** Open a [GitHub Discussion](https://github.com/yourusername/urban-heat-islands-prediction/discussions)
- 🐛 **Found a bug?** Open a [GitHub Issue](https://github.com/yourusername/urban-heat-islands-prediction/issues)
- 📧 **Private inquiry?** See contact info in [README.md](../README.md)

## Share Your Findings!

If you discover interesting patterns or analyze new cities, consider:
- Opening a Pull Request to add your city
- Sharing visualizations on social media
- Writing about your findings

Tag: `#UrbanHeatIsland #GoogleEarthEngine #ClimateScience`

---

**Ready to explore?** Open Google Earth Engine and start your first analysis! 🌍🔥

**Estimated time to first results:** 2-3 minutes  
**Estimated time to master basics:** 1-2 hours  
**Estimated time to analyze new city:** 30 minutes

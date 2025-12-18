# Contributing to Urban Heat Islands Prediction

Thank you for your interest in contributing to this project! This guide will help you get started.

## Ways to Contribute

### 1. Add New Cities
Analyze additional cities following the established methodology:
- Copy a city template from `src/cities/`
- Update AOI coordinates
- Test all three models
- Document results

### 2. Improve Models
Enhance existing prediction methods or add new ones:
- Optimize Random Forest parameters
- Refine Markov Chain transition probabilities
- Improve Cellular Automation rules
- Implement deep learning approaches (CNN, LSTM)

### 3. Documentation
Help improve documentation:
- Fix typos or unclear explanations
- Add tutorials or examples
- Translate documentation
- Create video walkthroughs

### 4. Data Validation
Contribute validation data:
- Ground truth temperature measurements
- Weather station data
- Local UHI reports

### 5. Bug Fixes
Report or fix issues:
- Code errors
- Incorrect calculations
- Performance problems

## Getting Started

### Prerequisites
- Google Earth Engine account
- Basic JavaScript knowledge
- Git and GitHub familiarity
- Understanding of remote sensing concepts

### Development Setup

1. **Fork the repository**
   ```bash
   # Click "Fork" button on GitHub
   ```

2. **Clone your fork**
   ```bash
   git clone https://github.com/YOUR-USERNAME/urban-heat-islands-prediction.git
   cd urban-heat-islands-prediction
   ```

3. **Create a branch**
   ```bash
   git checkout -b feature/your-feature-name
   # or
   git checkout -b fix/bug-description
   ```

4. **Make your changes**
   - Follow existing code style
   - Add comments for complex logic
   - Test thoroughly in Google Earth Engine

5. **Commit your changes**
   ```bash
   git add .
   git commit -m "Add: Brief description of changes"
   ```

6. **Push to GitHub**
   ```bash
   git push origin feature/your-feature-name
   ```

7. **Open a Pull Request**
   - Go to the original repository on GitHub
   - Click "New Pull Request"
   - Describe your changes clearly

## Code Style Guidelines

### JavaScript (Google Earth Engine)

```javascript
// Use descriptive variable names
var landSurfaceTemperature = lst;  // Good
var x = lst;                        // Bad

// Add comments for complex operations
// Calculate emissivity using fractional vegetation
var emissivity = fractionalVegetation.multiply(0.004).add(0.986);

// Use consistent formatting
var aoi = ee.Geometry.Polygon([
    [[lon1, lat1],
     [lon2, lat2],
     [lon3, lat3],
     [lon4, lat4]]
]);

// Group related operations
// 1. Load data
// 2. Preprocess
// 3. Calculate indices
// 4. Generate results
```

### Documentation

- Use clear, concise language
- Include code examples
- Add visual aids where helpful
- Keep markdown formatting consistent

## Adding a New City

### Template

1. **Copy an existing city file**
   ```bash
   cp src/cities/nyc.js src/cities/paris.js
   ```

2. **Update header comment**
   ```javascript
   // ========================================
   // URBAN HEAT ISLAND ANALYSIS - PARIS, FRANCE
   // Author: [Your Name]
   // Date: [YYYY-MM-DD]
   // ========================================
   ```

3. **Define new AOI**
   ```javascript
   var aoi = ee.Geometry.Polygon([
       [[2.224, 48.902],   // Paris coordinates
        [2.224, 48.816],
        [2.470, 48.816],
        [2.470, 48.902]]
   ]);
   ```

4. **Test all models**
   - Run in Google Earth Engine
   - Verify results make sense
   - Export visualizations

5. **Document results**
   Create `results/paris_analysis.md` with:
   - Mean LST
   - UHI statistics
   - UTFVI percentage
   - Model comparison
   - Key findings

### Checklist

- [ ] AOI covers entire metropolitan area
- [ ] Date range appropriate for climate
- [ ] Cloud masking working properly
- [ ] All three models run successfully
- [ ] Results exported and visualized
- [ ] Statistics calculated and documented
- [ ] Code commented and clean
- [ ] Added to city list in README

## Improving Models

### Random Forest
```javascript
// Current implementation
var classifier = ee.Classifier.smileRandomForest({
    numberOfTrees: 100,
    variablesPerSplit: null,
    minLeafPopulation: 1,
    bagFraction: 0.5,
    maxNodes: null,
    seed: 0
});

// Experiment with parameters:
// - numberOfTrees: Try 50, 150, 200
// - variablesPerSplit: Try 1, 2, 3
// - minLeafPopulation: Try 5, 10
// Document performance changes
```

### Markov Chain
```javascript
// Current transition matrix
var transitionMatrix = [
    [0.95, 0.05],  // Urban -> [Urban, Non-urban]
    [0.10, 0.90]   // Non-urban -> [Urban, Non-urban]
];

// Experiment with different probabilities
// Calculate from historical data:
// 1. Analyze urban growth 2010-2017
// 2. Calculate actual transition rates
// 3. Test sensitivity to different values
```

### Cellular Automation
```javascript
// Current neighborhood rule
var neighborCount = urbanArea.convolve(kernel);
var newUrban = neighborCount.gte(5);

// Try different rules:
// - Threshold: 3, 4, 6, 7 neighbors
// - Kernel size: 5x5, 7x7
// - Weighted neighbors (distance decay)
```

## Testing

### Before Submitting
1. **Run in Google Earth Engine**
   - No errors in console
   - Visualizations display correctly
   - Exports work properly

2. **Validate Results**
   - LST values reasonable (-50°C to 70°C)
   - UHI follows expected patterns
   - UTFVI percentages make sense

3. **Check Documentation**
   - Code comments clear
   - README updated if needed
   - Examples provided

## Pull Request Process

### PR Title Format
```
[Type]: Brief description

Examples:
Feature: Add analysis for London, UK
Fix: Correct LST calculation formula
Docs: Improve methodology explanation
Refactor: Optimize cloud masking function
```

### PR Description Template
```markdown
## Description
Brief summary of changes

## Motivation
Why this change is needed

## Changes Made
- Item 1
- Item 2
- Item 3

## Testing
How changes were tested

## Screenshots/Results
If applicable, add visualizations

## Checklist
- [ ] Code follows style guidelines
- [ ] Tested in Google Earth Engine
- [ ] Documentation updated
- [ ] Results validated
```

## Code Review

Pull requests will be reviewed for:
- **Correctness**: Does it work as intended?
- **Quality**: Is the code clean and well-documented?
- **Testing**: Has it been properly tested?
- **Impact**: Does it improve the project?

Expect feedback and iteration—it's part of the process!

## Community Guidelines

### Be Respectful
- Welcome newcomers
- Provide constructive feedback
- Assume good intentions

### Be Helpful
- Answer questions when you can
- Share knowledge and resources
- Collaborate on solutions

### Be Professional
- Keep discussions on-topic
- Use appropriate language
- Respect intellectual property

## Recognition

Contributors will be acknowledged in:
- README.md contributors section
- Release notes
- Project documentation

Significant contributions may lead to co-authorship on publications derived from this work.

## Questions?

- **Technical Issues**: Open a GitHub Issue
- **General Questions**: Start a GitHub Discussion
- **Private Inquiries**: Contact via email (see README)

## Resources

- [Google Earth Engine Guides](https://developers.google.com/earth-engine/guides)
- [GEE JavaScript API](https://developers.google.com/earth-engine/apidocs)
- [Remote Sensing Tutorials](https://www.mdpi.com/journal/remotesensing)
- [Urban Heat Island Resources (EPA)](https://www.epa.gov/heatislands)

---

Thank you for contributing to Urban Heat Island research! Your work helps cities worldwide prepare for climate challenges. 🌍🔬

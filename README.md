# Project Analyzer

A powerful tool to analyze and evaluate multiple project proposals for course selection and bidding. This system helps you extract key information from PDF project documents, evaluate their suitability based on your background, and generate structured analysis reports.

## Features

- 📄 **PDF Text Extraction**: Automatically extract text from PDF project documents
- 🤖 **AI-Powered Analysis**: Analyze projects using AI to extract structured information
- ⭐ **Suitability Rating**: Get star ratings (1-5 stars) based on your background and interests
- 💰 **Bidding Recommendations**: Receive suggested bidding scores for each project
- 📊 **Excel Export**: Export all analysis results to Excel for easy filtering and comparison
- 🏢 **Company Inference**: Automatically infer company names from project descriptions

## Installation

### Prerequisites

- Node.js (v14 or higher)
- Python 3.8+ (optional, for Python-based analysis)
- npm or yarn

### Setup

1. **Clone the repository**
   ```bash
   git clone <your-repo-url>
   cd apply-bot-main
   ```

2. **Install Node.js dependencies**
   ```bash
   npm install
   ```

3. **Install Python dependencies (optional)**
   ```bash
   pip install -r requirements.txt
   ```

## Usage

### Step 1: Configure Your Profile

Create your personal profile by copying the example file:

```bash
# Windows
copy user_profile.example.json user_profile.json

# Mac/Linux
cp user_profile.example.json user_profile.json
```

Then edit `user_profile.json` and fill in:
- Your educational background (undergraduate, graduate degrees)
- Work experience
- Technical skills level
- Industry preferences
- Bidding strategy (total points, min/max projects, etc.)

**Note**: `user_profile.json` is excluded from Git to protect your privacy.

### Step 2: Prepare PDF Files

Place your project PDF files in the `data/projects/` directory. The system will automatically process all PDF files in this directory.

**Note**: The `data/projects/` directory is excluded from Git to protect privacy. Create it manually if it doesn't exist.

### Step 3: Extract Text from PDFs

Run the PDF text extraction script:

```bash
node extract_pdfs.js
```

This will:
- Extract text from all PDF files in `data/projects/`
- Save extracted text to `data/project_texts/`

### Step 4: Generate Personalized Analysis

Run the personalized analysis tool:

```bash
node analyze_with_profile.js
```

This will:
- Read your `user_profile.json` configuration
- Analyze all projects based on your background and preferences
- Generate personalized suitability ratings (1-5 stars)
- Provide bidding score recommendations
- Export results to both JSON and Excel formats

The output files will be saved in `data/output/` with timestamps.

## Project Structure

```
apply-bot-main/
├── data/
│   ├── projects/          # PDF files (not in Git)
│   ├── project_texts/     # Extracted text files (not in Git)
│   └── output/            # Analysis results (not in Git)
├── extract_pdfs.js        # PDF text extraction
├── generate_excel_from_json.js  # Excel generation
├── package.json
└── README.md
```

## Analysis Output

Each project analysis includes:

- **Project ID**: Unique identifier
- **Project Name**: Title of the project
- **Company Name**: Inferred or explicit company name
- **Industry**: Industry classification
- **Application Scenario**: Detailed use case description
- **Company Diligence Score**: 1-10 rating with explanation
- **Expected Outcomes**: Project deliverables
- **Required Skills**: Technical and domain skills needed
- **Suitability Rating**: 1-5 stars based on your background
- **Suggested Bidding Score**: Recommended points to bid
- **Bidding Rationale**: Explanation for the recommendation

## Configuration

### Customizing Your Profile

Edit `user_profile.json` to customize the analysis criteria:

1. **Education Background**: Your degrees and majors
2. **Work Experience**: Relevant work experience
3. **Technical Skills**: Programming languages, ML/AI level
4. **Industry Preferences**: Preferred industries and industries to avoid
5. **Bidding Strategy**: Total points, minimum projects, max points per project

The analysis will automatically adjust based on your profile settings.

## Privacy & Security

This repository is configured to exclude sensitive data:

- **PDF files**: All project PDFs and personal documents
- **Analysis results**: Excel files and detailed analysis JSON
- **Personal data**: Resumes, application logs, personal configurations
- **API keys**: Environment variables and secrets

See `.gitignore` for the complete list of excluded files.

## Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## Troubleshooting

### PDF Extraction Fails

- Ensure PDFs are not encrypted or password-protected
- Check that PDFs are not corrupted
- Verify `pdf-parse` package is installed correctly

### Excel Generation Fails

- Ensure `xlsx` package is installed: `npm install xlsx`
- Check that `data/output/analysis_results.json` exists and is valid JSON
- Verify write permissions for the output directory

### Analysis Results Missing

- Run `extract_pdfs.js` first to extract text
- Ensure text files are in `data/project_texts/`
- Check that the analysis process completed successfully

## License

This project is open source and available under the [MIT License](LICENSE).

## Acknowledgments

- Built for Columbia University MSBA program course selection
- Uses `pdf-parse` for PDF text extraction
- Uses `xlsx` for Excel file generation

## Support

For issues or questions:
1. Check the troubleshooting section
2. Review the code comments
3. Open an issue on GitHub

---

**Note**: This tool is designed to help with project evaluation and bidding decisions. Always review the analysis results carefully and make your own informed decisions.

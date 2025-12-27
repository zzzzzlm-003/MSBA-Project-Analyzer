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

### Step 1: Prepare PDF Files

Place your project PDF files in the `data/projects/` directory. The system will automatically process all PDF files in this directory.

**Note**: The `data/projects/` directory is excluded from Git to protect privacy. Create it manually if it doesn't exist.

### Step 2: Extract Text from PDFs

Run the PDF text extraction script:

```bash
node extract_pdfs.js
```

This will:
- Extract text from all PDF files in `data/projects/`
- Save extracted text to `data/project_texts/`
- Generate an index file (`projects_index.json`) with metadata

### Step 3: Analyze Projects

The analysis can be done in two ways:

**Option A: Using AI Assistant (Recommended)**
- The AI assistant will read the extracted text files
- Automatically extract key information
- Generate structured analysis with ratings and recommendations

**Option B: Using OpenAI API (if configured)**
- Set up your OpenAI API key in `.env` file
- Run the Python analysis script (if available)

### Step 4: Generate Excel Report

After analysis is complete, generate the Excel report:

```bash
node generate_excel_from_json.js
```

The Excel file will be saved in `data/output/` with a timestamp.

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

### Customizing Analysis Criteria

Edit the analysis logic in the AI assistant prompts or analysis scripts to match your specific background and interests.

### Background Information

The system evaluates projects based on:
- Your educational background (e.g., Finance undergraduate, MSBA graduate)
- Your work experience (e.g., Equity Research)
- Your interests (e.g., Finance-related projects)
- Your technical skills (e.g., ML basics, not advanced)

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

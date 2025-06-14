# ChatTrainer AI 🤖

**Modern web-based tool for creating and managing high-quality Q&A datasets to train AI chatbots and RAG systems.**

## ✨ Features

- 🤖 **AI-Powered Generation**: Automatically generate questions and answers using OpenAI integration
- 📝 **Interactive CSV Table**: Google Sheets-like interface with infinite rows support
- 🏷️ **Smart Classification**: Intent and category dropdown with custom entry options
- 📊 **Import/Export**: Seamless CSV file handling with validation
- 🎨 **Modern UI**: Clean, responsive design with dark/light mode
- ⚙️ **Configurable Settings**: OpenAI API key management and customization options
- 🔄 **Real-time Auto-save**: Never lose your work with automatic data persistence
- 🎯 **Context Menu**: Right-click actions for efficient row management

## 🚀 Quick Start

### Prerequisites

- Node.js 16+ and npm installed - [install with nvm](https://github.com/nvm-sh/nvm#installing-and-updating)
- OpenAI API key (optional, for AI features)

### Installation

```bash
# Clone the repository
git clone https://github.com/EssamSoft/ChatTrainerAI

# Navigate to project directory  
cd chattrainer-ai

# Install dependencies
npm install

# Start development server
npm run dev
```

Open [http://localhost:5173](http://localhost:5173) to view the application.

## 🛠️ Usage

### Basic Operations
1. **Add Rows**: Click below the table to add new rows (Google Sheets style)
2. **Edit Cells**: Double-click any cell to edit inline
3. **Delete Rows**: Right-click on a row and select "Delete"
4. **Import Data**: Use the import button to load existing CSV files
5. **Export Data**: Export your dataset as CSV with custom formatting

### AI Integration
1. **Setup**: Click the settings icon and enter your OpenAI API key
2. **Generate Questions**: Focus on a question field and click the AI button
3. **Generate Answers**: Focus on an answer field for context-aware answer generation
4. **Smart Suggestions**: AI considers intent and category for better results

### Data Structure
| Column | Description | Type |
|--------|-------------|------|
| ID | Auto-generated unique identifier | Auto-increment |
| Question | Training question text | Text + AI Generate |
| Answer | Corresponding answer text | Text + AI Generate |
| Intent | Classification of question intent | Dropdown + Custom |
| Category | Topic/domain category | Dropdown + Custom |

## 🏗️ Built With

- **Frontend Framework**: React 18+ with TypeScript
- **Styling**: Tailwind CSS with shadcn-ui components
- **Build Tool**: Vite for fast development and building
- **State Management**: React hooks with local storage persistence
- **Table Management**: Advanced table functionality with virtual scrolling
- **File Processing**: CSV parsing and generation with validation
- **AI Integration**: OpenAI API for intelligent content generation

## 🔧 Development

### Available Scripts

```bash
# Start development server
npm run dev

# Build for production
npm run build

# Preview production build
npm run preview

# Run type checking
npm run type-check

# Lint code
npm run lint
```


## 🚀 Deployment

### Build for Production

```bash
npm run build
```

The `dist` folder contains the built application ready for deployment.

### Deploy to Vercel

[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https://github.com/EssamSoft/ChatTrainerAI)

### Deploy to Netlify

[![Deploy to Netlify](https://www.netlify.com/img/deploy/button.svg)](https://app.netlify.com/start/deploy?repository=https://github.com/EssamSoft/ChatTrainerAI)

## 🎯 Use Cases

- **AI Chatbot Training**: Create comprehensive Q&A datasets for chatbot training
- **RAG System Development**: Build knowledge bases for retrieval-augmented generation
- **FAQ Management**: Organize and maintain frequently asked questions
- **Intent Classification**: Train NLU models with categorized conversation data
- **Customer Support**: Prepare training data for automated support systems

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

1. Fork the project
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- Built with modern web technologies for optimal performance
- Inspired by the need for better AI training data management tools
- Designed with user experience and developer productivity in mind

## 📞 Support

If you have any questions or need help, please:
- Open an issue on GitHub
- Check the documentation
- Join our community discussions

---

**Made with ❤️ for the AI development community by lovable**

# HMIS AI Chatbot

An AI-powered chatbot for querying Homeless Management Information System (HMIS) data using natural language. Built with Next.js and AI SDK, this application allows users to analyze homeless services data through conversational interactions.

<p align="center">
  <img alt="HMIS AI Chatbot Interface" src="app/(chat)/opengraph-image.png">
</p>

## Overview

This chatbot provides natural language access to HMIS data following HUD Data Standards, enabling users to:
- Query client demographics and outcomes
- Analyze project performance metrics
- Track services and financial assistance
- Generate insights about homeless services

Currently tracking:
- 4,146 clients
- 27 projects
- 4,771 enrollments
- 4,295 exits
- 4,472 services
- 9,623 income/benefits records

## Features

- **Natural Language Queries**: Ask questions about HMIS data in plain English
- **HUD HMIS Compliance**: Full implementation of HUD HMIS Data Standards
- **Real-time Analysis**: Instant access to client and project metrics
- **Data Visualization**: Clear presentation of query results
- **Secure Access**: Role-based authentication and data access controls
- **Audit Trail**: Track all queries and data access

## Tech Stack

- **Framework**: Next.js 16
- **Frontend**: React 19, Tailwind CSS
- **Database**: PostgreSQL with Drizzle ORM
- **AI**: AI SDK with custom query tools
- **Authentication**: NextAuth.js
- **Testing**: Playwright

## Getting Started

### Prerequisites

- Node.js 18+
- PostgreSQL 15+
- HMIS CSV data exports

### Environment Setup

1. Clone the repository:
```bash
git clone https://github.com/yourusername/hmis-ai-chatbot.git
cd hmis-ai-chatbot
```

2. Install dependencies:
```bash
pnpm install
```

3. Copy the example environment file:
```bash
cp .env.example .env.local
```

4. Configure your environment variables:
```env
POSTGRES_URL=postgresql://user:password@localhost:5432/hmis
AI_GATEWAY_API_KEY=your_api_key
```

### Database Setup

1. Run migrations:
```bash
pnpm db:migrate
```

2. Load HMIS data:
```bash
pnpm db:seed
```

### Running the Application

1. Start the development server:
```bash
pnpm dev
```

2. Open [http://localhost:3000](http://localhost:3000) in your browser

## Usage Examples

Ask questions like:

- "How many clients were served last month?"
- "What's the average length of stay in emergency shelters?"
- "Show me the breakdown of exit destinations for RRH projects"
- "What percentage of clients increased their income?"
- "Which projects have the highest permanent housing placement rates?"

## Project Structure

```
.
├── app/                  # Next.js app router
├── components/          # React components
├── data/               # HMIS CSV data files
├── database/           # Schema and documentation
├── lib/                # Core utilities
│   ├── ai/            # AI tools and prompts
│   ├── db/            # Database configuration
│   └── utils/         # Helper functions
├── public/            # Static assets
├── scripts/           # Data loading scripts
└── tests/             # Test suites
```

## Development

### Running Tests

```bash
# Run all tests
pnpm test

# Run specific test suite
pnpm test tests/llm-query-tests.ts
```

### Code Style

We use Ultracite for code formatting and linting:

```bash
# Check code style
pnpm lint

# Fix code style issues
pnpm format
```

## Database Schema

The database implements the [HUD HMIS Data Standards](https://www.hudexchange.info/resource/3824/hmis-data-dictionary/), including:

- Client demographics
- Project enrollments
- Services provided
- Income and benefits
- Outcomes and exits

See [database/schema.md](database/schema.md) for complete documentation.

## Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## Acknowledgments

- Built on [Next.js AI Chatbot](https://github.com/vercel/ai-chatbot) template
- Implements [HUD HMIS Data Standards](https://www.hudexchange.info/resource/3824/hmis-data-dictionary/)
- Uses [AI SDK](https://sdk.vercel.ai/docs) for natural language processing

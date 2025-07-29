# Contributing to Luna Services

Thank you for your interest in contributing to Luna Services! This document provides guidelines and information for contributors.

## Table of Contents

1. [Code of Conduct](#code-of-conduct)
2. [Getting Started](#getting-started)
3. [Development Setup](#development-setup)
4. [Contributing Process](#contributing-process)
5. [Coding Standards](#coding-standards)
6. [Testing Guidelines](#testing-guidelines)
7. [Documentation](#documentation)
8. [Community](#community)

## Code of Conduct

This project adheres to a Code of Conduct that we expect all contributors to follow. Please read and follow these guidelines to help us maintain a welcoming community.

### Our Pledge

We pledge to make participation in our project a harassment-free experience for everyone, regardless of age, body size, disability, ethnicity, gender identity and expression, level of experience, nationality, personal appearance, race, religion, or sexual identity and orientation.

## Getting Started

### Prerequisites

- Node.js (v18 or higher)
- Python (v3.9 or higher)
- Docker and Docker Compose
- Git
- A Supabase account

### Fork and Clone

1. Fork the repository on GitHub
2. Clone your fork locally:
   ```bash
   git clone https://github.com/YOUR_USERNAME/Luna-Services.git
   cd Luna-Services
   ```
3. Add the upstream repository:
   ```bash
   git remote add upstream https://github.com/Drago-03/Luna-Services.git
   ```

## Development Setup

### Quick Setup

1. Run the setup script:
   ```bash
   chmod +x scripts/quick-setup.sh
   ./scripts/quick-setup.sh
   ```

### Manual Setup

1. Install frontend dependencies:
   ```bash
   npm install
   ```

2. Install backend dependencies:
   ```bash
   cd backend
   pip install -r requirements.txt
   ```

3. Copy environment file:
   ```bash
   cp .env.example .env
   ```

4. Configure your environment variables in `.env`

5. Start the development services:
   ```bash
   docker-compose up -d
   ```

6. Run database migrations:
   ```bash
   cd supabase
   supabase db push
   ```

## Supabase Database Setup

### Environment Configuration

Add these variables to your `.env` file:

```env
# Supabase Configuration
VITE_SUPABASE_URL=https://tnmsadjdeenhysllhyzp.supabase.co
VITE_SUPABASE_ANON_KEY=your_anon_key_here
SUPABASE_SERVICE_KEY=your_service_key_here
SUPABASE_DB_PASSWORD=your_database_password

# Database URLs
DATABASE_URL=postgresql://postgres:password@db.supabase.co:5432/postgres
```

### Running Migrations

```bash
# Apply all migrations
supabase db reset

# Or run specific migration
supabase db push
```

## Contributing Process

### 1. Create an Issue

Before starting work, create an issue describing:
- The problem you're solving
- Your proposed solution
- Any breaking changes

### 2. Create a Branch

Create a descriptive branch name:
```bash
git checkout -b feature/add-new-feature
git checkout -b fix/resolve-bug
git checkout -b docs/update-readme
```

### 3. Make Changes

- Follow our coding standards
- Write tests for new functionality
- Update documentation as needed
- Keep commits focused and atomic

### 4. Test Your Changes

```bash
# Run frontend tests
npm test

# Run backend tests
cd backend
pytest

# Run linting
npm run lint
cd backend
flake8
```

### 5. Submit a Pull Request

1. Push your branch to your fork
2. Create a pull request with:
   - Clear title and description
   - Reference to related issues
   - Screenshots for UI changes
   - Test results

## Coding Standards

### Frontend (TypeScript/React)

- Use TypeScript for all new code
- Follow ESLint configuration
- Use functional components with hooks
- Follow naming conventions:
  - Components: PascalCase
  - Files: PascalCase for components, camelCase for utilities
  - Variables/functions: camelCase

### Backend (Python/FastAPI)

- Follow PEP 8 style guide
- Use type hints for all functions
- Write docstrings for classes and functions
- Use async/await for I/O operations

### Database

- Use meaningful table and column names
- Include proper indexes
- Write migrations for schema changes
- Follow RLS (Row Level Security) patterns

## Testing Guidelines

### Frontend Testing

- Unit tests for utilities and hooks
- Component tests for React components
- Integration tests for complex workflows
- Use Jest and React Testing Library

### Backend Testing

- Unit tests for business logic
- Integration tests for API endpoints
- Database tests for models
- Use pytest and pytest-asyncio

### Test Coverage

- Maintain minimum 80% test coverage
- Include edge cases and error scenarios
- Test both success and failure paths

## Documentation

### Code Documentation

- Comment complex business logic
- Use TypeScript/Python type annotations
- Write clear commit messages
- Update API documentation

### User Documentation

- Update README for new features
- Add examples and screenshots
- Keep installation instructions current
- Document breaking changes

### API Documentation

- Update OpenAPI/Swagger specs
- Include request/response examples
- Document error codes and responses

## Project Structure

```
Luna-Services/
├── src/                   # React TypeScript frontend
│   ├── components/        # Reusable UI components
│   ├── pages/            # Page components
│   ├── services/         # API and external services
│   ├── hooks/            # Custom React hooks
│   └── utils/            # Utility functions
├── backend/              # FastAPI Python backend
│   ├── app/
│   │   ├── models/       # Database models
│   │   ├── routes/       # API routes
│   │   ├── services/     # Business logic
│   │   └── utils/        # Utility functions
├── supabase/             # Database migrations and config
├── docs/                 # Documentation
└── scripts/              # Setup and deployment scripts
```

## Release Process

1. Update version numbers
2. Update CHANGELOG.md
3. Create release branch
4. Run full test suite
5. Create GitHub release
6. Deploy to staging
7. Deploy to production

## Community

### Getting Help

- Create an issue for bugs or feature requests
- Join our discussions on GitHub
- Check existing documentation

### Reporting Security Issues

Please report security vulnerabilities privately to the maintainers. Do not create public issues for security problems.

## Recognition

Contributors are recognized in:
- README.md contributors section
- Release notes
- Annual contributor acknowledgments

## License

By contributing to Luna Services, you agree that your contributions will be licensed under the same license as the project.

---

Thank you for contributing to Luna Services! 🚀
   npm run dev
   
   # Backend (in backend directory)
   uvicorn app.main:app --reload
   ```

## 🤝 How to Contribute

### Types of Contributions

We welcome various types of contributions:

- 🐛 **Bug fixes**
- ✨ **New features**
- 📚 **Documentation improvements**
- 🧪 **Tests**
- 🎨 **UI/UX improvements**
- 🔧 **DevOps and tooling**
- 🌐 **Translations**

### Contribution Workflow

1. **Create an Issue**
   - Before starting work, create an issue describing what you want to do
   - This helps avoid duplicate work and allows for discussion

2. **Create a Branch**
   ```bash
   git checkout -b feature/your-feature-name
   # or
   git checkout -b bugfix/issue-number
   ```

3. **Make Your Changes**
   - Write clear, commented code
   - Follow our coding standards (see below)
   - Add tests for new functionality
   - Update documentation as needed

4. **Test Your Changes**
   ```bash
   # Run frontend tests
   npm test
   
   # Run backend tests
   cd backend
   pytest
   
   # Run linting
   npm run lint
   cd backend
   flake8 .
   ```

5. **Commit Your Changes**
   ```bash
   git add .
   git commit -m "feat: add amazing new feature"
   ```
   
   Use conventional commit messages:
   - `feat:` for new features
   - `fix:` for bug fixes
   - `docs:` for documentation
   - `test:` for tests
   - `refactor:` for code refactoring
   - `style:` for formatting changes

6. **Push and Create Pull Request**
   ```bash
   git push origin your-branch-name
   ```
   
   Then create a pull request through GitHub's interface.

## 📋 Coding Standards

### General Guidelines

- **Code Quality**: Write clean, readable, and maintainable code
- **Comments**: Comment your code thoroughly, especially complex logic
- **Testing**: Include tests for new features and bug fixes
- **Documentation**: Update relevant documentation

### Frontend (TypeScript/React)

- Use **TypeScript** for type safety
- Follow **React best practices**
- Use **Chakra UI** for consistent styling
- Implement **responsive design**
- Use **ESLint** and **Prettier** for code formatting

Example component structure:
```typescript
interface ComponentProps {
  title: string;
  isVisible?: boolean;
}

export const MyComponent: React.FC<ComponentProps> = ({ 
  title, 
  isVisible = true 
}) => {
  // Component logic here
  return (
    <Box>
      {/* Component JSX */}
    </Box>
  );
};
```

### Backend (Python/FastAPI)

- Follow **PEP 8** style guidelines
- Use **type hints** for all functions
- Implement **proper error handling**
- Use **async/await** for I/O operations
- Write **comprehensive docstrings**

Example function structure:
```python
async def create_automation_job(
    job_data: AutomationJobCreate,
    user_id: str,
    db: AsyncSession = Depends(get_db)
) -> AutomationJob:
    """
    Create a new automation job.
    
    Args:
        job_data: Job creation data
        user_id: ID of the user creating the job
        db: Database session
        
    Returns:
        Created automation job
        
    Raises:
        HTTPException: If job creation fails
    """
    try:
        # Implementation here
        pass
    except Exception as e:
        logger.error(f"Job creation failed: {e}")
        raise HTTPException(status_code=400, detail=str(e))
```

### Database

- Use **descriptive table and column names**
- Implement **proper indexing**
- Add **foreign key constraints**
- Include **audit trails** (created_at, updated_at)
- Use **Row Level Security** for data protection

## 🧪 Testing Guidelines

### Frontend Testing

- Use **Jest** and **React Testing Library**
- Test user interactions and component behavior
- Mock external dependencies
- Aim for good test coverage

```typescript
describe('MyComponent', () => {
  it('should render with correct title', () => {
    render(<MyComponent title="Test Title" />);
    expect(screen.getByText('Test Title')).toBeInTheDocument();
  });
});
```

### Backend Testing

- Use **pytest** for testing
- Test all API endpoints
- Mock external services
- Test error conditions

```python
@pytest.mark.asyncio
async def test_create_automation_job():
    # Test implementation
    assert response.status_code == 201
    assert response.json()['name'] == 'Test Job'
```

## 📚 Documentation

### Code Documentation

- **Inline comments**: Explain complex logic
- **Function docstrings**: Describe purpose, parameters, and return values
- **README files**: Keep them updated in each major directory
- **API documentation**: Use FastAPI's automatic documentation

### Wiki Documentation

Store comprehensive guides in the `/wiki` folder:
- Setup guides
- Architecture documentation
- API references
- User guides
- Troubleshooting

## 🚀 Release Process

1. **Version Numbering**: We use semantic versioning (MAJOR.MINOR.PATCH)
2. **Changelog**: Update `CHANGELOG.md` with all changes
3. **Version File**: Update the `VERSION` file
4. **Testing**: Ensure all tests pass
5. **Documentation**: Update relevant documentation

## 👥 Community Guidelines

### Be Respectful and Inclusive

- Use welcoming and inclusive language
- Respect different viewpoints and experiences
- Accept constructive criticism gracefully
- Focus on what's best for the community

### Getting Help

- **Issues**: Use GitHub issues for bugs and feature requests
- **Discussions**: Use GitHub discussions for questions and ideas
- **Documentation**: Check the wiki for detailed guides

### Recognition

Contributors will be recognized in:
- `CONTRIBUTORS.md` file
- Release notes
- Project documentation

## 🔧 Development Tools

### Recommended VS Code Extensions

- **ESLint**: For JavaScript/TypeScript linting
- **Python**: For Python development
- **Prettier**: For code formatting
- **GitLens**: For Git integration
- **Thunder Client**: For API testing

### Useful Commands

```bash
# Format all code
npm run format
cd backend && black .

# Run all tests
npm test
cd backend && pytest

# Build for production
npm run build

# Database migrations
supabase db reset
supabase db push
```

## 📝 Pull Request Template

When creating a pull request, please include:

- **Description**: What does this PR do?
- **Type**: Feature, bugfix, documentation, etc.
- **Testing**: How was this tested?
- **Screenshots**: For UI changes
- **Breaking Changes**: Any breaking changes?
- **Related Issues**: Link to related issues

## 🎯 Roadmap and Priorities

Current development priorities:
1. **Core MCP Features**: Enhanced protocol support
2. **UI/UX Improvements**: Better user experience
3. **Performance**: Optimization and scalability
4. **Documentation**: Comprehensive guides
5. **Testing**: Improved test coverage

Thank you for contributing to Luna Services! Your contributions help make this project better for everyone. 🚀

---

*This contributing guide is a living document. Please suggest improvements through issues or pull requests.*

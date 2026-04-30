# Contributing Guide

Thank you for your interest in contributing to the Election Support project!

## Getting Started

### Prerequisites
- Node.js 16+ and npm 7+
- Git

### Setup Development Environment

1. **Clone the repository**
```bash
git clone https://github.com/yourusername/electionSupport.git
cd electionSupport
```

2. **Setup backend**
```bash
cd backend
npm install
cp .env.example .env
npm run dev
```

3. **Setup frontend (in new terminal)**
```bash
cd frontend
npm install
cp .env.example .env.local
npm run dev
```

4. **Verify everything works**
```bash
# Backend
cd backend && npm test

# Frontend
cd frontend && npm test
```

---

## Development Workflow

### 1. Create a Feature Branch
```bash
git checkout -b feature/your-feature-name
```

### 2. Make Your Changes
- Follow the coding standards below
- Write/update tests for your changes
- Keep commits atomic and descriptive

### 3. Run Tests Locally
```bash
# Backend tests
cd backend && npm test

# Frontend tests
cd frontend && npm test

# Linting
cd backend && npm run lint
cd frontend && npm run lint
```

### 4. Commit & Push
```bash
git add .
git commit -m "feat: describe your changes"
git push origin feature/your-feature-name
```

### 5. Create Pull Request
- Reference related issues
- Describe what your PR does
- List any breaking changes

---

## Coding Standards

### JavaScript/TypeScript
- ✅ Use const/let, avoid var
- ✅ Use arrow functions
- ✅ Use destructuring
- ✅ Max line length: 100 characters
- ✅ Use async/await, avoid callbacks
- ✅ Add JSDoc comments for functions

### Bad Example
```javascript
var result = map(function(x) { return x * 2; });
```

### Good Example
```javascript
const result = items.map((x) => x * 2);
```

### ESLint Configuration
```javascript
// .eslintrc.js
module.exports = {
  extends: ['next/core-web-vitals'],
  rules: {
    'no-console': 'warn',
    'no-unused-vars': 'error'
  }
};
```

---

## Git Commit Messages

Follow the [Conventional Commits](https://www.conventionalcommits.org/) standard:

```
<type>(<scope>): <subject>

<body>

<footer>
```

### Types
- `feat`: New feature
- `fix`: Bug fix
- `docs`: Documentation changes
- `style`: Formatting/code style
- `refactor`: Code refactoring
- `test`: Test additions/updates
- `chore`: Build/deps updates
- `perf`: Performance improvements

### Examples
```
feat(chat): add support for multi-language responses

fix(api): resolve rate limiting on timeline endpoint

docs: update API documentation with new endpoints

test: add edge case tests for feedback validation
```

---

## Testing Guidelines

### Backend Tests
```javascript
describe('Feature Name', () => {
  test('should do something specific', async () => {
    // Arrange
    const input = { /* test data */ };

    // Act
    const response = await request(app)
      .post('/api/endpoint')
      .send(input);

    // Assert
    expect(response.statusCode).toBe(200);
    expect(response.body).toHaveProperty('expectedField');
  });
});
```

### Frontend Tests
```javascript
import { render, screen, fireEvent } from '@testing-library/react';
import MyComponent from '@/components/MyComponent';

describe('MyComponent', () => {
  test('renders and handles clicks', () => {
    render(<MyComponent />);
    const button = screen.getByRole('button', { name: /click me/i });
    fireEvent.click(button);
    expect(screen.getByText(/clicked/i)).toBeInTheDocument();
  });
});
```

### Test Coverage Requirements
- All public functions should have tests
- Edge cases should be tested
- Error paths should be tested
- Target: 80%+ coverage

---

## Documentation

### Code Comments
```javascript
/**
 * Normalizes a region string to match supported regions
 * @param {string} region - The region to normalize
 * @returns {string} Normalized region or 'national' as default
 */
function normalizeRegion(region) {
  // Implementation
}
```

### README Updates
When adding features, update relevant sections:
- Features list
- API endpoints (if applicable)
- Setup instructions (if dependencies added)

### Changelog
Document significant changes in CHANGELOG.md:
```markdown
## [1.1.0] - 2026-05-01

### Added
- New feature description

### Fixed
- Bug description

### Changed
- Breaking change description
```

---

## Code Review Process

### What We Look For
1. **Functionality** - Does it work as intended?
2. **Code Quality** - Is it maintainable?
3. **Tests** - Are edge cases covered?
4. **Security** - Are inputs validated?
5. **Performance** - Could it be optimized?
6. **Documentation** - Is it clear?

### Review Comments Examples

**Request Changes**
```
This doesn't handle the case where region is null.
Please add validation before using it.
```

**Suggestions**
```
Consider using a Map here for O(1) lookup instead of Array.find().
```

**Approval**
```
Looks good! The error handling is solid and tests cover the edge cases.
```

---

## Common Tasks

### Adding a New API Endpoint

1. **Create controller** `backend/src/controllers/newFeature.js`
```javascript
exports.getFeature = (req, res) => {
  // Validation
  // Business logic
  // Response
};
```

2. **Add route** in `backend/src/app.js`
```javascript
app.get('/api/feature', newFeatureController.getFeature);
```

3. **Write tests** in `backend/tests/api.test.js`
```javascript
test('GET /api/feature returns data', async () => {
  const response = await request(app).get('/api/feature');
  expect(response.statusCode).toBe(200);
});
```

4. **Update API documentation** in `API_DOCUMENTATION.md`

### Adding a New Frontend Component

1. **Create component** `frontend/components/NewComponent.jsx`
```javascript
export default function NewComponent({ prop1, prop2 }) {
  return (
    <div>
      {/* Component JSX */}
    </div>
  );
}
```

2. **Add tests** `frontend/tests/newComponent.test.jsx`

3. **Use in page** `frontend/pages/somePage.js`

4. **Update README** if it's user-facing

---

## Troubleshooting

### Port Already in Use
```bash
# Kill process on port 5000
lsof -ti:5000 | xargs kill -9

# Or use different port
PORT=5001 npm run dev
```

### Module Not Found
```bash
# Clear node_modules and reinstall
rm -rf node_modules package-lock.json
npm install
```

### Tests Failing
```bash
# Run with verbose output
npm test -- --verbose

# Run specific test
npm test -- --testNamePattern="specific test"
```

### Firebase Issues
```bash
# Check .env.local
cat .env.local

# Verify API key in Firebase console
# Project Settings → API Keys
```

---

## Reporting Bugs

When reporting bugs, include:
1. **Description** - What's the issue?
2. **Steps to Reproduce** - How to trigger it?
3. **Expected Behavior** - What should happen?
4. **Actual Behavior** - What actually happened?
5. **Environment** - Node version, OS, browser?
6. **Screenshots/Logs** - If applicable

**Example:**
```
## Bug Report: Chat endpoint returns 500 error

### Steps to Reproduce
1. Start the app
2. Send a message via chat
3. App returns 500 error

### Expected
Should return 200 with reply

### Actual
Returns 500 with error message

### Environment
- Node: 16.0.0
- npm: 7.0.0
- Backend logs: [attach logs]
```

---

## Feature Requests

For feature requests, please describe:
1. **Use Case** - Why is this needed?
2. **Proposed Solution** - How would it work?
3. **Alternatives** - Any other approaches?
4. **Additional Context** - Any relevant info?

---

## Getting Help

- **Documentation**: Check [README.md](README.md) and [API_DOCUMENTATION.md](API_DOCUMENTATION.md)
- **Issues**: Search existing issues for similar problems
- **Discussions**: Post questions in project discussions
- **Contact**: Reach out to maintainers

---

## Code of Conduct

Please be respectful and constructive in all interactions.
- Be inclusive and welcoming
- Be professional and courteous
- Focus on the ideas, not the person
- Give credit where due

---

**Thank you for contributing!** 🎉

Your contributions help make election education accessible to everyone.

---

**Last Updated:** May 1, 2026

# Security Policy

## Supported Versions

We release patches for security vulnerabilities in the following versions:

| Version | Supported          |
| ------- | ------------------ |
| 1.x.x   | :white_check_mark: |
| 0.x.x   | :white_check_mark: |

## Reporting a Vulnerability

The Luna Services team takes security bugs seriously. We appreciate your efforts to responsibly disclose your findings, and will make every effort to acknowledge your contributions.

### Where to Report

**Please do not report security vulnerabilities through public GitHub issues.**

Instead, please report them via:
- **Email**: security@luna-services.dev
- **GitHub Security Advisory**: Use the "Security" tab in this repository

### Response Timeline

- **Initial Response**: Within 48 hours of report
- **Status Update**: Within 7 days with preliminary assessment
- **Fix Timeline**: Critical issues within 30 days, others within 90 days

### What to Include

Please include the following information in your report:

1. **Type of issue** (e.g., SQL injection, XSS, authentication bypass, etc.)
2. **Full paths of source file(s) related to the manifestation of the issue**
3. **The location of the affected source code** (tag/branch/commit or direct URL)
4. **Any special configuration required to reproduce the issue**
5. **Step-by-step instructions to reproduce the issue**
6. **Proof-of-concept or exploit code** (if possible)
7. **Impact of the issue**, including how an attacker might exploit it

### Security Measures

Luna Services implements multiple security layers:

#### Database Security
- **Row Level Security (RLS)** enabled on all tables
- **Encrypted connections** to Supabase
- **Service key** protection for admin operations
- **JWT token validation** for all authenticated endpoints

#### API Security
- **Rate limiting** on all endpoints
- **Input validation** and sanitization
- **CORS configuration** for cross-origin requests
- **Authentication middleware** for protected routes

#### Frontend Security
- **Environment variable protection** (no secrets in client)
- **Content Security Policy** headers
- **XSS protection** through React's built-in escaping
- **Secure token storage** using httpOnly cookies where possible

#### Infrastructure Security
- **HTTPS enforcement** in production
- **Docker container** security hardening
- **Regular dependency** updates and vulnerability scanning
- **Secrets management** through environment variables

### Vulnerability Disclosure Policy

We follow responsible disclosure practices:

1. **Private reporting** of vulnerabilities
2. **Coordinated disclosure** timeline
3. **Public disclosure** only after fixes are available
4. **Credit** to security researchers (with permission)

### Security Best Practices for Contributors

When contributing to Luna Services, please follow these security guidelines:

#### Code Review
- All code changes require security review
- Use static analysis tools (ESLint, Bandit)
- Check for common vulnerabilities (OWASP Top 10)

#### Dependency Management
- Keep dependencies up to date
- Use `npm audit` and `pip-audit` regularly
- Pin dependency versions in production

#### Secrets Management
- Never commit secrets to version control
- Use environment variables for configuration
- Rotate API keys and tokens regularly

#### Database Access
- Use parameterized queries
- Implement proper access controls
- Audit database permissions regularly

### Security Testing

We encourage security testing but ask that you:

1. **Do not access** data that doesn't belong to you
2. **Do not perform** destructive testing
3. **Do not spam** our services or APIs
4. **Respect** rate limits and system resources
5. **Test only** against your own accounts/data

### Bug Bounty Program

Currently, Luna Services does not offer a bug bounty program. However, we recognize security researchers who responsibly disclose vulnerabilities:

- **Hall of Fame** listing on our website
- **Public recognition** in release notes
- **Direct communication** with the development team

### Security Contacts

- **Security Team**: security@luna-services.dev
- **Lead Developer**: drago@luna-services.dev
- **Emergency Contact**: For critical vulnerabilities affecting production

### Legal

This security policy is subject to our Terms of Service and Privacy Policy. Security research conducted in accordance with this policy will not result in legal action against the researcher.

---

Thank you for helping keep Luna Services secure! 🔒
2. **Full paths** of source file(s) related to the manifestation of the issue
3. **Location** of the affected source code (tag/branch/commit or direct URL)
4. **Special configuration** required to reproduce the issue
5. **Step-by-step instructions** to reproduce the issue
6. **Proof-of-concept or exploit code** (if possible)
7. **Impact** of the issue, including how an attacker might exploit the issue

### Response Timeline

- **Acknowledgment**: We will acknowledge receipt of your vulnerability report within 48 hours
- **Initial Assessment**: We will provide an initial assessment within 5 business days
- **Progress Updates**: We will keep you informed of our progress every 10 business days
- **Resolution**: We aim to resolve critical vulnerabilities within 30 days

### Disclosure Policy

- We will coordinate with you to determine an appropriate disclosure timeline
- We will not disclose the vulnerability until a fix is available
- We will credit you in our security advisory (unless you prefer to remain anonymous)

## Security Measures

### Authentication & Authorization

- **Supabase Auth**: Secure user authentication with JWT tokens
- **Row Level Security (RLS)**: Database-level access control
- **Role-based Access Control**: Fine-grained permissions system
- **API Key Management**: Secure API key generation and validation

### Data Protection

- **Encryption in Transit**: All data encrypted using TLS 1.3
- **Encryption at Rest**: Database encryption provided by Supabase
- **Input Validation**: Comprehensive input validation and sanitization
- **SQL Injection Prevention**: Parameterized queries and ORM usage

### Infrastructure Security

- **Container Security**: Docker images scanned for vulnerabilities
- **Dependency Management**: Regular dependency updates and vulnerability scanning
- **Environment Isolation**: Separate environments for development, staging, and production
- **Secret Management**: Secure handling of API keys and credentials

### Application Security

- **CSRF Protection**: Cross-Site Request Forgery protection
- **XSS Prevention**: Content Security Policy and input sanitization
- **Rate Limiting**: API rate limiting to prevent abuse
- **Session Management**: Secure session handling

## Security Best Practices for Contributors

### Code Review

- All code changes require review by at least one maintainer
- Security-sensitive changes require review by a security-aware maintainer
- Automated security scanning is performed on all pull requests

### Dependencies

- Keep dependencies up to date
- Use `npm audit` and `pip-audit` to check for vulnerabilities
- Prefer well-maintained packages with good security track records

### Environment Variables

- Never commit secrets to version control
- Use `.env.example` for configuration templates
- Rotate secrets regularly

### Database Security

- Use parameterized queries
- Implement proper access controls
- Validate all inputs
- Use database migrations for schema changes

## Vulnerability Disclosure Examples

### Example 1: Authentication Bypass

```
Subject: Authentication Bypass in User Management

Description:
I found a vulnerability in the user management system that allows an 
attacker to bypass authentication checks by manipulating JWT tokens.

Steps to reproduce:
1. Create a user account
2. Intercept the JWT token
3. Modify the role claim to "admin"
4. Use the modified token to access admin endpoints

Impact:
An attacker could gain administrative access to the system.
```

### Example 2: SQL Injection

```
Subject: SQL Injection in Project Search

Description:
The project search functionality is vulnerable to SQL injection through
the search parameter.

Steps to reproduce:
1. Navigate to /api/projects/search
2. Submit the following payload: `'; DROP TABLE projects; --`
3. Observe database error

Impact:
An attacker could read, modify, or delete database contents.
```

## Security Checklist for Developers

### Backend (Python/FastAPI)

- [ ] Input validation using Pydantic models
- [ ] SQL injection prevention with SQLAlchemy ORM
- [ ] Authentication middleware implemented
- [ ] Rate limiting configured
- [ ] CORS properly configured
- [ ] Secrets managed securely
- [ ] Error messages don't leak sensitive information

### Frontend (React/TypeScript)

- [ ] Content Security Policy implemented
- [ ] XSS prevention through proper data handling
- [ ] Authentication state managed securely
- [ ] Sensitive data not exposed in client-side code
- [ ] Third-party dependencies regularly updated
- [ ] HTTPS enforced in production

### Database (Supabase/PostgreSQL)

- [ ] Row Level Security (RLS) enabled
- [ ] Proper access controls implemented
- [ ] Database migrations reviewed for security
- [ ] Sensitive data encrypted
- [ ] Regular backups configured
- [ ] Connection strings secured

## Incident Response

### Immediate Response

1. **Assess the impact** and scope of the vulnerability
2. **Contain the threat** by implementing temporary mitigations
3. **Notify stakeholders** including users if personal data is affected
4. **Document the incident** for future reference

### Investigation

1. **Analyze the root cause** of the vulnerability
2. **Determine the timeline** of the incident
3. **Identify affected systems** and data
4. **Assess the damage** and potential impact

### Resolution

1. **Develop and test** a permanent fix
2. **Deploy the fix** to all affected systems
3. **Verify the fix** resolves the vulnerability
4. **Update documentation** and security measures

### Post-Incident

1. **Conduct a post-mortem** to identify lessons learned
2. **Update security procedures** to prevent similar incidents
3. **Communicate resolution** to affected parties
4. **Monitor for** any additional related issues

## Security Training and Awareness

### For Contributors

- Review OWASP Top 10 vulnerabilities
- Understand secure coding practices
- Learn about common attack vectors
- Stay updated with security advisories

### Resources

- [OWASP Web Security Testing Guide](https://owasp.org/www-project-web-security-testing-guide/)
- [SANS Secure Coding Practices](https://www.sans.org/white-papers/2172/)
- [Python Security Best Practices](https://python.org/dev/security/)
- [React Security Best Practices](https://reactjs.org/docs/dom-elements.html#dangerouslysetinnerhtml)

## Contact Information

- **Security Team**: security@luna-services.dev
- **Project Maintainer**: maintainer@luna-services.dev
- **General Contact**: contact@luna-services.dev

---

Thank you for helping keep Luna Services and our users safe!

*This security policy is regularly reviewed and updated. Last updated: January 29, 2025*

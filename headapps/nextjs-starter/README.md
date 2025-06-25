# XM Cloud Next.js Starter Kit with Authentication & Role-Based Navigation

This is a Next.js application integrated with Sitecore XM Cloud, featuring NextAuth.js authentication and role-based navigation middleware.

## Prerequisites

- [Node.js LTS](https://nodejs.org/en/) (v18 or higher)
- Access to a Sitecore XM Cloud Environment
- [Docker Desktop](https://www.docker.com/products/docker-desktop) (for local container development)
- [.NET 8.0 SDK](https://dotnet.microsoft.com/en-us/download) (for Sitecore CLI)

## Project Structure

```
├── src/
│   ├── components/
│   │   └── Navigation.tsx          # Role-based navigation component
│   ├── middleware.ts               # Authentication & authorization middleware
│   ├── pages/
│   │   └── api/auth/[...nextauth].ts # NextAuth.js configuration
│   └── lib/
├── .env.local                      # Local environment variables
└── package.json
```

## Getting Started

### 1. Environment Setup

1. **Clone the repository**
   
   git clone <your-repository-url>
   cd xm-demo-2/headapps/nextjs-starter
   

2. **Configure Environment Variables**
   
   Create a `.env.local` file in the `headapps/nextjs-starter` directory:
  
   # Sitecore Configuration
   SITECORE_EDGE_CONTEXT_ID=your_context_id
   SITECORE_SITE_NAME=demo
   SITECORE_GRAPHQL_HOME_QUERY="/sitecore/content/demo/demo/Home"
   
   # NextAuth.js Configuration
   NEXTAUTH_SECRET=your_secure_secret_here
   NEXTAUTH_URL=http://localhost:3000
   JSS_EDITING_SECRET=your_jss_editing_secret
   
   # Development Settings
   DISABLE_SSG_FETCH=true
   
   > **Note**: Get your actual values from the XM Cloud Deploy Portal:
   > - Log into [XM Cloud Deploy Portal](https://deploy.sitecorecloud.io/)
   > - Navigate to your Environment → Developer Settings tab
   > - Ensure Preview toggle is enabled
   > - Copy the Local Development `.env` contents

### 2. Install Dependencies

npm install

### 3. Run in Development Mode

**Connected Mode (Recommended):**

npm run start:connected

The application will be available at `http://localhost:3000

**Production Mode:**

npm run build
npm run start:production

## 4. Sitecore Item Synchronization

### Prerequisites

- [.NET 8.0 SDK](https://dotnet.microsoft.com/en-us/download) installed
- Sitecore CLI installed (automatically restored with `dotnet tool restore`)
- Valid XM Cloud environment access

### Authentication Commands

#### 1. XM Cloud Login
## First, authenticate with the XM Cloud Deploy portal:

dotnet sitecore cloud login

## Connect to your specific XM Cloud CM instance:

dotnet sitecore login --cm <CM url> -n <Project Id>> -r xmcloud

Parameters:
--cm: Your XM Cloud CM instance URL
-n: Environment/connection name identifier
-r: Reference name (typically "xmcloud")

## Synchronize items from your XM Cloud instance to your local development environment:

dotnet sitecore ser pull -n <Project Id> --trace

-n: Your environment/connection name
--trace: Enables detailed logging for troubleshooting

## Remark! Validate before pushing: Run dotnet sitecore ser validate to check for serialization issues

## Features

### Authentication
- **NextAuth.js** integration with custom providers
- **JWT-based** session management
- **Role-based** user authentication

### Authorization Middleware
- **Route protection** based on user roles
- **GraphQL-powered** page permissions
- **Automatic redirects** to 401 for unauthorized access

### Navigation Component
- **Dynamic navigation** based on user roles
- **Server-side rendering** for better performance
- **Login/Logout** state management

## Development Workflows

### Connected Development
Work directly against your XM Cloud instance:

npm run start:connected


### Local Container Development
For offline development with mocked XM Cloud services:

1. **Initialize containers** (requires elevated PowerShell):
   
   ./local-containers/scripts/init.ps1 -InitEnv -LicenseXmlPath "C:\path\to\license.xml" -AdminPassword "YourAdminPassword"
   

2. **Start containers**:
   
   ./local-containers/scripts/up.ps1
   

3. **Stop containers**:
   
   ./local-containers/scripts/down.ps1
   

## Configuration

### NextAuth.js Setup
The authentication is configured in `src/pages/api/auth/[...nextauth].ts`. Customize providers and callbacks as needed.

### Role-Based Navigation
Configure page roles in Sitecore by adding an "AllowedRoles" field to your page templates. The navigation component will automatically filter menu items based on user roles.

### Middleware Configuration
The `src/middleware.ts` file handles:
- **Route protection** based on page roles
- **User authentication** verification
- **Automatic redirects** for unauthorized access

## Available Scripts

# Development
npm run start:connected          # Start with XM Cloud connection
npm run start:production        # Start in production mode

# Build
npm run build                   # Build the application

# Utilities
npm run scaffold-component     # Create new components
npm run start:watch-components # Watch for component changes


## Environment Variables Reference

| Variable | Description | Required |
|----------|-------------|----------|
| `SITECORE_EDGE_CONTEXT_ID` | XM Cloud context identifier | Yes |
| `SITECORE_SITE_NAME` | Your Sitecore site name | Yes |
| `SITECORE_GRAPHQL_HOME_QUERY` | Path to home item in Sitecore | Yes |
| `NEXTAUTH_SECRET` | Secret for JWT signing | Yes |
| `NEXTAUTH_URL` | Your application URL | Yes |
| `JSS_EDITING_SECRET` | Secret for Sitecore editing integration | Yes |
| `DISABLE_SSG_FETCH` | Disable static generation fetching | No |

## Troubleshooting

### Common Issues

1. **GraphQL Errors**: Ensure your `SITECORE_EDGE_CONTEXT_ID` is correct and the site is deployed
2. **Authentication Issues**: Check that `NEXTAUTH_SECRET` is set and `NEXTAUTH_URL` matches your development URL
3. **Navigation Not Loading**: Verify the `SITECORE_GRAPHQL_HOME_QUERY` path exists in your Sitecore content tree
4. **Middleware Errors**: Ensure all environment variables are properly set in `.env.local`

### Debugging

Enable debug logging:
DEBUG=sitecore-jss:* npm run start:connected

## Deployment

### XM Cloud Deployment
1. Push your changes to your repository
2. XM Cloud will automatically build and deploy your application
3. Configure your site's rendering host in the XM Cloud Deploy Portal

### Custom Deployment
For other hosting platforms, build the application and deploy the `out` directory:
npm run build

## Contributing

1. Create a feature branch
2. Make your changes
3. Test thoroughly with both connected and disconnected modes
4. Submit a pull request

## Documentation

- [XM Cloud Documentation](https://doc.sitecore.com/xmc)
- [JSS Next.js Documentation](https://doc.sitecore.com/xmc/en/developers/xm-cloud/sitecore-javascript-rendering-sdk--jss--for-next-js.html)
- [NextAuth.js Documentation](https://next-auth.js.org/)

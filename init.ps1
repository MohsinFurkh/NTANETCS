# Create required directories
New-Item -ItemType Directory -Force -Path "src/app/auth/login"
New-Item -ItemType Directory -Force -Path "src/app/auth/register"
New-Item -ItemType Directory -Force -Path "src/app/practice"
New-Item -ItemType Directory -Force -Path "src/app/about"
New-Item -ItemType Directory -Force -Path "src/components"
New-Item -ItemType Directory -Force -Path "prisma"

# Install dependencies
npm install
npm install -D @types/react @types/react-dom @types/node
npm install @prisma/client bcryptjs next-auth
npm install -D prisma @types/bcryptjs
npm install react-icons

# Initialize Prisma
npx prisma init
npx prisma generate

# Create .env file if it doesn't exist
if (-not (Test-Path .env)) {
    Copy-Item .env.example .env
}

# Start development server
Write-Host "Setup complete! Run 'npm run dev' to start the development server." 
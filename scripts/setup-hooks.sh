#!/bin/bash

echo "🔧 Setting up Git hooks for claude-code-ts-hooks..."

HOOKS_DIR=".git/hooks"
SCRIPT_DIR="$( cd "$( dirname "${BASH_SOURCE[0]}" )" && pwd )"

# Check if we're in a git repository
if [ ! -d ".git" ]; then
  echo "❌ Error: Not in a git repository"
  exit 1
fi

# Create pre-commit hook
cat > "$HOOKS_DIR/pre-commit" << 'EOF'
#!/bin/sh

echo "🔍 Running pre-commit checks..."

# Run TypeScript type checking
echo "\n📝 Running TypeScript type check..."
npm run typecheck
if [ $? -ne 0 ]; then
  echo "❌ TypeScript type check failed. Commit aborted."
  exit 1
fi

# Run linting
echo "\n🎨 Running linter..."
npm run lint
if [ $? -ne 0 ]; then
  echo "❌ Linting failed. Commit aborted."
  exit 1
fi

# Run tests
echo "\n🧪 Running tests..."
npm test
if [ $? -ne 0 ]; then
  echo "❌ Tests failed. Commit aborted."
  exit 1
fi

# Run build
echo "\n🔨 Running build..."
npm run build
if [ $? -ne 0 ]; then
  echo "❌ Build failed. Commit aborted."
  exit 1
fi

# Run JSR validation (dry-run to check for slow types without publishing)
echo "\n🦕 Running JSR validation..."
npx -y jsr publish --dry-run --allow-dirty
if [ $? -ne 0 ]; then
  echo "❌ JSR validation failed. Commit aborted."
  exit 1
fi

echo "\n✅ All checks passed! Proceeding with commit."
exit 0
EOF

# Make the hook executable
chmod +x "$HOOKS_DIR/pre-commit"

echo "✅ Pre-commit hook installed successfully!"
echo ""
echo "The following checks will run before each commit:"
echo "  • TypeScript type checking"
echo "  • ESLint linting"
echo "  • Vitest tests"
echo "  • Build verification"
echo "  • JSR validation (slow types check)"
echo ""
echo "To skip these checks in an emergency, use: git commit --no-verify"
echo "(But please don't make this a habit! 🙏)"
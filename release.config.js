module.exports = {
  branches: ['main'],
  tagFormat: 'v${version}',
  plugins: [
    ['@semantic-release/commit-analyzer', { preset: 'conventionalcommits' }],
    ['@semantic-release/release-notes-generator', { 
      preset: 'conventionalcommits',
      // Add config to handle invalid timestamps gracefully
      options: {
        warn: true,
        ignoreMissing: true
      }
    }],
    ['@semantic-release/changelog', { changelogFile: 'CHANGELOG.md' }],
    // Dynamically publish to npm only when NPM_TOKEN is present
    ['@semantic-release/npm', { npmPublish: !!process.env.NPM_TOKEN }],
    ['@semantic-release/github', { assets: [] }],
    ['@semantic-release/git', {
      assets: ['CHANGELOG.md', 'package.json', 'package-lock.json', 'npm-shrinkwrap.json'],
      message: 'chore(release): ${nextRelease.version} [skip ci]\n\n${nextRelease.notes}'
    }],
    // Publish to JSR after successful release
    ['@semantic-release/exec', {
      publishCmd: 'npx jsr publish --allow-dirty'
    }]
  ]
};

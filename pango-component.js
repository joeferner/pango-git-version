const pangoGitVersion = require('.');

module.exports = {
    targets: {
        'generate-git-version-h': new pangoGitVersion.GitVersionTarget()
    }
};

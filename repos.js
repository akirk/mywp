const REPO_COLORS = [
  '#3b82f6', '#8b5cf6', '#ec4899', '#f97316', '#10b981',
  '#06b6d4', '#eab308', '#ef4444', '#6366f1', '#14b8a6',
];
const repoColorMap = {};
let repoColorIndex = 0;

function getRepoColor(slug) {
  if (!repoColorMap[slug]) {
    repoColorMap[slug] = REPO_COLORS[repoColorIndex % REPO_COLORS.length];
    repoColorIndex++;
  }
  return repoColorMap[slug];
}

function repoAbbrev(repoName) {
  const parts = repoName.split('-');
  if (parts.length >= 2) return (parts[0][0] + parts[1][0]).toUpperCase();
  return repoName.slice(0, 2).toUpperCase();
}

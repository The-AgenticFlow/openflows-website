const GITHUB_REPO = 'The-AgenticFlow/OpenFlows';

export const formatStars = (count: number): string =>
  count >= 1000 ? `${(count / 1000).toFixed(1).replace(/\.0$/, '')}k` : String(count);

const fetchStars = async (): Promise<string> => {
  try {
    const response = await fetch(`https://api.github.com/repos/${GITHUB_REPO}`, {
      headers: process.env.GITHUB_TOKEN ? { Authorization: `Bearer ${process.env.GITHUB_TOKEN}` } : {},
    });
    if (!response.ok) return '';
    const data = await response.json();
    return typeof data.stargazers_count === 'number' ? formatStars(data.stargazers_count) : '';
  } catch {
    return '';
  }
};

// One request per build, shared by every page that renders the navbar.
export const buildTimeStars: Promise<string> = fetchStars();

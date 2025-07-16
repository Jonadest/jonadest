/**
 * Formats a date to a readable string
 * @param {Date|string} date - The date to format
 * @returns {string} - Formatted date string
 */
export function formatDate(date) {
  if (!date) return '';

  const d = new Date(date);
  return d.toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });
}

/**
 * Formats a date to a relative time string
 * @param {Date|string} date - The date to format
 * @returns {string} - Relative time string
 */
export function formatRelativeTime(date) {
  if (!date) return '';

  const now = new Date();
  const d = new Date(date);
  const diffInSeconds = Math.floor((now - d) / 1000);

  const intervals = {
    year: 31536000,
    month: 2592000,
    week: 604800,
    day: 86400,
    hour: 3600,
    minute: 60,
  };

  for (const [unit, seconds] of Object.entries(intervals)) {
    const interval = Math.floor(diffInSeconds / seconds);
    if (interval >= 1) {
      return interval === 1
        ? `${interval} ${unit} ago`
        : `${interval} ${unit}s ago`;
    }
  }

  return 'Just now';
}

export default {
  formatDate,
  formatRelativeTime,
};

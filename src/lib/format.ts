export const formatTimestamp = (timestamp: string) => {
  const date = new Date(timestamp);
  const month = date.toLocaleString('en-US', { month: 'short' }).toLowerCase();
  const day = date.getDate();
  const year = date.getFullYear();
  const hours = date.getHours();
  const minutes = date.getMinutes().toString().padStart(2, '0');
  const ampm = hours >= 12 ? 'pm' : 'am';
  const hour12 = hours % 12 || 12;
  return `${month} ${day} ${year} ${hour12}:${minutes}${ampm}`;
};

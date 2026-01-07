// Add this function to get initials
function getInitials(name: string | null | undefined): string {
  if (!name || typeof name !== 'string') {
    return '?';
  }
  return name
    .split(" ")
    .map((word) => word[0])
    .join("")
    .toUpperCase()
    .slice(0, 2);
}

export { getInitials };

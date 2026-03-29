export const normalizeEntityName = (value: string) =>
  value
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/\b(prof|profa|profª|dr|dra)\.?\b/gi, " ")
    .replace(/[()]/g, " ")
    .replace(/\s+/g, " ")
    .trim()
    .toLowerCase();

export const buildShortBio = (value: string) => {
  const clean = value.trim();
  const firstSentence = clean.match(/^.*?[.!?](\s|$)/)?.[0]?.trim();
  return firstSentence && firstSentence.length >= 24 ? firstSentence : clean;
};

export const matchesAuthorName = (
  personName: string,
  authors: string[],
): boolean => {
  const normalizedPerson = normalizeEntityName(personName);

  return authors.some((author) => {
    const normalizedAuthor = normalizeEntityName(author);
    return (
      normalizedAuthor.includes(normalizedPerson) ||
      normalizedPerson.includes(normalizedAuthor)
    );
  });
};

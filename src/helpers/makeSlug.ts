
export const makeSlug = (name: string, timestamp: number | null = null) => {
  const slug = name
      .trim()
      .toLowerCase()
      .replace(/ /g, '-')
      .replace(/[^\w-]+/g, '')
      .replace(/(\-)\1+/gi, (str, match) => {
          return match[0];
      });

  return timestamp ? `${slug}-${timestamp}` : slug;
};
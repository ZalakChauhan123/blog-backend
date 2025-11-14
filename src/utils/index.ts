
// Generate random User name (e.g. username-abc123)
export const genUsername = (): string => {

    // create fixed string
    const userNamePrefix = "user-";
    // create random string
    const randomChars = Math.random().toString(36).slice(2);
    // Add 2 terms togather
    const userName = userNamePrefix + randomChars

    return userName;
} 


// Generate random slug from Username (e.g. my-title-abc123)
export const genSlug = (title: String) => {

    const slug = title
        .toLocaleLowerCase()
        // Removes leading and trailing whitespace (" hi " → "hi")
        .trim()
        // remove anything that's not a-z, 0-9, space or hyphen
        .replace(/[^a-z0-9\s-]/g, '') 
        // replace spaces (one or more) with a single hyphen
        .replace(/\s+/g, '-')
        // collapse multiple hyphens ("a--b" → "a-b")
        .replace(/-+/g, '-')

        // Generate random suffix
        /**
         * Math.random() produces a number like 0.839372346.
           .toString(36) converts it into a base-36 string that uses 0-9 and a-z, e.g. "0.qn7wpc4".
           .slice(8) takes the substring starting at index 8 to the end.
         */
        const randomChars = Math.random().toString(36).slice(8);

    // URL-encode the slug
    const slugUri = encodeURIComponent(slug);

    // Build final slug & return
    const uniqueSlug = `${ slugUri }-${ randomChars }`;

    return uniqueSlug


}
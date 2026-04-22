# Personal Site — CLAUDE.md

## Changelog rule (MANDATORY)

After completing every user request, append the user's exact prompt as a new string entry at the **end** of the array in `content/changelog.json`. The list is displayed newest-first via `flex-direction: column-reverse`, so always append to the end of the JSON array.

`content/changelog.json` is a JSON array of strings. Each string is one prompt, exactly as the user typed it (preserve casing, typos, punctuation, line breaks).

Do this for every single user message without exception — even one-word replies, even reverts, even "no I didn't want that". The changelog is a complete verbatim record of every word the user has spoken that shaped this site.

Do not ask the user if they want it added. Do not skip it. Just do it silently as the final step of every response.

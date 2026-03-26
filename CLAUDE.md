# Personal Site — CLAUDE.md

## Changelog rule (MANDATORY)

After completing every user request, append the user's exact prompt as a new `<li>` entry at the **bottom** of the changelog list in `index.html`. The list is displayed in reverse (newest on top) via CSS, so always append to the bottom in the HTML.

The entry format is:
```html
<li class="changelog-entry"><p>Exact prompt text here.</p></li>
```

The list lives inside `<ol class="changelog-list" id="changelogContent">` in the `#changelog` article section.

Do this for every single user message without exception — even one-word replies, even reverts, even "no I didn't want that". The changelog is a complete verbatim record of every word the user has spoken that shaped this site.

Do not ask the user if they want it added. Do not skip it. Just do it silently as the final step of every response.

- Ability to tag notes
- Search by tag (simple "contains")
- Do not save on every keystroke, just every 0.5 sec
- Ability to resize sidebar
- Proper sidebar pagination
- Hotkey for switching between notes
- Ability to choose whether to search by title or content separately
- On mobile - better switch between sidebar and main editor so that they occupy the whole screen
- Auto cleanup of removed notes
- Proper error messages on the frontend
- Dictate and maybe summarize/prompt on the dictated text with LLM
- Ability to Ctrl + V an image (an cleanup of the image if it is removed from the note)
- Remember the state of the view of the note (maybe in query parameter)
- Save scroll state when switching from raw to markdown and vice versa

Markdown things:

- diagrams? mermaid/drawio and stuff, ideally - inline
- proper dots for enumerations
- anchors in the html
- clickable checklist items

More distant things to maybe design:

- offline notes?? maybe not needed
- more friendliness for mobile devices
- tabs? maybe force using search, though feels sketchy
- export as PDF
- export as raw markdown
- more complex rules for searching by title/tags/content/dates
- deduplication of note titles - maybe something similar to filesystem/note namespaces
- UI/UX
- note templates/copying with custom templating (jinja?)
- ai generation/refinement
- pin notes?
- split notes by user/namespace so that users can only view specific notes

General idea is as follows: I want to have an app that allows me to create custom notes (mostly with checklists but possibly with other stuff) that I am able to _very easily_ instantiate, tick individual checkboxes (or run some snippets of code) and then mark as done/archived. I should also be able to easily alter the checklist to keep it relevant.

Important thing is an ability to template notes with custom variables: say, create a template with a list of variables and to instantiate a note you need to fill in (either manually or automatically) all of the variables (nulls should probably be allowed but maybe having default values instead is better).

This thing will require to kinda step from markdown to markdown + jinja or something which is unfortunate.

Example of such notes would be:

- list for things to take to travel
- some kind of morning/sports routine

So in general priority TODOs are:

- Ability to create and list templates of notes and require each note to have a parent template. Templates shound not be parameterized for now - simple md will do.
- Restrict ability to create notes without templates - there should be no general "new note" button - only list of templates each of which has "new note" button.
- Restrict ability to edit (and view? maybe unecessary) raw md code of notes - only allow editing in markdown view.
- Ability to mark note as done/archived.
- Ability to list and open active notes for each template.

Parameterization:

- Ability to make templates a proper jinja template. For now I can stick with auto-filled values like "today's date" or something. When instantiating, these values should be filled.
- Proper form for filling non-autofilled parameters. Parameters should ideally be strongly typed and have proper inputs - checkbox for booleans, int input for numbers, stuff like that. Hopefully no custom objects or nesting will be needed, this seems like a road to hell.

---

List of other TODOs in a random order:

- Ability to tag notes/templates
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
- Ctrl + K similar to cursor that invokes a small llm that can generate text using prompt. Example of custom DOM in the editor: https://microsoft.github.io/monaco-editor/playground.html?source=v0.36.1#example-interacting-with-the-editor-listening-to-mouse-events
- Ability to Ctrl + V an image (and cleanup of the image if it is removed from the note)
- Remember the state of the view of the note (maybe in query parameter)
- Save scroll state when switching from raw to markdown and vice versa

Markdown things:

- diagrams? mermaid/drawio and stuff, ideally - inline
- anchors in the html
- consistent font sizes and line heights

More distant things to maybe design:

- offline notes?? maybe not needed
- more friendliness for mobile devices
- tabs? maybe force using search, though feels sketchy
- export as PDF
- more complex rules for searching by title/tags/content/dates
- deduplication of note titles - maybe something similar to filesystem/note namespaces
- UI/UX
- note templates/copying with custom templating (jinja?) - user defines template with several variables and when template is instantiated, user is queried
- ai generation/refinement
- pin notes?
- split notes by user/namespace so that users can only view specific notes

# Contributing

Usually just open a pull-request for anything and I will check it out and give feedback. 

But here are some basic recommondations for a contribution:
- Target branch should always be `develop`!
- What, Why and How. Provide the basic information to your changes. What have you changed? Why did you change it?

### Adding new coding languages
Reddit-Viewer 2.0 offers the option to select between multiple coding languages. This means that you can add basically all languages you want with a pull-request.

1. Check out the [templates.ts](src/view/_templates.ts) file or the [documentation](https://ekarbe.github.io/reddit-viewer). It provides a template for language templates and advises you how to implement certain features like pagination.

2. Copy the `templates.ts` or any other templates content into `src/view/XYZTemplates.ts` with `XYZ` being your language.

3. Add `XYZ` to [package.json](package.json) to the configuration `"redditviewer.style"` under `"enum"` and add a description to `"enumDescriptions"`.

4. You can now test if the file is loaded properly in a dev environment (F5). Just change the `redditviewer.style` option to `XYZ` and open Reddit-Viewer. If it is not working there should be an error: `Error: Cannot find module`.

5. Adjust the template to your target language.

6. Add good comments and test everything.

7. Pull-request + discussion with me.

During the ongoing process you can open a pull-request and ask me about anything :)
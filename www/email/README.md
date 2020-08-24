## Designing email

Design email using https://bootstrapemail.com/editor. 

Use mustache templates (`{{}}`) for variable sections.

Check in what you've made with a name like `email-name/template.html.mu.bs`.  
Don't forget to create a plaintext template under `email-name/template.txt.mu` and a subject line in `email-name/subject.txt.mu`.

## Deploying templates

1. Emailize the bootstrap html you wrote (flip the switch from `Preview` to `Code` on https://bootstrapemail.com/editor). You could save this as `email-name/template.html.mu` if you want, but don't check it in.
2. Go through that output and replace any `%7B%7B` with `{{`, and `%7D%7D` with `}}`.
3. JSON sting escape that file (https://www.freeformatter.com/json-escape.html). You could save that as `email-name/template.html.mu.json` if you want, but don't check it in.
4. JSON string escape `email-name/template.txt.mu`.
5. JSON string escape `email-name/subject.txt.mu`.
6. Create a file `ses-template.json` with a json object like 

```json
{
  "Template": {
    "TemplateName": < template-name >,
    "SubjectPart": < content of subject.txt.mu.json >,
    "HtmlPart": < content of template.html.mu.json >,
    "TextPart": < content of template.txt.mu.json >
  }
}
```
7. run `aws ses create-template --cli-input-json file://email-name/ses-template.json`

> SES won't allow you to have multiple templates with the same name, would recommend adding a version part to the template name rather than deleting the old template (because what if you want to roll back, think of what a pain in the ass steps 1-5 were).

Dragonstone
===========

![Dragonstone](http://images1.wikia.nocookie.net/__cb20130501013128/gameofthrones/images/thumb/f/fb/Dragonstone_%28day%29.jpg/1000px-Dragonstone_%28day%29.jpg)

### Config
Override the default settings by defining them in `config/local.js`
 - `listen`: `{host: "127.0.0.1", port: 1111}
 - `name`
 - `base_url`
 - `auth`
 - `endpoints`: list of `{"name": "…", "prefix": "…", "methods": [<Method>, …]}`
 - `custom_types`: object of `{id: <Custom type>}`

#### Method object
 - `description`
 - `verb`
 - `URI` (ex: `/users/{name}` where `name` is the name of one of the parameters)
 - `auth_required`
 - `parameters`: list of:
  - `name`
  - `description`
  - `required`
  - `type` (an `<Object>`)
  - `default` (the value the API will default to if the parameter isn't supplied)
 - `reponse`: `<Object>`
 - `responseCode`: `200` or `{"200": "description", "303": "…"}`

#### Object
Either :
 - `(optional) <Object>`
 - `{"key": <Object>, …}`
 - `[<Object>]`, `[<Object>, size_max]` or `[<Object>, size_max, size_min]`
 - `int`, `float`, `string` or `bool`
 - Custom type id

#### Custom type
Object with the following attributes:
 - `name`
 - `inline`: weither this custom type should be described in the "Custom type section" of the doc or it's description should be copied everywhere it's mentionned
 - `type`: `<Object>`

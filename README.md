Dragonstone
===========

![Dragonstone](http://images1.wikia.nocookie.net/__cb20130501013128/gameofthrones/images/thumb/f/fb/Dragonstone_%28day%29.jpg/1000px-Dragonstone_%28day%29.jpg)

### Config
Override the default settings by defining them in `config/local.js`
 - `listen`: `{host: "127.0.0.1", port: 1111}
 - `name`
 - `base_url`
 - `auth`
 - `endpoints`: list of `{"name": "…", "prefix": "…", "methods": {"<VERB> URI": <Method>, …}}` with `VERB` being an `HTTP` verb (`GET`, `POST`, …)
 - `custom_types`: `{id: <Custom type>, …}`

#### Method
Object with the following attributes:
 - `description`
 - `verb`
 - `URI` (ex: `/users/{name}` where `name` is the name of one of the parameters)
 - `auth_required`
 - `parameters`: list of:
  - `name`
  - `description`
  - `required`
  - `type`: a `<Parameter>`
  - `default`: the value the API will default to if the parameter isn't supplied
 - `reponses`: object `{<CODE>: <Object>, …}` where `<CODE>` is of the form `200`, `3xx`, `41x`, `xxx` (`<CODE>` match `[0-9x]{3}`)

#### Parameter
One of the following:
 - `int`, `float`, `string` or `bool`
 - `"value1|value2|…"`
 - `<custom type id>`


#### Object
One of the following:
 - `(optional) <Object>`
 - `{"key": <Object>, …}`
 - `[<Object>]`, `[<Object>, size_max]` or `[<Object>, size_max, size_min]`
 - `<Parameter>`

#### Custom type
Object with the following attributes:
 - `name`
 - `inline`: whether this custom type should be described in the "Custom type section" of the doc or it's `name` should be copied everywhere it's mentionned along with its `type`
 - `type`: `<Object>`

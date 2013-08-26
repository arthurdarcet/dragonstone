Dragonstone
===========

Live demo [here](http://dragonstone.darcet.fr)

### Config
Override the default settings by defining them in `config/local.js`
 - `listen`: `{host: '127.0.0.1', port: 1111}`
 - `name`
 - `base_url`
 - `auth`
 - `endpoints`: list of `{name: …, prefix: …, methods: {'<VERB> URI': <Method>, …}}` with `VERB` being an `HTTP` verb (`GET`, `POST`, …) and `URI` an API endpoint. Ex: `GET /users/{name}`
 - `custom_types`: `{id: <Custom type>, …}`: `id` can be anything as all as it does not contain any '('

#### Method
Object with the following attributes:
 - `description`
 - `auth_required`
 - `parameters`: object of the form `{<NAME>: <Parameter>, …}`
 - `reponses`: object `{<CODE>: <Object>, …}` where `<CODE>` is of the form `200`, `3xx`, `41x`, `xxx` (`<CODE>` match `[0-9x]{3}`)

#### Parameter
Object with the following attributes:
 - `description`
 - `required` (default `false`, will be changed to `true` if the parameter is in the `URI`)
 - `type`: a `<Parameter type>`
 - `testing_value`: the value used when generating the `check.{html,json}` pages
 - `default`: the value the API will default to if the parameter isn't supplied

#### Parameter type
One of the following:
 - `int`, `float`, `string` or `bool`
 - `"value1|value2|…"`
 - `<custom type id>`

#### Object
One of the following:
 - `{key: <Object>, …}`
 - `[<Object>]`, `[<Object>, size_max]` or `[<Object>, size_max, size_min]`
 - `(optional) <Parameter type>`
 - `<Parameter type> (description)`
 - `<Parameter type>`

#### Custom type
Object with the following attributes:
 - `name`
 - `inline`: whether this custom type should be described in the "Custom type section" of the doc or it's `name` should be copied everywhere it's mentionned along with its `type`
 - `type`: `<Object>` (if no `type` key is present then we fall back on the value of the `inline` key)

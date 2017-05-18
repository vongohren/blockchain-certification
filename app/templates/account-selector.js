var template = "<select name='account' id='account-selector'>{{#accounts}}<option value='{{address}}' {{#selected}}selected{{/selected}}>{{address}} -- {{balance}}</option>{{/accounts}}</select>"

export default template;

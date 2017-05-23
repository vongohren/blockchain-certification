var template = "<div id='{{address}}'><div class='name'>{{name}}</div> <div class='toBeRaised'>To be raised: {{amountToBeRaised}}</div> <div class='raised'>Raised: {{raisedAmount}} </div> <div class='date'>By: {{fundedDate}}</div><div class='contributors'>{{#contributors}}<span>{{.}}</span>{{/contributors}}</div> <div class='fundButton'> <span class='fund' data-address={{address}}>Fund</span></div></div>"

export default template;

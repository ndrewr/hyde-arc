/*
  Andrew Roy Chen Jekyll-Hyde portfolio project
  Event handling and JS-orchestrated effects
*/
console.log('lets do this');


// vanilla version of event delegation
// sauce: Ian Clark, stackoverflow.com/a/23978597/2415751
(function(document, EventTarget) {
  /* Check various vendor-prefixed versions of Element.matches */
  function matches(selector, currentNode) {
    var vendors = ["webkit", "ms", "moz"],
        count = vendors.length, vendor, i;

    for(i = 0; i < count; i++) {
      vendor = vendors[i];
      if((vendor + "MatchesSelector") in currentNode) {
        return currentNode[vendor + "MatchesSelector"](selector);
      }
    }
  }

  /* Traverse DOM from event target up to parent, searching for selector */
  function passedThrough(event, selector, stopAt) {
    var currentNode = event.target;

    while(true) {
      if(matches(selector, currentNode)) {
        return currentNode;
      }
      else if(currentNode != stopAt && currentNode != document.body) {
        currentNode = currentNode.parentNode;
      }
      else {
        return false;
      }
    }
  }

  /* Extend the EventTarget prototype to add a proxyEventListener() event */
  EventTarget.prototype.delegateEventListener = function(eName, toFind, fn) {
    this.addEventListener(eName, function(event) {
      var found = passedThrough(event, toFind, event.currentTarget);

      if(found) {
        // Execute the callback with the context set to the found element
        // jQuery goes way further, it even has it's own event object
        fn.call(found, event);
      }
    });
  };

}(window.document, window.EventTarget || window.Element));

var openCard = function(e) {
  // use event object to find 'id tag' of clicked project
  var node, tagType = e.target.tagName;
  // make sure you are getting LI tag
  if(tagType === "LI") {
    node = e.target;
  }
  else {
    node = e.target.parentNode;
  }
  var card = document.getElementById(node.dataset.tag+"-card");
  var body = document.querySelector("body");
  window.scrollTo(0, 0);


  card.setAttribute('data-state', 'open');
  body.setAttribute('data-project', 'open');

};

var closeCard = function(e) {
  var card = document.querySelector(".project[data-state='open']");

  // var project_item = document.querySelector(".project-list__item[data-state='open']");
  var body = document.querySelector("body");

  card.setAttribute('data-state', 'closed');
  body.setAttribute('data-project', 'closed');

};

// set up click of project list item to open project card
document.body.delegateEventListener("click", ".project-list__item", openCard);

// set up card close btn
document.body.delegateEventListener("click", ".card-close-btn", closeCard);

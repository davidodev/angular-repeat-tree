
//from angular
getGpxString = function (node) {
  clone = node.cloneNode(true);
  var tmp = document.createElement("div");
  tmp.appendChild(clone);
  return tmp.innerHTML;
}
//from angular
function getBlockElements(nodes) {
  var startNode = nodes[0],
      endNode = nodes[nodes.length - 1];
  if (startNode === endNode) {
    return $(startNode);
  }

  var element = startNode;
  var elements = [element];

  do {
    element = element.nextSibling;
    if (!element) break;
    elements.push(element);
  } while (element !== endNode);

  return $(elements);
}

app.directive('repeatTree', ['$parse', '$log', function($parse, $log) {
'strict';

  return {

    priority: 1000,
    transclude: 'element',
    link: repeatTreeLink

  }



  function repeatTreeLink (scope, element, attrs, ctrl, transclude) {

    var expression,
        match,
        child,
        expLeft,
        expRight,
        collection,
        elements = [],
        element,
        node,
        prevNode = firstNode = element;

    expression = attrs.repeatTree;

    match = expression.match(/^\s*([\s\S]+?)\s+in\s+([\s\S]+?)(?:\s+track\s+by\s+([\s\S]+?))?\s*$/);
    expLeft = match[1];
    expRight = match[2];
    
    scope.$watchCollection(expRight, function(collection){

      if(elements.length > 0){
        //console.log('elements: ' + elements.length);

        for (var i = 0; i < elements.length; i++) {

          // for debug
          //console.log('delete-' + i + ' = ' + $parse(elements[i].scope));

          elements[i].el.remove();
          elements[i].scope.$destroy();
        };

        elements = [];
        prevNode = firstNode;

        // for debug
      }//else {

        //repeatTreeRecursive(collection);

      //}

      repeatTreeRecursive(collection);

      function repeatTreeRecursive(obj, level = 0){
        
        var before = '';

        for(var i= 0; i < level; i++) {
          before += '-';
        }

        level++;

        //for(index = 0; index < collection.length; index++) {
        angular.forEach(obj, function(value, index){

          var child = scope.$new();
          child[expLeft] = value;

          var children = value.children;

          // for debug
          //$log.log('Child to val: ' + childVal);
          //console.log('prev: ' + getGpxString(prevNode[0]));


          transclude(child, function(clone, scope){
            prevNode.after( clone );
            prevNode = clone;

            element = new Object();
            element.scope = child;
            element.el = clone;
            elements.push(element);  

          });

          var beforeElement = angular.element('<span class="before-level-' + level + '"></span>').append(before);
          prevNode.prepend(beforeElement);
          prevNode.addClass('level-' + level);

          if(children && Object.keys(children).length > 0){
            // for debug
            //$log.log('Children count: ' + Object.keys(children).length);

            repeatTreeRecursive(children, level);
          }
           
        });

      }

    });
  }


}]);

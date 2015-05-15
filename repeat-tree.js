
app.directive('repeatTree', ['$parse', '$log', function ($parse, $log) {
  'strict';

  return {
    priority: 1000,
    transclude: 'element',
    link: repeatTreeLink
  };

  function repeatTreeLink (scope, $element, attrs, ctrl, transclude) {

    var expression,
        match,
        child,
        expLeft,
        expRight,
        collection,
        elements = [],
        element,
        node,
        prevNode = $element,
        firstNode = $element;

    expression = attrs.repeatTree;

    match = expression.match(/^\s*([\s\S]+?)\s+in\s+([\s\S]+?)(?:\s+track\s+by\s+([\s\S]+?))?\s*$/);
    expLeft = match[1];
    expRight = match[2];

    scope.$watchCollection(expRight, function (collection) {

      if (elements.length > 0) {

        // For debug
        // $log.log('elements: ' + elements.length);

        for (var i = 0; i < elements.length; i++) {

          // For debug
          // $log.log('delete-' + i + ' = ' + $parse(elements[i].scope));

          elements[i].el.remove();
          elements[i].scope.$destroy();
        }

        elements = [];
        prevNode = firstNode;
      }

      repeatTreeRecursive(collection, 0);

      function repeatTreeRecursive (obj, level) {

        var before = '',
            child,
            children,
            beforeElement;

        for (var i = 0; i < level; i++) {
          before += '-';
        }
        level++;

        angular.forEach(obj, function (value, index) {

          child = scope.$new();
          child[expLeft] = value;
          children = value.children;

          // For debug
          // $log.log('Child to val: ' + childVal);

          transclude(child, function (clone, scope) {
            prevNode.after(clone);
            prevNode = clone;

            element = {};
            element.scope = child;
            element.el = clone;
            elements.push(element);
          });

          beforeElement = angular.element('<span class="before-level-' + level + '"></span>').append(before);
          prevNode.prepend(beforeElement);
          prevNode.addClass('level-' + level);

          if (children && Object.keys(children).length > 0) {

            // For debug
            // $log.log('Children count: ' + Object.keys(children).length);

            repeatTreeRecursive(children, level);
          }
        });
      }
    });
  }

}]);

// Generated by CoffeeScript 1.10.0
(function() {
  var collectInlineStyles, collectWalker, getClass, getSelector;

  getClass = function(className) {
    return '.' + className.split(/\s/)[0];
  };

  getSelector = function(tagname, closest) {
    if ((closest != null) && closest.count > 0) {
      return closest["class"] + ' ' + tagname;
    } else if ((closest != null) && closest.count === 0) {
      return closest["class"] + ' > ' + tagname;
    } else {
      return tagname;
    }
  };

  collectWalker = (function() {
    var attrs, closest;
    attrs = [];
    closest = null;
    return function(root, closest) {
      var attr, i, len, node, ref, ref1, ref2;
      if (root.tag == null) {
        return;
      }
      if (((ref = root.attrs) != null ? ref.style : void 0) != null) {
        attr = {
          "class": (function() {
            if (root.attrs["class"]) {
              return getClass(root.attrs["class"]);
            } else {
              return getSelector(root.tag, closest);
            }
          })(),
          style: root.attrs.style
        };
        attrs.push(attr);
        root.attrs.style = false;
      }
      if (((ref1 = root.attrs) != null ? ref1["class"] : void 0) != null) {
        closest = {
          "class": getClass(root.attrs["class"]),
          count: 0
        };
      } else if (closest != null) {
        closest.count++;
      }
      if (root.content != null) {
        ref2 = root.content;
        for (i = 0, len = ref2.length; i < len; i++) {
          node = ref2[i];
          collectWalker(node, closest);
        }
      }
      return attrs;
    };
  })();

  collectInlineStyles = function(tree) {
    var attrs;
    attrs = null;
    return tree.match({
      tag: 'body'
    }, function(node) {
      attrs = collectWalker(node);
      return node;
    }).match({
      tag: 'head'
    }, function(node) {
      var attr, content, css, dcrls, i, len, tag;
      tag = 'style';
      content = ["\n"];
      for (i = 0, len = attrs.length; i < len; i++) {
        attr = attrs[i];
        dcrls = (function() {
          dcrls = attr.style.split(/;/).filter(function(dcrl) {
            return !/^[\n\s]*$/.test(dcrl);
          }).map(function(dcrl) {
            var replaced;
            replaced = dcrl.replace(/^[\n\s]*|[\n\s]*$/, '');
            return '  ' + replaced + ";\n";
          });
          return dcrls;
        })();
        css = (function() {
          var selector;
          selector = [attr["class"] + " {\n", "}\n"];
          Array.prototype.splice.apply(selector, [1, 0].concat(dcrls));
          return selector;
        })();
        content = content.concat(css);
      }
      node.content.push({
        tag: tag,
        content: content
      });
      node.content.push("\n");
      return node;
    });
  };

  module.exports = collectInlineStyles;

}).call(this);

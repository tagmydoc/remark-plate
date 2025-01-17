function _extends() {
  _extends = Object.assign ? Object.assign.bind() : function (target) {
    for (var i = 1; i < arguments.length; i++) {
      var source = arguments[i];

      for (var key in source) {
        if (Object.prototype.hasOwnProperty.call(source, key)) {
          target[key] = source[key];
        }
      }
    }

    return target;
  };
  return _extends.apply(this, arguments);
}

var defaultNodeTypes = {
  paragraph: 'p',
  block_quote: 'blockquote',
  code_block: 'code_block',
  link: 'a',
  ul_list: 'ul',
  ol_list: 'ol',
  listItem: 'li',
  heading: {
    1: 'h1',
    2: 'h2',
    3: 'h3',
    4: 'h4',
    5: 'h5',
    6: 'h6'
  },
  emphasis_mark: 'italic',
  strong_mark: 'bold',
  delete_mark: 'strikethrough',
  inline_code_mark: 'code',
  thematic_break: 'hr',
  image: 'img',
  mention: 'mention'
};

function deserialize(node, opts) {
  var _opts$nodeTypes, _opts$linkDestination, _opts$imageSourceKey, _opts$imageCaptionKey, _ref, _ref2, _node$value, _extends2, _extends3, _extends4, _extends5, _extends6;

  var types = _extends({}, defaultNodeTypes, opts === null || opts === void 0 ? void 0 : opts.nodeTypes, {
    heading: _extends({}, defaultNodeTypes.heading, opts === null || opts === void 0 ? void 0 : (_opts$nodeTypes = opts.nodeTypes) === null || _opts$nodeTypes === void 0 ? void 0 : _opts$nodeTypes.heading)
  });

  var linkDestinationKey = (_opts$linkDestination = opts === null || opts === void 0 ? void 0 : opts.linkDestinationKey) !== null && _opts$linkDestination !== void 0 ? _opts$linkDestination : 'link';
  var imageSourceKey = (_opts$imageSourceKey = opts === null || opts === void 0 ? void 0 : opts.imageSourceKey) !== null && _opts$imageSourceKey !== void 0 ? _opts$imageSourceKey : 'link';
  var imageCaptionKey = (_opts$imageCaptionKey = opts === null || opts === void 0 ? void 0 : opts.imageCaptionKey) !== null && _opts$imageCaptionKey !== void 0 ? _opts$imageCaptionKey : 'caption';
  var children = [{
    text: ''
  }];
  var nodeChildren = node.children;

  if (nodeChildren && Array.isArray(nodeChildren) && nodeChildren.length > 0) {
    children = nodeChildren.flatMap(function (c) {
      return deserialize(_extends({}, c, {
        ordered: node.ordered || false
      }), opts);
    });
  }

  switch (node.type) {
    case 'heading':
      return {
        type: types.heading[node.depth || 1],
        children: children
      };

    case 'list':
      return {
        type: node.ordered ? types.ol_list : types.ul_list,
        children: children
      };

    case 'listItem':
      return {
        type: types.listItem,
        children: children
      };

    case 'paragraph':
      return {
        type: types.paragraph,
        children: children
      };

    case 'link':
      return _ref = {
        type: types.link
      }, _ref[linkDestinationKey] = node.url, _ref.children = children, _ref;

    case 'image':
      return _ref2 = {
        type: types.image,
        children: [{
          text: ''
        }]
      }, _ref2[imageSourceKey] = node.url, _ref2[imageCaptionKey] = node.alt, _ref2;

    case 'blockquote':
      return {
        type: types.block_quote,
        children: children
      };

    case 'code':
      return {
        type: types.code_block,
        language: node.lang,
        children: [{
          text: node.value
        }]
      };

    case 'html':
      if ((_node$value = node.value) !== null && _node$value !== void 0 && _node$value.includes('<br>')) {
        var _node$value2;

        return {
          "break": true,
          type: types.paragraph,
          children: [{
            text: ((_node$value2 = node.value) === null || _node$value2 === void 0 ? void 0 : _node$value2.replace(/<br>/g, '')) || ''
          }]
        };
      }

      return {
        type: 'paragraph',
        children: [{
          text: node.value || ''
        }]
      };

    case 'emphasis':
      return _extends((_extends2 = {}, _extends2[types.emphasis_mark] = true, _extends2), forceLeafNode(children), persistLeafFormats(children));

    case 'strong':
      return _extends((_extends3 = {}, _extends3[types.strong_mark] = true, _extends3), forceLeafNode(children), persistLeafFormats(children));

    case 'delete':
      return _extends((_extends4 = {}, _extends4[types.delete_mark] = true, _extends4), forceLeafNode(children), persistLeafFormats(children));

    case 'mention':
      return _extends((_extends5 = {}, _extends5[types.mention] = true, _extends5), forceLeafNode(children), persistLeafFormats(children));

    case 'inlineCode':
      return _extends((_extends6 = {}, _extends6[types.inline_code_mark] = true, _extends6.text = node.value, _extends6), persistLeafFormats(children));

    case 'thematicBreak':
      return {
        type: types.thematic_break,
        children: [{
          text: ''
        }]
      };

    case 'break':
      return {
        text: '  \n'
      };

    case 'text':
    default:
      return {
        text: node.value || ''
      };
  }
}

var forceLeafNode = function forceLeafNode(children) {
  return {
    text: children.map(function (k) {
      return k === null || k === void 0 ? void 0 : k.text;
    }).join('')
  };
}; // This function is will take any unknown keys, and bring them up a level
// allowing leaf nodes to have many different formats at once
// for example, bold and italic on the same node


function persistLeafFormats(children) {
  return children.reduce(function (acc, node) {
    Object.keys(node).forEach(function (key) {
      if (key === 'children' || key === 'type' || key === 'text') return;
      acc[key] = node[key];
    });
    return acc;
  }, {});
}

var isLeafNode = function isLeafNode(node) {
  return typeof node.text === 'string' || typeof node.value === 'string';
};

var VOID_ELEMENTS = ['thematic_break', 'image'];
var BREAK_TAG = '\n';
function serialize(chunk, opts) {
  var _chunk$caption;

  if (opts === void 0) {
    opts = {
      nodeTypes: defaultNodeTypes
    };
  }

  var _opts = opts,
      _opts$nodeTypes = _opts.nodeTypes,
      userNodeTypes = _opts$nodeTypes === void 0 ? defaultNodeTypes : _opts$nodeTypes,
      _opts$ignoreParagraph = _opts.ignoreParagraphNewline,
      ignoreParagraphNewline = _opts$ignoreParagraph === void 0 ? false : _opts$ignoreParagraph,
      _opts$listDepth = _opts.listDepth,
      listDepth = _opts$listDepth === void 0 ? 0 : _opts$listDepth;
  var text = chunk.text || chunk.value || '';
  var type = chunk.type || '';

  var nodeTypes = _extends({}, defaultNodeTypes, userNodeTypes, {
    heading: _extends({}, defaultNodeTypes.heading, userNodeTypes.heading)
  });

  var LIST_TYPES = [nodeTypes.ul_list, nodeTypes.ol_list];
  var children = text;

  if (!isLeafNode(chunk)) {
    children = chunk.children.map(function (c) {
      var isList = !isLeafNode(c) ? LIST_TYPES.includes(c.type || '') : false;
      var selfIsList = LIST_TYPES.includes(chunk.type || ''); // Links can have the following shape
      // In which case we don't want to surround
      // with break tags
      // {
      //  type: 'paragraph',
      //  children: [
      //    { text: '' },
      //    { type: 'link', children: [{ text: foo.com }]}
      //    { text: '' }
      //  ]
      // }

      var childrenHasLink = false;

      if (!isLeafNode(chunk) && Array.isArray(chunk.children)) {
        childrenHasLink = chunk.children.some(function (f) {
          return !isLeafNode(f) && f.type === nodeTypes.link;
        });
      }

      return serialize(_extends({}, c, {
        parentType: type
      }), {
        nodeTypes: nodeTypes,
        // WOAH.
        // what we're doing here is pretty tricky, it relates to the block below where
        // we check for ignoreParagraphNewline and set type to paragraph.
        // We want to strip out empty paragraphs sometimes, but other times we don't.
        // If we're the descendant of a list, we know we don't want a bunch
        // of whitespace. If we're parallel to a link we also don't want
        // to respect neighboring paragraphs
        ignoreParagraphNewline: (ignoreParagraphNewline || isList || selfIsList || childrenHasLink) && // if we have c.break, never ignore empty paragraph new line
        !c["break"],
        // track depth of nested lists so we can add proper spacing
        listDepth: LIST_TYPES.includes(c.type || '') ? listDepth + 1 : listDepth
      });
    }).join('');
  } // This is pretty fragile code, check the long comment where we iterate over children


  if (!ignoreParagraphNewline && (text === '' || text === '\n') && chunk.parentType === nodeTypes.paragraph && type !== nodeTypes.image) {
    type = nodeTypes.paragraph;
    children = BREAK_TAG;
  }

  if (children === '' && !VOID_ELEMENTS.find(function (k) {
    return nodeTypes[k] === type;
  })) return; // Never allow decorating break tags with rich text formatting,
  // this can malform generated markdown
  // Also ensure we're only ever applying text formatting to leaf node
  // level chunks, otherwise we can end up in a situation where
  // we try applying formatting like to a node like this:
  // "Text foo bar **baz**" resulting in "**Text foo bar **baz****"
  // which is invalid markup and can mess everything up

  if (children !== BREAK_TAG && isLeafNode(chunk)) {
    if (chunk.mention) {
      children = retainWhitespaceAndFormat(children, '**');
    } else if (chunk.strikethrough && chunk.bold && chunk.italic) {
      children = retainWhitespaceAndFormat(children, '~~***');
    } else if (chunk.bold && chunk.italic) {
      children = retainWhitespaceAndFormat(children, '***');
    } else {
      if (chunk.bold) {
        children = retainWhitespaceAndFormat(children, '**');
      }

      if (chunk.italic) {
        children = retainWhitespaceAndFormat(children, '_');
      }

      if (chunk.strikethrough) {
        children = retainWhitespaceAndFormat(children, '~~');
      }

      if (chunk.code) {
        children = retainWhitespaceAndFormat(children, '`');
      }
    }
  }

  switch (type) {
    case nodeTypes.heading[1]:
      return "# " + children;

    case nodeTypes.heading[2]:
      return "## " + children;

    case nodeTypes.heading[3]:
      return "### " + children;

    case nodeTypes.heading[4]:
      return "#### " + children;

    case nodeTypes.heading[5]:
      return "##### " + children;

    case nodeTypes.heading[6]:
      return "###### " + children;

    case nodeTypes.block_quote:
      // For some reason, marked is parsing blockquotes w/ one new line
      // as contiued blockquotes, so adding two new lines ensures that doesn't
      // happen
      return "> " + children + "\n";

    case nodeTypes.code_block:
      return "```" + (chunk.language || '') + "\n" + children + "\n```\n";

    case nodeTypes.link:
      return "[" + children + "](" + (chunk.url || '') + ")";

    case nodeTypes.image:
      return "![" + ((_chunk$caption = chunk.caption) !== null && _chunk$caption !== void 0 ? _chunk$caption : '') + "](" + (chunk.url || '') + ")";

    case nodeTypes.ul_list:
    case nodeTypes.ol_list:
      return "\n" + children + "\n";

    case nodeTypes.listItem:
      var isOL = chunk && chunk.parentType === nodeTypes.ol_list;
      var treatAsLeaf = chunk.children.length === 1 && chunk.children[0].type === 'lic' && isLeafNode(chunk.children[0].children[0]);
      var spacer = '';

      for (var k = 0; listDepth > k; k++) {
        if (isOL) {
          // https://github.com/remarkjs/remark-react/issues/65
          spacer += '   ';
        } else {
          spacer += '  ';
        }
      }

      return "" + spacer + (isOL ? '1.' : '-') + " " + children + (treatAsLeaf ? '\n' : '');

    case nodeTypes.paragraph:
      return children.replaceAll('\n', '  \n') + "\n";

    case nodeTypes.thematic_break:
      return "\n---\n";

    case nodeTypes.mention:
      return "**" + children + "**";

    default:
      return children.replaceAll('\n', '  \n');
  }
} // This function handles the case of a string like this: "   foo   "
// Where it would be invalid markdown to generate this: "**   foo   **"
// We instead, want to trim the whitespace out, apply formatting, and then
// bring the whitespace back. So our returned string looks like this: "   **foo**   "

function retainWhitespaceAndFormat(string, format) {
  // we keep this for a comparison later
  var frozenString = string.trim(); // children will be mutated

  var children = frozenString; // We reverse the right side formatting, to properly handle bold/italic and strikeThrough
  // formats, so we can create ~~***FooBar***~~

  var fullFormat = "" + format + children + reverseStr(format); // This conditions accounts for no whitespace in our string
  // if we don't have any, we can return early.

  if (children.length === string.length) {
    return fullFormat;
  } // if we do have whitespace, let's add our formatting around our trimmed string
  // We reverse the right side formatting, to properly handle bold/italic and strikeThrough
  // formats, so we can create ~~***FooBar***~~


  var formattedString = format + children + reverseStr(format); // and replace the non-whitespace content of the string

  return string.replace(frozenString, formattedString);
}

var reverseStr = function reverseStr(string) {
  return string.split('').reverse().join('');
};

function plugin(opts) {
  var compiler = function compiler(node) {
    return node.children.map(function (c) {
      return deserialize(c, opts);
    });
  }; // @ts-ignore


  this.Compiler = compiler;
}

export default plugin;
export { defaultNodeTypes, deserialize, serialize };
//# sourceMappingURL=remark-plate.esm.js.map

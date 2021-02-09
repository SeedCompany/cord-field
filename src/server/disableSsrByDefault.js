"use strict";
exports.__esModule = true;
var types_1 = require("@babel/types");
// eslint-disable-next-line import/no-default-export
exports["default"] = (function (_a) {
    var types = _a.types;
    return ({
        name: 'disable-apollo-ssr-by-default',
        visitor: {
            Program: function (path, state) {
                // Reset list on new file
                state.names = [];
            },
            ImportSpecifier: function (path, state) {
                // Add name to list if it matches
                if (path.node.imported.type === 'Identifier' &&
                    path.node.imported.name === 'useQuery' &&
                    types_1.isImportDeclaration(path.parent) &&
                    path.parent.source.value === '@apollo/client') {
                    state.names.push(path.node.local.name);
                }
            },
            CallExpression: function (path, state) {
                // Continue if we are a call to useQuery function
                if (!types_1.isIdentifier(path.node.callee) ||
                    !state.names.includes(path.node.callee.name)) {
                    return;
                }
                // Find options argument or create new it
                var options = path.node.arguments[1] ||
                    types.objectExpression([]);
                // Continue if options doesn't have a ssr
                if (options.properties.some(isPropertyName('ssr'))) {
                    return;
                }
                // Add it to the options object
                options.properties.unshift(types.objectProperty(types.identifier('ssr'), types.booleanLiteral(false)));
                // Replace function call with same one with options argument added.
                path.replaceWith(types.callExpression(path.node.callee, [
                    path.node.arguments[0],
                    options,
                ]));
            }
        }
    });
});
var isPropertyName = function (name) { return function (prop) {
    return types_1.isProperty(prop) && types_1.isIdentifier(prop.key) && prop.key.name === name;
}; };

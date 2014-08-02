angular.module('keyboard', [])
.factory('keyboardNavigation', function () {
    var keyboardContextStack = [];
    var navigatables = {};
    var activeIndex = 0;

    return {
        active: null,

        register: function (scope, events) {
            var self = this;
            navigatables[scope.$id] = {
                scope: scope,
                on: function (key) {
                    return events(scope)[self.key(key)];
                }
            };
        },
        
        key: function (code) {
            return (angular.isNumber(code) ? this.keys[code] : code) || 'default';
        },

        pushContext: function (scope) {
            var i = keyboardContextStack.lastIndexOf(function(x) {
                return x.scope === scope;
            });

            if (i > -1) { 
                this.active = keyboardContextStack[activeIndex = i];
                return;
            }

            if (activeIndex < keyboardContextStack.length - 1) {
                keyboardContextStack.splice(activeIndex + 1);
            }

            this.active = navigatables[scope.$id];

            if (this.active == null) {
                throw 'No navigatable registered for scope ' + scope.$id;
            }

            keyboardContextStack.push(this.active);
            activeIndex = keyboardContextStack.length - 1;
        },

        popContext: function (scope) {
            var i = angular.isNumber(scope) ? scope : keyboardContextStack.indexOf(function(x) {
                return x.scope === scope;
            });
            
            this.active = keyboardContextStack[activeIndex = i - 1];
        },

        keys: {
            37: 'left',
            38: 'up',
            39: 'right',
            40: 'down',
            09: 'tab',
            13: 'submit',
            27: 'escape',
            33: 'pageup',
            34: 'pagedown'
        }
    };
})

.directive('uiKeyboardNavigatable', function (keyboardNavigation, $parse) {
    $(document).onAsObservable('keydown.navigation')
        .where(function (ev) {
            return keyboardNavigation.active != null
                && (!$(document.activeElement).is('input,textarea,select') || document.activeElement.popout != null)
                && keyboardNavigation.key(ev.keyCode) != null
                && keyboardNavigation.active.on(ev.keyCode) != null;
        })
        .doAction(function (ev) {
            ev.preventDefault();
            ev.stopPropagation();
        }).oneInTime(200).subscribe(function (ev) {
            var key = keyboardNavigation.key(ev.keyCode);

            keyboardNavigation.active.scope.$emit('navigate-' + key);
            keyboardNavigation.active.scope.$apply(function () {
                var on = keyboardNavigation.active.on(key);
                on(String.fromCharCode(ev.which), ev);
            });
        });

    return function (scope, element, attr) {
        var explicitElement = $parse(attr.uiKeyboardNavigatable)(scope);
        var $element = $(explicitElement || element);
        keyboardNavigation.register(scope, $parse(attr.navigateOn));

        $element.bind('focus.navigate', function (ev) {
            keyboardNavigation.pushContext(scope);

        }).bind('blur.navigate', function () {
            keyboardNavigation.popContext(scope);
        });
    };

});


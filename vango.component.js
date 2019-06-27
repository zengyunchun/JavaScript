(function ($, angular) {
    vangoComponent = setupComponentLoader(window);

    function setupComponentLoader(window) {

        var util = window.vango.utils;

        function clone(a,b) {
            return $.extend(true,{},a, b);
        }

        function ensure(obj, name, factory) {
            return obj[name] || (obj[name] = factory());
        }

        // 获取依赖实例
        function inject(fn) {
            var $inject,
                args = [];
            $inject = injectArgs(fn);
            for (var i = 0, len = $inject.length; i < len; i++) {
                var key = $inject[i];
                if (!util.isString(key)) {
                    throw new TypeError("错误的注入标记，必须为字符串，当前为: " + key)
                }
                args.push(vango.getNgService(key));
            }
            return args;
        }
        // 解析依赖
        function injectArgs(fn) {
            var $inject = [],last;
            if (util.isArray(fn)) {
                last = fn.length - 1;
                $inject = fn.slice(0, last);
            }
            return $inject;
        }

        // 调用依赖注入函数
        function invoke(fn, self) {
            var rawArgs = Array.apply(this, arguments).slice(2, arguments.length);
            var args = inject(fn);
            if (util.isArray(fn)) {
                fn = fn[fn.length - 1];
            }
            args = args.concat(rawArgs);
            return fn.apply(self, args);
        }

        // 判断是否能调用或依赖注入
        function canInvoke(fn) {
            return util.isFunction(fn) || (util.isArray(fn) && util.isFunction(fn[fn.length-1]));
        }

        var vango = ensure(window, 'vango', Object); // vango
        return ensure(vango, 'component', function () { // vango.component
            var components = {};
            return function component(name) {  // vango.component(name);
                return ensure(components, name, function () {
                    var _lowerName = name.toLocaleLowerCase(), // 小写字母名字 - checkbox
                        _pascalName = util.toPascalCase(name), // 大写字母开头名 - CheckBox
                        _camelName = util.toCamelCase(name), // 小写字母开头名字- checkBox
                        _moduleName = "vango." + _camelName, // angular的模块名 - vango.checkBox
                        _controlName = "vango" + _pascalName, // $.vangoui.controls[_controlName]下的控件 - vangoCheckBox
                        _managerName = "vangoGet" + _pascalName + "Manager", // 管理类名 - vangoGetCheckBoxManager
                        _templateCacheName = "template/" + _camelName + ".html", // 默认模板名 - "template/checkBox.html"
                        // ---------- immutable, 里面的都可以用依赖注入 -------- //
                        _method, // 渲染方法
                        _attribute, // 属性
                        _template, // 模板
                        _directive, // 指令
                        _link, // 指令中link函数
                        // ---------- immutable -------- //
                        _scope = {}, // 解析后scope
                        _options = {}, // 解析后options
                        _config = { // 组件配置
                            isWrapPanelLi: false,
                            isTransclude: true,
                            isReplace: true,
                            baseComponent: $.vangoui.core.UIComponent,
                            baseAttribute: $.vangoBaseAttributes
                        };

                    function _wrapTemplatePanelLi(html) {
                        return _config.isWrapPanelLi ? "<div class=\"panel-li\" ng-style=\"::outWraperStyle\">" + html + "</div>": html;
                    }

                    function _initComponent() {
                        var container = $.vangoui.controls, // 控件容器引用
                            attrs = _initAttribute(); // 解析属性 
                        // 这里放到全局有点low,但是没办法，以前要这么用
                        $.vangoDefaults[_pascalName] = _options = vango._getOption(attrs);
                        $.vangoScopes[_pascalName] = _scope = vango._getScope(attrs);

                        // jquery控件初始化
                        $.fn[_controlName] = function (options, scope) {
                            return $.vangoui.run.call(this, _controlName, arguments);
                        };
                        // 控件管理类
                        $.fn[_managerName] = function () {
                            return $.vangoui.run.call(this, _managerName, arguments);
                        };
                        // 构造函数初始化
                        container[_pascalName] = function (element, options, scope) {
                            container[_pascalName].base.constructor.call(this, element, options, scope);
                        };
                        // 继承并初始化控件
                        container[_pascalName].vangoExtend(_config.baseComponent, _initMethod());
                    }

                    function _defaultMethod (){ 
                        return {
                            __getType: function () {
                                return _pascalName;
                            },
                            __idPrev: function () {
                                return _pascalName;
                            },
                            _extendMethods: function () {
                                return $.vangoMethos[_pascalName];
                            }
                        };
                    }

                    function _defaultDirective() {
                        return {
                            restrict: 'E',
                            replace: _config.isReplace,
                            template: function (elem, attrs) {
                                return _initTemplate(elem, attrs);
                            },
                            transclude: _config.isTransclude,  //必须配置模板中的ng-transclude指令使用
                            scope: _scope,
                            link: function (scope, element, attrs, ctrl) {
                                _initLink.call(this, scope, element, attrs, ctrl);
                            }
                        }
                    }

                    function _parseOptions(scope, attrs) {
                        return vango._parseOption(scope, _options, attrs);
                    }

                   function _renderComponent(scope, element, options) {
                        element[_controlName](options, scope);
                   }

                   function _initAttribute() {
                       var result;
                       if (canInvoke(_attribute)) {
                           result = invoke(_attribute);
                       } else if (util.isObject(_attribute)) {
                           result = _attribute;
                       } else {
                           throw new TypeError("组件 " + name + " 的属性(attribute)必须为对象，函数或依赖数组，当前属性类型为：" + typeof _attribute);
                       }
                       result = clone(_config.baseAttribute, result);
                       return result;
                   }

                   function _initTemplate(elem, attrs) {
                       var result;
                       if (canInvoke(_template)) {
                           result = invoke(_template, this, elem, attrs);
                       } else if (util.isEmpty(_template)) {
                           result = vango.getNgService("$templateCache").get(_templateCacheName);
                       } else if (util.isString(_template)) {
                           result = _template;
                       } else {
                           throw new TypeError("组件 " + name  + " 的模板(template)必须为字符串，函数或依赖数组，当前模板类型为： " + typeof _template);
                       }
                       if (util.isEmpty(result)) throw new TypeError("组件 " + name + " 的模板(template)不能为空!");
                       return _wrapTemplatePanelLi(result);
                   }

                   function _initDirective() {
                        var result, directiveObj;
                        if (canInvoke(_directive)) {
                            result = _directive;
                        } else {
                            // 注释不能直接调用
                            //directiveObj = util.isObject(_directive) ? clone(_defaultDirective(), _directive) : _defaultDirective();
                            //result = function () {
                            //    return directiveObj;
                            //}
                            result = _defaultDirective;
                        }
                        return result;
                    }
                   function _initMethod() {
                        var result;
                        if (canInvoke(_method)) {
                            result = clone(_defaultMethod(), invoke(_method));
                        } else if (util.isObject(_method)) {
                            result = clone(_defaultMethod(), _method);
                        }
                        return result;
                   }

                   function _initLink(scope, element, attrs, ctrl) {
                       if (canInvoke(_link)) {
                           invoke(_link, this, scope, element, attrs, ctrl, _parseOptions, _renderComponent);
                       } else {
                           _renderComponent(scope, element, _parseOptions(scope, attrs));
                       }
                   }

                    // 约定： 方法里面传入的静态的类型可以立即执行，但是传入function必须放入angular中执行，这样才能依赖注入angularjs的服务
                    var moduleInstance = {
                        config: function (c) { // _config是全局的
                            if (util.isObject(c)) {
                                _config = clone(_config, c);
                            } else {
                                throw new TypeError("组件 " + name + " 的配置(config)必须为对象，当前配置类型为：" + typeof c);
                            }
                            return moduleInstance;
                        },
                        // 以下函数把传入的参数保留一份引用，但是不能随意更改这个引用，
                        // 比如_tempalte不能改成解析后的字符串，用户传函数就保留函数，
                        // 保证数据的不变性，方便以后调试和回滚，这就是immutable的思想
                        attribute: function (a) {
                            _attribute = a;
                            return moduleInstance;
                        },
                        directive: function (d) {
                            _directive = d;
                            return moduleInstance;
                        },
                        template: function (t) {
                            _template = t;
                            return moduleInstance;
                        },
                        link: function (l) {
                            _link = l;
                            return moduleInstance;
                        },
                        method: function (m) {
                            _method = m;
                            return moduleInstance;
                        },
                        run: function () { // 必须最后一个调用
                            angular.module(_moduleName, [])
                                .run(_initComponent)
                                .directive(_lowerName, _initDirective());
                        },
                    }
                    return moduleInstance;
                })
            }
        });
    }
})(jQuery, angular);

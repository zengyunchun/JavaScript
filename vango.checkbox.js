(function ($, angular) {
    vango.component("CheckBox")
        .config({
            isWrapPanelLi: true,
            baseComponent: $.vangoui.controls.Input,
            baseAttribute: $.vangoInputAttributes,
        })
        .attribute({
            vid: ["=?", null],
            text: ['@?', null],
            checked: ['@?', false],
            onClick: ['&?', null],
        })
        
        //.directive(["$vanGoControl", "$templateCache", function ($vanGoControl, $templateCache) {
        //    return {
        //        restrict: 'E',
        //        template: function (elem, attrs) {
        //            return $vanGoControl.repalceEditLabel($templateCache.get('template/checkBox.html'), attrs);
        //        },
        //        replace: true,
        //        scope: $.vangoScopes.CheckBox,
        //        link: function (scope, element, attrs, ctrl) {
        //            var options = $vanGoControl.parseOption(scope, $.vangoDefaults.CheckBox, attrs);
        //            //解决IE8 解析出来默认value='on',导致默认被选中，具体原因不详
        //            if (options.value == "on")
        //                options.value = null;
        //            element.vangoCheckBox(options, scope);
        //        }
        //    };
        //}])
        .method(function () {
            return {
                _initAngularScope: function () {
                    var p = this.options, s = this.scope;
                    this.base._initAngularScope.call(this);
                    s.wrapper = s.wrapper || {};
                    s.wrapper.ngClass = {
                        'l-disabled': !p.enabled
                    };
                    s.checkbox = s.checkbox || {};
                    s.checkbox.ngClass = {
                        'l-checkbox-checked': p.checked
                    };
                    if (p.cssClass) {
                        s.wrapper.ngClass[p.cssClass] = true;
                    }
                    s.checkText = s.checkText || {};
                    s.checkText.ngClass = {
                    };
                },
                _render: function () {
                    // CheckBox父类(input)负责渲染label部分
                    this.base._render.call(this);
                    var g = this, p = this.options;
                    // 父类label中的label控件名, 可直接使用
                    //g.labelwrapper = $(".l-text-label", g.element);
                    //g.outerWrapper = $(".l-labeltext", g.element);
                    g.hiddenInput = $("input", g.element);
                    g.wrapper = $(".l-checkbox-wrapper", g.element);
                    g.linkwrapper = $(".l-checkbox-link-wrap", g.element);
                    g.link = $(".l-checkbox", g.element);
                    g.checkBox = $(".l-checkbox-input", g.element);
                    g.text = $(".l-checkbox-text", g.element);
                },
                /*
                * 事件绑定
                */
                _bindEvents: function () {
                    this.__bindClickEvents();
                    this.__bindLabelEvents();
                    this.__bindWrapperEvents();
                },
                /*
                * g.labelwrapper事件绑定
                */
                __bindLabelEvents: function () {
                    var g = this, p = this.options;
                    if (!g.labelwrapper) return;
                    g.labelwrapper.bind("click.labelCheckBox", function (e) {
                        g.trigger('labelclick', { e: e });
                    });
                },
                /*
                * g.text && g.linkwrapper事件绑定
                */
                __bindClickEvents: function () {
                    var g = this, p = this.options;
                    var triggerClickEvent = function (e) {
                        if (!p.enabled || p.readonly) return false;
                        if (g.trigger('click', g.triggerArgs({ checked: g._getValue() }, e)) == false) return false;
                        if (g.link.hasClass("l-checkbox-checked")) {
                            g._setValue(false);
                        }
                        else {
                            g._setValue(true);
                        }
                        g.trigger("change", g.triggerArgs({ checked: g._getValue() }, e));
                    };
                    //g.linkwrapper.bind("click.linkCheckBox", triggerClickEvent).bind("keydown", 'return', function () {
                    //    g.focusNext();
                    //    return false;
                    //});
                    g.text.bind("click.textCheckBox", triggerClickEvent);
                    g.checkBox.bind("click.ck", triggerClickEvent)
                },
                /*
                * g.wrapper事件绑定
                */
                __bindWrapperEvents: function () {
                    var g = this, p = this.options;
                    g.wrapper.bind("mouseover.checkboxwrapper", function () {
                        if (p.enabled) $(this).addClass("l-over");
                    }).bind("mouseout.checkboxwrapper", function () {
                        $(this).removeClass("l-over");
                    }).bind('blur.checkboxwrapper', function () {
                        g.trigger('blur');
                    });
                },
                _setCssClass: function (value) {
                    if (this.wrapper && value) {
                        this.wrapper.addClass(value);
                    }
                },
                _setCssStyle: function (value) {
                    if (this.wrapper && value) {
                        if (this.wrapper.attr("style"))
                            this.wrapper.attr("style", this.wrapper.attr("style") + value);
                        else
                            this.wrapper.attr("style", value);
                    }
                },
                _setTextColor: function (value) {
                    var g = this;
                    if (g.text) {
                        g.text.css("color", value);
                    }
                },
                _setText: function (value) {
                    var g = this, p = this.options;
                    g.text.html(value);
                },
                _getText: function () {
                    var g = this;
                    return g.text.html();
                },
                _setValue: function (value) {
                    var g = this, p = this.options;
                    // 值为false 和 小于零的整数则取消按钮
                    if (!value || ((typeof (value) == "number") && (value <= 0))) {
                        g.hiddenInput[0].checked = false;
                        //g.scope.link.ngClass["l-checkbox-checked icon-ischecked"] = false;
                        //g.scope.link.ngClass["icon-notcheck"] = true;
                        g.link.removeClass('l-checkbox-checked');
                        //g.link.addClass('icon-notcheck');
                    } else {
                        g.hiddenInput[0].checked = true;
                        //解决datafiled赋值时的bug
                        //g.scope.link.ngClass["icon-notcheck"] = false;
                        //g.scope.link.ngClass["l-checkbox-checked icon-ischecked"] = true;
                        //g.link.removeClass('icon-notcheck');
                        g.link.addClass('l-checkbox-checked');
                    }
                },
                _setChecked: function (value) {
                    var p = this.options;
                    if (!p.enabled || p.readonly) return false;
                    this._setValue(value);
                },
                _getChecked: function () {
                    var p = this.options;
                    //  禁用状态可以获取值
                    //if (!p.enabled || p.readonly) return false;
                    return this._getValue();
                },
                _setEnabled: function (value) {
                    if (!value) {
                        this.link.attr('disabled', true);
                        //this.input.attr('disabled', true);
                        this.wrapper.addClass("l-disabled");
                    } else {
                        this.link.attr('disabled', false);
                        //this.input.attr('disabled', false);
                        this.wrapper.removeClass("l-disabled");
                    }
                },
                _getValue: function () {
                    //return this.link[0].checked;
                    return this.hiddenInput[0].checked;
                },
                /*
                * 销毁控件
                */
                destroy: function () {
                    var g = this, p = g.options;
                    g.checkBox.unbind("click.ck");
                    g.text.unbind("click.textCheckBox");
                    $.vangoui.controls.CheckBox.base.destroy.call(this);
                    $.vangoui.remove(this);
                },
            };
        })
        .run();
})(jQuery, angular);

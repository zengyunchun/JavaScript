
    Function.prototype.inherit = function (parent, overrides) {
        if (typeof parent != 'function') return this;
        //引用父类原型
        this.base = parent.prototype;
        //引用父类构造函数
        this.base.constructor = parent;
        //继承父类
        var f = function () { };
        f.prototype = parent.prototype;
        this.prototype = new f();
        this.prototype.constructor = this;
        //附加属性方法
        if (overrides) $.extend(this.prototype, overrides);
    };
    
     var oc = {};

    //------------------Animal 动物父类 -------------------//
    oc.animal = function (type) {
        // 所有子类公用的属性,方法, 不会被重写, 像protect函数
        this.type = type;

        this.breath = function () {
            return "animal breath air";
        }

        // 私有方法, 像private函数
        var privateMethod = function () {

        };
    };

    // 子类可能会重写的属性,方法, 像virtual函数
    $.extend(oc.animal.prototype, {
        // 每种动物吃法不同, 会被重写
        eat: function () {
            return "animal eat something";
        },
    });

    //-------------------Bird 鸟子类 --------------------//
    oc.bird = function (name, type) {
        // 调用父类的构造函数
        oc.bird.base.constructor.call(this, type);
        // 子类扩展的属性方法
        this.name = name;
    };

    // bird继承于animal, 重载父类的方法
    oc.bird.inherit(oc.animal, {
        // 重载父类eat
        eat: function () {
            return "bird eat fish"
        },
        // 扩展fly方法, 可以给子类重载
        fly: function () {
            return "bird fly";
        }
    });

    //-------------------swift 雨燕子类 --------------------//
    oc.swift = function (name, type, wingType) {
        oc.swift.base.constructor.call(this, type);
        // 扩展自己的属性
        this.wingColor = ["brown", "black", "white"];

        this.getWingColor = function (wingType) {
            switch (wingType) {
                case 0:
                    wingColor[0];
                case 1:
                    wingColor[1];
                case 2:
                    wingColor[2];
                default:
                    "unknown color";
            }
        };
    };

    // swift继承于bird, 并重载父类方法
    oc.swift.inherit(oc.bird, {
        // 重载父类方法
        fly: function () {
            return "swift fly";
        },
        // 扩展sing方法, 可以给子类重载
        sing: function () {
            return "swift can sing";
        }
    });

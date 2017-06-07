// 第1步
var jason = "global jason";
function jasonzeng(){
    var jason = "local jason";
    function f(){
        return jason;
    }
    // 第3步
    return f();
    // 第4步
}
// 第2步
jasonzeng();
// 第5步


// 第1步: 执行全局代码，创建全局执行上下文并压入栈
ExecuteContextStack = [
    globalContext = {
        VO : [
            global,
            jason,
            jasonzeng = {
                [[scope]] : globalContext.VO
            }
        ],
        Scope : [
            globalContext.VO
        ],
        this : globalContext.VO
    }
];

// 第2步: 执行jasonzeng函数->创建执行函数上下文并压入栈-> 上下文初始化
ExecuteContextStack = [
    jasonzengContext = {
        AO : [
            arguments = {
                length : 0
            },
            jason = undefined,
            f = function f() {}
        ],
        Scope : [
            AO , globalContext.VO
        ],
        this : undefined
    },
    globalContext = {
        VO : [
            global,
            jason,
            jasonzeng = {
                [[scope]] : globalContext.VO
            }
        ],
        Scope : [
            globalContext.VO
        ],
        this : globalContext.VO
    }
];

// 第3步: 执行 f 函数->创建 f 函数执行上下文并压入栈->上下文初始化
ExecuteContextStack = [
    fContext = {
        AO : [
            arguments = {
                length : 0
            }
        ],
        Scope : [AO, jasonzengContext.AO, globalContext.VO],
        this : undefined
    },
    jasonzengContext = {
        AO : [
            arguments = {
                length : 0
            },
            jason = undefined,
            f = function f() {}
        ],
        Scope : [
            AO , globalContext.VO
        ],
        this : undefined
    },
    globalContext = {
        VO : [
            global,
            jason,
            jasonzeng = {
                [[scope]] : globalContext.VO
            }
        ],
        Scope : [
            globalContext.VO
        ],
        this : globalContext.VO
    }
];

// 第4步: .f 函数执行完毕，f 函数上下文从执行上下文栈中弹出
ExecuteContextStack = [
    jasonzengContext,
    globalContext
];

// 第5步: jasonzeng函数执行完毕，执行上下文从执行上下文栈中弹出
ExecuteContextStack = [
    globalContext
];
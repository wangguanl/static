### 为什么使用 typescript







### 知识区

1. abstract 抽象类

2. implements

3. **declare** 

4. 断言

   - ##### 1.“尖括号” 语法
     ```javascript
      let someValue: any = "this is a string";
     let strLength: number = (<string>someValue).length;
     ```

   - ##### 2.as 语法
     ```javascript
     let someValue: any = "this is a string";
     let strLength: number = (<string>someValue).length;
     ```

   - ##### 3.忽略 undefined 和 null 类型
     ```javascript
     function myFunc(maybeString: string | undefined | null) {
         // Type 'string | null | undefined' is not assignable to type 'string'.
         // Type 'undefined' is not assignable to type 'string'. 
         const onlyString: string = maybeString; // Error
         const ignoreUndefinedAndNull: string = maybeString!; // Ok
    }
     ```

   - ##### 4.调用函数时忽略 undefined 类型
     ```javascript
     type NumGenerator = () => number;
     function myFunc(numGenerator: NumGenerator | undefined) {
         // Object is possibly 'undefined'.(2532)
         // Cannot invoke an object which is possibly 'undefined'.(2722)
         const num1 = numGenerator(); // Error
         const num2 = numGenerator!(); //OK
     }
     // 因为 ! 非空断言操作符会从编译生成的 JavaScript 代码中移除，所以在实际使用的过程中，要特别注意。比如下面这个例子：
     const a: number | undefined = undefined;
     const b: number = a!;
     console.log(b); 
     ```

   - ##### 5.确定赋值断言
     ```javascript
     let x: number;
   initialize();
   // Variable 'x' is used before being assigned.(2454)
   console.log(2 * x); // Error
   function initialize() {
   		x = 10;
   }
     ```

5. 类型守卫




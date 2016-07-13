# 这是关于makedown 语法介绍
来自[简书](http://www.jianshu.com/p/q81RER)   [更加完整的介绍](http://wowubuntu.com/markdown/)

##标题
简单的来说标题就是利用`#`号来进行标记 `#`的个数决定了标题的大小。
<br>h1 ---> \# 
<br>h2 ---> \#\#
<br>h3 ---> \#\#\#
<br>h4 ---> \#\#\#\#
<br>h5 ---> \#\#\#\#\#
<br>h6 ---> \#\#\#\#\#\#
<br>
[标题](http://ww4.sinaimg.cn/large/687afc7fjw1dzs5crii94j.jpg)

##列表
有序列表<br>
1. 苹果<br>
2. 梨子<br>
3. 香蕉<br>

>1. 苹果<br>
>2. 梨子<br>
>3. 香蕉<br>

无序列表
- 苹果<br>
- 梨子<br>
- 香蕉<br>

>\- 苹果<br>
>\- 梨子<br>
>\- 香蕉<br>

\(PS:说我为什么用这几个水果， 只是顺口而已。 符号与列表之间要留空格啊~~\)

[列表](http://ww1.sinaimg.cn/large/687afc7fjw1dzs56gavuzj.jpg)

##链接和图片
定义连接中括号
>\[1]: http://google.com/        "Google" <br>
>\[2]: http://search.yahoo.com/  "Yahoo Search" <br>
>\[a]: http://search.msn.com/    "MSN Search" <br>

使用格式 `[MSN][a]` <br>

I get 10 times more traffic from [Google] [1] than from
[Yahoo] [2] or [MSN] [a].

[1]: http://google.com/        "Google"
[2]: http://search.yahoo.com/  "Yahoo Search"
[a]: http://search.msn.com/    "MSN Search"
  
[链接和图片](http://ww3.sinaimg.cn/large/687afc7fjw1dzs5i4iw3uj.jpg)

##引用

用符号 `>` 定义引用

>一盏灯， 一片昏黄； 一简书， 一杯淡茶。 守着那一份淡定， 品读属于自己的寂寞。
> 保持淡定， 才能欣赏到最美丽的风景！ 保持淡定， 人生从此不再寂寞。

[引用](http://ww3.sinaimg.cn/large/687afc7fjw1dzs5oehlj5j.jpg)

##粗体和斜体

斜体定义方式
`*斜体*` 

粗体定义方式
`**粗体**`


[粗体和斜体](http://ww4.sinaimg.cn/large/687afc7fjw1dzs5qrr3jcj.jpg)


##表格

表格 分割 用 `|` <br>
表头与表体 分割 `-----|-----|------` <br>
对齐  左 `:---`  中 `:---:`  右 `---:` <br>

dog | bird | cat
----|------|----
foo | foo  | foo
bar | bar  | bar
baz | baz  | baz

| Tables        | Are           | Cool  |
| ------------- |:-------------:| -----:|
| col 3 is      | right-aligned | $1600 |
| col 2 is      | centered      |   $12 |
| zebra stripes | are neat      |    $1 |

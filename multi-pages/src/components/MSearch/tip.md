# 公共搜索组件

## 想要哪个搜索项，设置相应的名称，值为当前页面所需的表达式的具体字段。如: 用户模块手机号搜索，表达式中的字段为 mobile. 设置 umobile="mobile" 定义函数handleSearch() 取搜索结果query
具体搜索框加在searchItems中 组件有参考示例

```
<m-search
  @search='handleSearch'
  umobile="mobile"
/>
handleSearch(res) {
  this.searchParamsMust = res //页面接收query
},
```
  
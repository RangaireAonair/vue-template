> 引言

这是一个通用性的vue+vite的前端开发初始化模板。

## 提供了什么?

开箱即用的 `git hook`:

1. 用以对代码**pre-commit**时的代码风格样式处理、
2. **commit-message**的[规范化](https://www.conventionalcommits.org/en/v1.0.0-beta.4/)校验
3. 代码版本管理： tag、version、CHANGELOG.md

```shell
  npm run release
```

4. 打包构建完成后，自动将dist目录输出为zip包, 默认zip文件名: `packageName`+ 当前构建完成的时间信息，例如: `my-vue-app20250115194122.zip`, 也接收传入的ZipFileName

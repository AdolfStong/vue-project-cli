// eslint-disable-next-line import/no-extraneous-dependencies
/*
 * @Author: songyanan
 * @Email: songyanan@meishubao.com
 * @Date: 2020-06-12 10:30:18
 * @LastEditors: songyanan
 * @LastEditTime: 2020-06-12 10:34:30
 */
// eslint-disable-next-line import/no-extraneous-dependencies
const dayjs = require('dayjs')
const ghpages = require('gh-pages')
const chalk = require('chalk')
const { editOperation } = require('./util.js')
const { BASE_URL } = process.env

editOperation('发布')

let repo = ''
let str

switch (BASE_URL) {
  case 'ghpagesdev':
    repo = 'https://newsgitlab.meishubao.com/msb-ai/ai-app-vue-toss-dev.git'
    str = 'Dev环境'
    break
  case 'ghpagestest':
    repo = 'https://newsgitlab.meishubao.com/msb-ai/ai-app-vue-toss-test.git'
    str = '测试环境'
    break
  case 'ghpagesprod':
    repo = 'https://newsgitlab.meishubao.com/msb-ai/ai-app-vue-toss-prod.git'
    str = '预发环境'
    break
  case 'ghpageslive':
    repo = 'https://newsgitlab.meishubao.com/msb-ai/ai-app-vue-toss-live.git'
    str = '生产环境'
    break
  default:
    repo = ''
    str = ''
}

ghpages.publish(
  'dist',
  {
    dest: 'public',
    repo
  },
  (err) => {
    const date = dayjs(new Date()).format('YYYY-MM-DD HH:mm:ss')
    if (err) {
      console.error(err, date)
      return
    }
    console.log(chalk.green(`TOSS:${str}发布成功：`), repo)
    console.log(chalk.green('发布时间:', date))
  }
)

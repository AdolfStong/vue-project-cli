/*
 * @Author: YangJiyong
 * @Email: yangjiyong@meishubao.com
 * @Date: 2019-12-26 17:13:38
 * @Last Modified by: YangJiyong
 * @Last Modified time: 2020-05-19 16:26:21
 * @Description: (顶部)模块导航 map - 显示对应名称
 * 如果 `src/pages/`下的模板名称是 小骆峰 ，link改为 中线 - 连接
 * TODO: 动态设置
 */

const menuItems = [
  {
    link: 'users',
    text: '学员中心',
    isShow: true
  },
  {
    link: 'dashboard',
    text: '个人工作台',
    isShow: false
  },
  {
    link: 'login',
    text: '登录',
    isShow: false
  }
]

// 获取菜单名称 @link: 模块链接或名称
function getMenuText(link) {
  if (!link) return ''
  const menu = menuItems.filter((item) => item.link === link)
  return menu[0] ? menu[0].text : ''
}

module.exports = { getMenuText, menuItems }

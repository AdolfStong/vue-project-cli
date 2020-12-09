/*
 * @Descripttion:
 * @version: 1.0.0
 * @Author: Shentong
 * @Date: 2020-12-07 20:35:09
 * @LastEditors: Shentong
 * @LastEditTime: 2020-12-08 18:09:45
 */
const router = [
  {
    path: '/dashboard',
    name: 'dashboard',
    hidden: false,
    meta: {
      title: '个人工作台',
      icon: 'el-icon-s-home',
      module: 'dashboard',
      affix: true
    }
  },
  {
    path: '/setting',
    name: 'setting',
    hidden: false,
    meta: {
      title: '设置',
      icon: 'el-icon-setting',
      module: 'setting'
    },
    children: [
      {
        path: '/userSetting',
        name: 'userSetting',
        meta: {
          title: '账号设置',
          module: 'setting',
          show: true
        }
      },
      {
        path: '/sysSetting',
        name: 'sysSetting',
        meta: {
          title: '账号设置',
          module: 'setting',
          show: true
        },
        children: [
          {
            path: '/sysSettingChild',
            name: 'sysSettingChild',
            meta: {
              title: '账号设置-1',
              module: 'setting',
              icon: 'el-icon-s-finance',
              show: true
            }
          }
        ]
      }
    ]
  },
  {
    path: '/users',
    name: 'users',
    hidden: false,
    meta: {
      title: '学员管理',
      icon: 'el-icon-user',
      module: 'users'
    },
    children: [
      {
        path: '/system',
        name: 'systemUsers',
        meta: {
          title: '系统课学员',
          module: 'users',
          show: false
        }
      },
      {
        path: '/studyRecord',
        name: 'studyRecord',
        meta: {
          title: '学习记录',
          module: 'users',
          show: true
        }
      }
    ]
  }
]

export default router

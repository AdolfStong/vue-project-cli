import { SUP_LEVEL_LIST_LOWER } from '@/utils/supList'

const enums = {
  addedWechatStatus: [
    {
      id: 1,
      text: '已加微信'
    },
    {
      id: 0,
      text: '未加微信'
    }
  ],
  addedGroupStatus: [
    {
      id: 1,
      text: '已进群'
    },
    {
      id: 0,
      text: '未进群'
    }
  ],
  followWechatStatus: [
    {
      id: 1,
      text: '已关注'
    },
    {
      id: 0,
      text: '未关注'
    }
  ],
  loginStatus: [
    {
      id: 0,
      text: '否'
    },
    {
      id: 1,
      text: '是'
    }
  ],
  joinCourseStatus: [
    {
      id: 1,
      text: '已参课'
    },
    {
      id: 0,
      text: '未参课'
    }
  ],
  completeCourseStatus: [
    {
      id: 1,
      text: '已完课'
    },
    {
      id: 0,
      text: '未完课'
    }
  ],
  courseTaskStatus: [
    {
      id: 1,
      text: '已上传作品'
    },
    {
      id: -1,
      text: '未上传作品'
    }
  ],
  // conversion_type 0 未转化 1 月课 2半年课 3 年课
  conversionStatus: [
    {
      id: 2,
      text: '已购半年课'
    },
    {
      id: 3,
      text: '已购年课'
    },
    {
      id: 0,
      text: '未转化'
    }
  ],
  conversionType: {
    0: '未转化',
    1: '已购月课',
    2: '已购半年课',
    3: '已购年课'
  },

  /**
   * 退费状态
   * 1: '已退费',
    2: '申请退费',
    3: '退费中'
   */
  refundStatus: [
    {
      id: 1,
      text: '已退费'
    },
    {
      id: 2,
      text: '申请退费'
    },
    {
      id: 3,
      text: '退费中'
    },
    {
      id: 0,
      text: '未退费'
    }
  ],

  /**
   * 体验课学员意向度 {0: 默认 1: 低 2: 中 3: 高}
   */
  intentionList: [
    {
      id: 0,
      text: '未添加'
    },
    {
      id: 3,
      text: '高意向'
    },
    {
      id: 2,
      text: '中意向'
    },
    {
      id: 1,
      text: '低意向'
    },
    {
      id: 4,
      text: '无意向'
    }
  ],
  // 系统课包类型
  userStatusList: [
    {
      id: 1,
      text: '年课班'
    },
    {
      id: 2,
      text: '半年课班'
    }
  ],
  // supList: [
  //   {
  //     id: 's1',
  //     text: 's1'
  //   },
  //   {
  //     id: 's2',
  //     text: 's2'
  //   },
  //   {
  //     id: 's3',
  //     text: 's3'
  //   },
  //   {
  //     id: 's4',
  //     text: 's4'
  //   },
  //   {
  //     id: 's5',
  //     text: 's5'
  //   }
  // ],
  supList: SUP_LEVEL_LIST_LOWER,
  // 转介绍学员
  user_StatusList: [
    {
      id: '2',
      text: '是'
    },
    {
      id: '1',
      text: '否'
    }
  ],
  // 是否续费
  isrenewList: [
    {
      id: '2',
      text: '已续费'
    },
    {
      id: '1',
      text: '待续费'
    }
  ]
}

function getJoinCourseList() {
  const list = []
  while (list.length <= 12) {
    list.push({
      id: list.length,
      text: list.length
    })
  }
  return list
}
function getCompleteCourseList() {
  const list = []
  while (list.length <= 12) {
    list.push({
      id: list.length,
      text: list.length
    })
  }
  return list
}

enums.joinCourseList = getJoinCourseList()
enums.completeCourseList = getCompleteCourseList()

export default enums

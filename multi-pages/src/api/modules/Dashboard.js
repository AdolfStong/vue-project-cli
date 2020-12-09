/*
 * @Descripttion: TOSS小熊
 * @version: 1.0.0
 * @Author: liukun
 * @Date: 2020-06-13 14:39:48
 * @LastEditors: liukun
 * @LastEditTime: 2020-10-30 16:03:23
 */

import { Message } from '../../../node_modules/element-ui'
import axios from '../axiosConfig'
function addZero(self) {
  if (self > 0 && self < 10) {
    return '0' + self
  }
  return self
}
export default {
  // 首周参课率
  // 月同比
  // 总参课率
  // 月同比
  // 退费率
  // 月同比
  // 4小时点评率
  // 月同比
  // 转介绍参与率(暂无)
  // leads量(暂无)
  // 签单量(暂无)
  // 签单金额(暂无)
  // 班级和学员数在待办事项接口里($emit)
  getKkz(params) {
    console.warn('我来查开课中指标', params)
    return axios.post('/graphql/v1/toss', {
      query: `{
            SalesSystemWorkStationStatistics(query: ${JSON.stringify(
              JSON.stringify(params)
            )}){
                first_week_join_course_rate 
                pre_month_first_week_join_course_rate
                all_join_course_rate
                pre_month_all_join_course_rate
                refund_rate
                pre_month_refund_rate
                comment_in_4h_rate
                pre_month_comment_in_4h_rate
                leads_count
                order_count
                order_amount
           }
      }`
    })
  },
  // 未添加微信
  // 未未加班级群
  // 物流地址未填写
  // 未绑定公众号
  // 上传作品未点评
  // 未使用优惠券
  // 待开课,开课中班级学员
  getThings(params) {
    console.warn(
      '我来查待办事项(附送未开课全部数据和已开课班级数学员数)',
      params
    )
    return axios.post('/graphql/v1/toss', {
      query: `{
            SystemWorkStation(query: ${JSON.stringify(JSON.stringify(params))}){
                unadd_wechat_count
                unadd_group_count
                no_address_count
                un_follow_count
                un_comment_count
                un_use_coupon_count
                started_team_count
                started_team_student_count
                not_start_team_count
                not_start_team_student_count
                add_wechat_rate
                add_wechat_group_rate
                express_rate
                follow_rate
                un_first_week_join_course_count
                un_current_week_join_course_count
                un_current_month_join_course_count
                user_follow_first_all_count,
                user_follow_first_todo_count,
                user_follow_old_all_count,
                user_follow_old_todo_count
           }
      }`
    })
  },
  async getBillboard(params) {
    // 参数teacher_id  取到手
    const {
      data: { TeacherDetailList }
    } = await axios.post('/graphql/v1/toss', {
      query: `{
            TeacherDetailList(query: ${JSON.stringify(
              JSON.stringify({
                group_id: [
                  9,
                  116,
                  142,
                  180,
                  181,
                  117,
                  118,
                  119,
                  165,
                  170,
                  74,
                  139,
                  179,
                  75,
                  76
                ],
                // 1级: [9]有5人
                // 2级: [116,142,180,181]有2人
                // 3级: [117, 118, 119, 165, 170, 74, 139, 179, 75, 76]有189人
                // TeacherDetailPage(totalElements,content{realname})
                status: 0
              })
            )},size: 500){id}
      }`
    })
    const teacherIds = []
    TeacherDetailList.forEach((item, index) => {
      teacherIds.unshift(item.id)
    })
    console.info(teacherIds)

    // 参数statistics_month 自己搞
    const now = new Date()
    const date = now.getFullYear() + '-' + addZero(now.getMonth() + 1)

    // 搞起来
    if (teacherIds.length > 0) {
      console.warn('参数凑齐,获取榜单数据', params)
      const query = Object.assign(
        {},
        { teacher_id: teacherIds },
        { statistics_month: date }
      )
      return axios.post('/graphql/v1/toss', {
        query: `{
              SalesSystemWorkStationStatisticsList(query: ${JSON.stringify(
                JSON.stringify(query)
              )},size:300){
                teacher_id
                teacherInfo {
                  realname
                }
                departmentInfo {
                  name
                }
                ${params}
            }
        }`
      })
    } else {
      Message({
        message: 'teacher_id 参数获取失败',
        type: 'error'
      })
    }
  },
  // 服务节点列表_东诚
  getTable(querysData, pageNum, pageSize) {
    return axios.post('/graphql/v1/toss', {
      query: `{
        UserFollowLogPage(query:${JSON.stringify(
          JSON.stringify(querysData)
        )} , page: ${pageNum}, size: ${pageSize}, sort:${JSON.stringify(
        JSON.stringify({ end_time: 'desc' })
      )}
) {
          totalElements
          content {
            userExtends {
              mobile
              username
              u_id
              status
            }
            teamInfo {
              id
              team_name
            }
            point_type
            end_time
            relative_status 
          }
        }
      }`
    })
  }
}

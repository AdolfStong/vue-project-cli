/*
 * @Descripttion:
 * @version:
 * @Author: ShenTong
 * @Date: 2020-04-11 16:06:42
 * @LastEditors: Shentong
 * @LastEditTime: 2020-12-08 16:20:45
 */
const getters = {
  sidebar: (state) => state.app.sidebar,
  popMenu: (state) => state.app.popMenu,
  visitedViews: (state) => state.tagsView.visitedViews,
  device: (state) => state.app.device,
  // token: (state) => state.user.token,
  // avatar: (state) => state.user.avatar,
  // name: (state) => state.user.name
  leftbar: (state) => state.leftbar.whackId,
  bransh: (state) => state.leftbar.bransh,
  typeStage: (state) => state.leftbar.typeStage,
  disableClick: (state) => state.leftbar.disableClick,
  team: (state) => state.team,
  teamItem: (state) => state.team.teamItem,
  tabbed: (state) => state.tabbed,
  token: (state) => '',
  avatar: (state) => 'https://msb-ai.meixiu.mobi/ai-pm/static/touxiang.png',
  name: (state) => ''
}
export default getters

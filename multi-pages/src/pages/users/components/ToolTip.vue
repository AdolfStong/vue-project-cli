<!--
 * @Descripttion: 
 * @version: 1.0.0
 * @Author: YangJiyong
 * @Date: 2020-06-19 21:20:49
 * @LastEditors: YangJiyong
 * @LastEditTime: 2020-11-02 22:33:47
-->
<template>
  <el-tooltip placement="bottom-end">
    <div slot="content">
      <h3>列表数据说明 <span>（数据更新延时1～3分钟）</span></h3>
      <p>【参课】参课指用户在APP点击某节课进入上课界面的行为（仅AI视频课）</p>
      <ol>
        <!-- <li>
          参课次数：筛选期数内，重复参加每节课的总次数
        </li> -->
        <li>
          参课节数：筛选期数内，用户参课的节数／总共放课的节数
        </li>
      </ol>
      <p>【完课】完课指用户观看完课程的学习视频的行为（仅AI视频课）</p>
      <ol>
        <!-- <li>
          完课次数：筛选期数内，重复完课的总次数
        </li> -->
        <li>
          完课节数：筛选期数内，用户完课的节数／总共放课的节数
        </li>
      </ol>
      <p>【作品】筛选期数内，用户上传的作品总数</p>
      <p>【点评】</p>
      <ol>
        <li>
          点评作品：筛选期数内，已被老师点评过的作品数
        </li>
        <li>
          已听作品：筛选期数内，用户已经听过点评的作品数
        </li>
      </ol>
    </div>
    <i class="el-icon-warning-outline"></i>
  </el-tooltip>
</template>

<style lang="scss" scoped>
h3 span {
  font-weight: normal;
  font-size: 12px;
}
</style>

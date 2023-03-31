<template>
  <div v-if="JSON.stringify(questionList) !== '{}'">
    <div class="row" style="height: 20px">
      <div class="col-lg-12" style="background-color: #303133">
        <div style="color: #F2F6FC; font-size: 1.5em;margin-top: 5px; text-align: center;">
          {{ title }}
        </div>
      </div>
    </div>
<!--    <template v-if="canAnswer">-->
      <div>
        <hr/>
        <div class="row" style="height: 10px">
          <div class="col-lg-12" style="">
            <div style="color: darkred; font-size: 0.5em;float: left;margin-left: 10px">
              <!--            ⚠️注意：（1）到达截止时间后，试卷将不可提交，请及时保存；（2）提交试卷后，试卷将不可修改，请谨慎提交。-->
              ⚠️注意：（1）到达截止时间后，试卷将自动提交，请及时保存。
            </div>
          </div>
        </div>
      </div>
<!--    </template>-->
<!--    <template v-if="canAnswer">-->
      <hr/>
      <div class="row" style="height: 20px">
        <div class="col-lg-12" style="">
          <div style="color: black; font-size: 1.5em;float: left; margin-left: 10px">
            距离结束:{{ countDown.day }}天{{ countDown.hr }}:{{ countDown.min }}:{{ countDown.sec }}
          </div>
        </div>
      </div>
<!--    </template>
    <template v-if="questionList.judgment.length > 0">
      <hr/>
      <div class="row" style="background-color: #99a9bf">
        <div class="col-lg-12">
          <div class="question-type">判断题</div>
        </div>
      </div>
      <template v-for="(item ,index) in questionList.judgment">
        <div class="row" :key="item.id" style="background-color: #e5e9f2">
          <div class="col-lg-12">
            <div class="question">{{ index + 1 }} 、{{ item.content }}({{ item.question_score }}分)</div>
          </div>
          <div class="col-lg-12">
            <div class="question">
              <el-radio v-model="item.answer" :disabled="!canAnswer" label="1"><span
                  v-if="item.right_answer === '1' && ((!canScore && !canAnswer && statu === 3) || canScore || (!canAnswer && statu === 3))"
                  style="color: red;">Y</span><span v-else style="color: #c2c4ce;">Y</span></el-radio>
              <el-radio v-model="item.answer" :disabled="!canAnswer" label="2"><span
                  v-if="item.right_answer === '2' && ((!canScore && !canAnswer && statu === 3) || canScore || (!canAnswer && statu === 3))"
                  style="color: red;">N</span><span v-else style="color: #c2c4ce;">N</span></el-radio>
            </div>
          </div>
          <template v-if="!canAnswer">
            <div class="col-lg-12">
              <div class="question">得分：{{ item.answer_score }}分</div>
            </div>
          </template>
        </div>
      </template>
    </template>
    <template v-if="questionList.single_choice.length > 0">
      <hr/>
      <div class="row" style="background-color: #99a9bf">
        <div class="col-lg-12">
          <div class="question-type">单选题</div>
        </div>
      </div>
      <template v-for="(item, i) in questionList.single_choice">
        <div class="row" :key="item.id" style="background-color: #e5e9f2">
          <div class="col-lg-12">
            <div class="question">{{ i + 1 }} 、{{ item.content }}({{ item.question_score }}分)</div>
          </div>
          <div class="col-lg-12" v-for="(choice, j) in item.answer_option" :key="j">
            <div class="question">
              <el-radio v-model="item.answer" :disabled="!canAnswer" :label="(j+1).toString()"><span
                  v-if="item.right_answer === (j+1).toString() && (!canScore && !canAnswer && statu === 3 || canScore || !canAnswer && statu === 3)"
                  style="color: red">{{ choice }}</span><span v-else style="color: #c2c4ce">{{ choice }}</span>
              </el-radio>
            </div>
          </div>
          <template v-if="!canAnswer">
            <div class="col-lg-12">
              <div class="question">得分：{{ item.answer_score }}分</div>
            </div>
          </template>
        </div>
      </template>
    </template>
    <template v-if="questionList.multiple_choice.length > 0">
      <hr/>
      <div class="row" style="background-color: #99a9bf">
        <div class="col-lg-12">
          <div class="question-type">多选题</div>
        </div>
      </div>
      <template v-for="(item, index) in questionList.multiple_choice">
        <div class="row" :key="item.id" style="background-color: #e5e9f2">
          <div class="col-lg-12">
            <div class="question">{{ index + 1 }} 、{{ item.content }}({{ item.question_score }}分)</div>
          </div>
          <div class="col-lg-12">
            <div class="question">
              <el-checkbox-group v-model="item.answer" :disabled="!canAnswer">
                <el-checkbox v-for="(choice, j) in item.answer_option" :label="(j+1).toString()" :key="j"><span
                    v-if="item.right_answer.includes((j+1).toString()) && (!canScore && !canAnswer && statu === 3 || canScore || !canAnswer && statu === 3)"
                    style="color: red">{{ choice }}</span><span v-else style="color: #c2c4ce">{{ choice }}</span><br/>
                </el-checkbox>
              </el-checkbox-group>
            </div>
          </div>
          <template v-if="!canAnswer">
            <div class="col-lg-12">
              <div class="question">得分：{{ item.answer_score }}分</div>
            </div>
          </template>
        </div>
      </template>
    </template>-->
    <template v-if="questionList.gap_filling.length > 0">
      <hr/>
      <div class="row" style="background-color: #99a9bf">
        <div class="col-lg-12">
          <div class="question-type">填空题</div>
        </div>
      </div>
      <template v-for="(item, index) in questionList.gap_filling">
        <div class="row" :key="item.id" style="background-color: #e5e9f2">
          <div class="col-lg-12">
            <div class="question">{{ index + 1 }}
              、{{ item.content }}({{ item.question_score }}分，{{ item.answer_words_limit }}字内)
            </div>
          </div>
          <div class="col-lg-12">
            <div class="question">
              <el-input size="large" style="width: 700px" :disabled="!canAnswer" :maxlength="item.answer_words_limit"
                        show-word-limit placeholder="请输入答案" v-model="item.answer"/>
            </div>
          </div>
          <!--<div class="col-lg-12">
            <template v-if="canScore">
              <div class="question">
                得分：
                <el-input-number v-model="item.answer_score" :min="0" :max="item.question_score"/>
                分
              </div>
            </template>
          </div>
          <template v-if="!canScore && !canAnswer && statu === 3 || canScore || !canAnswer && statu === 3">
            <div class="col-lg-12">
              <div class="question">
                正确答案：
                <el-input class="right-answer" type="textarea" style="width: 600px;" disabled
                          :maxlength="item.answer_words_limit" show-word-limit :autosize="{ minRows: 2, maxRows: 10}"
                          placeholder="正确答案" v-model="item.right_answer"/>
              </div>
              <div class="question" v-if="type === 'student'||!canScore && statu === 3">得分：{{ item.answer_score }}分
              </div>
            </div>
          </template>
          <template v-if="canScore || !canScore && !canAnswer && statu === 3">
            <div class="col-lg-12">
              <div class="question">
                <el-input type="textarea" style="width: 700px" :disabled="canScore"
                          :autosize="{ minRows: 2, maxRows: 10}" placeholder="请输入评论" v-model="item.comment"/>
              </div>
            </div>
          </template>-->
        </div>
      </template>
    </template>
    <template v-if="questionList.essay_question.length > 0">
      <hr/>
      <div class="row" style="background-color: #99a9bf">
        <div class="col-lg-12">
          <div class="question-type">问答题</div>
        </div>
      </div>
      <template v-for="(item, index) in questionList.essay_question">
        <div class="row" :key="item.id" style="background-color: #e5e9f2">
          <div class="col-lg-12">
            <div class="question">{{ index + 1 }}
              、{{ item.content }}({{ item.question_score }}分，{{ item.answer_words_limit }}字内)
            </div>
          </div>
          <div class="col-lg-12" :disabled="!canAnswer">
            <div class="question" :disabled="!canAnswer">
              <mavon-editor ref="wenda_huida" v-model="item.answer" :subfield="true" :preview="true"/>
<!--                            :editable="canAnswer" @imgAdd="$imgAdd(arguments, 'wenda_huida', index)" @imgDel="$imgDel"/>-->
            </div>
          </div>
          <!--<div class="col-lg-12">
            <template v-if="canScore">
              <div class="question">
                得分：
                <el-input-number v-model="item.answer_score" :min="0" :max="item.question_score"/>
                分
              </div>
            </template>
          </div>
          <template v-if="(!canScore && !canAnswer && statu === 3) || canScore || (!canAnswer && statu === 3)">
            <div class="col-lg-12">
              <div class="question">
                正确答案：
                <el-input class="right-answer" type="textarea" style="width: 600px" disabled
                          :maxlength="item.answer_words_limit" show-word-limit :autosize="{ minRows: 2, maxRows: 10}"
                          placeholder="正确答案" v-model="item.right_answer"/>
              </div>
              <div class="question" v-if="type === 'student'||!canScore && statu === 3">得分：{{ item.answer_score }}分
              </div>
            </div>
          </template>
          <template v-if="canScore || !canScore && !canAnswer && statu === 3" class="question">
          <template v-if="!canScore && !canAnswer && statu === 3 || canScore || !canAnswer && statu === 3">
            <div class="col-lg-12">
              <div class="question">
                教师建议：
                <el-input type="textarea" style="width: 600px" :disabled="!canAnswer && !canScore || canAnswer"
                          :autosize="{ minRows: 2, maxRows: 10}" placeholder="请输入评论" v-model="item.comment"/>
              </div>
            </div>
          </template>-->
        </div>
      </template>
    </template>
    <hr/>
    <!--<template v-if="!canScore && !canAnswer && statu === 3 || !canAnswer && statu === 3 || canScore">
      <div class="row">
        <div class="question">
          教师试卷评价：
          <el-input type="textarea" style="width: 600px" :disabled="!canScore && !canAnswer"
                    :autosize="{ minRows: 2, maxRows: 10}" placeholder="请输入试卷评价" v-model="appraise"/>
        </div>
      </div>
    </template>-->
    <template v-if="canAnswer">
      <div style="text-align: center; margin-top: 50px;">
        <el-button size="mini" type="primary" @click="save('save')">保存</el-button>
        <el-button size="mini" type="primary" @click="save_submit()">提交试卷</el-button>
      </div>
    </template>
  </div>
</template>

<script>
import $ from 'jquery'
import Conf from '../conf'
import Utils from '../utils'

export default {
  name: 'UserExamDetail',
  data() {
    return {
      id: 1,
      type: this.$route.query.type,
      title: '',
      // desc: '',
      // canScore: false,
      // canAnswer: false,
      questionList: {},
      // appraise: '',
      statu: 0,
      countDown: {
        day: 0,
        hr: 0,
        min: 0,
        sec: 0
      },
      // serverUrl: Conf.url.v1.file.upload().path
    }
  },
  methods: {
    // $imgAdd(args, refname, index) {
    //   let pos = args[0]
    //   let $file = args[1]
    //   var formdata = new FormData()
    //   formdata.append('file', $file)
    //   this.$axios({
    //     url: this.serverUrl,
    //     method: 'post',
    //     data: formdata,
    //   }).then((res) => {
    //     this.$refs[refname][index].$img2Url(pos, res.data.data.url)
    //   })
    // },
    // $imgDel() {
    // },
    detail() {
      const self = this
      $.ajax({
        url: Conf.url.v1.paper.detail(this.id).path,
        type: Conf.url.v1.paper.detail(this.id).method,
        dataType: 'json',
        xhrFields: {
          withCredentials: true
        },
        success: function (data) {
          if (Utils.apiStatusDeal(self, data)) {
            self.questionList = data.data.question_list
            // self.appraise = data.data.appraise
            // eslint-disable-next-line no-mixed-spaces-and-tabs
            self.statu = data.data.status
            self.title = data.data.title
            // self.desc = data.data.desc
            // self.canAnswer = data.data.can_answer && self.type === 'student'
            // self.canScore = data.data.can_score && self.type === 'teacher'
            // if (self.canAnswer) {
              self.countdown(data.data.end_time)
            // }
          }
        },
        error: function (xhr, errorType, error) {
          console.log('xhr:' + JSON.stringify(xhr))
          alert('Ajax request error, errorType: ' + errorType + ', error: ' + error)
        }
      })
    },
    save(operation) {
      const self = this
      $.ajax({
        url: Conf.url.v1.paper.save(this.id).path,
        type: Conf.url.v1.paper.save(this.id).method,
        data: JSON.stringify({
          new_answer_info: this.questionList,
          operation: operation,
          // eslint-disable-next-line no-mixed-spaces-and-tabs
          // appraise: this.appraise
        }),
        contentType: 'application/json; charset=utf-8',
        dataType: 'json',
        xhrFields: {
          withCredentials: true
        },
        success: function (data) {
          if (Utils.apiStatusDeal(self, data)) {
            self.$message('保存成功')
            self.detail()
          }
        },
        error: function (xhr, errorType, error) {
          console.log('xhr:' + JSON.stringify(xhr))
          alert('Ajax request error, errorType: ' + errorType + ', error: ' + error)
        }
      })
    },
    save_submit() {
      this.$confirm('此操作将永久提交，不可再修改, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        this.save('submit')
      }).catch(() => {
        this.$message({
          type: 'info',
          message: '已取消提交'
        })
      })
    },
    countdown(endTime) {
      const end = Date.parse(new Date(endTime))
      const now = Date.parse(new Date())
      const msec = end - now
      let day = 0
      let hr = 0
      let min = 0
      let sec = 0
      if (msec > 0) {
        day = parseInt(msec / 1000 / 60 / 60 / 24)
        hr = parseInt(msec / 1000 / 60 / 60 % 24)
        min = parseInt(msec / 1000 / 60 % 60)
        sec = parseInt(msec / 1000 % 60)
      } else {
        this.save('submit')
        this.canAnswer = false
        this.$alert('考试已结束', '考试通知', {
          confirmButtonText: '确定'
        })
      }
      this.countDown.day = day
      this.countDown.hr = hr > 9 ? hr : '0' + hr
      this.countDown.min = min > 9 ? min : '0' + min
      this.countDown.sec = sec > 9 ? sec : '0' + sec
      if (this.canAnswer === false) {
        return
      }
      const that = this
      clearTimeout(this._interval)
      this._interval = setTimeout(function () {
        that.countdown(endTime)
      }, 1000)
    }
  },
  mounted() {
    this.detail()
  },
  beforeDestroy() {
    clearInterval(this._interval)
  }
}
</script>

<style scoped>
.question-type {
  font-size: 25px;
  font-weight: bold;
  margin-top: 10px;
  margin-left: 100px;
  float: left;
  border-radius: 4px;
  min-height: 42px;
}

.question {
  font-size: 20px;
  font-weight: bold;
  margin-top: 10px;
  margin-left: 100px;
  float: left;
  border-radius: 4px;
  min-height: 42px;
}

.right-answer /deep/ .el-textarea__inner {
  color: red;

}
</style>

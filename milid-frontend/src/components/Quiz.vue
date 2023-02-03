
<template>
  <div class="quiz" :style="cssVars">
    <div ref="raw_root" v-html="quizContent" />
    <div class="center">
      <div style="height:20px"/>
      <button
      @click.once="validate"
      :disabled="!allQuestionsHaveAtLeastOneAnswer"
      class="validate-btn"
      :key="buttonKey"
      v-bind:class="{ validateBtnActive: allQuestionsHaveAtLeastOneAnswer }">
        Valide tes réponses
      </button>
    </div>
    <p>{{validationText}}</p>
    <div class="center">
      <button
      @click.once="reStart"
      v-if="showRetryBtn"
      :key="buttonKey"
      class="validate-btn validateBtnActive">Réessayer</button>
    </div>
  </div>
</template>


<style scoped>
  .quiz /deep/ .question
  {
    display:flex;
    flex-direction: column;
    width: 70%;
    margin: 0 auto
  }

  .center{
    display:flex;
    flex-direction: column;
    width: 50%;
    margin: 0 auto
  }

  .validate-btn{
    font-family: "inter", sans-serif;
    border: none;
    color: white;
    background-color: #aaa;
    padding: 10px 20px;
    text-align: center;
    text-decoration: none;
    display: inline-block;
    margin: 4px 2px;
    margin-top: 20px;
    margin-bottom: 10px;
    cursor: pointer;
    border-radius: 48px;
  }

  .validateBtnActive
  {
    background-color: var(--lesson-color);
  }

  .quiz /deep/ .quiz-btn
  {
    font-family: "inter", sans-serif;
    border: none;
    color: black;
    background-color: white;
    padding: 10px 20px;
    text-align: center;
    text-decoration: none;
    display: inline-block;
    margin: 4px 2px;
    cursor: pointer;
    border-radius: 24px;

    border-color: var(--lesson-color);
    border-style: solid;
    border-width: 4px;

    position: relative;
  }

  /* .quiz /deep/ .quiz-btn:hover
  {
    background-color: var(--lesson-color);
    color: white
  } */

  .quiz /deep/ .active,
  .quiz /deep/ .quiz-btn:hover
  {
    background-color: var(--lesson-color);
    color: white
  }

  .quiz /deep/ .btn-icon
  {
    width: 35px;
    display: inline-block;
    position: absolute;
    right: -15%;
    top: -2px;
  }

  .quiz /deep/ .quiz-btn-done
  {
     filter: opacity(0.5);
  }

</style>

<script lang="ts">
/* eslint-disable */
import { Component, Vue, Prop } from 'vue-property-decorator';

import { $module } from '@/services/module-service';
import { $config } from '@/services/config-service';

import { QuestionSet } from '../helpers/QuizModel';

@Component({
  components: { },
})
export default class Quiz extends Vue {
  @Prop() readonly moduleId!:string;
  @Prop() readonly lessonId!:string;

  quizContent = "";
  questionSets: any = []

  validationText = "";

  allQuestionsHaveAtLeastOneAnswer = false;

  showRetryBtn = false;

  buttonKey = 0; // allows remount of click once buttons (resets once directive)

  beforeMount(){
    this.quizContent = this.lesson.quiz;
  }

  mounted(){
    this.setupQuiz();
  }

  beforeDestroy(){
    this.cleanup();
  }

  get module() {
    return $module.getModuleWithId(this.moduleId);
  }

  get lesson(){
    return $module.getLessonForModuleAndLessonId(this.moduleId, this.lessonId);
  }

  get cssVars(){
      return {
        '--lesson-color': $config.store.config.themes[this.module.theme].primary,
      };
  }

  validate(){
    let correctAnswersCount = 0;

    for(const questionSet of this.questionSets){
      console.log(questionSet.id, questionSet.hasCorrectAnswer());
      if(questionSet.hasCorrectAnswer()){
        correctAnswersCount++;
      }
      questionSet.validate();
      questionSet.setDoneAppearance();
    }

    const plural = correctAnswersCount > 1 ? 's' : '';

    const questionCount = this.questionSets.length;

    if(correctAnswersCount == questionCount){
      // no errors
      this.validationText = "Bravo, tu as répondu correctement au Quiz!";
    }else{
      // there were errors
      this.validationText = `Tu as trouvé ${correctAnswersCount} réponse${plural} sur ${questionCount}.`
      // offer retry option
      this.showRetryBtn = true;
    }
  }

  reStart(){
    this.showRetryBtn = false;
    this.validationText = "";
    this.buttonKey++;
    this.allQuestionsHaveAtLeastOneAnswer = false;
    for(const questionSet of this.questionSets){
      questionSet.reset();
    }
  }

  computeStatus(){
    for(const questionSet of this.questionSets){
      if(!questionSet.hasAtLeastOneAnswer()){
        return false;
      }
    }
    return true;
  }

  quizAnswerHandler(e){
    // find questionSet containing button and deactivate all buttons
    const id = e.target.id;
    this.questionSets.find(questionSet => questionSet.containsId(id)).deActivateAllButtons();

    // activate target
    e.target.classList.toggle('active');
    this.allQuestionsHaveAtLeastOneAnswer = this.computeStatus();
    console.log("status", this.allQuestionsHaveAtLeastOneAnswer);
  }

  setupQuiz(){
      const rawRoot = this.$refs['raw_root'] as HTMLElement;
      const questionDivs = rawRoot.querySelectorAll('.question');

      let questionSetId = 0;
      let idCounter = 0;

      // for each collection of answers found in a div.question
      // create a question set;
      questionDivs.forEach(questionDiv => {
        const questionSet = new QuestionSet(questionSetId.toString());

        questionDiv.querySelectorAll('.quiz-btn').forEach((quizBtn ) => {
          const id = `qust_btn_id_${idCounter++}`;
          quizBtn.id = id;
          (quizBtn as HTMLElement).dataset.questionId = questionSetId.toString();
          quizBtn.addEventListener('click', this.quizAnswerHandler)
          questionSet.addAnswer(id, quizBtn);
        });

        this.questionSets.push(questionSet);
        questionSetId += 1;
      });
  }

  cleanup(){
    const rawRoot = this.$refs['raw_root'] as HTMLElement;
    const questionDivs = rawRoot.querySelectorAll('.question');

    questionDivs.forEach(questionDiv => {
      questionDiv.querySelectorAll('.quiz-btn').forEach(quizBtn => {
        quizBtn.removeEventListener('click', this.quizAnswerHandler)
      });
    });
  }

}
</script>

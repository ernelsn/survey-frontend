<template>
  <div class="py-5 px-8">
    <div v-if="loading" class="flex justify-center">Loading...</div>
    <form @submit.prevent="submitSurvey" v-else class="container mx-auto">
      <div class="grid items-center">
        <div class="hero min-h-screen">
          <div class="hero-content flex-col lg:flex-row-reverse">
            <img :src="survey.image_url" class="max-w-sm rounded-lg shadow-2xl" height="280" width="200" />
            <div>
              <h1 class="text-5xl font-bold">{{ survey.title }}</h1>
              <p class="py-6" v-html="survey.description"></p>
              <button v-if="!surveyStore.started" class="btn btn-primary" @click="start">Start</button>

              <div v-if="surveyStore.started" class="flex gap-5">
                <div>
                  <span class="countdown font-mono text-4xl">
                    {{ timeLeft.hours }}
                  </span>
                  hours
                </div>
                <div>
                  <span class="countdown font-mono text-4xl">
                    {{ timeLeft.minutes }}
                  </span>
                  minutes
                </div>
                <div>
                  <span class="countdown font-mono text-4xl">
                    {{ timeLeft.seconds }}
                  </span>
                  sec
                </div>
              </div>

            </div>
          </div>
        </div>
      </div>

      <div v-if="surveyStore.started">
        <div v-for="(question, ind) of survey.questions" :key="question.id">
          <QuestionViewer v-model="answers[question.id]" :question="question" :index="ind" />
        </div>

        <button type="submit"
          class="inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500">
          Submit
        </button>
      </div>

      <div v-if="surveyFinished" class="py-8 px-6 bg-emerald-400 text-white w-[600px] mx-auto">
        <div class="text-xl mb-3 font-semibold ">Thank you for participating in this survey.</div>
        <button @click="submitAnotherResponse" type="button"
          class="inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500">
          Submit another response
        </button>
      </div>

    </form>
  </div>
</template>

<script setup>
import { computed, ref, onMounted } from "vue";
import { useRoute } from "vue-router";
import { useSurveyStore } from "../stores/surveyStore";
import QuestionViewer from "../components/viewer/QuestionViewer.vue";

const route = useRoute();
const surveyStore = useSurveyStore();

const loading = computed(() => surveyStore.currentSurvey.loading);
const survey = computed(() => surveyStore.currentSurvey.data);

const surveyFinished = ref(false);
const answers = ref({});

surveyStore.getSurveyBySlug(route.params.slug);

let timerId = null;

const start = () => {
  surveyStore.started = true;

  let startTimeKey = 'startTime-' + route.params.slug;
  let endTimeKey = 'endTime-' + route.params.slug;
  let startTime = localStorage.getItem(startTimeKey);
  let endTime = localStorage.getItem(endTimeKey);

  if (!startTime) {
    startTime = Date.now();
    localStorage.setItem(startTimeKey, startTime);
  }

  if (!endTime) {
    let timeLimit = Number(survey.value.time_limit);
    endTime = Number(startTime) + timeLimit * 60 * 1000;
    localStorage.setItem(endTimeKey, endTime);
  }

  surveyStore.endTime = Number(endTime);

  if (!timerId) {
    timerId = setInterval(() => {
      surveyStore.now = Date.now();
      let timeLeft = Math.floor((surveyStore.endTime - surveyStore.now) / 1000);
      if (timeLeft <= 0) {
        clearInterval(timerId);
        timerId = null;
        // Handle the end of the countdown
      }
    }, 1000);
  }
};

const timeLeft = computed(() => {
  if (!surveyStore.started) {
    return { hours: '00', minutes: '00', seconds: '00' };
  }

  let timeLeft = Math.floor((surveyStore.endTime - surveyStore.now) / 1000);
  if (timeLeft <= 0) {
    return { hours: '00', minutes: '00', seconds: '00' };
  } else {
    let hours = Math.floor(timeLeft / 3600);
    let minutes = Math.floor((timeLeft % 3600) / 60);
    let seconds = timeLeft % 60;

    hours = hours < 10 ? "0" + hours : hours;
    minutes = minutes < 10 ? "0" + minutes : minutes;
    seconds = seconds < 10 ? "0" + seconds : seconds;

    return { hours, minutes, seconds };
  }
});

onMounted(() => {
  surveyStore.now = Date.now();

  if (timerId) {
    clearInterval(timerId);
  }

  timerId = setInterval(() => {
    surveyStore.now = Date.now();
  }, 1000);
});

function submitSurvey() {
  surveyStore
    .storeSurveyAnswer({
      surveyId: survey.value.id,
      answers: answers.value,
    })
    .then((response) => {
      if (response.status === 201) {
        surveyFinished.value = true;
      }
    });
}

function submitAnotherResponse() {
  answers.value = {};
  surveyFinished.value = false;
}
</script>

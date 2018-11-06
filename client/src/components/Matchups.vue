<template>
  <div class="container" id="matchups">
    <h1>
        Matchups -- Week: {{activeWeek}}
    </h1>
    <div class="row justify-content-center">
      <h5 class="col-md-4" v-if="matchups.length !== 0">Overall Record: <span>{{ overallRecord.wins }} - {{ overallRecord.losses }} - {{ overallRecord.pushes }}</span></h5>
      <h5 class="col-md-4" v-if="weekMatchups.length !== 0">Weekly Record: <span>{{ weeklyRecord.wins }} - {{ weeklyRecord.losses }} - {{ weeklyRecord.pushes }}</span></h5>
    </div>
    <div class="row justify-content-end">
      <button type="button" class="btn btn-primary" @click="syncVegasLines" style="margin-right: 10px"><i class="fa fa-sync-alt" style="margin-right: 10px"></i>Update Vegas Lines</button>
      <button type="button" class="btn btn-primary" @click="createNewWeek"><i class="fa fa-plus" style="margin-right: 10px"/>Add Week</button>
    </div>
    <div class="row week-tab">
      <ul class="nav justify-content-center">
        <li class="align-middle" style="display: flex; align-items: center;">
          <small class=" text-strong">Select Week:</small>
        </li>
        <li v-for="(weekNumber, key) in weekCount" :key="key" class="nav-item">
          <a class="nav-link" :class="{disabled: isActive(weekNumber)}" href="#" @click="selectWeek(weekNumber)">{{weekNumber}}</a>
        </li>
      </ul>
    </div>
    <br>
    <div class="row" v-if="teams">
      <div class="col-md-12 card" style="width: 18rem;">
        <div class="card-body container-fluid">
          <div class="row justify-content-md-center">
            <button type="button" class="btn btn-primary" style="margin-bottom: 10px" @click="showModal = true">
              Add Matchup
            </button>
          </div>
          <div v-if="weekMatchups.length === 0" class="card">
              <div class="card-header">
                <h4 style="margin: auto">There are no matchups for this week</h4>
              </div>
          </div>
          <ul v-for="thisMatchup in weekMatchups" v-bind:key="thisMatchup.id" style="padding-left: 0">
            <matchup :matchup="thisMatchup"></matchup>
          </ul>
        </div>
      </div>
    </div>

  <div v-if="showModal">
    <transition name="modal">
      <div class="modal-mask">
        <div class="modal-wrapper">
          <div class="modal-dialog" role="document">
            <div class="modal-content">
              <div class="modal-header">
                <h5 class="modal-title" style="width: 100%;">Add a Matchup</h5>
                <button type="button" class="close" data-dismiss="modal" aria-label="Close" @click="showModal = false">
                <span aria-hidden="true">&times;</span>
                </button>
              </div>
              <div class="modal-body container">
                <div class="row">
                  <label class="col-md-3 col-form-label" for="awayTeam">Away Team:</label>
                  <multiselect
                    id="awayTeam"
                    class="col-md-8"
                    v-model="awaySelected"
                    :options="options">
                  </multiselect>
                </div>
                <br>
                <div class="row">
                  <label class="col-md-3 col-form-label" for="homeTeam">Home Team:</label>
                  <multiselect
                    id="homeTeam"
                    class="col-md-8"
                    v-model="homeSelected"
                    :options="options">
                  </multiselect>
                </div>
                <br>
                <div class="row">
                  <label class="col-md-3 col-form-label" for="line">Spread:</label>
                  <input type="text" id="line" class="form-control col-md-8" v-model="matchupLine" placeholder="Enter home line" style="margin-left: 15px"/>
                </div>
                <br>
                <div class="row form-group">
                  <label class="col-md-3 col-form-label" for="week">Week:</label>
                  <select class="col-md-8 form-control" v-model="chosenWeekNumber" id="week" style="margin-left: 15px">
                    <option v-for="week in descendingWeekCount" :key="week">{{ week }}</option>
                  </select>
                </div>
              </div>
              <div class="modal-footer">
                <button type="button" class="btn btn-secondary" @click="showModal = false">Close</button>
                <button type="button" class="btn btn-primary" @click="selectTeams()">Save changes</button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </transition>
  </div>
  </div>
</template>
<script>
import axios from 'axios'
import Matchup from './Matchup'
import { Multiselect } from 'vue-multiselect'
import { mapState } from 'vuex'
import _ from 'lodash'

export default {
  name: 'matchups',
  components: {
    'matchup': Matchup,
    'multiselect': Multiselect
  },
  data () {
    return {
      teams: null,
      matchups: [],
      showModal: false,
      homeSelected: null,
      awaySelected: null,
      matchupLine: '',
      chosenWeekNumber: ''
    }
  },
  computed: {
    ...mapState([
      'activeWeek'
    ]),
    options () {
      return this.teams.map(team => team.name)
    },
    weekCount () {
      let weeks = []
      this.matchups.forEach(matchup => {
        if (!weeks.includes(matchup.week)) {
          weeks.push(matchup.week)
        }
      })
      return _.orderBy(weeks, Number)
    },
    descendingWeekCount () {
      return _.orderBy(this.weekCount, Number, ['desc'])
    },
    weekMatchups () {
      let filteredList = this.matchups.filter(matchup => matchup.week === this.activeWeek.toString())
      return _.orderBy(filteredList, ['date', 'time'], ['asc', 'asc'])
    },
    overallRecord () {
      let winCount = 0
      let lossCount = 0
      let pushCount = 0
      this.matchups.forEach(matchup => {
        if (matchup.score) {
          if (matchup.correctPick) {
            winCount++
          } else {
            parseFloat(matchup.score.awayTeam - matchup.score.homeTeam) === parseFloat(matchup.vegasSpread) ? pushCount++ : lossCount++
          }
        }
      })

      return {
        'wins': winCount,
        'losses': lossCount,
        'pushes': pushCount
      }
    },
    weeklyRecord () {
      let winCount = 0
      let lossCount = 0
      let pushCount = 0
      this.weekMatchups.forEach(matchup => {
        if (matchup.score) {
          if (matchup.correctPick) {
            winCount++
          } else {
            parseFloat(matchup.score.awayTeam - matchup.score.homeTeam) === parseFloat(matchup.vegasSpread) ? pushCount++ : lossCount++
          }
        }
      })

      return {
        'wins': winCount,
        'losses': lossCount,
        'pushes': pushCount
      }
    }
  },
  created () {
    this.fetchTeams()
    this.fetchMatchups()
    this.$on('deletedMatchup', (response) => {
      this.matchups = response.data['matchups']
    })
  },
  methods: {
    syncVegasLines () {
      axios({
        url: '/api/updateVegasLines',
        method: 'GET'
      })
        .then(response => {
          this.fetchMatchups()
        })
    },
    createNewWeek () {
      var latestWeek = this.weekCount[this.weekCount.length - 1]
      latestWeek++
      this.weekCount.push(latestWeek)
      this.$store.commit('setActiveWeek', latestWeek)
      axios({
        url: '/api/matchups/addAllWeeklyMatchups',
        method: 'POST',
        data: { week: latestWeek }
      })
        .then(response => {
          console.log(response)
          this.matchups = response.data['matchups']
        })
        .catch(error => {
          console.log(error)
        })
    },
    fetchTeams () {
      axios({
        url: '/api/teams',
        method: 'GET'
      })
        .then(response => {
          this.teams = response.data['teams']
        })
    },
    fetchMatchups () {
      axios({
        url: '/api/matchups',
        method: 'GET'
      })
        .then(response => {
          this.matchups = response.data['matchups']
        })
    },
    logoSrc (index) {
      return '../assets/0020919_cincinnati-bengals_300.png'
    },
    selectTeams () {
      if (this.awaySelected !== null && this.homeSelected !== null) {
        let payload = {
          awayTeam: this.teams.filter(team => team.name === this.awaySelected)[0],
          homeTeam: this.teams.filter(team => team.name === this.homeSelected)[0],
          vegasSpread: this.matchupLine <= 0 ? this.matchupLine : '+' + this.matchupLine,
          week: this.chosenWeekNumber
        }
        axios({
          url: '/api/matchups',
          method: 'POST',
          data: payload
        })
          .then(response => {
            this.matchups = response.data['matchups']
            this.homeSelected = null
            this.awaySelected = null
            this.chosenWeekNumber = ''
            this.matchupLine = ''
          })
          .catch(response => {
            console.log(response)
          })
        this.showModal = false
      }
    },
    selectWeek (weekNumber) {
      this.$store.commit('setActiveWeek', weekNumber)
    },
    isActive (weekNumber) {
      return weekNumber === this.activeWeek
    }
  }
}
</script>
<style>
.logo {
  vertical-align: middle;
}
img {
  height: 80px;
}

ul matchup {
  margin-left: 0;
  padding-left: 0;
}

.modal-mask {
  position: fixed;
  z-index: 9998;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(0, 0, 0, .5);
  display: table;
  transition: opacity .3s ease;
}

.modal-wrapper {
  display: table-cell;
  vertical-align: middle;
}

#matchups .btn-primary {
  background-color: #ff5f5f;
  border-color: #ff5f5f;
  
}

#matchups .btn-primary:hover {
  background-color: #9e253196;
  border-color: #9e253196;
}

</style>

<style src="vue-multiselect/dist/vue-multiselect.min.css"></style>
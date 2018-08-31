<template>
  <div class="container" id="matchups">
    <h1>
        Matchups -- Week: {{activeWeek}}
    </h1>
    <div class="row justify-content-end">
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
                <h5 class="modal-title">Add a Matchup</h5>
                <button type="button" class="close" data-dismiss="modal" aria-label="Close">
                <span aria-hidden="true" @click="showModal = false">&times;</span>
                </button>
              </div>
              <div class="modal-body container">
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
                  <label class="col-md-3 col-form-label" for="homeTeam">Away Team:</label>
                  <multiselect
                    id="awayTeam"
                    class="col-md-8"
                    v-model="awaySelected"
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
                    <option v-for="week in weekCount" :key="week">{{ week }}</option>
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
      activeWeek: '0',
      showModal: false,
      homeSelected: null,
      awaySelected: null,
      matchupLine: '',
      chosenWeekNumber: '',
      currentWeek: 0
    }
  },
  computed: {
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
      return weeks
    },
    weekMatchups () {
      return this.matchups.filter(matchup => matchup.week === this.activeWeek.toString())
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
    createNewWeek () {
      var latestWeek = this.weekCount[this.weekCount.length - 1]
      latestWeek++
      this.weekCount.push(latestWeek)
      this.activeWeek = latestWeek
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
      this.activeWeek = weekNumber
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
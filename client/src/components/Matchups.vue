<template>
  <div class="container" id="matchups">
    <h1>
        Matchups -- Week: 0
    </h1>
    <div class="row" v-if="teams">
      <div class="col-md-12 card" style="width: 18rem;">
        <div class="card-body container-fluid">
          <div class="row justify-content-md-center">
            <button type="button" class="btn btn-primary" style="margin-bottom: 10px" @click="showModal = true">
              Add Matchup
            </button>
          </div>
          <ul v-for="thisMatchup in matchups" v-bind:key="thisMatchup.id">
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
      matchups: null,
      showModal: false,
      homeSelected: null,
      awaySelected: null
    }
  },
  computed: {
    options () {
      return this.teams.map(team => team.name)
    }
  },
  created () {
    this.fetchTeams()
    this.fetchMatchups()
  },
  methods: {
    fetchTeams () {
      axios({
        url: 'http://localhost:3000/teams',
        method: 'GET'
      })
        .then(response => {
          this.teams = response.data['teams']
        })
    },
    fetchMatchups () {
      axios({
        url: 'http://localhost:3000/matchups',
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
          homeTeam: this.teams.filter(team => team.name === this.homeSelected)[0]
        }
        axios({
          url: 'http://localhost:3000/matchups',
          method: 'POST',
          data: payload
        })
          .then(response => {
            this.matchups = response.data['matchups']
            this.homeSelected = null
            this.awaySelected = null
          })
          .catch(response => {
            console.log(response)
          })
        this.showModal = false
      }
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

.btn-primary {
  background-color: #ff5f5f;
  border-color: #ff5f5f;
  
}

.btn-primary:hover {
  background-color: #9e253196;
  border-color: #9e253196;
}
</style>

<style src="vue-multiselect/dist/vue-multiselect.min.css"></style>
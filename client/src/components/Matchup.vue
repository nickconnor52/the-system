<template>
<div class="card">
  <div class="card-header">
    <ul id="header-override" class="nav nav-pills card-header-pills d-flex justify-content-md-center matchup-header">
        <li>
          <a @click="showMatchupModal=true" class="nav-link text-dark" href="#">View Matchup Details</a>
        </li>
        <li>
          <strong @click="showScoreModal=true" class="nav-link text-dark pointer" href="#">Update Score</strong>
        </li>
        <li>
          <i class="nav-link fas fa-sync-alt pointer align-center" @click="updateLine()" />
        </li>
        <li>
          <i class="nav-link far fa-trash-alt pointer align-center" @click="deleteMatchup()" />
        </li>
    </ul>
  </div>
  <div id="bootstrap-matchup-override" class="card-body">
    <div class="row justify-content-md-center">
      <div class="col-md-4">
        <div class="card-body logo" :class="{ 'bg-success': this.predictedWinner.name === matchup.awayTeam.name }">
        <img :src="getSrc(matchup.awayTeam['name'])" :alt="matchup.awayTeam['name']"/>
        <h4 class="text-dark">{{matchup.awayTeam['location'] }} {{matchup.awayTeam['name'] }}</h4>
        </div>
      </div>
      <div class="col-md-2 align-self-center">
        <h5 class="align-middle auto-margin">Vegas: {{ matchup.vegasSpread }}</h5>
        <h5 class="align-end auto-margin">TheSystem: {{ this.systemSpread }}</h5>
        <i v-if="matchup.score && matchup.correctPick" class="far fa-check-circle text-success" style="font-size: 2em; opacity: 0.8"></i>
        <i v-else-if="matchup.score && !matchup.correctPick" class="far fa-times-circle text-danger" style="font-size: 2em; opacity: 0.8"></i>
      </div>
      <div class="col-md-4">
        <div class="card-body logo" :class="{ 'bg-success': this.predictedWinner.name === matchup.homeTeam.name }">
        <img :src="getSrc(matchup.homeTeam['name'])" :alt="matchup.homeTeam['name']"/>
        <h4 class="text-dark">{{matchup.homeTeam['location'] }} {{ matchup.homeTeam['name'] }}</h4>
        </div>
      </div>
    </div>
    <br>
    <div v-if="matchup.score" class="row justify-content-center">
      <div class="col-md-4">
        <strong class="score">{{matchup.score.awayTeam}}</strong>
      </div>
      <div class="offset-md-2 col-md-4">
        <strong class="score">{{matchup.score.homeTeam}}</strong>
      </div>
    </div>
  </div>
 <!-- Score Modal --> 
  <div v-if="showScoreModal">
    <transition name="modal">
      <div class="modal-mask">
        <div class="modal-wrapper">
          <div class="modal-dialog" role="document">
            <div class="modal-content">
              <div class="modal-header">
                <h5 class="modal-title align-center">{{ matchup.awayTeam.name }} v {{ matchup.homeTeam.name }}</h5>
                <button type="button" class="close" data-dismiss="modal" aria-label="Close" @click="showScoreModal = false">
                <span aria-hidden="true">&times;</span>
                </button>
              </div>
              <div class="modal-body container">
                <div class="row justify-content-center">
                  <label class="col-md-3 col-form-label" for="awayScore">{{ matchup.awayTeam.name }}:</label>
                  <input type="text" id="awayScore" class="form-control col-md-4" v-model="score.awayTeam" placeholder="Away" style="margin-left: 15px"/>
                </div>
                <br>
                <div class="row justify-content-center">
                  <label class="col-md-3 col-form-label" for="homeScore">{{ matchup.homeTeam.name }}:</label>
                  <input type="text" id="homeScore" class="form-control col-md-4" v-model="score.homeTeam" placeholder="Home" style="margin-left: 15px"/>
                </div>
                <br>
              </div>
              <div class="modal-footer">
                <button type="button" class="btn btn-secondary" @click="showScoreModal = false">Close</button>
                <button type="button" class="btn btn-primary" :disabled="score.homeTeam === '' || score.awayTeam === ''" @click="updateScore()">Submit Score</button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </transition>
  </div>

  <!-- Stats Modal --> 
  <div v-if="showMatchupModal">
    <transition name="modal">
      <div class="modal-mask">
        <div class="modal-wrapper">
          <div class="modal-dialog" style="max-width: 1250px" role="document">
            <div class="modal-content">
              <div class="modal-header">
                <h5 class="modal-title align-center">{{ matchup.awayTeam.name }} v {{ matchup.homeTeam.name }}</h5>
                <button type="button" class="close" data-dismiss="modal" aria-label="Close" @click="showMatchupModal = false">
                <span aria-hidden="true">&times;</span>
                </button>
              </div>
              <div class="modal-body container">
                <table class="table table-sm">
                  <thead>
                    <tr>
                      <th scope="col">Team Name</th>
                      <th scope="col">Off LOS/Dr.</th>
                      <th scope="col">Def LOS/Dr.</th>
                      <th scope="col">Off Pts/RZA</th>
                      <th scope="col">Def Pts/RZA</th>
                      <th scope="col">Off RZA/gm</th>
                      <th scope="col">Def RZA/gm</th>
                      <th scope="col">(+/-)</th>
                      <th scope="col">Off 3rd Down %</th>
                      <th scope="col">Def 3rd Down %</th>
                      <th scope="col">Off Pass Yds/gm</th>
                      <th scope="col">Off Rush Yds/gm</th>
                      <th scope="col">Def Pass Yds/gm</th>
                      <th scope="col">Def Pass Yds/gm</th>
                      <th scope="col">Off Pts/gm</th>
                      <th scope="col">Def Pts/gm</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr v-for="team in teams" :key="team.name">
                      <th scope="row">1</th>
                      <td>test</td>
                      <td>Otto</td>
                      <td>@mdo</td>
                      <th scope="row">1</th>
                      <td>test</td>
                      <td>Otto</td>
                      <td>@mdo</td>
                      <th scope="row">1</th>
                      <td>test</td>
                      <td>Otto</td>
                      <td>@mdo</td>
                      <th scope="row">1</th>
                      <td>test</td>
                      <td>Otto</td>
                      <td>@mdo</td>
                    </tr>
                  </tbody>
                </table>
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

export default {
  name: 'matchup',
  props: [
    'matchup'
  ],
  data () {
    return {
      showScoreModal: false,
      showMatchupModal: false,
      score: {
        homeTeam: '',
        awayTeam: ''
      }
    }
  },
  computed: {
    teams () {
      return [this.matchup.awayTeam, this.matchup.homeTeam]
    },
    systemSpread () {
      let rawSpread = parseFloat(this.matchup.systemSpread).toFixed(1)
      return rawSpread > 0 ? '+' + rawSpread : rawSpread
    },
    predictedWinner () {
      let homeTeam = this.matchup.homeTeam
      let awayTeam = this.matchup.awayTeam
      if (this.matchup.systemSpread < parseFloat(this.matchup.vegasSpread)) {
        return homeTeam
      } else {
        return awayTeam
      }
    }
  },
  methods: {
    getSrc (name) {
      var images = require.context('../../static/img/logos/', false, /\.png$/)
      return images('./' + name.toLowerCase() + '.png')
      // return '../../static/img/logos/' + name + '.png'
    },
    deleteMatchup () {
      axios({
        url: '/api/matchups/' + this.matchup._id,
        method: 'DELETE'
      }).then(response => {
        this.$parent.$emit('deletedMatchup', response)
      }
      )
        .catch(error => {
          console.log(error)
        })
    },
    updateLine () {
      axios({
        url: '/api/matchups/updateLine',
        method: 'POST',
        data: this.matchup
      }).then(response => {
        this.matchup.systemSpread = response.data.systemSpread
        this.$parent.$emit('updatedMatchup', response)
      }
      ).catch(error => {
        console.log(error)
      })
    },
    updateScore () {
      this.matchup.score = JSON.parse(JSON.stringify(this.score))
      axios({
        url: '/api/matchups/updateScore',
        method: 'POST',
        data: this.matchup
      }).then(response => {
        this.showScoreModal = false
        this.matchup.score.homeTeam = response.data.score.homeTeam
        this.matchup.score.awayTeam = response.data.score.awayTeam
        this.matchup.correctPick = response.data.correctPick
        this.score.homeTeam = ''
        this.score.awayTeam = ''
      }).catch(response => {
        console.log(response)
      })
    }
  }
}
</script>

<style>
.align-center {
  height: 100%;
  display: flex; 
  align-items: center;  /*Aligns vertically center */
  justify-content: center; /*Aligns horizontally center */
}

#bootstrap-matchup-override .bg-success {
  background-color: rgba(0, 166, 105, .3) !important;
}

.card {
  margin-bottom: 3em;
}

#header-override li i.nav-link {
  margin-bottom: auto;
  margin-top: auto;
}
 
#header-override ul {
  display: grid !important;
  grid-column-gap: 5px;
  justify-items: center;
}

li:nth-child(2) { margin-left: auto; }

.score {
  font-size: 1.5em
}

</style>



<template>
  <div class="container" id="matchups">
    <h1>
        Matchups
    </h1>
    <div class="row" v-if="teams">
      <div class="col-md-12 card" style="width: 18rem;">
        <div class="card-body">
          <p class="card-text">This is where we will display the head to head matchups</p>
          <ul v-for="thisMatchup in matchups" v-bind:key="thisMatchup.id">
            <matchup :matchup="thisMatchup"></matchup>
          </ul>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
import axios from 'axios'
import Matchup from './Matchup'

export default {
  name: 'matchups',
  components: {
    'matchup': Matchup
  },
  data () {
    return {
      teams: null,
      matchups: null
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
    }
  }
}
</script>
<style>
.logo {
  vertical-align: middle;
  border: solid black;
}
img {
  height: 80px;
}
</style>
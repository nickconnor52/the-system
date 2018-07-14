<template>
  <div class="container" id="matchups">
    <h1>
        Matchups
    </h1>
    <div class="row" v-if="teams">
      <div class="col-md-12 card" style="width: 18rem;">
        <div class="card-body">
          <p class="card-text">This is where we will display the head to head matchups</p>
          <div class="row">
            <div class="offset-md-2 col-md-4">
              <div class="card-body logo">
                <img src="../assets/0020919_cincinnati-bengals_300.png" alt="bengals"/>
                <h4 class="text-dark">{{ teams[1]['name']}}</h4>
              </div>
            </div>
            <div class="col-md-4">
              <div class="card-body logo">
                <img src="../assets/0020920_dallas-cowboys_300.png" alt="bengals"/>
                <h4 class="text-dark">{{ teams[0]['name'] }}</h4>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
import axios from 'axios'

export default {
  name: 'matchups',
  data () {
    return {
      teams: null
    }
  },
  created () {
    this.fetchTeams()
  },
  methods: {
    fetchTeams () {
      axios({
        url: 'http://localhost:8081/teams',
        method: 'GET'
      })
        .then(response => {
          this.teams = response.data['teams']
        })
    },
    logoSrc (index) {
      console.log()
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
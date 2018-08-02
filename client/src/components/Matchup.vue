<template>
<div class="card">
  <div class="card-header">
    <ul class="nav nav-pills card-header-pills d-flex justify-content-md-center">
        <a class="nav-link text-dark" href="#">View Matchup Details</a>
        <span class="nav-link" @click="updateLine()">Update Spinner</span>
        <span class="nav-link" @click="deleteMatchup()">Trash</span>
    </ul>
  </div>
  <div id="bootstrap-matchup-override" class="row justify-content-md-center card-body">
    <div class="col-md-4">
      <div class="card-body logo" :class="{ 'bg-success': this.systemSpread > 0 }">
      <img :src="getSrc(matchup.awayTeam['name'])" :alt="matchup.awayTeam['name']"/>
      <h4 class="text-dark">{{matchup.awayTeam['location'] }} {{matchup.awayTeam['name'] }}</h4>
      </div>
    </div>
    <div class="col-md-2 align-self-center">
      <h5 class="align-middle auto-margin">Vegas: {{ matchup.vegasSpread }}</h5>
      <h5 class="align-end auto-margin">TheSystem: {{ this.systemSpread }}</h5>
    </div>
    <div class="col-md-4">
      <div class="card-body logo" :class="{ 'bg-success': this.systemSpread < 0 }">
      <img :src="getSrc(matchup.homeTeam['name'])" :alt="matchup.homeTeam['name']"/>
      <h4 class="text-dark">{{matchup.homeTeam['location'] }} {{ matchup.homeTeam['name'] }}</h4>
      </div>
    </div>
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
  computed: {
    systemSpread () {
      let rawSpread = parseFloat(this.matchup.systemSpread).toFixed(1)
      return rawSpread > 0 ? '+' + rawSpread : rawSpread
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
        url: 'http://localhost:3000/api/matchups/' + this.matchup._id,
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
        url: 'http://localhost:3000/api/matchups/updateLine',
        method: 'POST',
        data: this.matchup
      }).then(response => {
        this.matchup.systemSpread = response.data.systemSpread
        this.$parent.$emit('updatedMatchup', response)
      }
      )
        .catch(error => {
          console.log(error)
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

</style>



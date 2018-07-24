<template>
  <div class="row justify-content-md-center">
    <div class="col-md-4">
      <div class="card-body logo">
      <img :src="getSrc(matchup.awayTeam['name'])" :alt="matchup.awayTeam['name']"/>
      <h4 class="text-dark">{{matchup.awayTeam['location'] }} {{matchup.awayTeam['name'] }}</h4>
      </div>
    </div>
    <div class="col-md-2 align-middle">
      <h4 class="align-center">Spread: {{ matchup.vegasSpread }}</h4>
    </div>
    <div class="col-md-4">
      <div class="card-body logo">
      <img :src="getSrc(matchup.homeTeam['name'])" :alt="matchup.homeTeam['name']"/>
      <h4 class="text-dark">{{matchup.homeTeam['location'] }} {{ matchup.homeTeam['name'] }}</h4>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'matchup',
  props: [
    'matchup'
  ],
  methods: {
    getSrc (name) {
      // var images = require.context('../assets/', false, /\.png$/)
      // return images('./' + team['name'].toLowerCase() + '.png')
      return '../../static/img/logos/' + name + '.png'
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
</style>



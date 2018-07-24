<template>
  <div class="row justify-content-md-center">
    <div class="col-md-4">
      <div class="card-body logo">
      <img src="../assets/0020920_dallas-cowboys_300.png" alt="bengals"/>
      <h4 class="text-dark">{{matchup.awayTeam['location'] }} {{matchup.awayTeam['name'] }}</h4>
      </div>
    </div>
    <div class="col-md-2 align-middle">
      <h4 class="align-center">Spread: {{ matchup.vegasSpread }}</h4>
    </div>
    <div class="col-md-4">
      <div class="card-body logo">
      <img src="../assets/0020919_cincinnati-bengals_300.png" alt="bengals"/>
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
  ]
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



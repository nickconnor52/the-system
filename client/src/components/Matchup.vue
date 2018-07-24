<template>
  <div class="row">
    <div class="offset-md-2 col-md-4">
      <div class="card-body logo">
      <img src="../assets/0020919_cincinnati-bengals_300.png" alt="bengals"/>
      <h4 class="text-dark">{{matchup.homeTeam['name'] }}</h4>
      </div>
    </div>
    <div class="col-md-4">
      <div class="card-body logo">
      <img src="../assets/0020920_dallas-cowboys_300.png" alt="bengals"/>
      <h4 class="text-dark">{{ matchup.awayTeam['name'] }}</h4>
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


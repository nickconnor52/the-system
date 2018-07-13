<template>
  <div class="container" id="matchups">
    <h1>
        Matchups
    </h1>
    <div class="row">
      <div class="col-md-12 card" style="width: 18rem;">
        <div class="card-body">
          <p class="card-text">This is where we will display the head to head matchups</p>
          <div class="row">
            <div class="offset-md-2 col-md-4">
              <div class="card-body logo">
                <img src="../assets/0020919_cincinnati-bengals_300.png" alt="bengals"/>
                <h4 class="text-dark">Bengals</h4>
              </div>
            </div>
            <div class="col-md-4">
              <div class="card-body logo">
                <img src="../assets/0020920_dallas-cowboys_300.png" alt="bengals"/>
                <h4 class="text-dark">Cowboys</h4>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
export default {
  name: 'matchups'
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
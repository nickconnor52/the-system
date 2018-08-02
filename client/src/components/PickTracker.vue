<template>
<div class="container">
  <div class="card">
    <div class="card-header">
        <ul class="nav nav-pills card-header-pills d-flex justify-content-md-center">
        </ul>
    </div>
    <div id="bootstrap-matchup-override" class="row justify-content-md-center card-body">
        <h5>Coming Soon</h5>
    </div>
  </div>
</div>
</template>

<script>

export default {
  name: 'pick-tracker',
  computed: {
    //
  },
  methods: {
    //
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
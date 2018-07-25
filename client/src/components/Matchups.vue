<template>
  <div class="container" id="matchups">
    <h1>
        Matchups -- Week: 0
    </h1>
    <div class="row" v-if="teams">
      <div class="col-md-12 card" style="width: 18rem;">
        <div class="card-body container-fluid">
          <div class="row justify-content-md-center">
            <button type="button" class="btn btn-primary" @click="showModal = true">
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
                    <h5 class="modal-title">Modal title</h5>
                    <button type="button" class="close" data-dismiss="modal" aria-label="Close">
                    <span aria-hidden="true" @click="showModal = false">&times;</span>
                    </button>
                </div>
                <div class="modal-body">
                    <p>Add a matchup:</p>
                </div>
                <div class="modal-footer">
                    <button type="button" class="btn btn-secondary" @click="showModal = false">Close</button>
                    <button type="button" class="btn btn-primary">Save changes</button>
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

export default {
  name: 'matchups',
  components: {
    'matchup': Matchup
  },
  data () {
    return {
      teams: null,
      matchups: null,
      showModal: false
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

ul {
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
</style>
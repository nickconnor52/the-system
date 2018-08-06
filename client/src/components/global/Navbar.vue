<template>
<div id="app">
    <header>
      <nav id="global-navbar" style="padding-top: 7px" class="nav-bar nav nav-pills nav-fill">
        <a class="nav-item nav-link navitem" :class="{ active: activeLink1 }" href="/">Home</a>
        <a class="nav-item nav-link navitem" :class="{ active: activeLink2 }" href="/matchups/">Matchups</a>
        <a class="nav-item nav-link navitem" :class="{ active: activeLink3 }" href="/pick-tracker/">Pick Tracker</a>
      </nav>
    </header>
</div>
</template>
<script>
export default {
  name: 'navbar',
  computed: {
    activeLink1 () {
      return this.$route.path === '/'
    },
    activeLink2 () {
      console.log(this.$route.path)
      return this.$route.path === '/matchups/'
    },
    activeLink3 () {
      return this.$route.path === '/pick-tracker/'
    }
  }
}
</script>
<style>
#global-navbar a.nav-item {
  background-color: #9e253196;
  margin-left: 3px;
  margin-right: 3px;

}

.active {
  background-color: #ff5f5f !important
}

.navitem {
  color: white !important
}
</style>
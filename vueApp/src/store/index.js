import Vue from 'vue'
import Vuex from 'vuex'
import axios from 'axios'

Vue.use(Vuex)

export default new Vuex.Store({
  state: {
    vehicles: [],
    locations: [],
    filteredVehicles: [],
    currentVehicle: {},
    location: null,
    pickup: '',
    dropoff: ''
  },
  getters: {
    allVehicles: (state) => state.vehicles,
    allLocations: (state) => state.locations,
    filteredVehicles: (state) => state.filteredVehicles,
    currentVehicle: (state) => state.currentVehicle,
    pickupDate: (state) => state.pickup,
    dropOffDate: (state) => state.dropoff
  },
  mutations: {
    GET_VEHICLES: (state, vehicles) => {
      state.vehicles = vehicles
    },
    GET_LOCATIONS: (state, locations) => {
      state.locations = locations
    },
    SET_FILTERED: (state, vehicles) => {
      state.filteredVehicles = vehicles
    },
    SET_VEHICLE: (state, vehicle) => {
      state.currentVehicle = vehicle
    },
    SET_LOCATION: (state, location) => {
      state.location = location
    },
    SET_PICKUP: (state, date) => {
      state.pickup = date
    },
    SET_DROPOFF: (state, date) => {
      state.dropoff = date
    }
  },
  actions: {
    getVehicles ({ commit }) {
      axios.get('http://api.vue-rentacar.test/vehicles').then((res) => {
        commit('GET_VEHICLES', res.data)
      })
    },
    getLocations ({ commit }) {
      axios.get('http://api.vue-rentacar.test/locations/list').then((res) => {
        commit('GET_LOCATIONS', res.data)
      })
    },
    filterVehicles ({ commit, state }) {
      const filtered = state.vehicles.filter((vehicle) => {
        const foundLocations = vehicle.locations.findIndex((location) => {
          return location.id === this.state.location
        })

        return foundLocations !== -1
      })

      const filteredVehicles = []

      filtered.forEach((vehicle) => {
        if (vehicle.dates.length > 0) {
          const overlaps = []

          vehicle.dates.forEach((date) => {
            const startDate1 = new Date(date.pickup)
            const endDate1 = new Date(date.dropoff)
            const startDate2 = new Date(this.state.pickup)
            const endDate2 = new Date(this.state.dropoff)

            overlaps.push(startDate1 < endDate2 && startDate2 < endDate1)
          })

          if (!overlaps.includes(true)) {
            filteredVehicles.push(vehicle)
          }

          return
        }

        filteredVehicles.push(vehicle)
      })

      commit('SET_FILTERED', filteredVehicles)
    },
    setLocation ({ commit, state }, value) {
      commit('SET_LOCATION', value)
    },
    getVehicle ({ commit, state }, slug) {
      const vehicle = this.state.vehicles.find(
        (vehicle) => vehicle.slug === slug
      )

      commit('SET_VEHICLE', vehicle)
    },
    setDates ({ commit, state }, date) {
      if (date.type === 'pickup') {
        commit('SET_PICKUP', date.value)
        localStorage.setItem('pickup', date.value)
        return
      }

      commit('SET_DROPOFF', date.value)
      localStorage.setItem('dropoff', date.value)
    },
    registerUser ({ commit, state }, user) {
      axios
        .post('http://api.vue-rentacar.test/api/signup', user)
        .then((response) => {
          console.log(response)
        })
    },
    loginUser ({ commit, state }, user) {
      console.log(user.get('login'), user.get('password'))
      axios
        .post('http://api.vue-rentacar.test/api/login', user)
        .then((response) => {
          console.log(response)
        })
    }
  },
  modules: {}
})

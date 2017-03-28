var actorsFilmOne = [], actorsFilmTwo = [], directorsFilmOne = [], directorsFilmTwo = [];
	
var app = new Vue({
	el: '#b-films',

	data: {
		baseURL: 'http://www.omdbapi.com/?t=',
		filmOne: '',
		filmTwo: '',
		filmOut: '',
		actors: '',
		directors: ''
	},
	methods: {
		search: function() {
			var vm = this

				if (!this.filmOne.length || !this.filmTwo.length) {
					this.filmOut = 'Please, provide two movie titles.'
					return false
				}

				var filmOneFound = false, filmTwoFound = false

				axios.get(this.baseURL + this.filmOne)
					.then(function (response) {
						if (response.data.Response === "True") {
							actorsFilmOne = response.data.Actors.split(', ')
							directorsFilmOne = response.data.Director.split(', ')
							filmOneFound = true
						}
					})
					.catch(function (error) {
     					vm.filmOut = 'Sorry, an error has occurred';
					});

				axios.get(this.baseURL + this.filmTwo)
					.then(function (response) {
						if (response.data.Response === "True") {

							vm.filmOut = ''

							var actorsCommon = [], directorsCommon = []

							actorsFilmTwo = response.data.Actors.split(', ')
							directorsFilmTwo = response.data.Director.split(', ')
							filmTwoFound = true

							if (filmOneFound && actorsFilmOne[0] === 'N/A') {
								vm.actors = 'Film found, but no actors data for movie title ' + vm.filmOne
								return false
							} 

							if (filmTwoFound && actorsFilmTwo[0] === 'N/A') {
								vm.actors = 'Film found, but no actors data for movie title ' + vm.filmTwo;
								return false
							} 

							if (filmOneFound && directorsFilmOne[0] === 'N/A') {
								vm.directors = 'Film found, but no director data for movie title ' + vm.filmOne
								directorsFilmOne = []
							} 

							if (filmTwoFound && directorsFilmTwo[0] === 'N/A') {
								vm.directors = 'Film found, but no director data for movie title ' + vm.filmTwo
								directorsFilmTwo = []
							} 



							for (var i = 0; i < actorsFilmOne.length; i++) {
								for (var j = 0; j < actorsFilmTwo.length; j++) {
									if (actorsFilmOne[i] === actorsFilmTwo[j]) {
										actorsCommon.push(actorsFilmOne[i])
									}
								}
							}

							var actorsResult = actorsCommon.join(', ')
		
							if (actorsCommon.length > 0) {
								vm.actors = 'Common actor' + (actorsCommon.length > 1 ? 's: ' : ': ') + actorsResult
							} else {
								vm.actors = 'Common actors not found'
							}



							for (var i = 0; i < directorsFilmOne.length; i++) {
								for (var j = 0; j < directorsFilmTwo.length; j++) {
									if (directorsFilmOne[i] === directorsFilmTwo[j]) {
										directorsCommon.push(directorsFilmOne[i])
									}
								}
							}
		
							var directorsResult = directorsCommon.join(', ')
		
							if (directorsCommon.length > 0) {
								vm.directors = 'Common director' + (directorsCommon.length > 1 ? 's: ' : ': ') + directorsResult
							} else {
								vm.directors = 'Common directors not found'
							}


						}

						var notFound = []
						if (!filmOneFound && vm.filmOne.length) notFound.push(vm.filmOne)
						if (!filmTwoFound && vm.filmTwo.length) notFound.push(vm.filmTwo)

						if (notFound.length > 0) {
							vm.directors = ''
							vm.actors = ''
							vm.filmOut = 'The following film' + (notFound.length > 1 ? 's' : '') + ' cannot be found: '
							vm.filmOut += notFound.join(', ')
						}
					})
					.catch(function (error) {
						console.log(error)
 						vm.filmOut = 'Sorry, an error has occurred'
					});
		}
	}
});


$(document).ready(function(){
	$("#idk").autocomplete({
		source: function (request, response) {
			$.ajax({
				method: "GET",
				dataType: "json",
				url: "http://www.omdbapi.com/?s="+request.term,
				success: function (data) {
					console.log(data);
					var transformed = $.map(data.Search, function (el) {
						return {
							label: el.Title,
							id: el.Years
						};
					});
					response(transformed);
					console.log(arguments);
				},
				error: function () {
					response([]);
				}	
			});
		}
	});

	$("#idk2").autocomplete({
		source: function (request, response) {
			$.ajax({
				method: "GET",
				dataType: "json",
				url: "http://www.omdbapi.com/?s="+request.term,
				success: function (data) {
					console.log(data);
					var transformed = $.map(data.Search, function (el) {
						return {
							label: el.Title,
							id: el.Years
						};
					});
					response(transformed);
				},
				error: function () {
					response([]);
				}
			});
		}
	});
});
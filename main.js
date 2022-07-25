

var margin = { top: 0, left: 0, right: 0, bottom: 0 },
	height = 400 - margin.top - margin.bottom,
	width = 800 - margin.left - margin.right;

Promise.all([
	d3.json("https://cdn.jsdelivr.net/npm/us-atlas@3/states-10m.json"),
	d3.csv("./fireflies_chart2.csv", d3.autoType),
]).then((response) => {
	const us = response[0];
	const data = response[1];
	const states = topojson.feature(us, us.objects.states);


// i didn't actually use this next chunk of code in the animation
    const dateExtent = d3.extent(data, d => d.date)
	let begindate = new Date(2008, 1, 0);
	let begindateinms = begindate.getTime(); 

	var svg = d3
		.select("#map")
		.append("svg")
		.attr("height", height + margin.top + margin.bottom)
		.attr("width", width + margin.left + margin.right)
		.append("g")
		.attr("transform", "translate(" + margin.left + "," + margin.top + ")");
	// use a map projection from D3
	const projection = d3
		.geoAlbersUsa()
		.scale(800)
		.translate([width / 2, height / 2]);
	// create a D3 geopath to render our geographic shapes
	const path = d3.geoPath(projection);
	const g = svg.append("g");
	// map
	g.selectAll("path")
		.data(states.features)
		.enter()
		.append("path")
		.attr("class", "state")
		.attr("stroke", "rgba(255, 255, 255, .5)")
		.attr("d", path)
		.attr("id", d => d.properties.name) ;

		console.log(path) 

	// circles
	g.selectAll("circle")
		.data(data)
		.join("circle")
		.attr("cx", (d) => {
			// need to use the projection we set up above to convert from lat/lon to x and y values
			const location = projection([d.Longitude, d.Latitude]);
			if (location) {
				// saving the output of this calculation to the object so we don't have to re-calculate it
				d.location = location;
				return location[0];
			} else {
				// this is here in case any points cannot be converted with the projection for some reason
				return null;
			}
		})
		.attr("cy", (d) => (d.location ? d.location[1] : null))
		.attr("r", 4.5)
		.attr("fill", "rgba(222,254,91,0.8)")
		.attr("stroke", "rgba(222,254,91,1)")


        g.selectAll("circle")
        .style("opacity", 0)
        .transition()
        .delay(function(d) {
            let yearMS = 30000
            let year = d.date.getFullYear() - 2008
            let month = d.date.getMonth() - 1
            let day = d.date.getDay() - 1
            let waitMS = yearMS * year +  month * yearMS / 12 + day * yearMS / 365
            return waitMS
        })
        .duration(300)
        .style("opacity", 1)
        .remove()

		g.append("text")
		.text(begindateinms)
		.attr("id", "first-date")
		.attr("transform", "translate(450, 385)")
		.attr("font-size", "20px")
		.style('fill', 'white')
		.attr("font-family", "Courier New")

		setInterval(function() {

			if (begindateinms >= 1490598000000) {
				return
			  }
			begindateinms = begindateinms + 86400000 
			var newdate = new Date(begindateinms) ;

			let shortMonth = newdate.toLocaleString('en-us', { month: 'short' }); /* Jun */
			const dyear = newdate.getFullYear();

			const dstr = shortMonth + " " + dyear;
			svg.select("#first-date")
			.text(dstr)

		  }, 82.19)
		// g.selectAll("circle")
        // .style("opacity", 0)
		// .transition()
        // .delay(function(d) {
        //     let yearMS = 10000
        //     let year = d.date.getFullYear() - 2008
        //     let month = d.date.getMonth() - 1
        //     let day = d.date.getDay() - 1
        //     let waitMS = yearMS * year +  month * yearMS / 12 + day * yearMS / 365
        //     return waitMS
        // })
        // .style("opacity", 1)
        // .transition()
        // .delay(1000)
        // .style("opacity", 0)

	g.selectAll("path")
			.attr("opacity", 0)

	g.selectAll("text")
			.attr("opacity", 0)

	g.selectAll("circle")
		  .attr("opacity", 0)


	const scroller = scrollama();
	let interval = null

	scroller
	.setup({
		step: ".step",
		offset: 0.5
	})

	.onStepEnter((response) => {
			console.log(response.index)
		if (response.index === 1) {
			g.selectAll("path")
				.transition(100)
				.attr("opacity", 1)

			g.selectAll("text")
				.transition(100)
				.attr("opacity", 1)

			g.selectAll("circle")
				.attr("visibility", "visible")
		}

		else if (response.index === 12) {

			g.selectAll("path")
				.transition(100)
				.attr("opacity", 0)


			g.selectAll("text")
				.transition(100)
				.attr("opacity", 0)


			g.selectAll("circle")
			.attr("opacity", 0)
		}

		else if (response.index === 14) {

			g.selectAll("path")
				.transition(100)
				.attr("opacity", 1)

			d3.select("#Illinois")
				.attr("fill", "grey")
				.attr("opacity", .5)

			g.selectAll("text")
				.transition(100)
				.attr("opacity", .5)


				g.selectAll("circle")
				.attr("opacity", 1)
		}

		else if (response.index === 15) {

			g.selectAll("path")
				.transition(100)
				.attr("opacity", 1)

			d3.select("#Louisiana")
				.attr("fill", "grey")
				.attr("opacity", .5)

			d3.select("#Iowa")
				.attr("fill", "grey")
				.attr("opacity", .5)

			g.selectAll("text")
				.transition(100)
				.attr("opacity", .5)


		}
		else if (response.index === 22) {

			g.selectAll("path")
				.transition(100)
				.attr("opacity", 0)


			g.selectAll("text")
				.attr("opacity", 0)

			g.selectAll("circle")
			.attr("visibility", "hidden")
		}
	})



});



// svg flexbox look it up later
// change .delay to be a calculation based on time stamp
// let firstdate = new Date()
// firstdate.setDate(firstdate.getDate() + 1)
// console.log(firstdate)
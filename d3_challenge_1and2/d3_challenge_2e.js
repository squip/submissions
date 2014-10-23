// 2e. G ELEMENTS, NESTED DATA, GROUPED BAR CHART
// **************************************************************************
// Make a nested bar graph that groups the mta data into boroughs and plots a bar
// for each station. 

// check out the data file d3_mta_data.csv. How might the data be grouped to 
// make this plotting task the easiest possible? 


d3.csv('d3_mta_data.csv', function(raw_data) {

    // CHALLENGE:
    // use .nest() .key() and .rollup() to make a hierarchical data object. 
    // the first key is the borough
    // the second key is the station
    // then use rollup to sum the total number of rides within each station.
    // finally, you have to tell it what to nest by giving it the original 'raw_data'
    // as an argument to .entries()
    data = d3.nest()
//	.key(...


    // set up another svg, as should be pretty familiar now. 
    // this one I'm making wider and giving a broader left gutter for our axis.
    var margin = {'bottom':50,'top':20,'left':70,'right':20}
    var h = 400 - margin.bottom - margin.top;
    var w = 600 - margin.left - margin.right;

    var svg = d3.select('#challenge_2e').append('svg')
	.attr('height',h + margin.bottom + margin.top)
	.attr('width',w + margin.left + margin.right)
	.style('border','2px dotted blue')
      .append('g')
	.attr('transform','translate(' + margin.left + ',' + margin.top + ')');


    // for a grouped bar chart, you'll have two x scales, one for the groups 
    // and one within groups.
    
    // CHALLENGE:
    // For the groups (boroughs), make an ordinal axis. (xB for Boroughs)
    // The domain should be an array with the names of the boroughs. 
    //     (you can cheat and type these, or see if you can use the .map() function
    //      of javascript to get it from your data)
    // Look up rangeBands in the d3 api. what does the parameter 0.2 do?
    var xB = d3.scale.ordinal()
//	.domain(
	.rangeBands([0,w],0.2)

    // Create another x scale for the bars within the groups (xS for Stations) 
    // This time, it is best to use numbers for the domain 
    // The rangeBands() this time are defined to fill up each xB rangeBand
    // No spacing between the bars (as 0.2 above) is just a design choice.
    var xS = d3.scale.ordinal()
	.domain(d3.range(data[0].values.length))
	.rangeBands([0,xB.rangeBand()])


    // after all that, the y scale is almost easy. oops, almost. 

    // CHALLENGE:
    // Find the maximum y value of the nested data object using d3.max (at least once)
    // and set the domain.
    var y = d3.scale.linear()
	.range([h,0])
//	.domain([0,


    // create the axes elements (we won't actually display an axis for the stations
    // because it would be too cluttered.)
    var yAxis = d3.svg.axis()
    // ... 


    var xAxis = d3.svg.axis()
    //...


    // Now comes the fun part -- this is where g elements really pay off. 
    // bind the `data` and append g elements within svg for each borough.


    // CHALLENGE:
    // transform each borough_g using the xB scale. 
    // hint: if you remove the `var` before xB in the declaration, you can play
    // with the function in the console. 
    // Delete `var`, save, reload, and type xB('Manhattan') in the console.
    var boroughs = svg.selectAll('g')
	.data(data)
	.enter().append('g')
	.attr('class',function(d) { return 'borough_g ' + d.key; })
//	.attr('transform',


    // This is the best part. 
    // Because of g elements, we're about to plot 16 rectangles, 
    // in four groups, in one swoop. I can tell that you are as excited as I am.
    // Above, we called the set of g elements "boroughs". 
    // Now, we're going to nest more g's inside each borough g. 
    // Each of these will hold one bar.
    var stations = boroughs.selectAll('g')
	.data(function(d){console.log(d.values);return d.values})
	.enter().append('g')
	.attr('transform',function(d,i){return 'translate(' + xS(i) + ',0)';})
	.attr('class','station_g')

    // CHALLENGE: 
    // Append the rectangle and give it attributes. 
    // Because we already transformed the g, x can be 0.
    // This part is annoying - because of rollup, the count 
    // (what we need for y and height) is 
    // called d.values.
    // Use xS.rangeBand() for the width.

      .append('rect')
//	.attr('x',
//	.attr('y',
//	.attr('width',
//	.attr('height',


    // Now let's call the y axis and add it to the svg.
    svg.append('g')
	.attr('class','y axis')
	.call(yAxis)

    // and the x axis
    svg.append('g')
	.attr('class','borough axis')
	.attr('transform','translate(0,' + h + ')')
	.call(xAxis)
    // !! get rid of the lines by specifying stroke:none and fill:none 
    // for `.borough.axis line {}` and `.borough.axis path {}` in your css file.



    // Since it's too cramped to label the stations on the x axis, let's 
    // make a text box where the station can appear when you hover over the bar. 

    // let's call it station_box, and put it in the top right corner.

    // CHALLENGE: 
    // Append a g to svg and call it station_box. 
    // Translate it over to the right edge of the plottable area, and down margin.top
    // Append a text element to the g (just keep on chaining)
    // Text element needs an x and a y, but these can be 0 since you are inside a g
    // You might want to come back later and mess with the 'text-anchor' attribute.
    
    var station_box = svg.append('g')
    //...

    // To make it work, we need event listeners on the rectangles. 
    // Those rectangles are in the variable stations. 
    // Hover events need two listeners, one for mouseover to start it,
    // and one for mouseout to end it. 
    stations.on('mouseover', update_box)
	.on('mouseout', clear_box)

    // update_box and clear_box are two functions that we need to define 
    // to make the hover thing work.
    var update_box = function() {

	// this says: 
	station = d3.select(this).data()[0].key
	// * d3.select(this): Use d3 to select the thing that was clicked. 
	// * .data(): Get the data that is bound to that thing.
	// Oops, it's in an array, even though it's one thing, so 
	// * [0]: Get the thing out of the array. (now we have the d we are used to)
	// * d.key: give me the name of the station for this clicked rectangle.

	// CHALLENGE:
	// Set the text() attribute of station_box to the name of the station.
	
    }

    var clear_box = function() {

	// CHALLENGE: 
	// set the text of station_box back to nothing or ''.
    }

    // CHALLENGE: 
    // this will probably fail unless you move these two functions up 
    // above the thing that is calling them. 

});


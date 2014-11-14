
var width = 1500,
    height = 500,
    padding = 1.5, // separation between nodes
    maxRadius = 12;


// d3.select("#datasets")
//     .on("change", function() {
//        $("svg").empty()
//         datafile = this.value + ".csv";
//       }
//     )

//   .selectAll("option")
//     .data([
//       "clusters_full_day",
//       "clusters_example"
//     ])
//   .enter().append("option")
//     .attr("value", String)
//     .text(String);




var max_cluster_id = 0;
d3.csv(datafile, function(error, data) {
    data.forEach(function(d) {
        d.cluster_size = +d.cluster_size
        d.label = d.label
        d.cluster = +d.cluster;
        if (d.cluster > max_cluster_id) {max_cluster_id = d.cluster;}
        d.radius = Math.sqrt(d.value * d.cluster_size * maxRadius);
    });


var n = data.length; // total number of nodes
var m = max_cluster_id+1;  // number of distinct clusters


var color = d3.scale.category10().domain(d3.range(m));

var x = d3.scale.ordinal().domain(d3.range(m)).rangeBands([0, width]);



/*
var nodes = d3.range(n).map(function() {
  var i = Math.floor(Math.random() * m),
      v = (i + 5) / m * -Math.log(Math.random());
  return {
    radius: Math.sqrt(v) * maxRadius,
    color: color(i)
  };
});
*/


var svg = d3.select("body").append("svg")
    .attr("width", width)
    .attr("height", height);

d3.nest()
    .key(function(d) { return d.cluster; })
    .entries(data)
    .forEach(force);

function force(entry, i) {
  var nodes = entry.values;


  var force = d3.layout.force()
      .nodes(nodes)
      .size([x.rangeBand(), height])
      .gravity(.2)
      .charge(0)
      .on("tick", tick)
      .start();

  var cluster_group = svg.append("g")
      .attr("transform", "translate(" + x(i) + ")")
       ;

  var circle_node = cluster_group.selectAll("g.node").data(nodes);

  circle_node.exit().remove();

  circle_node.enter()
            .append("g")
            .attr("class", "node")
            .call(force.drag);




  circle = circle_node.append("circle")
            .attr("id", function(d, j) {return "circle"+i+"-"+j})
            .attr("r", function(d) { return d.radius; })
            .style("z-index", 1)
            .style("fill", function(d) { return color(d.cluster); });


//  circle_node.append("title")
//            .text( function(d) {return d.label});
 
 
 circle_node.append("text")
            .attr("id", function(d, j) {return "label"+i+"-"+j})
            // .attr("dy", ".35em")
            .attr("y", "-150")
            .text( function(d) {return d.label})
            .style("z-index", 1000000)
            .style("font-weight","bold")
            .style("font-size","40px")
            .style("display", "none")
            .style("fill", function(d) { return color(d.cluster); });

var representative_ngram = nodes[0].label;
var max_tfidf = nodes[0].value;
nodes.forEach( function(node) {
    if (node.value > max_tfidf) {
          representative_ngram = node.label;
          max_tf_idf = node.value; }
});

var cluster_label = cluster_group.append("g")
      .append("a")
      .attr("xlink:href", document.URL+"/cluster/"+i+"/"+ $.trim(representative_ngram));

cluster_label.append("text")
   .attr("y", "370").text(representative_ngram)
   .attr("x", "70").text(representative_ngram)
   .attr('text-anchor', 'middle')
   .style("font-weight","bold")         
   .style("font-size","15px")
   


  nodes.forEach( function(d, j) {

    console.log("#label"+i+"-"+j);

    $("#circle"+i+"-"+j).hover( 
               function(){
                            $(this).parent().parent().parent().append($(this).parent().parent());
                            $(this).parent().parent().append($(this).parent());
                            $("#label"+i+"-"+j).show();
                          },
               function() {$("#label"+i+"-"+j).hide();  }
              );

  });




  function tick(e) {
    circle
        .each(collide(.5))
        .attr("cx", function(d) { return d.x; })
        .attr("cy", function(d) { return d.y; });
    circle_node
        .each(collide(.5))
        .attr("transform", function(d) {return "translate(" + [d.x, d.y] +")"});

  }

  // Resolves collisions between d and all other circles.
  function collide(alpha) {
    var quadtree = d3.geom.quadtree(nodes);
    return function(d) {
      var r = d.radius + maxRadius + padding,
          nx1 = d.x - r,
          nx2 = d.x + r,
          ny1 = d.y - r,
          ny2 = d.y + r;
      quadtree.visit(function(quad, x1, y1, x2, y2) {
        if (quad.point && (quad.point !== d)) {
          var x = d.x - quad.point.x,
              y = d.y - quad.point.y,
              l = Math.sqrt(x * x + y * y),
              r = d.radius + quad.point.radius + padding;
          if (l < r) {
            l = (l - r) / l * alpha;
            d.x -= x *= l;
            d.y -= y *= l;
            quad.point.x += x;
            quad.point.y += y;
          }
        }
        return x1 > nx2 || x2 < nx1 || y1 > ny2 || y2 < ny1;
      });
    };
  }
}


});


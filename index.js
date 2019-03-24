var margin = {
    top: 50,
    bottom: 50,
    right: 50,
    left: 50
};
var height = 800;
var width = 800;

/*
    Initialize the dimensions of the map
    Add margins to height and width
*/
var svg = d3.select("#map")
    .append("svg")
    .attr("height", height)
    .attr("width", width)
    .append("g")

/*
    Read in world.topojson
    Read in olympics.csv
    Ready function handles data processing
*/
Promise.all([
    d3.json("topojson/world.json"),
    d3.csv("data/olympics.csv"),
]).then(ready).catch(handleError)

/*
    Create a new projection using Mercator (geoMercator)
    and center it (translate)
    and zoom in a certain amount (scale) 
*/
var projection = d3.geoMercator()
    .translate([width / 2, height / 2])
    .scale(100)

/*
    create a path (geoPath)
    using the projection
*/
var path = d3.geoPath()
    .projection(projection)

/*
    Handle processing
    data[0] = world.json data
    data[1] = olympics.csv data
*/
function ready(data) {
    var country_data = data[0]
    var olympics_data = data[1]

    /*
        topojson.feature converts our RAW geo data into 
        USEABLE geo data. Always pass it data, then
        data.objcets.__something__ then get .features out 
        of it.
    */
    var countries = topojson.feature(country_data, country_data.objects.countries).features

    /*
        Add a path for each country
        Shapes -> path
    */
    svg.selectAll(".country")
        .data(countries)
        .enter().append("path")
        .attr("class", "country")
        .attr("d", path)
        .data(olympics_data)
        .on("mouseover", function (d) {
            console.log(d)
            d3.select(this).classed("selected", true)
        })
        .on("mouseout", function (d) {
            d3.select(this).classed("selected", false)
        })
}

/*
    Handle error
*/
function handleError(data) {}
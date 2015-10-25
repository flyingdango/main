d3.select(window).on("scroll",function(){
	var st=document.body.scrollTop+document.documentElement.scrollTop;
	var sl=document.body.scrollLeft+document.documentElement.scrollLeft;
	d3.select("#bb")
		.transition()
		.duration(50)
		.style("left",function(){
			return sl<1500 ? parseInt(sl)+"px" : "1500px";
		})
		.style("top",function(){
			return st<1500 ? parseInt(st)+150+"px" : "1650px";
	});
	d3.event.stopPropagation();
})
d3.selectAll("#bb .but")
	.on("mouseover",function(){
		d3.select(this)
			.style("background-color","#444")
		d3.event.stopPropagation();
	})
	.on("mouseout",function(){
		d3.select(this)
			.style("background-color","#222")
		d3.event.stopPropagation();
	})
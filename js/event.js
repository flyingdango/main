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
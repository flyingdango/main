var w=1500;
var note_w=parseInt(w/3);
note_w=note_w % 2==0 ? note_w : note_w+1;
var padding=200;
d3.select("#note")
	.style({"width":note_w+"px","height":note_w+"px"})
	.style({"left":w/2-note_w/2+"px","top":w/2-note_w/2+"px"});
d3.select("#comp")
	.on("click",function(){
		d3.selectAll(".circle")
			.style("fill","#66CCFF");
		d3.select("#note")
			.style("display","none");
		d3.event.stopPropagation();
	});
var svg=d3.select("#comp")
	.style({"width":w+'px',"heihgt":w+'px'})
	.append("svg")
	.attr({width:w,height:w})
	.append("g")
	.attr("transform","translate("+w/2+","+w/2+")");
var cluster=d3.layout.cluster()
    .size([360,w/2-padding])
    .sort(null);
var temp=[];
var curve=d3.svg.diagonal()
	.projection(function projection(d) {
  		var r=d.y;
  		var a= (d.x-90)/180*Math.PI;
  		return [r *Math.cos(a),r*Math.sin(a)];
	});
d3.json("effects.json",function(data){
	var nodes=cluster.nodes(data);
	var links=cluster.links(nodes);
	svg.selectAll("path.line")
		.data(links)
		.enter()
		.append("path")
		.attr("class","line")
		.attr("d",curve);
	svg.selectAll("circle")
		.data(temp)
		.enter()
		.append("circle").attr("r",5).attr("fill","#FFF")
		.attr("cx",function(d){return d[0]})
		.attr("cy",function(d){return d[1]});
	var g_nodes=svg.selectAll("g.node")
		.data(nodes)
		.enter()
		.append("g")
		.attr("class","node")
		.attr("transform",function(d){
			return "rotate("+(d.x-90)+")translate("+ d.y +")";
		});
	g_nodes.append("circle")
		.attr("class","circle")
		.attr("r",5)
		.on("click",function(d){
			d3.selectAll(".circle").style("fill","#66CCFF");
			d3.select(this).style("fill","red");
			d3.select("#note")
				.style("display","block");
			d3.select("#note_head")
				.text(function(){return d.data.text});
			d3.select("#note_text")
				.text(function(){return d.data.note ? d.data.note : "暂无简介"});
			d3.event.stopPropagation();
		});
	var pth=192;
	g_nodes.append("text")
		.attr("class","text")
		.attr("dx",function(d){return d.x>pth ? -6 : 6})
		.attr("dy",4)
		.attr("text-anchor",function(d){return d.x>pth ? "end" : "start"})
      	.attr("transform",function(d){return d.x>pth ? "rotate(180)" : null})
		.text(function(d){return d.data.text});
});
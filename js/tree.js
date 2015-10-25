var oComp=document.getElementById("comp");
var w=1600;
var nodes,links;
var now="";
var note_w=320;
var padding=240;
d3.select("#note")
	.style({"width":note_w+"px","height":note_w+"px"})
	.on("click",function(){
		d3.event.stopPropagation();
	});
d3.select("#comp")
	.style({"width":w+"px","height":w+"px"})
	.on("click",function(){
		d3.selectAll(".circle")
			.style("stroke","none");
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
var color=d3.scale.category20();
var cluster=d3.layout.cluster()
    .size([360,w/2-padding])
    .sort(null);
var curve=d3.svg.diagonal()
	.projection(function projection(d) {
  		var r=d.y;
  		var a= (d.x-90)/180*Math.PI;
  		return [r *Math.cos(a),r*Math.sin(a)];
	});
function change(name){
	//line
	var line=svg.selectAll("path.line").data(links);
	line.exit().remove();
	line.enter().append("path")
		.attr("class","line");
	line.transition()
		.style("stroke","#000")
		.transition()
		.delay(function(){
			if(name=="effects"){
				return 2000;
			}else if(name=="expression"){
				return 1800;
			}else if(name=="xpresso"){
				return 1500;
			}
		})
		.duration(1000)
		.attr("d",curve)
		.style("stroke","#666");
	//c_remove+add+update
	var circle=svg.selectAll(".circle").data(nodes);
	var ng=15;
	circle.exit().remove();
	circle.enter().append("circle")
		.attr("class","circle")
		.attr("r",5)
		.on("click",function(d){
			var pos=d3.mouse(oComp);
			d3.selectAll(".circle").style("stroke","none");
			d3.select(this).style("stroke","#FFF");
			d3.select("#note")
				.style("left",function(){return (pos[0]<w/2 ? pos[0]+ng : pos[0]-note_w-ng)+"px"})
				.style("top",function(){return (pos[1]<w/2 ? pos[1]+ng : pos[1]-note_w-ng)+"px"})
				.style("display","block");
			d3.select("#note_head")
				.text(function(){return d.data.text});
			d3.select("#note_text")
				.html(function(){return d.data.note ? d.data.note : "暂无简介"});
			d3.event.stopPropagation();
		});
	circle.transition()
		.delay(function(d,i){return i*10+Math.random()*200})
		.style("fill",function(d){
			return d.data.resource ? color(parseInt(d.data.resource[0])) : "#66CCFF";
		})
		.attr("transform",function(d){
				return "rotate("+(d.x-90)+")translate("+ d.y +")";
		});
	//t_remove+add
	d3.selectAll("g.node").remove();
	var g_nodes=svg.selectAll("g.node")
		.data(nodes)
		.enter()
		.append("g")
		.attr("class","node")
		.attr("transform",function(d){
			return "rotate("+(d.x-90)+")translate("+ d.y +")";
		});
	var pth=192;
	g_nodes.append("text")
		.attr("class","text")
		.attr("dx",function(d){return d.x>pth ? -6 : 6})
		.attr("dy",4)
		.attr("text-anchor",function(d){return d.x>pth ? "end" : "start"})
		.attr("transform",function(d){return d.x>pth ? "rotate(180)" : null})
		.text(function(d){return d.data.text})
		.transition()
		.delay(function(d,i){return i*10+Math.random()*200})
		.style("fill","#FFF");
}
//add botton event
d3.selectAll("#bb .but").on("click",function(){
	d3.selectAll(".circle").style("stroke","none");
	d3.select("#note").style("display","none");
	d3.selectAll("#bb .but").style("border-color","#666");
	d3.select(this).style("border-color","#FFF");
	var tid=d3.select(this).attr("id");
	var hasData=(tid=="effects" || tid=="expression" || tid=="xpresso");
	if(hasData && tid != now){
		//console.log(tid+","+now);
		d3.json("./data/"+tid+".json",function(data){
			if(tid=="effects"){
				padding=240;
			}else if(tid=="expression"){
				padding=320;
			}else if(tid=="xpresso"){
				padding=420;
			}
			cluster=d3.layout.cluster()
			    .size([360,w/2-padding])
			    .sort(null);
			nodes=cluster.nodes(data);
			links=cluster.links(nodes);
			change(tid);
			now=tid;
		});
	}
	d3.event.stopPropagation();
});
document.getElementById("effects").click();
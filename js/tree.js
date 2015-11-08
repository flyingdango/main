var dt={};
var dnl=["effects","expression","xpresso","snap"];
var padl=[240,320,420,360];
var nodes,links;
var w=1600;
var oComp=document.getElementById("comp");
var now="";
var note_w=320;

d3.select("#note")
	.style({"width":note_w+"px","height":note_w+"px"})
	.on("click",function(){
		d3.event.stopPropagation();
	});
d3.select(document)
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
	.attr({width:w,height:w});
	//下层 放线
var g2=svg.append("g")
	.attr("transform","translate("+w/2+","+w/2+")");
	//上层 放圆+字
var g1=svg.append("g")
	.attr("transform","translate("+w/2+","+w/2+")");
var color=d3.scale.category20();
var curve=d3.svg.diagonal()
	.projection(function projection(d) {
  		var r=d.y;
  		var a= (d.x-90)/180*Math.PI;
  		return [r *Math.cos(a),r*Math.sin(a)];
	});
function change(name){
	//line
	var line=g2.selectAll("path.line").data(links);
	line.exit().remove();
	line.enter().append("path")
		.attr("class","line");
	line.transition()
		.style("stroke","#000")
		.transition()
		.delay(function(){
			return nodes.length*10;
		})
		.duration(1000)
		.attr("d",curve)
		.style("stroke","#666");
	//c_remove+add+update
	var circle=g1.selectAll(".circle").data(nodes);
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
	var g_nodes=g1.selectAll("g.node")
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
function load(index){
	dt[dnl[index]]={};
	var cluster=d3.layout.cluster()
	    	.size([360,w/2-padl[index]])
	    	.sort(null);
	d3.json("./data/"+dnl[index]+".json",function(data){
		var tnodes=cluster.nodes(data);
		dt[dnl[index]].nodes=(tnodes);
		dt[dnl[index]].links=(cluster.links(tnodes));
	});
}
for(var n=0;n<dnl.length;n++){
	load(n);
}

d3.timer(function(){
	//console.log(dt[dnl[0]]);
	if(dt[dnl[dnl.length-1]] && dt[dnl[0]]){
		if(! dt[dnl[0]].nodes){return false}
		if(dt[dnl[0]].nodes.length<270){return false}
		d3.selectAll("#comp,#bb").style("display","block");
		d3.selectAll("#loading").style("display","none");
		d3.selectAll("#bb .but").on("click",function(){
			d3.selectAll(".circle").style("stroke","none");
			d3.select("#note").style("display","none");
			d3.selectAll("#bb .but").style("border-color","#666");
			d3.select(this).style("border-color","#FFF");
			var tid=d3.select(this).attr("id");
			if(tid != now){
				nodes=dt[tid].nodes;
				links=dt[tid].links;
				change(tid);
				now=tid;
			}
			d3.event.stopPropagation();
		});
		var t=setTimeout(function(){
			document.getElementById("effects").click();
			clearTimeout(t);
		},500);
		return true;
	}
},500);

const body = d3.select('body').append('div')
  .attr('id','backdiv');

// create four div for four parts of the dashboard
const formDiv = body.append('div')
  .attr('id','formdiv')
  .attr('class','blockdiv');
const topDiv = body.append('div')
  .attr('id','topdiv')
  .attr('class','blockdiv');
const leftBottomDiv = body.append('div')
  .attr('id','leftbottomdiv')
  .attr('class','blockdiv');
const rightBottomDiv = body.append('div'
)
  .attr('id','rightbottomdiv')
  .attr('class','blockdiv');
let topSvg; 
  
//get the data and make the dashboard
d3.csv('static/business.csv',function(error,flare) {
  d3.csv('static/toge.csv',function(error,root) {
      let yearMonth = [];
      let companys = [];
      let businesses = [];

      for(let i in flare) {
        let flag = true;
        for(let j in yearMonth) {
          if(yearMonth[j] === flare[i].年月) {flag = false;}
        }
        if(flag) {yearMonth.push(flare[i].年月);}
      }
  
      for(let i in flare) {
        let flag = true;
        for(let j in companys) {
          if(companys[j] === flare[i].公司) {flag = false;}
        }
        if(flag) {companys.push(flare[i].公司)}
      }
  
    for(let i in flare) {
      let flag = true;
      for(let j in businesses) {
        if(businesses[j] === flare[i].业务线) {flag = false;}
      }
      if(flag) {businesses.push(flare[i].业务线)}
    }
    yearMonth.sort(function(a,b) {return b-a;});
    companys.sort();
    businesses.sort();
    formPart(yearMonth,companys,businesses);
    let data = getTheDataFromForm();

    topMake(flare,root,data);
    leftMake(flare,root,data);
    rightMake(flare,root,data);
    });
});

function redraw() {
  
  d3.csv('static/business.csv',function(error,flare) {
    d3.csv('static/toge.csv',function(error,root) {
      let data = getTheDataFromForm();
      topDiv.html('');
      topMake(flare,root,data);
      leftBottomDiv.html('');
      leftMake(flare,root,data);
      rightBottomDiv.html('');
      rightMake(flare,root,data);
    });
  });
}

function formPart(yearMonth,companys,businesses) {
    // the form part of the dashboard
    // create five part for the form  
    const divTitle = formDiv.append('div')
    .attr('id','titlediv');
    const date = formDiv.append('div')
    .attr('id','dateCho');
    const business = formDiv.append('div')
    .attr('id','busCho');
    const company = formDiv.append('div')
    .attr('id','comCho');
    const binSel = formDiv.append('div')
    .attr('id','binCho');
    const check = formDiv.append('div')
    .attr('id','cheCho');

    // the title of the form
    divTitle.append('b').text('显示选择: ');  
    
    
    date.append('b').text('日期选择: ');
    const dateSel = date.append('select')
      .attr('id','datechoice');
    dateSel.selectAll('option').data(yearMonth).enter()
      .append('option')
      .attr('class','options')
      .text(function(d,i) {
        return yearMonth[i];
      })
      .on('click',redraw);
    
    
    // the choice of the business
    business.append('b').text('业务选择: ');
    const busSel = business.append('select')
      .attr('id','businesschoice');
    busSel.selectAll('option').data(businesses).enter()
    .append('option')
    .attr('class','options')
    .text(function(d,i) {
        return businesses[i];
    })
    .on('click',redraw);

    // the choice of the company
    company.append('b').text('公司选择: ')
    const comSel = company.append('select')
      .attr('id','companychoice')
    comSel.selectAll('option').data(companys).enter()
    .append('option')
    .attr('class','options')
    .text(function(d,i) {
        return companys[i];
    })
    .on('click',redraw);
    
    // the choice between monthly or altogether
    const bin1 = binSel.append('input')
    .attr('type','radio')
    .attr('name','bin')
    .attr('id','binchoice')
    .text('the month')
    .attr('checked','')
	.on('click',redraw);
	
    const label1 = binSel.append('b').text('当月');
    const bin2 = binSel.append('input')
    .attr('type','radio')
    .attr('name','bin')
	.on('click',redraw);
    const label2 = binSel.append('b')
    .text('累计');

    // the choice to display all
    const check1 = check.append('input')
    .attr('id','checkchoice')
    .attr('type','checkbox')
	.on('click',redraw);
    const label3 = check.append('b')
    .text('显示全部');
    
}

//指标后带M为上月，带L为上年同期，带P为同行平均, 带T为预算目标, !!!!结尾带A为累计计算
function topMake(flare,root,data) {
  
topSvg = topDiv.append('svg')
  .attr('width','800')
  .attr('height','240')
  .attr('id','topsvg')
  .style('background-color','white');
  //get the form data
  const com = data.companyResult;
  const bus = data.businessResult;
  const date = data.dateResult;
  const firstChoice = data.binResult;
  const secondChoice = data.cheResult;

  
  let sales = 0;
  let salesT = 0;
  let salesP = 0;
  let cost = 0;
  
  //get the year, last year, month and last month
  const year = Math.floor(date/100);
  let pastYear = (parseInt(date) - 100).toString();
  const month = date - year * 100;
  let pastMonth = '';
 
  if((parseInt(date) - 1) % 100 === 0) {
	pastMonth = (parseInt(date) - 89).toString();
  }
  else {
	pastMonth = (parseInt(date) - 1).toString();
  }
  
  //get this month's sales data (本期,同业,目标,成本)
  for(let i = 0; i < flare.length; i++) {
    if((flare[i].年月 === date) && (flare[i].公司 === com) && flare[i].业务线 === bus) {
      sales += parseInt(flare[i].本期销售额);
      salesP += parseInt(flare[i].同业平均);
      salesT += parseInt(flare[i].目标销售额);
      cost += parseInt(flare[i].销售成本);
    }
  }
  
  ////get last year's this month's sales data (同期,成本)
  let salesL = 0;
  let costL = 0;
  for(let i = 0; i < flare.length; i++) {
    if((flare[i].年月 === pastYear) && (flare[i].公司 === com) && flare[i].业务线 === bus) {
      salesL += parseInt(flare[i].本期销售额);
      costL += parseInt(flare[i].销售成本);
    }
  }
  
  //get last month's sales data (环比,成本)
  let costM = 0;
  let salesM = 0;
  for(let i = 0; i < flare.length; i++) {
    if((flare[i].年月 === pastMonth) && (flare[i].公司 === com) && flare[i].业务线 === bus) {
      salesM += parseInt(flare[i].本期销售额);
      costM += parseInt(flare[i].销售成本);
    }
  }
  
  let dateArray = [];
  for(let i = year * 100 + 1; i <= date; i++) {
	dateArray.push(i);
  }
  
  let dateArrayL = [];
  for(let i = (year - 1) * 100 + 1; i <= pastYear; i++) {
	dateArrayL.push(i);
  }
  
   
  let salesA = 0;
  let salesTA = 0;
  let salesPA = 0;
  let costA = 0;
  for(let i in dateArray) {
	for(let j = 0; j < flare.length; j++) {
	  if((flare[j].年月 === dateArray[i].toString()) && (flare[j].公司 === com) && flare[j].业务线 === bus) {
		salesA += parseInt(flare[j].本期销售额);
		salesPA += parseInt(flare[j].同业平均);
		salesTA += parseInt(flare[j].目标销售额);
		costA += parseInt(flare[j].销售成本);
	  }
	}	  
  }
  
  let salesLA = 0;
  let costLA = 0;
  for(let i in dateArrayL) {
	for(let j = 0; j < flare.length; j++) {
      if((flare[j].年月 === dateArrayL[i].toString()) && (flare[j].公司 === com) && flare[j].业务线 === bus) {
        salesLA += parseInt(flare[i].本期销售额);
        costLA += parseInt(flare[i].销售成本);	  
	  }
	}
  }


  //build the svg

  //the top title
  const topTitle = topSvg.append('text')
    .text('经营能力: ')
    .style('text-anchor','start')
    .style('font-weight','bold')
    .attr('transform','translate(5,20)');
 
  
  
  // the build of the first top gauge
  {
	const top1 = topSvg.append('g');
    const topTitle = topSvg.append('text')
      .text('销售收入增加率(%)')
      .style('text-anchor','middle')
      .style('font-weight','bold')
      .attr('transform','translate(145,40)');
    let percentInGauge = 0;
    let percentInLeft = 0;
    let percentInMiddle = 0;
    let percentInRight = 0;
    if(firstChoice)	{
      percentInGauge = Math.round(((salesM - sales)/salesM * 100));
	  percentInLeft = Math.round(((salesT - sales)/salesT * 100));
	  percentInMiddle = Math.round(((salesL - sales)/salesL * 100));
	  percentInRight = Math.round(((salesP - sales)/salesP * 100));
	} else {
	  percentInGauge = Math.round(((salesM - sales)/salesM * 100));
	  percentInLeft = Math.round(((salesTA - salesA)/salesTA * 100));
	  percentInMiddle = Math.round(((salesLA - salesA)/salesLA * 100));
	  percentInRight = Math.round(((salesPA - salesA)/salesPA * 100));
	}
    
	//the value of the gauge
    let titleGP = topSvg.append('text')
      .style('text-anchor','middle')
      .attr('transform','translate(145,180)')
      .text(percentInGauge + '%');
	let titleL = topSvg.append('text')
      .style('text-anchor','middle')
      .attr('transform','translate(65,210)')
	  .text('环比');
	let titleM = topSvg.append('text')
      .style('text-anchor','middle')
      .attr('transform','translate(145,210)')
	  .text('同比');
	let titleR = topSvg.append('text')
      .style('text-anchor','middle')
      .attr('transform','translate(225,210)')
	  .text('同行');
    //the value of the left, middle, right bottom 
    let titleLP = topSvg.append('text')
      .style('text-anchor','middle')
      .attr('transform','translate(65,230)')       
    let titleMP = topSvg.append('text')
      .style('text-anchor','middle')
      .attr('transform','translate(145,230)');
    let titleRP = topSvg.append('text')
      .style('text-anchor','middle')
      .attr('transform','translate(225,230)');
	
    if(!secondChoice) {
	  titleL.attr('font-size','0');
	  titleM.attr('font-size','0');
	  titleR.attr('font-size','0');
      titleLP.attr('font-size','0');
	  titleMP.attr('font-size','0');
	  titleRP.attr('font-size','0');
    }	  
    //judge the color of the value 
    if(percentInGauge > 0) {
      titleGP.attr('fill','green')
        .text('\u25B2' + Math.abs(percentInGauge) + '%');
    } else {
        titleGP.attr('fill','red')
        .text('\u25BC' + Math.abs(percentInGauge) + '%');
    }
    
    if(percentInLeft > 0) {
      titleLP.attr('fill','green')
        .text('\u25B2' + Math.abs(percentInLeft) + '%');
    } else {
        titleLP.attr('fill','red')
          .text('\u25BC' + Math.abs(percentInLeft) + '%');
    }
    
    if(percentInMiddle > 0) {
      titleMP.attr('fill','green')
        .text('\u25B2' + Math.abs(percentInMiddle) + '%');
    } else {
        titleMP.attr('fill','red')
          .text('\u25BC' + Math.abs(percentInMiddle) + '%');
    }
    
    if(percentInRight > 0) {
      titleRP.attr('fill','green')
        .text('\u25B2' + Math.abs(percentInRight) + '%');
    } else {
        titleRP.attr('fill','red')
          .text('\u25BC' + Math.abs(percentInRight) + '%');
    }
        
        
    let gauge = iopctrl.arcslider()
      .radius(100)
      .bands([
        {"domain": [75, 100], "span":[0.95, 1] , "class": "fault"},
        {"domain": [50, 75], "span": [0.95, 1] , "class": "warning"},
        {"domain": [0, 50], "span": [0.95, 1] , "class": "ok"}
      ])
      .events(false)
      .indicator(iopctrl.defaultGaugeIndicator);
    
        // set the axis of the dashboard
    let aa = gauge.axis()
      .orient('in')
      .normalize(true)
      .ticks(12)
      .tickSubdivide(4)
      .tickSize(15, 8, 15)
      .tickPadding(10)
      .tickValues([0,20,40,60,80,100])
      .tickFormat(function(d) {
        return d + '%';
      })
      .scale(d3.scale.linear()
      .domain([00, 100])
      .range([-2*Math.PI/4, 2*Math.PI/4])
      );
    
    // show the dashboard
    let segDisplay = iopctrl.segdisplay();  
    
    let tt = top1.append('g')
      .attr('class', 'gauge')
      .attr('transform', 'translate(-10,0)')
      .style('background-color', 'gray')
      .call(gauge);	 
    let vv = gauge.value(percentInGauge); 
    
  }

  
  
  // the second top gauge 
  const top2 = topSvg.append('g');  
  const topTitle2 = topSvg.append('text')
    .text('毛利率(%)')
    .style('text-anchor','middle')
    .style('font-weight','bold')
    .attr('transform','translate(400,40)');

  {
    let percentInGauge = 0;
    let percentInLeft = 0;
    let percentInMiddle = 0;
    let percentInRight = 0;
    if(firstChoice) {
      percentInGauge = Math.round((sales - cost)/sales * 100); 
      percentInLeft = Math.round(((salesM - costM)/salesM * 100));
      percentInMiddle = Math.round(((salesL - costL)/salesL * 100));
      percentInRight = Math.round(((salesP - 10000000)/salesP * 100));
    } else {
	  percentInGauge = Math.round((salesA - costA)/salesA * 100); 
      percentInLeft = Math.round(((salesM - costM)/salesM * 100));
      percentInMiddle = Math.round(((salesLA - costLA)/salesLA * 100));
      percentInRight = Math.round(((salesPA - 10000000 * dateArray.length)/salesPA * 100));
    }
  
  
    let titleGP = topSvg.append('text')
      .style('text-anchor','middle')
      .attr('transform','translate(400,180)')
      .text(percentInGauge + '%');


    let titleLP = topSvg.append('text')
      .style('text-anchor','middle')
      .attr('transform','translate(320,230)')       
    let titleMP = topSvg.append('text')
      .style('text-anchor','middle')
      .attr('transform','translate(400,230)');
    let titleRP = topSvg.append('text')
      .style('text-anchor','middle')
      .attr('transform','translate(480,230)');
	let titleL = topSvg.append('text')
      .style('text-anchor','middle')
      .attr('transform','translate(320,210)')
	  .text('环比');
	let titleM = topSvg.append('text')
      .style('text-anchor','middle')
      .attr('transform','translate(400,210)')
	  .text('同比');
	let titleR = topSvg.append('text')
      .style('text-anchor','middle')
      .attr('transform','translate(480,210)')
	  .text('同行');
	
    if(!secondChoice) {
      titleLP.attr('font-size','0');
	  titleMP.attr('font-size','0');
	  titleRP.attr('font-size','0');
	  titleL.attr('font-size','0');
	  titleM.attr('font-size','0');
	  titleR.attr('font-size','0');
    }	  
     
    if(percentInGauge > 0) {
      titleGP.attr('fill','green')
        .text('\u25B2' + Math.abs(percentInGauge) + '%');
    } else {
      titleGP.attr('fill','red')
        .text('\u25BC' + Math.abs(percentInGauge) + '%');
    }
    
    if(percentInLeft > 0) {
      titleLP.attr('fill','green')
        .text('\u25B2' + Math.abs(percentInLeft) + '%');
    } else {
      titleLP.attr('fill','red')
        .text('\u25BC' + Math.abs(percentInLeft) + '%');
    }
    
    if(percentInMiddle > 0) {
      titleMP.attr('fill','green')
        .text('\u25B2' + Math.abs(percentInMiddle) + '%');
    } else {
      titleMP.attr('fill','red')
        .text('\u25BC' + Math.abs(percentInMiddle) + '%');
    }
    
    if(percentInRight > 0) {
      titleRP.attr('fill','green')
        .text('\u25B2' + Math.abs(percentInRight) + '%');
    } else {
      titleRP.attr('fill','red')
        .text('\u25BC' + Math.abs(percentInRight) + '%');
    }
        
    if(percentInGauge > 0) {
      titleGP.attr('fill','green')
        .text('\u25B2' + Math.abs(percentInGauge) + '%');
    } else {
      titleGP.attr('fill','red')
        .text('\u25BC' + Math.abs(percentInGauge) + '%');
    }

  let gauge = iopctrl.arcslider()
    .radius(100)
    .bands([
	  {"domain": [75, 100], "span":[0.95, 1] , "class": "fault"},
	  {"domain": [50, 75], "span": [0.95, 1] , "class": "warning"},
	  {"domain": [0, 50], "span": [0.95, 1] , "class": "ok"}
    ])
    .events(false)
    .indicator(iopctrl.defaultGaugeIndicator);
  
    // set the axis of the dashboard
  let a1 = gauge.axis()
    .orient('in')
    .normalize(true)
    .ticks(12)
    .tickSubdivide(4)
    .tickSize(15, 8, 15)
    .tickPadding(10)
    .tickValues([0,20,40,60,80,100])
    .tickFormat(function(d) {
	  return d + '%';
    })
    .scale(d3.scale.linear()
    .domain([0, 100])
    .range([-2*Math.PI/4, 2*Math.PI/4])
  );
  
  // show the dashboard
  let segDisplay = iopctrl.segdisplay();   
  let t1 = top2.append('g')
    .attr('class', 'gauge')
    .attr('transform', 'translate(245,0)')
    .style('background-color', 'gray')
    .call(gauge);	 
  let v1 = gauge.value(percentInGauge);  
  // fix the position of every parts of the dashboard
  }


  
  const yearEnd = year * 100 + 12;
  const yearStart = year * 100 + 1;

  //
  let assetsEnd = 0;
  let assetsStart = 0;
  
  for(let i in root) {
    if(com === root[i].公司 && yearEnd.toString() === root[i].年月) 
	{
	  assetsEnd = root[i].月初资产余额;
	}
  }
  
  for(let i in root) {
    if(com === root[i].公司 && yearStart.toString() === root[i].年月) {
	  assetsStart = root[i].年初资产总额;
    }
  }

  
  const top3 = topSvg.append('g');
  const topTitle3 = topSvg.append('text')
    .text('总资产增长率(%)')
    .style('text-anchor','middle')
    .style('font-weight','bold')
    .attr('transform','translate(655,40)');
	
    {
    let percentInGauge = Math.floor((assetsEnd - assetsStart) / assetsStart * 100);
	
    let titleGP = topSvg.append('text')
      .style('text-anchor','middle')
      .attr('transform','translate(655,180)')
      .text(percentInGauge + '%');
        
    let titleMP = topSvg.append('text')
      .style('text-anchor','middle')
      .attr('transform','translate(655,230)')
      .text(30 + '万元');
	  
	let titleM = topSvg.append('text')
      .style('text-anchor','middle')
      .attr('transform','translate(655,210)')
	  .text('三年平均');
	  
    if(!secondChoice) {
	  titleMP.attr('font-size','0');
	  titleM.attr('font-size','0');
	}
        
    if(percentInGauge > 0) {
      titleGP.attr('fill','green')
        .text('\u25B2' + Math.abs(percentInGauge) + '%');
    } else {
      titleGP.attr('fill','red')
        .text('\u25BC' + Math.abs(percentInGauge) + '%');
    }
        
  let gauge = iopctrl.arcslider()
    .radius(100)
    .bands([
	  {"domain": [75, 100], "span":[0.95, 1] , "class": "fault"},
	  {"domain": [5, 75], "span": [0.95, 1] , "class": "warning"},
	  {"domain": [0, 50], "span": [0.95, 1] , "class": "ok"}
    ])
    .events(false)
    .indicator(iopctrl.defaultGaugeIndicator);
  
  // set the axis of the dashboard
  let a1 = gauge.axis()
    .orient('in')
    .normalize(true)
    .ticks(12)
    .tickSubdivide(4)
    .tickSize(15, 8, 15)
    .tickPadding(10)
    .tickValues([0,20,40,60,80,100])
    .tickFormat(function(d) {
	  return d + '%';
    })
    .scale(d3.scale.linear()
    .domain([00, 100])
    .range([-2*Math.PI/4, 2*Math.PI/4])
  );
  
  // show the dashboard
  let segDisplay = iopctrl.segdisplay();   
  let t1 = top3.append('g')
    .attr('class', 'gauge')
    .attr('transform', 'translate(500,0)')
    .style('background-color', 'gray')
    .call(gauge);	 
  let v1 = gauge.value(percentInGauge);  
  // fix the position of every parts of the dashboard
  //d3.select('#topsvg').append('a').attr('href',"data").append('rect').attr('width',250).attr('height','240').style('opacity','0').attr('title','tomap');
  d3.select('#topsvg').append('rect').attr('width',250).attr('height','240').style('opacity','0').attr('title','tomap').on('click',tonew);
  }
}

function tonew() {
  
  $.ajax({
    type: "get",
    url: "/gejson",
    data: getTheDataFromForm(),
    dataType: "json"
  });
  
  
  window.location.href='/data';
}

//指标后带M为上月，带L为上年同期，带P为同行平均, 带T为预算目标, !!!!结尾带A为累计计算
function leftMake(flare,root,data) {
  const com = data.companyResult;
  const bus = data.businessResult;
  const date = data.dateResult;
  const firstChoice = data.binResult;
  const secondChoice = data.cheResult;

  //get the year, last year, month and last month
  const year = Math.floor(date/100);
  let pastYear = (parseInt(date) - 100).toString();
  const month = date - year * 100;
  let pastMonth = '';
 
  if((parseInt(date) - 1) % 100 === 0) {
	pastMonth = (parseInt(date) - 89).toString();
  }
  else {
	pastMonth = (parseInt(date) - 1).toString();
  }
  
  let dateArray = [];
  for(let i = year * 100 + 1; i <= date; i++) {
	dateArray.push(i);
  }

  let dateArrayL = [];
  for(let i = (year - 1) * 100 + 1; i <= pastYear; i++) {
	dateArrayL.push(i);
  }
  
  let roundDay1 = 0;
  let roundDay2 = 0;
  let roundDay3 = 0;
  
  for(let i in root) {
    if(root[i].年月 === date && root[i].公司 === com) {
      roundDay1 = parseInt(root[i].应收周转天数);
      roundDay2 = parseInt(root[i].库存周转天数);
      roundDay3 = parseInt(root[i].应付周转天数);
    }
  }
  
  const roundDay = roundDay1 + roundDay2 - roundDay3;
  
  let roundDay1L = 0;
  let roundDay2L = 0;
  let roundDay3L = 0;
  
 //去年
  for(let i in root) {
    if(root[i].年月 === date && root[i].公司 === com) {
      roundDay1L = parseInt(root[i].应收周转天数);
      roundDay2L = parseInt(root[i].库存周转天数);
      roundDay3L = parseInt(root[i].应付周转天数);
    }
  }

  const roundDayL = roundDay1L + roundDay2L - roundDay3L;
  
  const roundDayP = 20;
  
  let roundDay1A = 0;
  let roundDay2A = 0;
  let roundDay3A = 0;
  for(let i in dateArray) {
	for(let j in root) {
	  if((root[j].年月 === dateArray[i].toString()) && (root[j].公司 === com)) {
	    roundDay1A += parseInt(root[j].应收周转天数);
	    roundDay2A += parseInt(root[j].库存周转天数);
        roundDay3A += parseInt(root[j].应付周转天数);
	  }
    }
  }
  const roundDayA = roundDay1A + roundDay2A - roundDay3A;
  
  let roundDay1LA = 0;
  let roundDay2LA = 0;
  let roundDay3LA = 0;
  for(let i in dateArrayL) {
	for(let j in root) {
	  if((root[j].年月 === dateArrayL[i].toString()) && (root[j].公司 === com)) {
	    roundDay1LA += parseInt(root[j].应收周转天数);
	    roundDay2LA += parseInt(root[j].库存周转天数);
        roundDay3LA += parseInt(root[j].应付周转天数);
	  }
    }
  }
  const roundDayLA = roundDay1LA + roundDay2LA - roundDay3LA;
	    
  const leftSvg = leftBottomDiv.append('svg')
    .attr('width','395')
    .attr('height','240')
    .style('background-color','white');
  const leftTitle = leftSvg.append('text')
    .text('企业效率: ')
    .style('text-anchor','start')
    .style('font-weight','bold')
    .attr('transform','translate(5,20)');
    
  const left1 = leftSvg.append('g');
  const leftTitle1 = leftSvg.append('text')
    .text('营运资金周转天数(%)')
    .style('text-anchor','middle')
    .style('font-weight','bold')
    .attr('transform','translate(105,50)');
  {
	let percentInGauge = 0;
    let percentInLeft = 0;
    let percentInRight = 0;
	
	if(firstChoice) {
      percentInGauge = Math.round((roundDay/365)*100);
      percentInLeft = Math.round((roundDayL/365)*100);
      percentInRight = Math.round((roundDayP/365)*100);
	} else {
      percentInGauge = Math.round((roundDayA/365)*100);
      percentInLeft = Math.round((roundDayLA/365)*100);
      percentInRight = Math.round((roundDayP * dateArray.length/365)*100);
	}
    
    
    let titleGP = leftSvg.append('text')
      .style('text-anchor','middle')
      .attr('transform','translate(100,180)')
      .text(percentInGauge + '%');
    let titleLP = leftSvg.append('text')
      .style('text-anchor','middle')
      .attr('transform','translate(60,230)');
    let titleRP = leftSvg.append('text')
      .style('text-anchor','middle')
      .attr('transform','translate(140,230)');
	let titleL = leftSvg.append('text')
      .style('text-anchor','middle')
      .attr('transform','translate(60,200)')
	  .text('同期');
	let titleR = leftSvg.append('text')
      .style('text-anchor','middle')
      .attr('transform','translate(140,200)')
	  .text('同行');


    if(!secondChoice) {
      titleLP.attr('font-size','0');
	  titleRP.attr('font-size','0');
	  titleL.attr('font-size','0');
	  titleR.attr('font-size','0');
    }	

    if(percentInGauge > 0) {
      titleGP.attr('fill','green')
        .text('\u25B2' + Math.abs(percentInGauge) + '%');
    } else {
      titleGP.attr('fill','red')
        .text('\u25BC' + Math.abs(percentInGauge) + '%');
    }
    
    if(percentInLeft > 0) {
      titleLP.attr('fill','green')
        .text('\u25B2' + Math.abs(percentInLeft) + '%');
    } else {
      titleLP.attr('fill','red')
        .text('\u25BC' + Math.abs(percentInLeft) + '%');
    }
    
    if(percentInRight > 0) {
      titleRP.attr('fill','green')
        .text('\u25B2' + Math.abs(percentInRight) + '%');
    } else {
      titleRP.attr('fill','red')
        .text('\u25BC' + Math.abs(percentInRight) + '%');
    }
    
    let gauge = iopctrl.arcslider()
      .radius(75)
      .bands([
	    {"domain": [75, 100], "span":[0.95, 1] , "class": "fault"},
	    {"domain": [50, 75], "span": [0.95, 1] , "class": "warning"},
	    {"domain": [0, 50], "span": [0.95, 1] , "class": "ok"}
      ])
      .events(false)
      .indicator(iopctrl.defaultGaugeIndicator);
  
    // set the axis of the dashboard
    let a1 = gauge.axis()
      .orient('in')
      .normalize(true)
      .ticks(12)
      .tickSubdivide(4)
      .tickSize(15, 8, 15)
      .tickPadding(10)
      .tickValues([0,20,40,60,80,100])
      .tickFormat(function(d) {
	    return d + '%';
      })
      .scale(d3.scale.linear()
      .domain([0, 100])
      .range([-2*Math.PI/4, 2*Math.PI/4])
    );
  
  // show the dashboard
    let segDisplay = iopctrl.segdisplay();   
    let t1 = left1.append('g')
      .attr('class', 'gauge')
      .attr('transform', 'translate(-20,20)')
      .style('background-color', 'gray')
      .call(gauge);	 
    let v1 = gauge.value(percentInGauge);  
    // fix the position of every parts of the dashboard
    }
  
  const left2 = leftSvg.append('g');
  const leftTitle2 = leftSvg.append('text')
    .text('EBIT(%)')
    .style('text-anchor','middle')
    .style('font-weight','bold')
    .attr('transform','translate(295,50)');

  let EBITDA = 0;
  let EBIT = 0;
  let beOld = 0;
  let pushCost = 0;
  for(let i in root) {
    if((root[i].年月 === date) && (root[i].公司 === com)) {
        EBIT = 10000;
        beOld = 10000;
        pushCost = 10000;
    }
  }
  
  EBITDA = EBIT + beOld + pushCost;
  
  let EBITDAM = 0;
  let EBITM = 0;
  let beOldM = 0;
  let pushCostM = 0;

  for(let i in root) {
    if((root[i].年月 === pastMonth) && (root[i].公司 === com)) {
        EBITM = 9000;
        beOldM = 9000;
        pushCostM = 9000;
    }
  }
  
  EBITDAM = EBITM + beOldM + pushCostM;
  
  let EBITDAL = 0;
  let EBITL = 0;
  let beOldL = 0;
  let pushCostL = 0;
  
  for(let i in root) {
    if((root[i].年月 === pastMonth) && (root[i].公司 === com)) {
        EBITL = 8000;
        beOldL = 8000;
        pushCostL = 8000;
    }
  }

  EBITDAL = EBITL + beOldL + pushCostL;
  
  let EBITDAT = 0;
  let EBITT = 0;
  let beOldT = 0;
  let pushCostT = 0;
  
  for(let i in root) {
    if((root[i].年月 === pastMonth) && (root[i].公司 === com)) {
        EBITT = 8500;
        beOldT = 8500;
        pushCostT = 8500;
    }
  }

  EBITDAT = EBITT + beOldT + pushCostT;

  
  EBITDAP = 26000;
  
  let EBITDAA = 0;
  let EBITA = 0;
  let beOldA = 0;
  let pushCostA = 0;
  for(let i in dateArray){
    for(let j in root) {
      if((root[j].年月 === date) && (root[j].公司 === com)) {
        EBITA += 10000;
        beOldA += 10000;
        pushCostA += 10000;
     }
    }
  }
  
  EBITDAA = EBITA + beOldA + pushCostA;

/*
  let EBITDAM = 0;
  let EBITM = 0;
  let beOldM = 0;
  let pushCostM = 0;

  for(let i in root) {
    if((root[i].年月 === pastMonth) && (root[i].公司 === com)) {
        EBITM = 9000;
        beOldM = 9000;
        pushCostM = 9000;
    }
  }
  
  EBITDAM = EBITM + beOldM + pushCostM;
*/  
  let EBITDALA = 0;
  let EBITLA = 0;
  let beOldLA = 0;
  let pushCostLA = 0;
  
  for(let i in dateArrayL) {
    for(let j in root) {
      if((root[j].年月 === pastMonth) && (root[j].公司 === com)) {
        EBITLA += 8000;
        beOldLA += 8000;
        pushCostLA += 8000;
      }
    }
  }

  EBITDALA = EBITLA + beOldLA + pushCostLA;

  let EBITDATA = 0;
  let EBITTA = 0;
  let beOldTA = 0;
  let pushCostTA = 0;
  
  for(let i in dateArray) {
    for(let j in root) {
      if((root[j].年月 === pastMonth) && (root[j].公司 === com)) {
        EBITTA += 8500;
        beOldTA += 8500;
        pushCostTA += 8500;
      }
    }
  }

  EBITDATA = EBITTA + beOldTA + pushCostTA;
  
  EBITDAPA = 26000 * dateArray.length;
 
  
  {
    let percentInGauge = 0;
    let percentInLeft = 0;
    let percentInMiddle = 0;
    let percentInRight = 0;


	if(firstChoice) {
      percentInGauge = Math.round(EBITDA / EBITDAM * 100);
      percentInLeft = Math.round(EBITDA / EBITDAT * 100);
      percentInMiddle = Math.round(EBITDA / EBITDAL * 100);
      percentInRight = Math.round(EBITDA / EBITDAP * 100);
	} else {
      percentInGauge = Math.round(EBITDA / EBITDAM * 100);
      percentInLeft = Math.round(EBITDAA / EBITDATA * 100);
      percentInMiddle = Math.round(EBITDAA / EBITDALA * 100);
      percentInRight = Math.round(EBITDAA / EBITDAPA * 100);
	}
    
    
    let titleGP = leftSvg.append('text')
      .style('text-anchor','middle')
      .attr('transform','translate(295,180)')
      .text(percentInGauge + '%');
    let titleLP = leftSvg.append('text')
      .style('text-anchor','middle')
      .attr('transform','translate(235,230)');
    let titleMP = leftSvg.append('text')
      .style('text-anchor','middle')
      .attr('transform','translate(295,230)');
    let titleRP = leftSvg.append('text')
      .style('text-anchor','middle')
      .attr('transform','translate(355,230)');
    let titleL = leftSvg.append('text')
      .style('text-anchor','middle')
      .attr('transform','translate(235,200)')
	  .text('环比');
    let titleM = leftSvg.append('text')
      .style('text-anchor','middle')
      .attr('transform','translate(295,200)')
	  .text('同比');
    let titleR = leftSvg.append('text')
      .style('text-anchor','middle')
      .attr('transform','translate(355,200)')
	  .text('同行');

    if(!secondChoice) {
      titleLP.attr('font-size','0');
      titleMP.attr('font-size','0');
	  titleRP.attr('font-size','0');
      titleL.attr('font-size','0');
      titleM.attr('font-size','0');
	  titleR.attr('font-size','0');
    }	

    if(percentInGauge > 0) {
      titleGP.attr('fill','green')
        .text('\u25B2' + Math.abs(percentInGauge) + '%');
    } else {
      titleGP.attr('fill','red')
        .text('\u25BC' + Math.abs(percentInGauge) + '%');
    }
    
    if(percentInLeft > 0) {
      titleLP.attr('fill','green')
        .text('\u25B2' + Math.abs(percentInLeft) + '%');
    } else {
      titleLP.attr('fill','red')
        .text('\u25BC' + Math.abs(percentInLeft) + '%');
    }
    
    if(percentInMiddle > 0) {
      titleMP.attr('fill','green')
        .text('\u25B2' + Math.abs(percentInMiddle) + '%');
    } else {
      titleMP.attr('fill','red')
        .text('\u25BC' + Math.abs(percentInMiddle) + '%');
    }
    
    if(percentInRight > 0) {
      titleRP.attr('fill','green')
        .text('\u25B2' + Math.abs(percentInRight) + '%');
    } else {
      titleRP.attr('fill','red')
        .text('\u25BC' + Math.abs(percentInRight) + '%');
    }    
    
    
    
    let gauge = iopctrl.arcslider()
      .radius(75)
      .bands([
	    {"domain": [75, 100], "span":[0.95, 1] , "class": "fault"},
	    {"domain": [50, 75], "span": [0.95, 1] , "class": "warning"},
	    {"domain": [0, 50], "span": [0.95, 1] , "class": "ok"}
      ])
      .events(false)
      .indicator(iopctrl.defaultGaugeIndicator);
  
    // set the axis of the dashboard
    let a1 = gauge.axis()
      .orient('in')
      .normalize(true)
      .ticks(12)
      .tickSubdivide(4)
      .tickSize(15, 8, 15)
      .tickPadding(10)
      .tickValues([0,20,40,60,80,100])
      .tickFormat(function(d) {
	    return d + '%';
      })
      .scale(d3.scale.linear()
      .domain([0, 100])
      .range([-2*Math.PI/4, 2*Math.PI/4])
    );

    // show the dashboard
    let segDisplay = iopctrl.segdisplay();   
    let t1 = left2.append('g')
      .attr('class', 'gauge')
      .attr('transform', 'translate(170,20)')
      .style('background-color', 'gray')
      .call(gauge);	 
    let v1 = gauge.value(percentInGauge);  
  }
}

//指标后带M为上月，带L为上年同期，带P为同行平均, 带T为预算目标, !!!!结尾带A为累计计算
function rightMake(flare,root,data) {
  const com = data.companyResult;
  const bus = data.businessResult;
  const date = data.dateResult;
  const firstChoice = data.binResult;
  const secondChoice = data.cheResult;

  //get the year, last year, month and last month
  const year = Math.floor(date/100);
  let pastYear = (parseInt(date) - 100).toString();
  const month = date - year * 100;
  let pastMonth = '';
 
  if((parseInt(date) - 1) % 100 === 0) {
	pastMonth = (parseInt(date) - 89).toString();
  }
  else {
	pastMonth = (parseInt(date) - 1).toString();
  }
  
  let dateArray = [];
  for(let i = year * 100 + 1; i <= date; i++) {
	dateArray.push(i);
  }

  let dateArrayL = [];
  for(let i = (year - 1) * 100 + 1; i <= pastYear; i++) {
	dateArrayL.push(i);
  }
  
  
  //流动资产
  let moveAssets = 0;
  //存货
  let inAssets = 0;
  //预付账款
  let payAssets = 0;
  //摊派费用
  let putAssets = 0;
  //流动负债总额
  let moveOwe = 0;
  
  for(let i in dateArray) {
    for(let j in root) {
      if(root[j].年月 === dateArray[i].toString() && root[j].公司 === com) {
        moveAssets += parseInt(root[i].流动资产);
        inAssets += parseInt(root[i].存货);
        payAssets += parseInt(root[i].预付账款);
        putAssets += parseInt(root[i].待摊费用);
        moveOwe += parseInt(root[i].流动负债);
      }
    }
  }

  //速动比率
  let movePercent = Math.round((moveAssets - inAssets - payAssets - putAssets) / moveOwe * 100);
  
  const rightSvg = rightBottomDiv.append('svg')
    .attr('width','395')
    .attr('height','240')
    .style('background-color','white');
  const rightTitle = rightSvg.append('text')
    .text('风险管控: ')
    .style('text-anchor','start')
    .style('font-weight','bold')
    .attr('transform','translate(5,20)');
    
  const right1 = rightSvg.append('g');
  const rightTitle1 = right1.append('text')
    .text('速动比率(%)')
    .style('text-anchor','middle')
    .style('font-weight','bold')
    .attr('transform','translate(105,50)');
  {
    let percentInGauge = 0;
    percentInGauge = movePercent;

    let titleGP = rightSvg.append('text')
      .style('text-anchor','middle')
      .attr('transform','translate(100,180)');

    if(percentInGauge > 0) {
      titleGP.attr('fill','green')
        .text('\u25B2' + Math.abs(percentInGauge) + '%');
    } else {
      titleGP.attr('fill','red')
        .text('\u25BC' + Math.abs(percentInGauge) + '%');
    }
    
    let gauge = iopctrl.arcslider()
      .radius(75)
      .bands([
	    {"domain": [75, 100], "span":[0.95, 1] , "class": "fault"},
        {"domain": [50, 75], "span": [0.95, 1] , "class": "warning"},
	    {"domain": [0, 50], "span": [0.95, 1] , "class": "ok"}
      ])
      .events(false)
      .indicator(iopctrl.defaultGaugeIndicator);

  
    // set the axis of the dashboard
    let a1 = gauge.axis()
      .orient('in')
      .normalize(true)
      .ticks(12)
      .tickSubdivide(4)
      .tickSize(15, 8, 15)
      .tickPadding(10)
      .tickValues([0,20,40,60,80,100])
      .tickFormat(function(d) {
	    return d + '%';
      })
      .scale(d3.scale.linear()
      .domain([0, 100])
      .range([-2*Math.PI/4, 2*Math.PI/4])
    );
  
    // show the dashboard
    let segDisplay = iopctrl.segdisplay();   
    let t1 = right1.append('g')
      .attr('class', 'gauge')
      .attr('transform', 'translate(-20,20)')
      .style('background-color', 'gray')
      .call(gauge);	 
    let v1 = gauge.value(percentInGauge);  
    // fix the position of every parts of the dashboard
    }
    
  const right2 = rightSvg.append('g');
  const rightTitle2 = rightSvg.append('text')
    .text('资产负债率(%)')
    .style('text-anchor','middle')
    .style('font-weight','bold')
    .attr('transform','translate(295,50)');
  
  let assets = 0;
  let debt = 0;
  

  for(let i in root) {
    if(root[i].年月 === date && root[i].公司 === com) {
      assets =  parseInt(root[i].月初资产余额) + parseInt(root[i].本月新增资产);
      debt = parseInt(root[i].月初负债余额) + parseInt(root[i].本月新增负债);
    }
  }
  
  
    
  {
    let percentInGauge = 0;
    let leftInGauge = Math.round(debt / 10000);
    
    percentInGauge = Math.round((debt / assets) * 100);

    let titleGP = rightSvg.append('text')
      .style('text-anchor','middle')
      .attr('transform','translate(295,180)');
    let titleLP = rightSvg.append('text')
      .style('text-anchor','middle')
      .attr('transform','translate(255,230)')
      .text(leftInGauge + '万元');
    let titleRP = rightSvg.append('text')
      .style('text-anchor','middle')
      .attr('transform','translate(335,230)')
      .text(50 + '万元');
	let titleL = rightSvg.append('text')
      .style('text-anchor','middle')
      .attr('transform','translate(255,200)')
      .text('负债');
	let titleR = rightSvg.append('text')
      .style('text-anchor','middle')
      .attr('transform','translate(335,200)')
      .text('负债');

    if(percentInGauge > 0) {
      titleGP.attr('fill','green')
        .text('\u25B2' + Math.abs(percentInGauge) + '%');
    } else {
      titleGP.attr('fill','red')
        .text('\u25BC' + Math.abs(percentInGauge) + '%');
    }
    
    if(!secondChoice) {
      titleLP.attr('font-size',0);
      titleRP.attr('font-size',0);
      titleL.attr('font-size',0);
      titleR.attr('font-size',0);
    }
      

  let gauge = iopctrl.arcslider()
    .radius(75)
    .bands([
	  {"domain": [75, 100], "span":[0.95, 1] , "class": "fault"},
	  {"domain": [50, 75], "span": [0.95, 1] , "class": "warning"},
	  {"domain": [0, 50], "span": [0.95, 1] , "class": "ok"}
    ])
    .events(false)
    .indicator(iopctrl.defaultGaugeIndicator);
  
    // set the axis of the dashboard
    let a1 = gauge.axis()
      .orient('in')
      .normalize(true)
      .ticks(12)
      .tickSubdivide(4)
      .tickSize(15, 8, 15)
      .tickPadding(10)
      .tickValues([0,20,40,60,80,100])
      .tickFormat(function(d) {
	    return d + '%';
      })
      .scale(d3.scale.linear()
      .domain([0, 100])
      .range([-2*Math.PI/4, 2*Math.PI/4])
    );
  
  // show the dashboard
  let segDisplay = iopctrl.segdisplay();   
  let t1 = right2.append('g')
    .attr('class', 'gauge')
    .attr('transform', 'translate(170,20)')
    .style('background-color', 'gray')
    .call(gauge);	 
  let v1 = gauge.value(7);  
  // fix the position of every parts of the dashboard
  }
}

d3.select('body').append('#abc').text('aaaa');
function getTheDataFromForm() {
    let data = {};
    data.companyResult = d3.select('#companychoice').property('value');
    data.businessResult = d3.select('#businesschoice').property('value');
    data.dateResult = d3.select('#datechoice').property('value');
    data.binResult = d3.select('#binchoice').property('checked');
    data.cheResult = d3.select('#checkchoice').property('checked');
    
    $.ajax({
      type: "get",
      url: "/gejson",
      data: data,
      dataType: "json"
    });
    
    return data;
}

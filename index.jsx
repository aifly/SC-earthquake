import React, { Component } from 'react';
import ReactDOM from 'react-dom';
import injectTapEventPlugin from 'react-tap-event-plugin';
import $ from 'jquery';
injectTapEventPlugin();
import IScroll from 'iscroll';
import './assets/css/index.css';

import Picker from 'react-weui/build/packages/components/picker/picker';
import 'weui';
import 'react-weui/build/packages/react-weui.css';
import Obserable from './components/public/obserable';


import ZmitiToastApp from './components/toast/index.jsx'

var obserable = new Obserable();

 class App extends Component {
	constructor(props) {
		super(props);

		var years = [],
			month = [],
			date = [];


		var cYear = new Date().getFullYear()-5;

		for(var i =0;i<105;i++){
			if (i<31){
				date.push({
					label:i+1<10?'0'+(i+1):i+1,
					value:'2-'+(i+1<10?'0'+(i+1):i+1)
				})
			}
			if(i<12){
				month.push({
					label:i+1<10?'0'+(i+1):i+1,
					value:'1-'+(i+1)
				})
			}
			years.push({
				label:cYear+i,
				value:'0-'+(cYear+i)
			});
		}



		this.state = {
			stateId:'',//国家id
			showProvincePicker: false,
        	picker_value: '',
        	busyLive:700,
        	currentCountry:'',
        	currentProvinceName:'',
        	currentProvinceId:-1,
        	logoImg:'./assets/images/showImage.jpg',
        	currentCityId:-1,
        	currnetSelectProvinceIndex:0,//当前选择的省的索引
        	currnetSelectCityIndex:0,//当前选择的市的索引
        	reasonSelectIndex:0,//出差事由索引
        	currentSelectJobIndex:0,
        	currentCityName:'',
        	defaultProvinceSelect:[0],
        	defaultCitySelect:[0],
        	currentStartdateSelectIndex:[5,new Date().getMonth(),new Date().getDate()-1],
        	currentEnddateSelectIndex:[5,new Date().getMonth(),new Date().getDate()-1],
			provinceGroup: [{
	                items: [
	                    
	                ]
	        	}
	        ],
	        cityGroup:[{
	        		items:[]
	        	}
	        ],
	        dateGroup:[
	        	{
	        		items:years
	        	},
	        	{
	        		items:month
	        	},
	        	{
	        		items:date
	        	},

	        ],
	        reasonGroup:[
	        	{
	        		items:[
	        		]
	        	}
	        ],
	        busyDayArray:[],
	        jobGroup:[
	        {
	        	items:[
	        	]
	        }],
	        toast:'',
	        currentReasonName:'',
	        currentReasonId:'',
	        startdate:'',
	        enddate:'',
	        indexClass:'active',
	        resultClass:'right',
	        noticeClass:'right',
	        showCover:window.showCover,
	        version:''
			
		}
		this.viewW = document.documentElement.clientWidth;
		this.viewH = document.documentElement.clientHeight;
		window.s = this;
	}
	render() {
		return (
			<div className='zmiti-main-ui' >
				 {this.state.toast && <ZmitiToastApp toast={this.state.toast}></ZmitiToastApp>}
				 <section  style={{opacity:this.state.showCover?0:1}} className={'zmiti-index-page '+this.state.indexClass}>
					<header>{document.title}</header>
					<section className='zmiti-index-scroll-wrap' style={{height:this.viewH - 54}} ref='zmiti-index-scroll-wrap'>
						<div>
							<img src={this.state.logoImg}/>
							<section className='zmiti-trip'>
								<div>
									<section className='zmiti-trip-destination'>出差目的地</section>
									<section className='zmiti-trip-city-C'>
										<aside>
											  {this.state.currentCountry||'中国'}
										</aside>
										<aside  onTouchStart={(e)=>{ e.preventDefault();this.setState({showProvincePicker:true})}}>
											{this.state.currentProvinceName}
										</aside>
										<aside  onTouchStart={(e)=>{ e.preventDefault();this.setState({showCityPicker:true})}}>
											{this.state.currentCityName}
										</aside>
									</section>
								</div>
							</section>

							<section className='zmiti-trip'>
								<div>
									<section className='zmiti-trip-destination'>出差时间</section>
									<section className='zmiti-trip-date'>
										<aside onTouchStart={this.selectedDate.bind(this,'startdate')}>
											  {this.state.startdate}
											  <img src='./assets/images/date.png'/>
										</aside>
										<aside><span style={{opacity:0}}>{this.state.enddate}</span></aside>
										<aside onTouchStart={this.selectedDate.bind(this,'enddate')}>
											{this.state.enddate}
											<img src='./assets/images/date.png'/>
										</aside>
									</section>
								</div>


							</section>

							<section className='zmiti-trip'>
								<div>
									<section className='zmiti-trip-destination'>出差事由</section>
									<section className='zmiti-trip-city-C zmiti-trip-reason'>
										<aside style={{width:0,'WebkitBoxFlex':0,opacity:0}}></aside>
										<aside style={{textAlign:'left'}} onTouchTap={(e)=>{ e.preventDefault();this.setState({showReasonPicker:true})}}>
											{this.state.currentReasonName}
										</aside>
									</section>
								</div>
							</section>

							<section className='zmiti-trip'>
								<div>
									<section className='zmiti-trip-destination'>职务级别</section>
									<section className='zmiti-trip-city-C zmiti-trip-reason'>
										<aside style={{width:0,'WebkitBoxFlex':0,opacity:0}}></aside>
										<aside style={{textAlign:'left'}} onTouchTap={(e)=>{ e.preventDefault();this.setState({showJobPicker:true})}}>
											{this.state.currentJobName}
										</aside>
									</section>
								</div>
							</section>


							<section onTouchTap={this.beginSearch.bind(this)} className='zmiti-index-ok'>
								确定
							</section>
						</div>
					</section>
					
				 </section>
				<section className={'zmiti-result-page lt-full '+ this.state.resultClass}>
					 <div style={{background:'url(./assets/images/backImage.png) no-repeat center top'}}></div>
					 <header>
					 	<div onTouchTap={()=>{this.setState({indexClass:'active',resultClass:'right'})}}><img src='./assets/images/back@2x.png'/></div>
					 	<div>{this.state.currentJobName + "人员出差标准"}</div>
					 	<div></div>
					 </header>
					 <section ref='result-page' style={{height:this.viewH - 55}}>
					 	<div>
					 		<article>
					 			{this.state.currentCityName}<span>北京时间：{this.state.beiJingTime}</span>
					 		</article>
					 		<div className='zmiti-result-date'>
					 			<aside>{this.state.startdate}</aside>
					 			<aside></aside>
					 			<aside>{this.state.enddate}</aside>
					 		</div>

					 		<section className='zmiti-travel-standard'>
					 			<div>
					 				<h2>交通标准</h2>
					 				<section className='zmiti-result-train'>
					 					<img src='./assets/images/haveTrain.png'/>
					 					<span>{this.state.train}</span>
					 				</section>
					 				<section className='zmiti-result-travels'>
					 					<aside>
					 						<img src='./assets/images/haveHight.png'/>
					 						<span>{this.state.hightSpeedRail}</span>
					 					</aside>
					 					<aside>
					 						<img src='./assets/images/haveSofe.png'/>
					 						<span>{this.state.soft}</span>
					 					</aside>
					 				</section>
					 				<section className='zmiti-result-travels'>
					 					<aside>
					 						<img src='./assets/images/haveSteamer.png'/>
					 						<span>{this.state.steamer}</span>
					 					</aside>
					 					<aside>
					 						<img src='./assets/images/haveAir.png'/>
					 						<span>{this.state.air}</span>
					 					</aside>
					 				</section>
					 				<h2>住宿标准</h2>
					 				{!(this.state.live && this.state.busyLive) && <section className='zmiti-stay'>
					 					<span>{this.state.live||this.state.busyLive}</span>元/天
					 				</section>}

					 				{this.state.live && this.state.busyLive && <section className='zmiti-stay'>
					 					<aside>淡季：<span>{this.state.live}</span>元/天</aside>
					 					<aside></aside>
					 					<aside>旺季：<span>{this.state.busyLive}</span>元/天</aside>
					 				</section>}

					 				{this.state.busyDayArray.length>0&&<h2 className='zmiti-busyday-title'>旺季日期：</h2>}
					 				{this.state.busyDayArray.length>0&&<section className='zmiti-busyday'>
					 									 					{this.state.busyDayArray.map((item,o)=>{
					 									 						return <div key={o}>
					 									 							{item}
					 									 						</div>
					 									 					})}
					 									 				</section>}
					 				
					 				<section className='zmiti-food-travel'>
					 					<aside>
					 						<h2>伙食补助</h2>
					 						<div><span>{this.state.food*this.state.day}</span>元 <label>({this.state.food}元/天)</label></div>
					 					</aside>
					 					<aside>
					 						<h2>交通补助</h2>
					 						<div><span>{this.state.traffic*this.state.day}</span>元 <label>({this.state.traffic}元/天)</label></div>
					 					</aside>
					 				</section>
					 				<section className='zmiti-result-remark'>
					 					{this.state.reasonType === 1 && <span>依据{this.state.currentReasonName}标准，您出差补助共{this.state.subsidy}元</span>}
					 					{this.state.reasonType === 2  &&<span>依据{this.state.currentReasonName}标准,您共出差{this.state.day}天，可得补助{this.state.subsidy}元</span>}
					 				</section>

					 				<h2>发票信息</h2>
					 				<section className='zmiti-result-invoice'>
					 					<div>抬<span style={{opacity:0}}>税人识别</span>头：<label>中国人民银行营业管理部</label></div>
					 					<div>纳税人识别号：<label>11100000H52630606M</label></div>
					 				</section>

					 				<h2>版本号: {this.state.version||'v1.2'}</h2>
					 				<section></section>

					 				<section className='zmiti-notice'>
					 					<span onTouchTap={this.getNotice.bind(this)}>注意事项</span>
					 				</section>

					 			</div>
					 		</section>
					 	</div>
					 </section>
				</section>

				<section className={'zmiti-notice-page lt-full '+this.state.noticeClass}>
					 <header>
					 	<div  onTouchTap={()=>{this.setState({noticeClass:'right',resultClass:'active'})}}><img src='./assets/images/back@2x.png'/></div>
					 	<div>注意事项</div>
					 	<div></div>
					 </header>
					 <section style={{height:this.viewH - 55}} className='zmiti-notice-wrap' ref='zmiti-notice-wrap'>
					 	<div  dangerouslySetInnerHTML={this.createMarkup()}></div>
					 </section>
				</section>
				   {this.state.showProvincePicker&&<Picker
				   				   		defaultSelect={[this.state.currnetSelectProvinceIndex]}
				   	                    onChange={selected=>{
				   	                        let value = '',
				   	                        	label = '',
				   	                        	currentCityId = -1,
				   	                        	currentCityName = '';
				   							var index = -1;
				   	                        selected.forEach( (s, i)=> {
				   	                            value = this.state.provinceGroup[i]['items'][s].value;
				   	                            label = this.state.provinceGroup[i]['items'][s].label;
				   	                        	currentCityId = this.defaultProvince[s].cities[0].cityId;
				   	                        	index = s;
				   	                        	currentCityName = this.defaultProvince[s].cities[0].name;
				   	                        	this.state.cityGroup[0].items.length = 0;
				   	                        	this.defaultProvince[s].cities.map((list,i)=>{
				   									this.state.cityGroup[0].items.push({
				   										label:list.name,
				   										value:list.cityId
				   									})
				   								});
				   	                        })
				   	                        this.setState({
				   	                        	defaultCitySelect:[0],
				   	                            currentProvinceId: value,
				   	                            currentProvinceName:label,
				   	                            showProvincePicker: false,
				   	                            currnetSelectCityIndex:0,
				   	                            currnetSelectProvinceIndex:index,
				   	                            currentCityId,
				   	                            currentCityName
				   	                        })
				   	                    }}
				   	                    lang={{ leftBtn: '取消', rightBtn: '确定' }}
				   	                    groups={this.state.provinceGroup}
				   	                    show={this.state.showProvincePicker}
				   	                   	onCancel={e=>{this.setState({showProvincePicker: false})}}
				   	                />}
	                {this.state.showCityPicker && <Picker
	                	                 	defaultSelect={[this.state.currnetSelectCityIndex]}
	                	                    onChange={selected=>{
	                	                        let value = '',
	                	                        	label = '',
	                	                        	currentCityId = -1,
	                	                        	currentCityName = '',
	                	                        	index = -1;;
	                
	                	                        selected.forEach( (s, i)=> {
	                	                        	index = s ;
	                	                            value = this.state.cityGroup[i]['items'][s].value;
	                	                            label = this.state.cityGroup[i]['items'][s].label;
	                	                        })
	                	                        this.setState({
	                	                            currentCityId: value,
	                	                            currentCityName:label,
	                	                            currnetSelectCityIndex:index,
	                	                            showCityPicker: false,
	                	                            defaultCitySelect:selected
	                	                        })
	                	                    }}
	                	                    lang={{ leftBtn: '取消', rightBtn: '确定' }}
	                	                    groups={this.state.cityGroup}
	                	                    show={this.state.showCityPicker}
	                	                   	onCancel={e=>{this.setState({showCityPicker: false})}}
	                	                />}

	           						 {this.state.showDatePicker && <Picker
	            					   className='zmiti-date-picker'
	            				   		defaultSelect={this.state.currentStartdateSelectIndex}
	            	                    onChange={selected=>{
	            	                    	
	            	                        this.setState({
	            	                        	currentStartdateSelectIndex:selected,
	            	                            showDatePicker: false,
	            	                        });

	            	                        var val =this.selectedDateType ==='startdate'? 'startdate1':'enddate1';
	            	                    	this[val] = this.state[this.selectedDateType];


	            	                    }}
	            	                    lang={{ leftBtn: '取消', rightBtn: '确定' }}
	            	                    groups={this.state.dateGroup}
	            	                    onGroupChange={(selected)=>{
	            	                    	var index = selected.value.split('-')[0]*1;
	            	                    	var year = this.state[this.selectedDateType].split('-')[0];
	            	                    	var month = this.state[this.selectedDateType].split('-')[1];
	            	                    	var day =this.state[this.selectedDateType].split('-')[2];
	            	                    	switch(index){
	            	                    		case 0:
	            	                    		year = selected.label;
	            	                    		this.fixDay(year,month);
	            	                    		break;
	            	                    		case 1:
	            	                    		 month = selected.label;
	            	                    		 var count = this.getDaysInOneMonth(year,month);
	            	                    		 this.fixDay(year,month);
	            	                    		break;
	            	                    		case 2:
	            	                    		day = selected.label;
	            	                    		break;
	            	                    	}
	            	                    	if(day>this.getDaysInOneMonth(year,month)){
	            	                    		day=this.getDaysInOneMonth(year,month);
	            	                    	}
	            	                    	

	            	                    	this.setState({
	            	                    		[this.selectedDateType]:[year,month,day].join('-')
	            	                    	})
	            	                    
	            	                    }}
	            	                    show={this.state.showDatePicker}
	            	                   	onCancel={e=>{

	            	                   		var val =this.selectedDateType ==='startdate'? 'startdate1':'enddate1';
	            	                   		this.setState({showDatePicker: false,[this.selectedDateType]:this[val]},()=>{
	            	                   			this.state.currentStartdateSelectIndex = [this.state.startdate.split('-')[0]*1-new Date().getFullYear()+5,this.state.startdate.split('-')[1]*1-1,this.state.startdate.split('-')[2]*1-1];
	            	                   			this.forceUpdate();
	            	                   		})
	            	                   	}}
	            	                />}

	            	                {this.state.showDateEndPicker && <Picker
	            					   className='zmiti-date-picker'
	            				   		defaultSelect={this.state.currentEnddateSelectIndex}
	            	                    onChange={selected=>{
	            	                    	

	            	                         this.setState({
	            	                        	currentEnddateSelectIndex:selected,
	            	                            showDateEndPicker: false,
	            	                        });

	            	                        var val =this.selectedDateType ==='startdate'? 'startdate1':'enddate1';
	            	                    	this[val] = this.state[this.selectedDateType];


	            	                    }}
	            	                    lang={{ leftBtn: '取消', rightBtn: '确定' }}
	            	                    groups={this.state.dateGroup}
	            	                    onGroupChange={(selected)=>{
	            	                    	var index = selected.value.split('-')[0]*1;
	            	                    	var year = this.state[this.selectedDateType].split('-')[0];
	            	                    	var month = this.state[this.selectedDateType].split('-')[1];
	            	                    	var day =this.state[this.selectedDateType].split('-')[2];
	            	                    	switch(index){
	            	                    		case 0:
	            	                    		year = selected.label;
	            	                    		this.fixDay(year,month);
	            	                    		break;
	            	                    		case 1:
	            	                    		 month = selected.label;
	            	                    		 var count = this.getDaysInOneMonth(year,month);
	            	                    		 this.fixDay(year,month);
	            	                    		break;
	            	                    		case 2:
	            	                    		day = selected.label;
	            	                    		break;
	            	                    	}
	            	                    	if(day>this.getDaysInOneMonth(year,month)){
	            	                    		day=this.getDaysInOneMonth(year,month);
	            	                    	}
	            	                    	

	            	                    	this.setState({
	            	                    		[this.selectedDateType]:[year,month,day].join('-')
	            	                    	})
	            	                    
	            	                    }}
	            	                    show={this.state.showDateEndPicker}
	            	                   	onCancel={e=>{
	            	                   		var val =this.selectedDateType ==='startdate'? 'startdate1':'enddate1';
	            	                   		this.setState({showDateEndPicker: false,[this.selectedDateType]:this[val]},()=>{
	            	                   			this.state.currentEnddateSelectIndex = [this.state.enddate.split('-')[0]*1-new Date().getFullYear()+5,this.state.enddate.split('-')[1]*1-1,this.state.enddate.split('-')[2]*1-1];
	            	                   			this.forceUpdate();
	            	                   		})
	            	                   	}}
	            	                />}

    	                {this.state.showReasonPicker&&<Picker
    	                					   		defaultSelect={[this.state.reasonSelectIndex]}
    	                		                    onChange={selected=>{
    	                		                        let value = '',
    	                		                        	label = '',
    	                		                        	index = -1;
    	                
    	                		                        selected.forEach( (s, i)=> {
    	                		                        	index = s;
    	                		                            value = this.state.reasonGroup[i]['items'][s].value;
    	                		                            label = this.state.reasonGroup[i]['items'][s].label;
    	                		                        })
    	                		                        this.setState({
    	                		                            showReasonPicker: false,
    	                		                            reasonSelectIndex:index,
    	                		                            currentReasonId:value,
    	                		                            currentReasonName:label
    	                		                        })
    	                		                    }}
    	                		                    lang={{ leftBtn: '取消', rightBtn: '确定' }}
    	                		                    groups={this.state.reasonGroup}
    	                		                    show={this.state.showReasonPicker}
    	                		                   	onCancel={e=>{this.setState({showReasonPicker: false})}}
    	                		                />}

		                {this.state.showJobPicker && <Picker
		                					   		defaultSelect={[this.state.currentSelectJobIndex]}
		                		                    onChange={selected=>{
		                		                        let value = '',
		                		                        	label = '',
		                		                        	currentCityId = -1,
		                		                        	currentCityName = '',
		                		                        	index = 0;;
		                
		                		                        selected.forEach( (s, i)=> {
		                		                        	index = s;
		                		                            value = this.state.jobGroup[i]['items'][s].value;
		                		                            label = this.state.jobGroup[i]['items'][s].label;
		                		                        })
		                		                        this.setState({
		                		                            showJobPicker: false,
		                		                            currentJobId:value,
		                		                            currentJobName:label,
		                		                            currentSelectJobIndex:index
		                		                        })
		                		                    }}
		                		                    lang={{ leftBtn: '取消', rightBtn: '确定' }}
		                		                    groups={this.state.jobGroup}
		                		                    show={this.state.showJobPicker}
		                		                   	onCancel={e=>{this.setState({showJobPicker: false})}}
		                		                />}
			</div>
		);
	}

	createMarkup(){
		 return {__html:  this.state.notice};
	}

	selectedDate(type,e){
		e.preventDefault();
		var val = type === 'startdate'? 'showDatePicker':'showDateEndPicker';
		//console.log(val,this.state.currentStartdateSelectIndex)
		this.setState({
			[val]:true
		});
		this.selectedDateType = type;

	}

	showToast(msg){
		this.setState({
        	toast:msg
        });

        setTimeout(()=>{
			this.setState({
	       		toast:''
	        });	        	
        },2000)
	}

	getDaysInOneMonth (year, month) {

		month = parseInt(month,10);
		var d = new Date(year, month,0);
	
		return d.getDate();

	}

	fixDay(year,month){

	
		
		var count = this.getDaysInOneMonth(year,month);

		var arr = [];
		for(var i = 0;i <count;i++){
			arr.push({
				label:i+1<10?'0'+(i+1):i+1,
				value:'2-'+(i+1<10?'0'+(i+1):i+1),
			})
		};

		this.state.dateGroup[2].items.lenght =0;
		this.state.dateGroup[2].items = arr;
		this.forceUpdate();
	}


	format(date){
		var month = date.getMonth()+1;
		month < 10 && (month = '0'+month);
		var d = date.getDate();
		d < 10 && (d = '0'+d);
		return date.getFullYear()+"-"+month+"-"+d;
	}
 
	componentDidMount() {
		this.request();

		this.scroll = new IScroll(this.refs['zmiti-index-scroll-wrap'],{
			scrollbars:true
		});

		this.resultScroll = new IScroll(this.refs['result-page'],{
			scrollbars:true
		});

		this.noticeScroll = new IScroll(this.refs['zmiti-notice-wrap'],{
			scrollbars:true
		})

	 
		this.state.dateGroup[2].items.length = 0;


	
		setTimeout(()=>{
			this.setState({
				showCover:false,
				version:window.JSInterface &&  window.JSInterface.getVersion()
			});
			
			///alert(window.JSInterface ? window.JSInterface.getVersion() : 'error');

			$('#zmiti-cover').remove();
		},2000)

		var D = new Date();

		this.state.currentStartdateSelectIndex = [5,this.format(D).split('-')[1]*1-1,this.format(D).split('-')[2]*1-1];
		this.state.currentEnddateSelectIndex = [5,this.format(D).split('-')[1]*1-1,this.format(D).split('-')[2]*1-1];

		this.setState({
			startdate:this.format(D),
			enddate:this.format(D)
		});

		this['startdate1'] =this['enddate1'] = this.format(D);

		var date = D;
		var year = date.getFullYear();
		var month = date.getMonth()+1;
		this.fixDay(year,month);
	}

	compareDate(checkStartDate, checkEndDate) {      
		var arys1= new Array();      
		var arys2= new Array();      
		arys1=checkStartDate.split('-');      
	    var sdate=new Date(arys1[0],parseInt(arys1[1]-1),arys1[2]);      
	 	arys2=checkEndDate.split('-');      
	 	var edate=new Date(arys2[0],parseInt(arys2[1]-1),arys2[2]);      
	 	return sdate <= edate;
	}  

	request(){
		$.ajax({
			type:window.ajaxType,
			url:window.baseUrl + 'travel/get_basedata',
			data:{
				companyid:window.companyid
			}
		}).done((data)=>{
			if(typeof data === 'string'){
				data = JSON.parse(data);
			}
			if(data.getret === 0){

				this.state.currentCountry = data.result.citys[0].name;
				
				
				data.result.citys[0].list.map((list,i)=>{
					this.state.provinceGroup[0].items.push({
						label:list.name,
						value:list.provinceId
					})
				});
				data.result.citys[0].list[0].cities.map((list,i)=>{
					this.state.cityGroup[0].items.push({
						label:list.name,
						value:list.cityId
					})
				});
				this.state.currentProvinceId = data.result.citys[0].list[0].provinceId;
				this.state.stateId = data.result.citys[0].stateId;
				this.state.currentProvinceName = data.result.citys[0].list[0].name;
				this.state.currentCityId = data.result.citys[0].list[0].cities[0].cityId;
				this.state.currentCityName = data.result.citys[0].list[0].cities[0].name;
				this.defaultProvince = data.result.citys[0].list;
				this.state.currentReasonId = data.result.reason[0].reasonId;
				this.state.currentReasonName = data.result.reason[0].reasonName;
				data.result.reason.map((item,i)=>{
					this.state.reasonGroup[0].items.push({
						label:item.reasonName,
						value:item.reasonId
					})
				});

				this.state.currentJobId = data.result.duty[0].dutyId;
				this.state.currentJobName = data.result.duty[0].name;
				data.result.duty.map((item,i)=>{
					this.state.jobGroup[0].items.push({
						label:item.name,
						value:item.dutyId
					})
				});

				this.state.logoImg = data.result.logoImage;

			
				
				this.forceUpdate(()=>{
					setTimeout(()=>{
						this.scroll.refresh();
					},100)
				});

			}
		});
	}

	beginSearch(){

		if(!this.compareDate(this.state.startdate,this.state.enddate)){
			this.showToast('开始日期不能大于结束日期');
			return;
		}


		$.ajax({	
			type:'post',
			url:window.baseUrl+'travel/get_travecost/',
			data:{

				companyid:window.companyid,
				countryid:this.state.stateId,
				provinceid:this.state.currentProvinceId,
				cityid:this.state.currentCityId,
				traveltime:this.state.startdate,
				traveltime2:this.state.enddate,
				joblevelid:this.state.currentJobId,
				tripcode:this.state.currentReasonId//'h7Wmv3d'//
			}
		}).done((data)=>{
			if(typeof data === 'string'){
				data = JSON.parse(data);
			}
			if(data.getret === 0 ){
				this.state.indexClass = 'left';
				this.state.resultClass = 'active';
				
				//data.result.busyDayArray =  ['07月01日-09月30日','11月01日-12月31日','11月01日-12月31日','11月01日-12月31日'];
				this.setState(data.result,()=>{
					this.resultScroll.refresh();
				});
			}
		});
	}

	getNotice(){
		$.ajax({
			type:'post',
			url:window.baseUrl+'travel/get_notice/',
			data:{
				companyid:window.companyid
			}
		}).done((data)=>{
			if(typeof data === 'string'){
				data = JSON.parse(data);
			}
			if(data.getret === 0){
				this.setState({
					resultClass:'left',
					noticeClass:'active',
					notice:data.notice
				},()=>{
					this.noticeScroll.refresh();
				})
			}
		})
	}
	
	 
}


ReactDOM.render(<App></App>,document.getElementById('fly-main-ui'));
	


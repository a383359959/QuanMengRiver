mui.plusReady(function(){
	var index = new Vue({
		el : '#main',
		data : {
			user_id : null,
			name : '',
			telephone : '',
			status : 0,
			order_list : [],
			count : [0,0,0],
			index_active : 0
		},
		mounted : function(){
			this.init();
			plus.runtime.getProperty(plus.runtime.appid,function(result){
			    $('.version').text('当前版本：' + result.version);
			});
		},
		methods : {
			init : function(){
				this.user_id = plus.storage.getItem('user_id');
				if(this.user_id != null) this.getUser();
				if(this.user_id == null){
					this.count = [0,0,0];
					this.order_list = [];
					this.status = 0;
				}
				var obj = this;
				obj.loadData(obj.index_active);
				plus.push.addEventListener('click',function(result){
					obj.loadData(obj.index_active);
				},false);
				document.addEventListener('reload',function(){
					obj.loadData(obj.index_active);
				});
				plus.push.addEventListener('receive',function(result){
					obj.loadData(obj.index_active);
				},false);
				// 监听重新切入消息
				document.addEventListener('resume',function(){
					obj.loadData(obj.index_active);
				});
			},
			menu : function(type){
				if(type == 'show'){
					$('.menu_bg').show();
					$('.menu_layout').animate({'left' : '0px'},'fast');
				}else{
					$('.menu_bg').hide();
					$('.menu_layout').animate({'left' : '-60%'},'fast');
				}
			},
			login : function(){
				openWindow('login.html');
			},
			getUser : function(){
				var obj = this;
				var option = {
					user_id : this.user_id,
					field : 'name,telephone,status'
				}
				mui.post(getLocation('User/info.html'),option,function(result){
					obj.name = result.name;
					obj.telephone = result.telephone;
					obj.status = result.status;
					obj.loadData(0);
				},'json');
			},
			loadData : function(status){
				$('.index_item a').removeClass('active');
				$('.index_item a').eq(status).addClass('active');
				if(this.status != 1) return false;
				var obj = this;
				var option = {
					status : status
				};
				mui.post(getLocation('Order/lists.html'),option,function(result){
					obj.order_list = result.list;
					obj.count = result.count;
					obj.index_active = status;
				},'json');
			},
			changeStatus : function(status){
				var obj = this;
				if(this.user_id == null) return false;
				if(status == this.status) return false;
				var option = {
					status : status,
					user_id : this.user_id
				}
				plus.nativeUI.showWaiting();
				mui.post(getLocation('User/changeStatus.html'),option,function(result){
					plus.nativeUI.closeWaiting();
					obj.status = status;
					if(status == 1){
						obj.loadData(obj.index_active);
					}else{
						obj.count = [0,0,0];
					}
				},'json');
			},
			order_detail : function(order_id){
				openWindow('orderDetail.html',{
					order_id : order_id
				});
			},
			success : function(order_id,index){
				var obj = this;
				plus.nativeUI.confirm('确定接受？',function(e){
					if(e.index == 0){
						var option = {
							zhuant : 5,
							order_id : order_id,
							user_id : obj.user_id
						}
						plus.nativeUI.showWaiting();
						mui.post(getLocation('Order/success.html'),option,function(result){
							if(result.status == 'success'){
								plus.nativeUI.closeWaiting();
								obj.order_list.splice(index,1);
								obj.loadData(obj.index_active);
							}
						},'json');
					}
				},['是','否']);
			},
			quhuo : function(order_id,index){
				var obj = this;
				plus.nativeUI.confirm('确定取货？',function(e){
					if(e.index == 0){
						var option = {
							order_id : order_id
						}
						plus.nativeUI.showWaiting();
						mui.post(getLocation('Order/quhuo.html'),option,function(result){
							if(result.status == 'success'){
								plus.nativeUI.closeWaiting();
								obj.order_list.splice(index,1);
								obj.loadData(obj.index_active);
							}
						},'json');
					}
				},['是','否']);
			},
			songda : function(order_id,index){
				var obj = this;
				plus.nativeUI.confirm('确定送达？',function(e){
					if(e.index == 0){
						var option = {
							order_id : order_id
						}
						plus.nativeUI.showWaiting();
						mui.post(getLocation('Order/songda.html'),option,function(result){
							if(result.status == 'success'){
								plus.nativeUI.closeWaiting();
								obj.order_list.splice(index,1);
								obj.loadData(obj.index_active);
							}
						},'json');
					}
				},['是','否']);
			},
			jump : function(html){
				openWindow(html);
			},
			logout : function(){
				var obj = this;
				plus.nativeUI.confirm('确认退出？',function(e){
					if(e.index == 0){
						plus.storage.removeItem('user_id');
						obj.init();
					}
				},'提示',['是','否']);
			}
		}
	});
	document.addEventListener('login',function(){
		index.init();
	});
});
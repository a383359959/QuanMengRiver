mui.plusReady(function(){
	
	new Vue({
		el : '.workSummary',
		data : {
			user_id : null,
			data_list : []
		},
		mounted : function(){
			this.user_id = plus.storage.getItem('user_id');
			this.loadData();
		},
		methods : {
			loadData : function(){
				var page = 0;
				var obj = this;
		        $('.dropload-down').remove();
		        $('.workSummary').dropload({
		        	scrollArea : window,
		        	loadDownFn : function(me){
		        		page++;
						var option = {
							'user_id' : obj.user_id,
							'page' : page
						};
						mui.post(getLocation('User/signRecord.html'),option,function(result){
							if(result.list.length > 0){
								for(var i = 0;i < result.list.length;i++){
									obj.data_list.push(result.list[i]);
								}
							}else{
								me.lock();
								me.noData();
							}
							me.resetload();
						},'json');
		        	}
		        });
			}
		}
	});
	
});
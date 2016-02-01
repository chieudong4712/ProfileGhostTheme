/*
* Theme Name: Wooo
* Theme URI: http://woowebsite.com/impress
* Description: Complete Theme For Ghost
* Author: RooneyBoy
* Author URI: http://woowebsite.com
* Version:1.0
*/

/*  TABLE OF CONTENT
    1. Common function
    2. Initialing
*/
/*================================================================*/
/*  1. Common function
/*================================================================*/

var ghostApp={
	
	recentPosts:function(){
		$.ajax({
		    type: 'GET',
		    url: '/rss/',
		    dataType: "xml",
		    success: function(xml) {
		        if($(xml).length){

                    if($('.recent-post').length){
            			$('.recent-post').each(function(){
            				var htmlStr='';
		                    var date;
		                    var count=0;
		                    var size=-1;
		                    var monthName=new Array();
			                monthName[0]="Jan";
			                monthName[1]="Feb";
			                monthName[2]="Mar";
			                monthName[3]="Apr";
			                monthName[4]="May";
			                monthName[5]="June";
			                monthName[6]="July";
			                monthName[7]="Aug";
			                monthName[8]="Sept";
			                monthName[9]="Oct";
			                monthName[10]="Nov";
			                monthName[11]="Dec";
			                if($(this).data('size'))
                    			size=$(this).data('size');
			                
		                    $('item', xml).each( function(entry) {
		                        if(size>0 && count < size){
									var media;// = this.childNodes[7].attributes['url'];
									for (var i = 0; i < this.childNodes.length; i++) {
										var node = this.childNodes[i];
										if(node.localName == 'content') media = node.attributes['url'];
									};
									var image = "/assets/images/default-post-thumbnail.png";
									var title = $(this).find('title').eq(0).text();
									var link  = $(this).find('link').eq(0).text();
									var date = new Date($(this).find('pubDate').eq(0).text());
									var datePost = date.getDate()+' '+monthName[date.getMonth()]+' '+date.getFullYear();
									if(media) image = media.nodeValue;
		                            htmlStr += '<li class="clearfix">';
		                            htmlStr += '<a href="' + link + '" class="thumb pull-left m-r-10">\
								        			<img src="' + image + '" alt="'+title+'">\
								      			</a>'
								    htmlStr += '<div class="info">\
		        									<a href="' + link + '">' + title + '</a>\
		        									<span class="meta">' + datePost + '</span>\
		      									</div>';
		                            htmlStr += '</li>';
		                            count++;
		                        }
		                        else{
		                            return false;
		                        }
		                    });
            				
            				$(this).append(htmlStr);
            			})
            		}
                    
		        }
		    }
		});
    },
    tagCloud: function(){
    	var FEED_URL = "/rss/";
		var primary_array = [];
		$.get(FEED_URL, function (data) {
			$(data).find("category").each(function () {
				var el = $(this).text();
				if ($.inArray(el, primary_array) == -1) {
					primary_array.push(el);
				}
			});
			var formated_tag_list = "";
			for ( var i = 0; i < primary_array.length; i = i + 1 ) {
				var tag = primary_array[ i ];
				var tagLink = tag.toLowerCase().replace(/ /g, '-');
				formated_tag_list += ("<li><a href=\"/tag/" + tagLink + "\">" + tag + "</a></li>");
			}
			$('.tag-cloud').append(formated_tag_list);
		});
    },
    newsletter:function() {
		var form = $('#subscribe-form');
		form.attr("action", mailchimp_form_url);
		var message = $('#message');
		var submit_button = $('subscribe');
		function IsEmail(email) {
			var regex = /^([a-zA-Z0-9_.+-])+\@(([a-zA-Z0-9-])+\.)+([a-zA-Z0-9]{2,4})+$/;
			return regex.test(email);
		}
		form.submit(function(e){
			e.preventDefault();
			$('#subscribe').attr('disabled','disabled');
			if($('#mce-EMAIL').val() != '' && IsEmail($('#mce-EMAIL').val())) {
				message.html('please wait...').fadeIn(1000);
				var url=form.attr('action');
				if(url=='' || url=='YOUR_MAILCHIMP_WEB_FORM_URL_HERE') {
					alert('Please config your mailchimp form url for this widget');
					return false;
				}
				else{
					url=url.replace('?u=', '/post-json?u=').concat('&c=?');
					console.log(url);
					var data = {};
					var dataArray = form.serializeArray();
					$.each(dataArray, function (index, item) {
						data[item.name] = item.value;
					});
					$.ajax({
						url: url,
						type: "POST",
						data: data,
						dataType: 'json',
						success: function(response, text){
							if (response.result === 'success') {
								message.html(success_message).delay(10000).fadeOut(500);
								$('#subscribe').removeAttr('disabled');
								$('#mce-EMAIL').val('');
							}
							else{
								message.html(response.result+ ": " + response.msg).delay(10000).fadeOut(500);
								console.log(response);
								$('#subscribe').removeAttr('disabled');
								$('#mce-EMAIL').focus().select();
							}
						},
						dataType: 'jsonp',
						error: function (response, text) {
							console.log('mailchimp ajax submit error: ' + text);
							$('#subscribe').removeAttr('disabled');
							$('#mce-EMAIL').focus().select();
						}
					});
					return false;
				}
			}
			else {
				message.html('Please provide valid email').fadeIn(1000);
				$('#subscribe').removeAttr('disabled');
				$('#mce-EMAIL').focus().select();
			}            
		});
	},
   	twitter: function() {
		var twitter_block = '<a class="twitter-timeline" href="'+twitter_url+'" data-widget-id="'+twitter_widget_id+'" data-link-color="#0062CC" data-chrome="nofooter noheader noscrollbar noborders transparent" data-tweet-limit="'+number_of_tweet+'">Tweets</a>';
		twitter_block += "<script>!function(d,s,id){var js,fjs=d.getElementsByTagName(s)[0],p=/^http:/.test(d.location)?'http':'https';if(!d.getElementById(id)){js=d.createElement(s);js.id=id;js.src=p+\"://platform.twitter.com/widgets.js\";fjs.parentNode.insertBefore(js,fjs);}}(document,\"script\",\"twitter-wjs\");</script>";
		$('.tweets').append(twitter_block);
	},
	flickr:function(){
        if($('.flickr-feed').length){
            $('.flickr-feed').each(function() {
                var $this=$(this);
                if(flickr_id=='' || flickr_id=='YOUR_FLICKR_ID_HERE'){
                    $(this).html('<li><strong>Please change Flickr user id before use this widget</strong></li>');
                }
                else{
                	var size = -1;
                	if($(this).data('size'))
            			size=$(this).data('size');

                    $.getJSON("http://api.flickr.com/services/feeds/groups_pool.gne?jsoncallback=?",
				  	{
					  	id: '675729@N22',
					  	lang: 'en-us',
					    format: "json"
				  	},
				  	function(data) {
					  	var i = 0;
					    $.each(data.items, function(i,item){
					    	if ( i == size ) { 
								i = 0; 
								size = -1;
								return false; 
							}
					    	var img = item.media.m;
					    	var title = item.title;
					    	var href = item.link;
							var a = '<li><a target="_blank" href="'+ href +'" title="'+title+'" ><img width="75" height="75" src="'+img+'" alt="'+title+'" /></a></li>';
							$(".flickr-feed").append(a);
							
					    });
				  	});
                }
            });
        }
    },
	substringMatcher: function(posts) {
	  return function findMatches(q, cb) {
	    var matches, substringRegex;

	    matches = [];

	    substrRegex = new RegExp(q, 'i');

	    $.each(posts, function(i, post) {
	      if (substrRegex.test(post.title)) {
	        matches.push(post);
	      }
	    });

	    cb(matches);
	  };
	},
    search: function(){
    	var self = this;
    	$.get(ghost.url.api('posts', {limit: 20})).done(function (data){
		  	$('.typeahead').typeahead({
			  hint: false,

			  autoSelect: false,
			  highlight: true,
			  minLength: 1
			},{
				display: 'title',
			  	source: self.substringMatcher(data.posts),
			  	templates: {
				    suggestion: function(data) { // data is an object as returned by suggestion engine
				        return '<div class="tt-suggest-page"><a href="'+data.url+'">' + data.title + '</a></div>';
				    }
				}
			});
	  		
		}).fail(function (err){
		  	console.log(err);
		});

    },
    carosel: function(){

      $(".gallery-images").owlCarousel({
     
          navigation : true, // Show next and prev buttons
          slideSpeed : 300,
          paginationSpeed : 400,
          singleItem:true,
          pagination : false,
          navigationText: ['<i class="fa fa-chevron-left"></i>', '<i class="fa fa-chevron-right"></i>']
      });

    },
    

    init: function () {
        ghostApp.search();
        ghostApp.carosel();
        ghostApp.recentPosts();
        ghostApp.tagCloud();
        ghostApp.newsletter();
        ghostApp.twitter();
    	ghostApp.flickr();
    }
}


/*================================================================*/
/*  2. Initialing
/*================================================================*/
$(document).ready(function() {
    ghostApp.init();
    $('#scroll_top').smoothScroll();
});



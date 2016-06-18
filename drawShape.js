;(function () {
	var selfInterval = 16;
	var requestAnimFrame = window.requestAnimationFrame    ||
                       	window.webkitRequestAnimationFrame ||
                        window.mozRequestAnimationFrame    ||
                       	window.msRequestAnimationFrame     ||
                        window.oRequestAnimationFrame      ||
                        function (callback) {
                            setTimeout(callback, selfInterval);
                        };
    window.requestAnimationFrame = requestAnimFrame;
})();

(function ($) {
	$.fn.extend({
		drawLine: function(options, callback) {
			options = $.extend({
				angle: 0,
				lineWidth: 1,
				length: 0,
				color: "#00f",
				speed: 1,
				direction: "start"
			}, options);
			var _this = this[0];

			var length = isNaN(options.length) ? parseFloat(options.length) * parseFloat(this.css("font-size")) : options.length;
			var radian = options.angle * Math.PI / 180;		
			var c = document.createElement("canvas");
			c.width = length * Math.cos(radian) + options.lineWidth * Math.sin(radian);
			c.height = length * Math.sin(radian) + options.lineWidth * Math.cos(radian);
			var ctx = c.getContext("2d");

			$(c).css({
				"position": "absolute", 
				"top" : 0, 
				"left": 0,
				"z-index": 999
			});
			if (this.css("position") == "static") {
				this.css({"position": "relative"});
			}
			this.append(c);

			ctx.strokeStyle = options.color;
			ctx.lineWidth = options.lineWidth;
			ctx.rotate(radian);

			var startPos = 0;
			var endPos = length;
			var speed = options.speed;

			ctx.beginPath();
			
			if (speed) {
				var i = 0;
				switch (options.direction) {
					case "start":
						ctx.translate(0, 0);
						ctx.moveTo(0,0);
						requestAnimationFrame(function() {							
							startPos += speed;
							if (startPos > endPos && !i) {
								i++;
								startPos = endPos;
							} 
							ctx.lineTo(startPos, 0);
							ctx.stroke();
							if (startPos <= endPos) {
								requestAnimationFrame(arguments.callee);
							} else if (typeof callback == "function") {
								callback.apply(_this);
							}

						});
						break;
					case "middle":
						ctx.translate(length / 2, 0);
						ctx.moveTo(0,0);
						
						var flag = 1;
						requestAnimationFrame(function() {
							if (flag == 1) {
								startPos += speed;
							}																			
							if (startPos > endPos/2 && !i) {
								i++;
								startPos = endPos/2;
							}
							ctx.lineTo(flag*startPos, 0);
							ctx.stroke();	

							if (flag > 0) {
								ctx.moveTo(speed-flag*startPos,0);
							} else {
								ctx.moveTo(-flag*startPos,0);
							}			
							flag *= -1;	

							if (startPos <= endPos/2) {
								requestAnimationFrame(arguments.callee);
							} else if (typeof callback == "function") {
								callback.apply(_this);
							}
						});
						break;
					case "end":
						ctx.translate(length, 0);
						ctx.moveTo(0,0);
						requestAnimationFrame(function() {							
							startPos -= speed;
							if (startPos < -endPos && !i) {
								i++;
								startPos = -endPos;
							}
							ctx.lineTo(startPos, 0);
							ctx.stroke(); 
							if (startPos >= -endPos) {
								requestAnimationFrame(arguments.callee);
							} else if (typeof callback == "function") {
								callback.apply(_this);
							}
						});
						break;
					default:
				}				
			} else {
				ctx.moveTo(0,0);
				ctx.lineTo(endPos, 0);	
				ctx.stroke();
			}

		}
	});
	
})(jQuery);

(function ($) {
	$.fn.extend({
		drawCurve: function (options, callback) {
			options = $.extend({
				lineWidth: 1,
				radius: 0,
				color: "#000",
				percentage: 0,
				speed: 0
			}, options);
			var _this = this;

			var c = document.createElement("canvas");
			c.width = c.height = options.radius * 2 + options.lineWidth;

			$(c).css({
				"position": "absolute",
				"top": -c.height / 2 + "px",
				"left": -c.width / 2 + "px",
				"z-index": 999
			});
			if (this.css("position") == "static") {
				this.css({"position": "relative"});
			}		
			this.append(c);

			var ctx = c.getContext("2d");
			ctx.translate(c.width/2, c.height/2);
			ctx.strokeStyle = options.color;
			ctx.lineWidth = options.lineWidth;
			
			var startAngle = -Math.PI * 0.5;
			var endAngle = Math.PI * 2 * options.percentage / 100 - Math.PI * 0.5;			
			var speed = options.speed * Math.PI /180;

			ctx.beginPath();
			if (speed) {
				var i = 0;
				requestAnimationFrame(function() {					
					ctx.arc(0, 0, options.radius, startAngle, startAngle + speed, false);
					ctx.stroke();
					startAngle += speed;
					if (startAngle > endAngle && !i) {
						i++;
						startAngle = endAngle;
					}
					if (startAngle <= endAngle) {
						requestAnimationFrame(arguments.callee);
					} else if (typeof callback == "function") {
						callback.apply(_this);
					}
				});
			} else {
				ctx.arc(0, 0, radius, startAngle, endAngle, false);
				ctx.stroke();
			}
			
		}
	});
	
})(jQuery);
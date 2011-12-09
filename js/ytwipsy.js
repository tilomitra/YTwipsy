/*
 * YTwipsy
 * 
 * Version 0.1
 *
 * YTwipsy is a tooltip for the YUI3 Library that tries to replicate behavior of Twipsy,
 * the popular tooltip from Twitter's Bootstrap. (http://twitter.github.com/bootstrap/javascript.html#twipsy)
 *
 * Tilo Mitra
 * Copyright (c) 2011 Tilo Mitra [www.tilomitra.com]
 * YUI BSD License - http://developer.yahoo.com/yui/license.html
 */
YUI.add('twipsy', function(Y) {

	
	var getCN = Y.ClassNameManager.getClassName,
	

	
	//HTML5 Data Attributes
	DATA_CONTENT = 'data-content',
	DATA_PLACEMENT = 'data-placement',
	
	
	//Classes
	TWIPSY = 'twipsy',
	WRAPPER = 'wrapper',
	INNER = 'inner',
	TIP = 'tip',
	FADE = 'fade',
	IN = 'in',
	UPARROW = "arrow-up",
	DOWNARROW = "arrow-down",
	LEFTARROW = "arrow-left",
	RIGHTARROW = "arrow-right",
	
 	CLASSES = {
		tooltip: getCN(TWIPSY, WRAPPER),
		inner: getCN(TWIPSY, INNER),
		tip: getCN(TWIPSY, TIP),
		fade: getCN(TWIPSY, FADE),
		fadeIn: getCN(TWIPSY, IN),
		upArrow: getCN(TWIPSY, UPARROW),
		downArrow: getCN(TWIPSY, DOWNARROW),
		leftArrow: getCN(TWIPSY, LEFTARROW),
		rightArrow: getCN(TWIPSY, RIGHTARROW)
	},
	
	
	//markup templates
	TEMPLATES = {
		wrapper: '<div class="' + CLASSES.tooltip + '"><div class="' + CLASSES.inner + '">{content}</div></div>',
		tip: '<div class="' + CLASSES.tip + '"></div>'
	};
	
	
    Y.Twipsy = Y.Base.create("Twipsy", Y.Plugin.Base, [], {

        _handles : [],

		_tooltipNode: undefined,

        //constructor
        initializer : function(config) {
			var host = this.get("host");
			var triggerOn = this.get("triggerOn");
			var triggerOff = this._determineTriggerOff(triggerOn);
			
			if (host.getAttribute("rel") == TWIPSY) {
				this.set("content", host.getAttribute(DATA_CONTENT));
				this.set("placement", host.getAttribute(DATA_PLACEMENT));
			}
			
			this._handles.push(this.on("isEnabledChange", this.handleEnableChange, this));
			
            this._handles.push(host.on(triggerOn, function(e) {
                this.set("isEnabled", true);
            }, this));

			this._handles.push(host.on(triggerOff, function(e) {
                this.set("isEnabled", false)
            }, this));
        },

        //clean up on destruction
        destructor : function() {
			Y.each(this._handles, function(v,k,o) {
				v.detach();
			});
            this._handles = [];
        },

		render : function () {
			var content = this.get("content");
			var host = this.get("host");
			var parentNode = host.get("parentNode");
			var placement = this.get("placement");
			
			var tooltipNode = Y.Node.create(
				Y.Lang.sub(this.get("template"), {
					content: content
				})
			);
			
			tooltipNode.setStyles({position: 'absolute', top:0, left:0, display:'block'}).addClass(CLASSES.fade);
			Y.one(document.body).prepend(tooltipNode);
			
			var styles = this._getStylesFromPlacement(tooltipNode, placement);
			var arrowClass = this._getArrowClass(placement);
			
			var tip = Y.Node.create(this.get("_tip"));
			tip.addClass(arrowClass);
			tip.setStyles(this._positionTip(tooltipNode, placement));
			
			tooltipNode.prepend(tip);
			tooltipNode.setStyles(styles).addClass(CLASSES.fadeIn);
			this._tooltipNode = tooltipNode;
			
			
		},
		
		show : function () {
			if (this._tooltipNode) {
				this._tooltipNode.addClass(CLASSES.fadeIn);
			}
			else {
				this.render();
			}
		},
		
		hide : function () {
			if (this._tooltipNode) {
				this._tooltipNode.removeClass(CLASSES.fadeIn);
			}
		},
		
		_getStylesFromPlacement : function (tooltipNode, placement) {
			var styles = {};
			var offset = this.get("offset");
			
			//Region values refer to values on the host.
			var region = this.get("host").get("region");
			
			//Offset values refer to values on the tooltip
			var offsetWidth = tooltipNode.get("offsetWidth");
			var offsetHeight = tooltipNode.get("offsetHeight");
						
			switch (placement) {
				case "above":
					styles["top"] = region.top - region.height - 2*offset;
					styles["left"] = region.left + region.width/2 - offsetWidth/2;
					break;
				case "left":
					styles["top"] = region.top - offsetHeight/2.5;
					styles["left"] = region.left - offsetWidth - offset;
					break;
				case "below":
					styles["top"] = region.top + region.height + offset;
					styles["left"] = region.left + region.width/2 - offsetWidth/2;
					break;
				case "right":
					styles["top"] = region.top - offsetHeight/2.5; 
					styles["left"] = region.left + region.width + offset;
					break;
				default:
					break;
			}
			return styles;
		},
		
		_positionTip : function (tooltipNode, placement) {
			styles = {
				position: 'relative'
			};
			var region = tooltipNode.get("region");
			var offset = this.get("offset");
			switch (placement) {
				case "above":
					styles['top'] = region.height + 5;
					break;
				case "left":
					styles['left'] = region.width;
					styles['top'] = tooltipNode.get("offsetHeight")/2
					break;
				case "below":
					styles['top'] = region.top - region.height/4;
					break;
				case "right":
					styles['left'] = region.left - 10;
					console.log(tooltipNode.getStyle("padding"));
					styles['top'] = tooltipNode.get("offsetHeight")/2
					break;
				default:
					break;
			}
			return styles;
		},
		
		_getArrowClass : function (placement) {
			var arrowClass = '';

			//Remember that the arrow must be pointing in the opposite direction of placement! :)
			switch (placement) {
				case "above":
					arrowClass = CLASSES.downArrow;
					break;
				case "left":
					arrowClass = CLASSES.rightArrow;
					break;
				case "below":
					arrowClass = CLASSES.upArrow;
					break;
				case "right":
					arrowClass = CLASSES.leftArrow;
					break;
				default:
					break;
			}
			
			return arrowClass;
		},
		
		_determineTriggerOff : function(triggerOn) {
			return this.get("triggerOff");
		},
		
		handleEnableChange : function (e) {
			if (e.newVal) {
				this.show();
			}
			else {
				this.hide();
			}
		}
    },
    {
        NS : "twipsy",
        ATTRS : {
            content : { 
				value : '',
				validator: Y.Lang.isString 
			},
			
			triggerOn : {
				value: "mouseover"
			},
			
			triggerOff : {
				value: 'mouseout'
			},
			
			placement : {
				value: 'above'
			},
			offset : {
				value: 10,
				validator: Y.Lang.isNumber
			},
			
			isEnabled : {
				value: false,
				validator: Y.Lang.isBoolean,
				lazyAdd: false
			},
			
			template : {
				value: TEMPLATES.wrapper,
				validator: Y.Lang.isString
			},
			
			_tip: {
				value: TEMPLATES.tip,
				validator: Y.Lang.isString
			}
        }
    });
}, "0.1", { requires : [ "base", "plugin", "node-base", "classnamemanager"] });

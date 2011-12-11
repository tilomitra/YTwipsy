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
	
	
    Y.Twipsy = Y.Base.create("Twipsy", Y.Plugin.Base, [Y.Plugin.Align], {

		_host: undefined,
        _handles : [],
		_tooltipNode: undefined,
		_tip: undefined,

        //constructor
        initializer : function(config) {
			this._host = this.get("host");
			var triggerOn = this.get("triggerOn");
			var triggerOff = this._determineTriggerOff(triggerOn);
			
			if (this._host.getAttribute("rel") == TWIPSY) {
				this.set("content", this._host.getAttribute(DATA_CONTENT));
				this.set("placement", this._host.getAttribute(DATA_PLACEMENT));
			}
			
			this._handles.push(this.on("isEnabledChange", this.handleEnableChange, this));
			
            this._handles.push(this._host.on(triggerOn, function(e) {
                this.set("isEnabled", true);
            }, this));

			this._handles.push(this._host.on(triggerOff, function(e) {
                this.set("isEnabled", false)
            }, this));
        },

        //clean up on destruction
        destructor : function() {
			Y.each(this._handles, function(v,k,o) {
				v.detach();
			});
            this._handles = [];
			this._tooltipNode.unplug(Y.Plugin.Align);
			this._tip.unplug(Y.Plugin.Align);
			this._tooltipNode = undefined;
			this._tip = undefined;
			this._host = undefined;
        },

		render : function () {
			var content = this.get("content");
			//var host = this.get("host");
			var parentNode = this._host.get("parentNode");
			var placement = this.get("placement");
			
			var tooltipNode = Y.Node.create(
				Y.Lang.sub(this.get("template"), {
					content: content
				})
			);
			
			//position the tooltipnode at the top left of screen but hide it so it cant be seen. this allows us to
			//calculate width and height values, and then reposition and fade it in when ready.
			tooltipNode.setStyles({position: 'absolute', top:0, left:0, display:'block'}).addClass(CLASSES.fade);
			Y.one(document.body).prepend(tooltipNode);
			
			var arrowClass = this._getArrowType(placement);
			var tip = Y.Node.create(this.get("_tip"));
			
			tooltipNode.prepend(tip);
			
			tip.addClass(arrowClass);			
			tooltipNode = this._alignToolTip(tooltipNode, placement);
			tip = this._alignTip(tooltipNode, tip, placement);
			
			tooltipNode.addClass(CLASSES.fadeIn);
			tooltipNode.setStyle("margin-bottom", this.get("offset") + 'px');
			this._tooltipNode = tooltipNode;
			this._tip = tip;
			
			
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
		
		_alignToolTip : function (tooltipNode, placement) {
			tooltipNode.plug(Y.Plugin.Align);
			var offset = this.get("offset");
			//var host = this.get("host");
						
			switch (placement) {
				case "above":
					tooltipNode.align.to(this._host, "tc", "bc", true);
					break;
				case "left":
					tooltipNode.align.to(this._host, "lc", "rc", true);
					break;
				case "below":
					tooltipNode.align.to(this._host, "bc", "tc", true);
					break;
				case "right":
					tooltipNode.align.to(this._host, "rc", "lc", true);
					break;
				default:
					break;
			}
			
			return tooltipNode;
		},
		
		_alignTip : function (tooltipNode, tip, placement) {
			tip.plug(Y.Plugin.Align);
			
			switch (placement) {
				case "above":
					tip.align.to(tooltipNode, "bc", "tc", true);
					break;
				case "left":
					tip.align.to(tooltipNode, "rc", "lc", true);
					break;
				case "below":
					tip.align.to(tooltipNode, "tc", "bc", true);
					break;
				case "right":
					tip.align.to(tooltipNode, "lc", "rc", true);
					break;
				default:
					break;
			}
			
			return tip;
		},
		
		_getArrowType : function (placement) {
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
}, "0.1", { requires : ["base", "node", "plugin", "align-plugin", "classnamemanager"] });
